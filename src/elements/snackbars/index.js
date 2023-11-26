import { Snackbar } from "@mui/material";

const SaveTableSnackbar = ({ saveTableSnackbarMessage, saveTableSnackbarOpen, handleCloseSaveTableSnackbar }) => (
    <Snackbar
        open={saveTableSnackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSaveTableSnackbar}
        message={saveTableSnackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ '& .MuiSnackbarContent-root': { backgroundColor: '#105c69', fontFamily: 'Inter Tight, sans-serif', fontSize: '20px', boxShadow: '0 0 10px 3px #4ed3e6' } }}
    />
)

export default SaveTableSnackbar;