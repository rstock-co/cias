import ButtonGroup from '@mui/material/ButtonGroup';
import { FetchTypeButton } from './styles';

export const FetchTypeSelect = ({ fetchType, setFetchType }) => (
    <ButtonGroup variant="contained" aria-label="fetch type button group" sx={{ boxShadow: 'none', marginBottom: '15px' }} disableRipple>
        <FetchTypeButton active={fetchType === 'normal'} onClick={() => setFetchType('normal')}>
            Normal
        </FetchTypeButton>
        <FetchTypeButton active={fetchType === 'erc20'} onClick={() => setFetchType('erc20')}>
            ERC20
        </FetchTypeButton>
        <FetchTypeButton active={fetchType === 'all'} onClick={() => setFetchType('all')}>
            All
        </FetchTypeButton>
    </ButtonGroup>
);


