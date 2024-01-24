export class HoneycombStructure {
  constructor(radius) {
    this.radius = radius;
    this.hexInnerLength = radius * Math.cos(Math.PI / 6) * 2;
    this.hexSideLength = radius * Math.sin(Math.PI / 6) * 2;
    this.displacement = radius + this.hexSideLength / 2;
  }

  totalHeight(nRows) {
    return this.hexInnerLength * (nRows + 0.5);
  }

  totalWidth(nColumns) {
    return this.displacement * nColumns + this.hexSideLength / 2;
  }

  rowsForHeight(height) {
    return Math.floor(height / this.hexInnerLength);
  }

  columnsForWidth(width) {
    return Math.floor((width - this.hexSideLength / 2) / this.displacement);
  }
}

export function fitToCanvas(width, height) {
  const nRows = Math.floor(height / structure.hexInnerLength);
  const nColumns = Math.floor(width / structure.displacement);
  return { nRows, nColumns };
}
