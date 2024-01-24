import { useState, useEffect } from "react";
import SVGViewer from "./SVGViewer";

import api from "../api";

export function Preview({ rows, columns, width, height }) {
  const [state, setState] = useState();

  useEffect(() => {
    api.preview({ rows, columns }, { width, height }).then(setState);
  }, [rows, columns, width, height]);

  if (!state) {
    return null;
  }

  return <SVGViewer shape={state} withGrid={false} />;
}
