import { hoc } from "../../../lib/pipelines/hoc";
import baseUX from "./ux.base";

const BaseUX = hoc(baseUX);

// left-to-right execution
const uxPipeline = [BaseUX];

export default uxPipeline;