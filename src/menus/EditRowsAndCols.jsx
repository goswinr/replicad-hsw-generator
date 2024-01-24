import React, { useState } from "react";
import { observer } from "mobx-react";

import useAppState from "../useAppState";

import { InputBlock, Form, SaveButtonRow } from "./common";
import { Preview } from "../components/Preview";

import { HoneycombStructure } from "../cad/HoneycombStructure";
import { OUTER_RADIUS } from "../cad/constants";

const STRUCTURE = new HoneycombStructure(OUTER_RADIUS);

export default observer(function EditGridForm() {
  const state = useAppState();

  const [rows, setRows] = useState(state.config?.rows || 5);
  const [columns, setColumns] = useState(state.config?.columns || 7);

  const saveChanges = (e) => {
    e.preventDefault();
    const changes = {
      rows,
      columns,
    };

    state.updateRowsAndCols(changes);
  };

  return (
    <>
      <Form onSubmit={saveChanges}>
        <SaveButtonRow />
        <InputBlock title="Columns" htmlFor="cols">
          <input
            id="cols"
            type="number"
            step="1"
            min="2"
            value={columns}
            onChange={(e) => setColumns(parseInt(e.target.value, 10))}
          />
        </InputBlock>
        <InputBlock title="Rows" htmlFor="rows">
          <input
            id="rows"
            type="number"
            step="1"
            min="2"
            value={rows}
            onChange={(e) => setRows(parseInt(e.target.value, 10))}
          />
        </InputBlock>
      </Form>
      <hr />
      <InputBlock title="Total width">
        {STRUCTURE.totalWidth(columns).toFixed(2)}mm
      </InputBlock>
      <InputBlock title="Total height">
        {STRUCTURE.totalHeight(rows).toFixed(2)}mm
      </InputBlock>
    </>
  );
});
