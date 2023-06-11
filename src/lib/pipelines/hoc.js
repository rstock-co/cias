import { curry } from '../functions/fp';

export const hoc = curry((mapper, ComponentToWrap) => {
    const HOC = props => {
        const mappedProps = mapper(props);
        return <ComponentToWrap {...{ ...props, ...mappedProps }} />;
    };
    return HOC;
});