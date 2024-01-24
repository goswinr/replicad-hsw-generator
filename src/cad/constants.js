const hexLengthToRadius = (length) => {
  return length / 2 / Math.cos(Math.PI / 6);
};

export const INNER_WIDTH = 20;
export const INNER_RADIUS = hexLengthToRadius(INNER_WIDTH);
export const HEIGHT = 8;

export const THICKNESS = 1.8;
export const INNER_THICKNESS = THICKNESS - 1;

export const OUTER_WIDTH = INNER_WIDTH + 2 * THICKNESS;
export const OUTER_RADIUS = hexLengthToRadius(OUTER_WIDTH);

export const CHAMFER_WIDTH = 0.4;
export const CHAMFER_HEIGHT = 0.5;

export const THIN_HEIGHT = 2;
export const THINNING_HEIGHT = 0.9;
