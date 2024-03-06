import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MultiInputDateTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputDateTimeRangeField';
import { ThemeProvider } from '@mui/material'; // TextField, 
import { autoCompleteTheme, } from './styles'; // defaultStyle, filledStyle 
import dayjs from 'dayjs';

export const DateRangeSelect = ({
    selectedDateRange,
    handleChange,
    // isStartDateDefault,
    // isEndDateDefault 
}
    = {}) => {

    const { startDate, endDate } = selectedDateRange;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ThemeProvider theme={autoCompleteTheme}>


            <MultiInputDateTimeRangeField
                slotProps={{
                    textField: ({ position }) => ({
                        label: position === 'start' ? 'Start Date' : 'End Date',
                        sx: { width: '200px' }
                    }),
                }}
                value={[
                    startDate ? dayjs(startDate) : null, 
                    endDate ? dayjs(endDate) : null
                ]}
                onChange={handleChange}
            />
            {/* <DateRangePicker
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
            /> */}
            </ThemeProvider>
        </LocalizationProvider>
    )
};
