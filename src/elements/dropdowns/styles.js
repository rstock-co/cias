import "@fontsource/inter-tight";
import { InputLabel, OutlinedInput, Select, TextField } from '@mui/material';
import { createTheme, styled } from '@mui/material/styles';
import { useEffect, useRef, useState }from 'react';

// SINGLE SELECTS

export const StyledTextField = styled(TextField)(() => ({
    minWidth: 120,

    '& .MuiOutlinedInput-root': {
        borderRadius: '10px',
        fontFamily: 'Inter Tight, sans-serif',
        '& .MuiOutlinedInput-input': {
            padding: '10px 14px',
            fontFamily: 'Inter Tight, sans-serif',
            '&.custom-input': {
                background: 'linear-gradient(to right, #011D24, #02343C)',
                color: "#6DFAFE",
                border: '1px solid #096B78',
                borderRadius: "10px",
            },
            '&.custom-input-value': {
                background: 'linear-gradient(to right, #011D24, #02343C)',
                color: "#6DFAFE",
                border: '1px solid #f2db88',
                boxShadow: '0 0 3px 3px #b09946', // Add the glow when value is present
                borderRadius: "10px",
            },
        },
        '&.Mui-focused': {
            boxShadow: '0 0 3px 2px #096B78',
        },
        '& .MuiSelect-icon': {
            color: '#6DFAFE',
        },
    },
    '& .MuiInputLabel-root': {
        fontSize: '14px',
        color: '#e6c347',
        fontWeight: 'bold',
        letterSpacing: '1px',
        '&.Mui-focused': {
            fontSize: '15px', // Adjust the font size when focused
        },
        '&.MuiInputLabel-shrink': {
            fontSize: '20px', // Adjust the font size when value is present
            top: '-15px',
            left: '-10px',
            letterSpacing: '1.25px',
        },
    },
    '& .MuiOutlinedInput-notchedOutline': {
        border: 'none',
    },
}));

// MULTI SELECT (main wallet select box)

export const CustomInputLabel = styled(InputLabel)(() => ({
    color: '#e6c347',
    fontWeight: 'bold',
    fontFamily: 'Inter, sans-serif',
    fontSize: '17px',
    letterSpacing: '0.75px',
    left: '-5px',
    '&.Mui-focused': {
        color: '#e6c347',
        fontWeight: 'bold',
    },
    '&.MuiInputLabel-shrink': {
        color: '#e6c347', 
        fontWeight: "bold",
    },
}));

// Define the base styles
const baseStyles = {
    color: '#6DFAFE',
    fontFamily: 'Inter Tight, sans-serif',
    height: '45px',
    borderRadius: "10px",
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#096B78', // Set the border color
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#096B78', // Keep the border color on hover
    },
    "& .MuiSvgIcon-root": {
        color: "#6DFAFE !important",
    },
};

// Apply the base styles to OutlinedInput
const StyledOutlinedInput = styled(OutlinedInput)(() => ({
    root: baseStyles,
}));

export const CustomOutlinedInput = (props) => {
    const [isFocused, setIsFocused] = useState(true);
    const inputRef = useRef(null); // Ref to track the input element

    const handleClickOutside = (event) => {
        // Check if the click was outside the input
        if (inputRef.current && !inputRef.current.contains(event.target)) {
            setIsFocused(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            // Cleanup the event listener
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <StyledOutlinedInput
            {...props}
            ref={inputRef} // Attach the ref
            style={{ boxShadow: isFocused ? '0 0 3px 2px #096B78' : 'none' }}
            onFocus={() => setIsFocused(true)} // Set focus on focus
            onBlur={() => setIsFocused(false)} // Remove focus on blur
        />
    );
};

export const CustomSelect = styled(Select)(() => ({
    root: {
        height: '50px',
    },
    "& .MuiSelect-select": {
        backgroundColor: "#011D24",
        color: "#6DFAFE",
        borderColor: '#096B78',
    },
    '&.Mui-focused .MuiSelect-select': {
        color: "#6DFAFE", // Set to the theme's primary text color or another color for when the select has a value
        borderColor: '#096B78',
    },
}));


// AUTO COMPLETE (FILTER WALLET SELECT) & DATE RANGE PICKERS

export const autoCompleteTheme = createTheme({
    components: {
        MuiAutocomplete: {
            styleOverrides: {
                tag: {
                    backgroundColor: "#011D24",
                    color: "#6DFAFE",
                    borderColor: "#096B78",
                },
                clearIndicator: {
                    color: "#6DFAFE",
                },
                popupIndicator: {
                    color: "#6DFAFE",
                },
                popupIndicatorOpen: {
                    transform: "rotate(180deg)",
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                input: {
                    borderRadius: "10px",
                    background: 'linear-gradient(to right, #022027, #02343C)',
                    padding: "10px 14px",
                    color: "#6DFAFE",
                    "&::placeholder": {
                        color: "#6DFAFE",
                    },
                },
                root: {
                    borderRadius: "10px",
                    background: 'linear-gradient(to right, #022027, #02343C)',
                    fontFamily: 'Inter Tight, sans-serif',
                    minHeight: "45px",
                    "&:hover": {
                        borderColor: "#096B78",
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#096B78",
                        },
                    },
                    "&.Mui-focused": {
                        borderColor: "#096B78",
                        boxShadow: "none",
                        "& .MuiOutlinedInput-notchedOutline": {
                            border: "1px solid #096B78",
                            boxShadow: "0 0 3px 2px #096B78",
                        },
                    },

                },
                filled: { 
                    '& .MuiOutlinedInput-notchedOutline': {
                        boxShadow: "0 0 3px 2px #b09946",
                    },
                },
                notchedOutline: {
                    borderColor: "#096B78",
                },
                notchedOutlineWithValue: {
                    borderColor: "#f2db88",
                    boxShadow: "0 0 3px 3px #b09946",
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    fontSize: "13px",
                    color: "#e6c347",
                    fontWeight: "bold",
                    "&.Mui-focused": {
                        fontSize: "13px",
                        color: "#e6c347", // Update the color to yellow
                    },
                    "&.MuiInputLabel-shrink": {
                        fontSize: "17px",
                        left: "-5px",
                    },
                },
            },
        },
        MuiFormLabel: {
            styleOverrides: {
                root: {
                    fontSize: "13px",
                    color: "#e6c347",
                    fontWeight: "bold",
                    "&.Mui-focused": {
                        fontSize: "13px",
                        color: "#e6c347", // Update the color to yellow
                    },
                    "&.MuiInputLabel-shrink": {
                        fontSize: "17px",
                        left: "-5px",
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontFamily: 'Inter Tight, sans-serif',
                    fontWeight: 'regular',
                    fontSize: '15px',
                    background: '-webkit-linear-gradient(left, #01070D, #082a33)', // : `linear-gradient(to right, #022027, #04373A)`,
                    color: '#8fafff', // : '#08E2EA',
                    border: '1px solid #46a7ab !important', // : '1px solid #08E2EA !important',
                    transform: 'translateY(-2px)',
                    boxShadow: 'none', // : 'none',
                    transition: 'box-shadow 0.3s ease-in-out, background 0.3s ease-in-out',
                    marginTop: '18px',
                    alightItems: 'center',
                    alignContent: 'center',
                    justifyContent: 'center',
                    '&:hover': {
                        background: '#043f54', // : '#0c546e',
                        boxShadow: '0 0px 5px 0.5px #0c546e', // maintain the box shadow on hover
                    },
                    '&:focus, &:active, &:focus-visible': {
                        border: '#3a61c2',
                        background: '#0b2566', // : '#0c546e',
                    },
                },
                label: {
                    fontFamily: 'Inter Tight, sans-serif',
                    fontWeight: 'regular',
                    fontSize: '15px',
                    color: '#6DFAFE', // : '#08E2EA',
                
                },
                deleteIcon: {
                    color: '#46a7ab',
                    '&:hover': {
                        color: '#6DFAFE', 
                    }
                },
                endAdornment: {
                    color: '#46a7ab',
                }
            }
        },
        MuiAutocomplete: {
            styleOverrides: {
                tag: {
                    marginTop: '9px',
                    marginBottom: '1px'
                },
                popupIndicator: {
                    color: '#6DFAFE'
                }
            }
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    color: '#6DFAFE',
                    '&:hover': {
                        color: '#6DFAFE',
                    }
                }
            
            }
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    '&.MuiTypography-root':{
                    fontFamily: 'Inter Tight, sans-serif',
                    fontSize: '15px',
                    color: '#6DFAFE',
                    }
                },
                body1: {
                    '&.MuiTypography-root.MuiTypography-body1': {
                    fontFamily: 'Inter Tight, sans-serif',
                    fontSize: '15px',
                    color: '#6DFAFE',
                    }
                },

            }
        }
    },
});

// DATE RANGE PICKERS - extra styles

export const defaultStyle = {
    width: '325px',
    "& .MuiOutlinedInput-notchedOutline": {
        borderColor: '#096B78',
    }
};

export const filledStyle = {
    width: '325px',
    "& .MuiOutlinedInput-notchedOutline": {
        boxShadow: '0 0 3px 3px #b09946',
        border: '1px solid #f2db88',
    }
};
