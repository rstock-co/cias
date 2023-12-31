import Typography from '@mui/material/Typography';
import { curry } from '../../lib/functions/fp';

const baseStyles = { 
  fontFamily: 'Inter Tight Pro'
};

const baseProps = { 
  variant: 'body1', 
  /* ...other default props... */ 
};

const TypographyBuilder = curry((baseStyles, defaultProps, overrides = {}) => {
  const finalStyles = { ...baseStyles, ...overrides.sx };
  const finalProps = { ...defaultProps, ...overrides };

  const Component = (props) => (
    <Typography sx={finalStyles} {...finalProps} {...props}>
      {props.children}
    </Typography>
  );

  Component.displayName = 'CustomTypography';
  return Component;
});

const CustomTypography = TypographyBuilder(baseStyles, baseProps);

export default CustomTypography;


// Usage example
// const ExampleUsage = () => (
//   <div>
//     <CustomTypography overrides={{ sx: { fontWeight: 'bold', color: 'red' }, variant: 'h5' }}>
//       This is bold, red, and an H5.
//     </CustomTypography>
//     <CustomTypography overrides={{ variant: 'body2' }}>
//       This is a body2 text.
//     </CustomTypography>
//   </div>
// );

// export default ExampleUsage;
