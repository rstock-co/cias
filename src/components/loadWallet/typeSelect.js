import { TextField, MenuItem } from '@mui/material';

const TypeSelect = ({ transactionType, handleTransactionTypeChange }) => {
    return (
        <TextField
            select
            label="Transaction"
            value={transactionType}
            onChange={handleTransactionTypeChange}
            variant="outlined"
            size="small"
            sx={{ minWidth: 120, backgroundColor: 'white' }}
        >
            <MenuItem value="">
                <em>None</em>
            </MenuItem>
            <MenuItem value="Contribution">Contribution</MenuItem>
            <MenuItem value="Receiving">Receiving</MenuItem>
        </TextField>
    );
}

export default TypeSelect;
