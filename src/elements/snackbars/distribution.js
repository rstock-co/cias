import React from 'react';
import { Snackbar } from "@mui/material";

export const DistributionProcessSnackbar = ({ updateProcessMessage, updateProcessError, processMessage, processError }) => {
    // Define the onClose function
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            // Do not close if the snackbar is clicked away
            return;
        }
        // Clear the current messages to close the snackbar
        updateProcessMessage('');
        updateProcessError('');
    };

    // Conditional styling based on processError
    const snackbarStyle = {
        '& .MuiSnackbarContent-root': {
            backgroundColor: processError ? '#d32f2f' : '#105c69', // Red for error, otherwise the original color
            fontFamily: 'Inter Tight, sans-serif',
            fontSize: '20px',
            boxShadow: '0 0 10px 3px #4ed3e6',
        }
    };

    return (
        <Snackbar
            open={!!(processMessage || processError)}
            message={processError || processMessage} // Show error if present, otherwise show the process message
            autoHideDuration={3000} // Adjusted to give users more time to read the message, set to null to disable auto-hide
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            sx={snackbarStyle}
        />
    );
}
