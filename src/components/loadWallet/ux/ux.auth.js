import { createNewCappedMove, generateCappedMoveData, importCappedMoveData } from '../../../api/google';
import { useEffect, useState } from 'react';
import { curry } from '../../../lib/functions/fp';
import { getNowMST } from '../../../lib/functions/time';
import { useAuth } from '../../../auth/google';

const AuthUX = ({sortedAllocationTableData, cappedMoveAmount, selectedCappedMoveWallets, selectedWallets, setIsCappedMove }) => { 

    const { accessToken, initiateGoogleLogin } = useAuth();
    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [exportType, setExportType] = useState('new');
    const [importedCappedMoveData, setImportedCappedMoveData] = useState([]);
    const [isCappedWalletFound, setIsCappedWalletFound] = useState(false);
    const dateTime = getNowMST();
    const { name, address } = selectedCappedMoveWallets.length > 0 ? selectedCappedMoveWallets[0] : {name: undefined, address: undefined};


    useEffect(() => {
        if (!accessToken || (!isExporting && !isImporting)) return;

        const exportData = async () => {
            if (isExporting) {
                console.log(exportType === 'new' ? "attempting to CREATE NEW capped move" : "attempting to UPDATE EXISTING capped move");
                const action = exportType === 'new' ? createNewCappedMove : updateExistingCappedMove;
                try {
                    await action({
                        accessToken,
                        data: generateCappedMoveData(sortedAllocationTableData, `Capped Move for ${name}`, dateTime),
                        dateTime,
                        indexTabName: 'index',
                        moveName: name,
                        walletAddress: address,
                        cappedMoveAmount,
                    });
                } catch (error) {
                    console.error('Error exporting data:', error);
                } finally {
                    setIsExporting(false); // Prevent infinite loop
                }
            }
        };

        const importData = async () => {
            if (isImporting) {
                console.log("attempting to IMPORT capped moves metadata");
                try {
                    await importCappedMoveData({
                        accessToken, 
                        indexTabName: 'index', 
                        setStateCallback: setImportedCappedMoveData
                    });
                } catch (error) {
                    console.error('Error importing data:', error);
                } finally {
                    setIsImporting(false); // Prevent infinite loop
                }
            }
        };

        exportData();
        importData();
    }, [accessToken, isExporting, isImporting]);

    useEffect(() => {
        if (![1, 3].includes(selectedWallets.length)) setIsCappedMove(false); // only 1 is allowed for update, only 3 is allowed for generate
        if (selectedWallets.length !== 1) return;  // the rest is only for update
        
        // Assuming selectedWallets always contains only one wallet
        const selectedWalletName = selectedWallets[0]?.name;
    
        // Normalize names for comparison (optional, based on your naming convention)
        const normalizeName = name => name.toLowerCase().replace(/\s+/g, '');
    
        // Check if the selected wallet name exists in the imported data.
        const walletFound = importedCappedMoveData.some(row => {
            // Extract the wallet name from the row (assuming it's always in the same position).
            const [, walletName] = row;
            return normalizeName(walletName) === normalizeName(selectedWalletName);
        });
    
        setIsCappedWalletFound(walletFound);
    
    }, [importedCappedMoveData, selectedWallets]);
    

    const handleLogin = curry((setter, type) => {
        if (!accessToken) {
            console.log('No Google OAuth 2.0 token found, initiating login..');
            initiateGoogleLogin();
        }
        setter(true); // Set the flag to indicate an operation attempt is pending
        setExportType(type);
    });
    
    const handleCappedMoveExport = handleLogin(setIsExporting)
    const handleCappedMoveImport = handleLogin(setIsImporting);
    
    return {
        handleCappedMoveExport,
        handleCappedMoveImport,
        importedCappedMoveData,
        isCappedWalletFound,
        setExportType
    }

};

export default AuthUX;