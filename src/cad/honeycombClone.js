import { HoneycombStructure } from "./HoneycombStructure";

const range = (n) => [...Array(n).keys()];
export function honeycombClone(shape, nRows, nColumns, radius) {
  const structure = new HoneycombStructure(radius);

  const column = range(nRows)
    .map((i) => shape.clone().translate(0, i * structure.hexInnerLength))
    .map((cell) => cell.translate(0, -structure.totalHeight(nRows - 1) / 2));

  return range(nColumns)
    .flatMap((i) =>
      column.map((cell) =>
        cell
          .clone()
          .translate(
            i * structure.displacement,
            i % 2 ? structure.hexInnerLength / 2 : 0
          )
      )
    )
    .map((cell) =>
      cell.translate(
        -structure.totalWidth(nColumns - 1) / 2 + structure.hexSideLength / 4,
        0
      )
    );
}
