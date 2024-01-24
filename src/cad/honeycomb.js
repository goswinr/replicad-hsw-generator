import {
  draw,
  drawPolysides,
  drawRectangle,
  EdgeFinder,
  assembleWire,
  genericSweep,
  makeFace,
  makeSolid,
} from "replicad";
import { honeycombClone } from "./honeycombClone";
import { HoneycombStructure } from "./HoneycombStructure";
import {
  INNER_RADIUS,
  HEIGHT,
  THICKNESS,
  INNER_THICKNESS,
  OUTER_RADIUS,
  CHAMFER_WIDTH,
  CHAMFER_HEIGHT,
  THIN_HEIGHT,
  THINNING_HEIGHT,
} from "./constants";

export const defaultParams = {
  columns: 5,
  rows: 7,
};

const range = (n) => [...Array(n).keys()];

const shellExtrude = (base, height) => {
  return genericSweep(
    base.sketchOnPlane().wire,
    draw().vLine(height).done().sketchOnPlane("XZ").wire,
    { forceProfileSpineOthogonality: true },
    true
  );
};

export const exteriorProfile = (radius, cutout, nRows, nColumns) => {
  const structure = new HoneycombStructure(radius);

  let base = drawRectangle(
    structure.totalWidth(nColumns),
    structure.totalHeight(nRows)
  );

  const columnCutouts = range(nRows + 1)
    .map((i) => cutout.clone().translate(0, i * structure.hexInnerLength))
    .map((cell) => cell.translate(0, -structure.totalHeight(nRows - 1) / 2))
    .flatMap((cell) => {
      const xDisplacement =
        structure.totalWidth(nColumns - 1) / 2 -
        structure.hexSideLength / 4 +
        structure.displacement;
      return [
        cell.clone().translate(-xDisplacement, -structure.hexInnerLength / 2),
        cell
          .clone()
          .translate(
            xDisplacement,
            nColumns % 2 ? structure.hexInnerLength / 2 : 0
          ),
      ];
    });
  columnCutouts.forEach((cutout) => {
    base = base.cut(cutout);
  });

  const rowCutouts = range(nColumns + 1)
    .map((i) => cutout.clone().translate(2 * i * structure.displacement))
    .map((cell) =>
      cell.translate(
        -structure.totalWidth(nColumns - 1) / 2 + structure.hexSideLength / 4,
        0
      )
    )
    .flatMap((cell) => {
      return [
        cell.translate(
          -structure.displacement,
          -structure.totalHeight(nRows) / 2
        ),
        cell.translate(0, structure.totalHeight(nRows) / 2),
      ];
    });

  rowCutouts.forEach((cutout) => {
    base = base.cut(cutout);
  });

  return base;
};

export const honeycombProfile = (nRows, nColumns) => {
  return exteriorProfile(
    OUTER_RADIUS,
    drawPolysides(OUTER_RADIUS, 6, 0).rotate(30),
    nRows,
    nColumns
  );
};

export function preview({ columns, rows }, { width, height }) {
  return [honeycombProfile(rows, columns), drawRectangle(width, height)];
}

export default function honeycomb({ rows, columns }) {
  const outsideProfile = exteriorProfile(
    OUTER_RADIUS,
    drawPolysides(OUTER_RADIUS, 6, 0).rotate(30),
    rows,
    columns
  );

  const [outside, outsideBottom, outsideTop] = shellExtrude(
    outsideProfile,
    HEIGHT
  );
  outsideTop.wrapped.Reverse();

  const profile = draw([CHAMFER_WIDTH, 0])
    .line(-CHAMFER_WIDTH, CHAMFER_HEIGHT)
    .vLineTo(HEIGHT - THIN_HEIGHT - THINNING_HEIGHT)
    .line(THICKNESS - INNER_THICKNESS, THINNING_HEIGHT)
    .vLine(THIN_HEIGHT)
    .done();

  const cell = drawPolysides(INNER_RADIUS, 6, 0)
    .rotate(30)
    .sketchOnPlane()
    .sweepSketch((plane) => profile.sketchOnPlane(plane));

  const inside = honeycombClone(cell, rows, columns, OUTER_RADIUS);

  const topFinder = new EdgeFinder().inPlane("XY", HEIGHT);
  const top = makeFace(
    outsideTop,
    inside.map((copy) => assembleWire(topFinder.find(copy)))
  );

  const bottomFinder = new EdgeFinder().inPlane("XY");
  const bottom = makeFace(
    outsideBottom,
    inside.map((copy) => assembleWire(bottomFinder.find(copy)))
  );

  return makeSolid([outside, top, bottom, ...inside]);
}
