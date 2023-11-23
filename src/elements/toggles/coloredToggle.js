// CustomColorSwitch.js
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';

export const CustomColorSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase': {
    color: '#f7f9fa', // thumb color when unchecked
    
    '&.Mui-checked': {
      color: '#097c8f', // thumb color when checked
      '& + .MuiSwitch-track': {
        backgroundColor: '#097c8f', // track color when checked
        boxShadow: '0 0 10px 2px #199eb0',
      },
    },
  },
  '& .MuiSwitch-track': {
    backgroundColor: '#000000', // track color when unchecked
  },
}));