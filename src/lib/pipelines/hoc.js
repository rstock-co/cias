import { curry } from '../functions/fp';

export const hoc = curry((mapper, ComponentToWrap) => {
    const HOC = props => {
        console.log(`Running ${mapper.name} with props`, props);
        const mappedProps = mapper(props);
        console.log(`Got mappedProps from ${mapper.name}`, mappedProps);
        return <ComponentToWrap {...{ ...props, ...mappedProps }} />;
    };
    return HOC;
});