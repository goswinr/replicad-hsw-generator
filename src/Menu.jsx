import React, { useState } from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import useAppState from "./useAppState";

import { IconButton, IconGroup } from "./components/buttons.jsx";
import download from "./download";

import UndoIcon from "./icons/Undo";
import RedoIcon from "./icons/Redo";
import DownloadIcon from "./icons/Download";
import LoadingIcon from "./icons/Loading";

import EditWidthAndHeight from "./menus/EditWidthAndHeight";
import EditRowsAndCols from "./menus/EditRowsAndCols";
import EditPlateShape from "./menus/EditPlateShape";

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  & > :not(:first-child):not(hr) {
    margin-top: 0.6rem;
  }
`;

const EditButtons = styled.div`
  display: flex;
  justify-content: space-between;
`;

const DownloadButton = observer(() => {
  const state = useAppState();
  const [loading, setLoading] = useState(false);

  const dl = async () => {
    setLoading(true);
    try {
      await download(state.currentValues);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <IconButton disabled={!state.shapeLoaded || state.processing} onClick={dl}>
      {loading ? <LoadingIcon size="1.5em" /> : <DownloadIcon size="1.3em" />}
    </IconButton>
  );
});

export default observer(() => {
  const state = useAppState();
  const [selected, setSelected] = useState("rowsAndCols");

  return (
    <Menu>
      <EditButtons>
        <IconGroup>
          <IconButton
            disabled={!state.history.canUndo}
            onClick={() => state.history.undo()}
          >
            <UndoIcon />
          </IconButton>
          <IconButton
            disabled={!state.history.canRedo}
            onClick={() => state.history.redo()}
          >
            <RedoIcon />
          </IconButton>
        </IconGroup>
        <DownloadButton />
      </EditButtons>
      <select
        id="type-select"
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
      >
        <option value="rowsAndCols">Rows and Columns</option>
        <option value="widthAndHeight">Width and Height</option>
      </select>
      {selected === "widthAndHeight" && <EditWidthAndHeight />}
      {selected === "rowsAndCols" && <EditRowsAndCols />}
    </Menu>
  );
});
