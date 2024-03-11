import { hoc } from "../../../lib/pipelines/hoc";
import headerUX from "./ux.header";
import baseUX from "./ux.base";
import authUX from "./ux.auth";

const HeaderUX = hoc(headerUX);
const BaseUX = hoc(baseUX);
const AuthUX = hoc(authUX);

// left-to-right execution
const uxPipeline = [HeaderUX, BaseUX, AuthUX];

export default uxPipeline;