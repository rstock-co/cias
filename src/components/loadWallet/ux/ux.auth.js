import { createNewCappedMove, generateCappedMoveData, importCappedMoveData, updateExistingCappedMove } from '../../../api/google';
import { useEffect, useState } from 'react';
import { curry } from '../../../lib/functions/fp';
import { getNowMST } from '../../../lib/functions/time';
import { useAuth } from '../../../auth/google';

const AuthUX = ({cappedMoveAmount, setCappedMoveAmount, setSelectedCappedMoveWallets, selectedCappedMoveWallets, selectedWallets, setIsCappedMove, sortedAllocationTableData }) => { 

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

        const isNew = exportType === 'new';

        const exportData = async () => {
            if (isExporting) {
                console.log(isNew ? "attempting to CREATE NEW capped move" : "attempting to UPDATE EXISTING capped move");
                const action = isNew ? createNewCappedMove : updateExistingCappedMove;
                try {
                    await action({
                        accessToken,
                        data: generateCappedMoveData(sortedAllocationTableData, `Capped Move for ${name}`, dateTime),
                        dateTime,
                        targetTabName: isNew ? 'index' : 'txn-data',
                        moveName: name,
                        walletAddress: address,
                        cappedMoveAmount,
                        CAPPED_SSID: selectedCappedMoveWallets[0]?.ssid
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

    useEffect(() => {  // matches the currently selected wallet to see if it is in the imported capped move metadata

        if (![1, 3].includes(selectedWallets.length)) {   // reset:  only 1 wallet is allowed for update, only 3 wallets is allowed for generate
            setIsCappedMove(false);
            setCappedMoveAmount(0);
        } 
        
        if (selectedWallets.length !== 1) return;  // the rest of this useEffect is only applicable to update
        
        // Assuming selectedWallets always contains only one wallet
        const selectedWalletName = selectedWallets[0]?.name;
    
        // Normalize names for comparison (optional, based on your naming convention)
        const normalizeName = name => name.toLowerCase().replace(/\s+/g, '');
    
        let walletFound = false;
        let cappedMoveAmount = 0; // Initialize with a default value

        importedCappedMoveData.forEach(row => {
            const [dateTime, name, dollarValue, address, ssid] = row;
            if (normalizeName(name) === normalizeName(selectedWalletName)) {
                walletFound = true;

                // Extract numeric value from the dollar value string and convert it to a number
                cappedMoveAmount = parseFloat(dollarValue.replace(/[$,]+/g, ''));

                // Since the wallet is found, update selectedCappedMoveWallets
                setSelectedCappedMoveWallets([{ dateTime, name, address, ssid }]);
            }
        });

        setIsCappedWalletFound(walletFound);

        // Set the dollar amount for the capped move. This value is only set if the wallet is found.
        if (walletFound) {
            setCappedMoveAmount(cappedMoveAmount);
        }

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
        setExportType,
        exportType,
        isImporting
    }

};

export default AuthUX;