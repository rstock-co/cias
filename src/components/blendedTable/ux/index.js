import { hoc } from "../../../lib/pipelines/hoc";
import headerUX from "./ux.header";
import baseUX from "./ux.base";
import blendUX from "./ux.blend";

const HeaderUX = hoc(headerUX);
const BaseUX = hoc(baseUX);
const BlendUX = hoc(blendUX);

// left-to-right execution
const uxPipeline = [HeaderUX, BaseUX, BlendUX];

export default uxPipeline;