import { TextField, ThemeProvider } from '@mui/material';
import { useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DateRangePicker } from '@mui/x-date-pickers-pro';
import dayjs from 'dayjs';
import { autoCompleteTheme, defaultStyle, filledStyle } from './styles';

export const DateRangeSelect = ({ selectedDateRange, handleChange }) => {

    const { startDate, endDate } = selectedDateRange;

    const [isStartDateDefault, setIsStartDateDefault] = useState(true);
    const [isEndDateDefault, setIsEndDateDefault] = useState(true);

    const handleDateChange = (newValue) => {
        const formattedStartDate = newValue[0]?.format('YYYY-MM-DD') || '';
        const formattedEndDate = newValue[1]?.format('YYYY-MM-DD') || '';
        handleChange({
            startDate: formattedStartDate,
            endDate: formattedEndDate
        });

        setIsStartDateDefault(formattedStartDate === '');
        setIsEndDateDefault(formattedEndDate === '');
    };

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
                            boxShadow: '0 0 3px 3px #b09946'
                        },
                    }}
                value={[dayjs(startDate), dayjs(endDate)]}
                onChange={handleDateChange}
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
