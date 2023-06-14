import { OutlinedInput, InputLabel, Select, TextField, createTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { makeStyles, withStyles } from '@mui/styles';


// SINGLE SELECTS

export const StyledTextField = styled(TextField)(({ theme }) => ({
    minWidth: 120,
    '& .MuiOutlinedInput-root': {
        borderRadius: '10px',
        '& .MuiOutlinedInput-input': {
            padding: '10px 14px',
            '&.custom-input': {
                background: 'linear-gradient(to right, #011D24, #02343C)',
                color: "#6DFAFE",
                border: '1px solid #096B78',
            },
            '&.custom-input-value': {
                background: 'linear-gradient(to right, #011D24, #02343C)',
                color: "#6DFAFE",
                border: '1px solid #f2db88',
                boxShadow: '0 0 3px 3px #b09946', // Add the glow when value is present
            },
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
            // translate: 'translate(0, -12px)'
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
        '&.Mui-focused': {
            color: '#e6c347',
            fontWeight: 'bold',
        },
    },
})(InputLabel);

export const CustomOutlinedInput = withStyles({
    root: {
        color: '#6DFAFE',
        height: '50px',
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#096B78', // Set the border color
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#096B78', // Keep the border color on hover
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#096B78', // Keep the border color when focused
        },
    },
})(OutlinedInput);

export const CustomSelect = withStyles({
    root: {
        height: '50px',
        '& .MuiSelect-icon': {
            color: '#6DFAFE', // Set the select dropdown arrow color
        },
    },
    "& .MuiSelect-select": {
        backgroundColor: "#011D24",
        color: "#6DFAFE",
    },
})(Select);



// AUTO COMPLETE (FILTER WALLET SELECT)

export const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
            height: '45px',
            '& fieldset': {
                border: '1px solid #096B78',
                '&:hover': {
                    borderColor: '#096B78',
                },
            },
            '& input': {
                padding: '10px 14px',
                color: '#6DFAFE',
                border: 'none', // Hide the inner border
            },
            '&.Mui-focused fieldset': {
                borderColor: '#096B78',
                boxShadow: '0 0 3px 2px #096B78',
            },
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#096B78',
        },
        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#096B78',
        },
        '& .MuiAutocomplete-clearIndicator, & .MuiAutocomplete-popupIndicator': {
            color: '#6DFAFE',
        },
        '& .MuiAutocomplete-root': {
            height: '50px', // Adjust the height as desired
        },
        '& .MuiInputLabel-root': {
            fontSize: '13px',
            color: '#e6c347',
            fontWeight: 'bold',
            '&.Mui-focused': {
                fontSize: '13px', // Adjust the font size when focused
            },
            '&.MuiInputLabel-shrink': {
                fontSize: '20px', // Adjust the font size when value is present
                top: '-15px',
                left: '-10px',
            },
        },
    },
    customInput: {
        '& fieldset': {
            borderColor: "#096B78",
        },
        '& input': {
            // background: 'linear-gradient(to right, #011D24, #02343C)',
        }
    },
    customInputValue: {
        '& fieldset': {
            borderColor: "#f2db88",
            boxShadow: '0 0 3px 3px #b09946', // Add the glow when value is present
        },
        '& input': {
            // background: 'linear-gradient(to right, #011D24, #02343C)',
        }
    },
}));

export const autoCompleteTheme = createTheme();
