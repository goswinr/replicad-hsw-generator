import React, { useState, useImperativeHandle } from "react";
import { observer } from "mobx-react";

import useAppState from "../useAppState";

import { InputTitle, BaseInline } from "./common";

export default observer(
  React.forwardRef(function EditGridForm(_, ref) {
    const state = useAppState();

    const [left, setLeft] = useState(state.config.profileConfig.disableLeft);
    const [right, setRight] = useState(state.config.profileConfig.disableRight);
    const [top, setTop] = useState(state.config.profileConfig.disableTop);
    const [bottom, setBottom] = useState(
      state.config.profileConfig.disableBottom
    );

    useImperativeHandle(ref, () => {
      return {
        saveChanges: () => {
          const changes = {
            disableLeft: left,
            disableRight: right,
            disableTop: top,
            disableBottom: bottom,
          };

          state.updateProfile(changes);
        },
      };
    });

    return (
      <>
        <InputTitle as="div" style={{ marginTop: "2em" }}>
          Flat borders
        </InputTitle>
        <BaseInline>
          <input
            id="left"
            type="checkbox"
            checked={left}
            onChange={(e) => setLeft(e.target.checked)}
          />
          <label htmlFor="left">Left</label>
        </BaseInline>
        <BaseInline>
          <input
            id="top"
            type="checkbox"
            checked={top}
            onChange={(e) => setTop(e.target.checked)}
          />
          <label htmlFor="top">Top</label>
        </BaseInline>
        <BaseInline>
          <input
            id="right"
            type="checkbox"
            checked={right}
            onChange={(e) => setRight(e.target.checked)}
          />
          <label htmlFor="right">Right</label>
        </BaseInline>
        <BaseInline>
          <input
            id="bottom"
            type="checkbox"
            checked={bottom}
            onChange={(e) => setBottom(e.target.checked)}
          />
          <label htmlFor="bottom">Bottom</label>
        </BaseInline>
      </>
    );
  })
);
