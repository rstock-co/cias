import { OutlinedInput, InputLabel, Select, TextField } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import { withStyles } from '@mui/styles';
import "@fontsource/inter-tight";

// SINGLE SELECTS

export const StyledTextField = styled(TextField)(({ theme }) => ({
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

export const CustomInputLabel = withStyles({
    root: {
        color: '#e6c347', // Set the label color
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
    },
})(InputLabel);

export const CustomOutlinedInput = withStyles({
    root: {
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
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#096B78', // Keep the border color when focused
            boxShadow: '0 0 3px 2px #096B78',
        },
        "& .MuiSvgIcon-root": {
            color: "#6DFAFE !important",
        },
    },

})(OutlinedInput);

export const CustomSelect = withStyles({
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
})(Select);

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
                    height: "45px",
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
    },
});

// DATE RANGE PICKERS - extra styles

export const defaultStyle = {
    "& .MuiOutlinedInput-notchedOutline": {
        borderColor: '#096B78',
    }
};

export const filledStyle = {
    "& .MuiOutlinedInput-notchedOutline": {
        boxShadow: '0 0 3px 3px #b09946',
        border: '1px solid #f2db88',
    }
};
