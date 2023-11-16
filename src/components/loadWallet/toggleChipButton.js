import { Chip } from '@mui/material';
import '@fontsource/inter-tight';

const ToggleChipButton = ({onToggle, isBlended, txnId }) => (
    <Chip
      label={isBlended ? "Blended" : "Not blended"}
      onClick={() => onToggle(txnId, !isBlended)}
      style={{
        fontFamily: 'Inter Tight, sans-serif',
        backgroundColor: isBlended ? '#048241' : '#a84931',
        color: 'white',
        cursor: 'pointer',
        marginLeft: 12, // Left padding from the text
        marginBottom: 2,
        height: 24, // Slimmer height
        fontSize: '0.8rem', // Adjust font size if needed
        // Adjust internal padding if needed
        lineHeight: 1,
        paddingTop: '2px',
        paddingBottom: 0
      }}
    />
  );

export default ToggleChipButton;

