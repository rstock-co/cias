import '@fontsource/inter-tight';
import { MenuItem } from '@mui/material';
import { StyledTextField } from './styles';

export const MoveSelect = ({ moves, selectedMove, handleChange }) => {
    return (
        <StyledTextField
            select
            label="Move"
            value={selectedMove}
            onChange={handleChange}
            variant="outlined"
            size="small"
            InputProps={{
                classes: {
                    input: selectedMove !== "" ? 'custom-input custom-input-value' : 'custom-input',
                },
            }}
        >
            <MenuItem value="" sx={{ fontFamily: 'Inter Tight, sans-serif' }}>
                <em>All</em>
            </MenuItem>
            {moves.map((move) => (
                <MenuItem key={move} value={move} sx={{ fontFamily: 'Inter Tight, sans-serif' }}>
                    {move}
                </MenuItem>
            ))}
        </StyledTextField>
    );
};
