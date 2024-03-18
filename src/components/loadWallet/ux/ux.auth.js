import { createDistribution, createNewCappedMove, importCappedMoveData, updateExistingCappedMove } from '../../../api/google';
import { useEffect, useState } from 'react';
import { generateCappedMoveData } from '../../../lib/functions/google';
// import { curry } from '../../../lib/functions/fp';
import { getNowMST } from '../../../lib/functions/time';
import { useAuth } from '../../../auth/google';

const AuthUX = ({cappedMoveAmount, setCappedMoveAmount, setSelectedCappedMoveWallets, selectedCappedMoveWallets, selectedWallets, setIsCappedMove, sortedAllocationTableData }) => { 

    const { accessToken, initiateGoogleLogin } = useAuth();
    const [operation, setOperation] = useState({
        type: null,
        subtype: 'new',
        data: null
    });
    const [importedCappedMoveData, setImportedCappedMoveData] = useState([]);
    const [isCappedWalletFound, setIsCappedWalletFound] = useState(false);
    const dateTime = getNowMST();
    const { name, address } = selectedCappedMoveWallets.length > 0 ? selectedCappedMoveWallets[0] : {name: undefined, address: undefined};

    const exportActions = {
        new: { action: createNewCappedMove, title: `Capped Move for ${name}` },
        existing: { action: updateExistingCappedMove, title: `Capped Move for ${name}` },
        distribution: { action: createDistribution, title: `Distribution for ${name}` } 
    };


    useEffect(() => {
        if (!accessToken) return;

        console.log("USE EFFECT TRIGGERED WITH ACCESS TOKEN: ", operation)

        const exportData = async () => {
            const exportConfig = exportActions[operation.subtype]; 

            console.log("EXPORT initiated: ", exportConfig)

            try {
                await exportConfig.action({
                    accessToken,
                    data: generateCappedMoveData(sortedAllocationTableData, exportConfig.title, dateTime),
                    dateTime,
                    moveName: operation.subtype === 'distribution' ? selectedWallets[0].name : name,
                    walletAddress: address,
                    amount: operation.subtype === 'distribution' && operation.data ? operation.data[0] : cappedMoveAmount,
                    CAPPED_SSID: selectedCappedMoveWallets[0]?.ssid
                });
            } catch (error) {
                console.error('Error exporting data:', error);
            } finally {
                setOperation({ type: null, subtype: null, data: null }); 
            }
        };

        const importData = async () => {
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
                setOperation({ type: null, subtype: null, data: null});  
            }
        };

        if (operation.type === 'export') {
            exportData();
        } else if (operation.type === 'import') {
            importData();
        }
    }, [accessToken, operation]);

    
    useEffect(() => {  // matches the currently selected wallet to see if it is in the imported capped move metadata

        if (![1, 3].includes(selectedWallets.length)) {   // reset:  only 1 wallet is allowed for update, only 3 wallets is allowed for generate
            setIsCappedMove(false);
            setCappedMoveAmount(0);
        } 
        
        if (selectedWallets.length !== 1) return;  // the rest of this useEffect is only applicable to capped move update
        
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

    const handleLogin = (type, subtype, ...args) => {
        if (!accessToken) {
            console.log('No Google OAuth 2.0 token found, initiating login..');
            initiateGoogleLogin();
        }
        setOperation({
            type,
            subtype,
            data: args
        }); // Set the flag to indicate an operation attempt is pending
    };
    
    return {
        handleLogin,
        importedCappedMoveData,
        isCappedWalletFound,
        operation
    }
};

export default AuthUX;