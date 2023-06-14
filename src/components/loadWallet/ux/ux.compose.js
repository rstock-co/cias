import { hoc } from "../../../lib/pipelines/hoc";
import initUX from "./ux.init";
import baseUX from "./ux.base";
import selectUX from "./ux.select";
import filterUX from "./ux.filter";
import dialogUX from "./ux.dialog";

const InitUX = hoc(initUX);
const BaseUX = hoc(baseUX);
const SelectUX = hoc(selectUX);
const FilterUX = hoc(filterUX);
const DialogUX = hoc(dialogUX);

// left-to-right execution
const uxPipeline = [InitUX, BaseUX, SelectUX, FilterUX, DialogUX];

export default uxPipeline;