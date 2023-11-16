import { hoc } from "../../../lib/pipelines/hoc";
import initUX from "./ux.init";
import baseUX from "./ux.base";
import selectUX from "./ux.select";
import filterUX from "./ux.filter";
import dialogUX from "./ux.dialog";
import calculationsUX from "./ux.calculations";
import saveTableUX from "./ux.saveTable";

const InitUX = hoc(initUX);
const BaseUX = hoc(baseUX);
const SelectUX = hoc(selectUX);
const FilterUX = hoc(filterUX);
const DialogUX = hoc(dialogUX);
const CalculationsUX = hoc(calculationsUX);
const SaveTableUX = hoc(saveTableUX);

// left-to-right execution
const uxPipeline = [InitUX, BaseUX, SelectUX, FilterUX, DialogUX, CalculationsUX, SaveTableUX];

export default uxPipeline;