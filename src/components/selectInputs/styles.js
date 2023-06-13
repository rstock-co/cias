import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledTextField = styled(TextField)(({ theme }) => ({
    minWidth: 120,
    '& .MuiOutlinedInput-root': {
        borderRadius: '10px', // Adjust the value to control the amount of rounding
        '& .MuiOutlinedInput-input': {
            padding: '10px 14px', // Adjust the padding as desired
            '&.custom-input': {
                background: 'linear-gradient(to right, #011D24, #02343C)',
                color: "#6DFAFE",
                border: '1px solid #096B78', // Add the border style
            },
            '&:focus': {
                boxShadow: `0 0 3px 2px #096B78`,
            },
        },
        '& .MuiOutlinedInput-notchedOutline': {
            border: 'none', // Remove the default border
        },
    },
}));