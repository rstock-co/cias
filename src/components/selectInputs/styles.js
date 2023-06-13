import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

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
            // translate: 'translate(0, -12px)'
        },
    },
    '& .MuiOutlinedInput-notchedOutline': {
        border: 'none',
    },
}));
