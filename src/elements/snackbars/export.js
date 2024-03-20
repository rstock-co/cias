import { Snackbar, SnackbarContent } from "@mui/material";
import { ColorButton } from '../buttons';
import React from 'react';

export const ExportProcessSnackbar = ({ 
    updateProcessMessage, 
    updateProcessError, 
    processMessage: { message, type, showActionButton, actionButtonUrl }, 
    processError,
}) => {
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        updateProcessMessage(''); 
        updateProcessError('');
    };

    const openUrlInNewWindow = (url) => {
        window.open(url, '_blank');
        // Close the Snackbar after opening the URL
        updateProcessMessage('');
        updateProcessError('');
    };

    const snackbarStyle = {
        '& .MuiSnackbarContent-root': {
            backgroundColor: processError ? '#d32f2f' : '#105c69',
            fontFamily: 'Inter Tight, sans-serif',
            fontSize: '20px',
            boxShadow: processError ? '0 0 10px 3px #54020d' : '0 0 10px 3px #4ed3e6',
        }
    };

    const buttonText = type === 'distro' ? 'Open Distribution Sheet' : 'Open Capped Move Sheet';
                       
    return (
        <Snackbar
            open={!!(message || processError)}
            autoHideDuration={null} // Keep open indefinitely until an action occurs
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            sx={snackbarStyle}
        >
            <SnackbarContent
                message={
                    <div>
                        {processError || message}
                        {showActionButton && actionButtonUrl && (
                            <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'center' }}>
                                <ColorButton onClick={() => openUrlInNewWindow(actionButtonUrl)} buttonText={buttonText} />
                            </div>
                        )}
                    </div>
                }
            />
        </Snackbar>
    );
};
