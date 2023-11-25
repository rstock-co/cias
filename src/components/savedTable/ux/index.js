import baseUX from "./ux.base";
import { hoc } from "../../../lib/pipelines/hoc";

const BaseUX = hoc(baseUX);

// left-to-right execution
const uxPipeline = [BaseUX];

export default uxPipeline;
