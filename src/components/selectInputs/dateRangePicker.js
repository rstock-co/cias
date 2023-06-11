import { TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DateRangePicker } from '@mui/x-date-pickers-pro';
import dayjs from 'dayjs';

export const DateRangeSelect = ({ selectedDateRange, handleChange }) => {
    const { startDate, endDate } = selectedDateRange;

    const handleDateChange = (newValue) => {
        const formattedStartDate = newValue[0]?.format('YYYY-MM-DD') || '';
        const formattedEndDate = newValue[1]?.format('YYYY-MM-DD') || '';
        handleChange({
            startDate: formattedStartDate,
            endDate: formattedEndDate
        });
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateRangePicker
                startText="Start date"
                endText="End date"
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
                sx={{
                    '& .MuiOutlinedInput-root': {
                        height: 32,
                        backgroundColor: 'white',
                        '& fieldset': {
                            borderColor: '#D3D3D3'
                        },
                        '&:hover fieldset': {
                            borderColor: '#4B0082'
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#4B0082'
                        }
                    }
                }}
            />
        </LocalizationProvider>
    );
};

