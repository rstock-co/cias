import { TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DateRangePicker } from '@mui/x-date-pickers-pro';
import dayjs from 'dayjs';

export const DateRangeSelect = ({ selectedDateRange, handleChange }) => {
    const { startDate, endDate } = selectedDateRange;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateRangePicker
                startText="Start date"
                endText="End date"
                value={[dayjs(startDate), dayjs(endDate)]}
                onChange={(newValue) => {
                    handleChange({
                        startDate: newValue[0]?.format('YYYY-MM-DD'),
                        endDate: newValue[1]?.format('YYYY-MM-DD')
                    });
                }}
                renderInput={(startProps, endProps) => (
                    <>
                        <TextField {...startProps} variant="outlined" size="small" sx={{ minWidth: 120, backgroundColor: 'white' }} />
                        <TextField {...endProps} variant="outlined" size="small" sx={{ minWidth: 120, backgroundColor: 'white' }} />
                    </>
                )}
            />
        </LocalizationProvider>
    );
}
