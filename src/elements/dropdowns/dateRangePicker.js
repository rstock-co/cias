import { DateRangePicker, LocalizationProvider } from '@mui/x-date-pickers-pro';
import { TextField, ThemeProvider } from '@mui/material';
import { autoCompleteTheme, defaultStyle, filledStyle } from './styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

export const DateRangeSelect = ({
    selectedDateRange,
    handleChange,
    isStartDateDefault,
    isEndDateDefault }
    = {}) => {

    const { startDate, endDate } = selectedDateRange;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ThemeProvider theme={autoCompleteTheme}>
            <DateRangePicker
                startText="Start date"
                endText="End date"
                    sx={(isEndDateDefault && isStartDateDefault) ? defaultStyle : filledStyle}
                    slotProps={{
                        textField: {
                            size: "small",
                            error: false,
                        },
                    }}
                value={[dayjs(startDate), dayjs(endDate)]}
                    onChange={handleChange}
                renderInput={(startProps, endProps) => (
                    <>
                        <TextField
                            {...startProps}
                            variant="outlined"
                            size="small"
                            onFocus={(e) => {
                                if (e.target.value === 'mm/dd/yyyy') {
                                    e.target.value = '';
                                }
                            }}
                            onBlur={(e) => {
                                if (e.target.value === '') {
                                    e.target.value = 'mm/dd/yyyy';
                                }
                            }}
                        />
                        <TextField
                            {...endProps}
                            variant="outlined"
                            size="small"
                            onFocus={(e) => {
                                if (e.target.value === 'mm/dd/yyyy') {
                                    e.target.value = '';
                                }
                            }}
                            onBlur={(e) => {
                                if (e.target.value === '') {
                                    e.target.value = 'mm/dd/yyyy';
                                }
                            }}

                        />
                    </>
                )}
            />
            </ThemeProvider>
        </LocalizationProvider>
    )
};
