import { hoc } from "../../../lib/pipelines/hoc";
import baseUX from "./ux.base";

const BaseUX = hoc(baseUX);

const withProps = (additionalProps) => (ComponentToWrap) => {
    const HOC = (props) => {
        const mappedProps = { ...additionalProps };
        return <ComponentToWrap {...{ ...props, ...mappedProps }} />;
    };
    return HOC;
};

// these will be executed in left-to-right order (BaseUX should remain on left)
const uxPipeline = [withProps({ selectedWallet, tableData }), BaseUX];

export default uxPipeline;