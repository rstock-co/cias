import { hoc } from "../../../lib/pipelines/hoc";
import initUX from "./ux.init";
import baseUX from "./ux.base";
import saveTableUX from "./ux.saveTable";
import blendUX from "./ux.blend";
import selectUX from "./ux.select";
import filterUX from "./ux.filter";
import dialogUX from "./ux.dialog";
import calculationsUX from "./ux.calculations";


const InitUX = hoc(initUX);
const BaseUX = hoc(baseUX);
const SaveTableUX = hoc(saveTableUX);
const BlendUX = hoc(blendUX);
const SelectUX = hoc(selectUX);
const FilterUX = hoc(filterUX);
const DialogUX = hoc(dialogUX);
const CalculationsUX = hoc(calculationsUX);

// left-to-right execution
const uxPipeline = [InitUX, BaseUX, SaveTableUX, BlendUX, SelectUX, FilterUX, DialogUX, CalculationsUX];

export default uxPipeline;