import { hoc } from "../../../lib/pipelines/hoc";
import headerUX from "./ux.header";
import baseUX from "./ux.base";

const HeaderUX = hoc(headerUX);
const BaseUX = hoc(baseUX);

// left-to-right execution
const uxPipeline = [HeaderUX, BaseUX];

export default uxPipeline;