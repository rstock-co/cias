import { hoc } from "../../../lib/pipelines/hoc";
import baseUX from "./ux.base";

const BaseUX = hoc(baseUX);

// these will be executed in left-to-right order (BaseUX should remain on left)
const uxPipeline = [BaseUX];

export default uxPipeline;