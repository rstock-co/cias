import View from "./view";
import { compose } from "../../lib/functions/fp";
import uxPipeline from "./ux";

const FullUX = compose(...uxPipeline);

export default FullUX(View);