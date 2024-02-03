import { types, flow, getSnapshot } from "mobx-state-tree";
import { autorun } from "mobx";
import { UndoManager } from "mst-middlewares";

import api from "./api";
import UIState from "./ui-state";

const inSeries = (func) => {
  let refresh;
  let currentlyRunning = false;

  return async function () {
    if (currentlyRunning) {
      refresh = true;
      return;
    }
    currentlyRunning = true;

    while (true) {
      refresh = false;
      await func();

      if (!refresh) break;
    }

    currentlyRunning = false;
  };
};

const AppState = types
  .model("AppState", {
    ui: UIState,
    config: types.optional(
      types.model({
        rows: types.optional(types.number, 8),
        columns: types.optional(types.number, 7),
        profileConfig: types.optional(
          types.model({
            disableLeft: types.optional(types.boolean, false),
            disableRight: types.optional(types.boolean, false),
            disableTop: types.optional(types.boolean, false),
            disableBottom: types.optional(types.boolean, false),
          }),
          {}
        ),
      }),
      {}
    ),
    history: types.optional(UndoManager, {}),
  })
  .views((self) => ({
    get currentValues() {
      return getSnapshot(self.config);
    },
  }))
  .volatile(() => ({
    currentMesh: null,
    processing: false,
    shapeLoaded: false,
    error: false,
    processingInfo: null,
  }))
  .actions((self) => ({
    updateRowsAndCols({ rows, columns }) {
      self.config.rows = rows;
      self.config.columns = columns;
    },
    updateProfile({ disableLeft, disableRight, disableTop, disableBottom }) {
      if (disableLeft !== undefined)
        self.config.profileConfig.disableLeft = disableLeft;
      if (disableRight !== undefined)
        self.config.profileConfig.disableRight = disableRight;
      if (disableTop !== undefined)
        self.config.profileConfig.disableTop = disableTop;
      if (disableBottom !== undefined)
        self.config.profileConfig.disableBottom = disableBottom;
    },

    process: flow(function* process() {
      self.processing = true;
      try {
        const mesh = yield api.run(self.currentValues);
        self.currentMesh = mesh;
        self.error = false;
        self.shapeLoaded = true;
      } catch (e) {
        console.error(e);
        self.error = true;
      }
      self.processing = false;
    }),
  }))
  .extend((self) => {
    let disposer = null;

    const processor = inSeries(self.process);

    const run = async () => {
      self.currentValues;
      await processor();
    };

    return {
      actions: {
        afterCreate() {
          disposer = autorun(run, { delay: 300 });
        },

        afterDestroy() {
          if (disposer) disposer();
        },
      },
    };
  });

export default AppState;
