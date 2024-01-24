import React, { useState } from "react";
import { observer } from "mobx-react";

import { HoneycombStructure } from "../cad/HoneycombStructure";
import { OUTER_RADIUS } from "../cad/constants";

import useAppState from "../useAppState";

import { InputBlock, Form, SaveButtonRow } from "./common";
import { Preview } from "../components/Preview";

const STRUCTURE = new HoneycombStructure(OUTER_RADIUS);

export default observer(function EditGridForm() {
  const state = useAppState();

  const [width, setWidth] = useState(
    Math.ceil(STRUCTURE.totalWidth(state.config?.rows || 5))
  );
  const [height, setHeight] = useState(
    Math.ceil(STRUCTURE.totalHeight(state.config?.columns || 7))
  );

  const columns = STRUCTURE.columnsForWidth(width);
  const rows = STRUCTURE.rowsForHeight(height);

  const saveChanges = (e) => {
    e.preventDefault();
    const changes = {
      columns,
      rows,
    };

    state.updateRowsAndCols(changes);
  };

  return (
    <>
      <Form onSubmit={saveChanges}>
        <SaveButtonRow />
        <InputBlock title="Height (mm)" htmlFor="height">
          <input
            id="height"
            type="number"
            step="1"
            min="50"
            value={height}
            onChange={(e) => setHeight(parseFloat(e.target.value, 10))}
          />
        </InputBlock>
        <InputBlock title="Width (mm)" htmlFor="width">
          <input
            id="width"
            type="number"
            step="1"
            min="50"
            value={width}
            onChange={(e) => setWidth(parseFloat(e.target.value, 10))}
          />
        </InputBlock>
      </Form>
      <div>
        {rows} rows, {columns} columns
      </div>
      <Preview rows={rows} columns={columns} width={width} height={height} />
    </>
  );
});
