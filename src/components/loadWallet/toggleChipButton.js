import React, { useState } from 'react';
import { Chip } from '@mui/material';

function ToggleChipButton() {
  const [isAdded, setIsAdded] = useState(false);

  const handleClick = () => {
    setIsAdded(!isAdded);
  };

  return (
    <Chip
      label={isAdded ? "Added to blend" : "Blend"}
      onClick={handleClick}
      style={{
        backgroundColor: isAdded ? 'green' : 'grey',
        color: 'white',
        cursor: 'pointer',
        marginLeft: 8, // Left padding from the text
        height: 24, // Slimmer height
        fontSize: '0.8rem', // Adjust font size if needed
        // Adjust internal padding if needed
        paddingTop: 0,
        paddingBottom: 0
      }}
    />
  );
}

export default ToggleChipButton;

