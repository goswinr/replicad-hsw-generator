import opencascade from "replicad-opencascadejs/src/replicad_single.js";
import opencascadeWasm from "replicad-opencascadejs/src/replicad_single.wasm?url";

import {
  setOC,
  Vector,
  Blueprint,
  Drawing,
  CompoundBlueprint,
  Blueprints,
} from "replicad";
import { expose } from "comlink";

// We import our model as a simple function
//import { run as runDefault } from "./cad";
import { run as runDefault, showPreview } from "./cad/";
import { STATE, registerAsLatestShape } from "./cad/state";

// This is the logic to load the web assembly code into replicad
let loaded = false;
const init = async () => {
  if (loaded) return Promise.resolve(true);

  const OC = await opencascade({
    locateFile: () => opencascadeWasm,
  });

  setOC(OC);
  loaded = true;

  return true;
};
const started = init();

const meshShape = (shape) => {
  return {
    faces: shape.mesh && shape.mesh({ tolerance: 0.5, angularTolerance: 30 }),
    edges: shape.meshEdges({
      tolerance: 0.1,
      angularTolerance: 10,
    }),
  };
};

async function run(config) {
  await started;
  const shape = registerAsLatestShape(await runDefault(config));

  if (
    shape instanceof Drawing ||
    shape instanceof Blueprint ||
    shape instanceof CompoundBlueprint ||
    shape instanceof Blueprints
  ) {
    return {
      ...meshShape(registerAsLatestShape(shape.sketchOnPlane().wires())),
      svgPaths: shape.toSVGPaths(),
      svgViewBox: shape.toSVGViewBox(),
    };
  }
  return meshShape(shape);
}

async function preview(hexConfig, borderConfig, profileConfig) {
  await started;
  const shapes = await showPreview(hexConfig, borderConfig, profileConfig);

  return shapes.map((shape) => ({
    format: "svg",
    paths: shape.toSVGPaths(),
    viewbox: shape.toSVGViewBox(),
  }));
}

const transformationInfo = (trsf) => {
  const translation = new Vector(trsf.TranslationPart()).toTuple();
  return {
    translation,
    scale: trsf.ScaleFactor(),
  };
};

async function faceInfo(faceIndex) {
  const face = STATE.latestShape?.faces[faceIndex];

  return {
    geomType: face?.geomType,
    extrema: {
      min: face.pointOnSurface(0, 0).toTuple(),
      max: face.pointOnSurface(1, 1).toTuple(),
    },
    center: face?.center.toTuple(),
    normal: face?.normalAt().normalize().toTuple(),
    bounds: face?.boundingBox.bounds,
    orientation: face?.orientation,
    uv: face?.UVBounds,
  };
}

async function createSTL(config) {
  const shape = await runDefault(config);
  return shape.blobSTL({
    tolerance: 0.01,
    angularTolerance: 30,
  });
}

async function createSTEP(config) {
  const shape = await runDefault(config);
  return shape.blobSTEP();
}

const API = {
  run,
  faceInfo,
  createSTL,
  createSTEP,
  preview,
};

expose(API);
export default API;
