import { createNewCappedMove, generateCappedMoveData } from '../../../api/google';
import { useEffect, useState } from 'react';
import { getNowMST } from '../../../lib/functions/time';
import { useAuth } from '../../../auth/google';

const AuthUX = ({sortedAllocationTableData, cappedMoveAmount, selectedCappedMoveWallets, }) => {

    console.log("SORTED DATA: ", sortedAllocationTableData)

    const { accessToken, initiateGoogleLogin } = useAuth();
    const [isExporting, setIsExporting] = useState(false);
    const dateTime = getNowMST();
    const { name, address } = selectedCappedMoveWallets.length > 0 ? selectedCappedMoveWallets[0] : {name: undefined, address: undefined};
    console.log("NAME: ", name)
    console.log("ADDRESS: ", address)

    useEffect(() => {
        console.log("USE EFFECT FOR GOOGLE AUTH TRIGGERED")
        const handleCappedMove = async () => {
            if (accessToken && isExporting) {
                console.log("ATTEMPTING TO CREATE CAPPED MOVE")
                try {
                    await createNewCappedMove({
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
                    setIsExporting(false); // Reset the flag after attempting to export data
                }
            }
        };

        handleCappedMove();
    }, [isExporting, accessToken]);

    const handleCappedMoveExport = () => {
        if (!accessToken) {
            console.log('No Google OAuth 2.0 token found, initiating login..');
            initiateGoogleLogin();
        }
        setIsExporting(true); // Set the flag to indicate an export attempt is pending
    };        

    return {
        isExporting,
        setIsExporting,
        handleCappedMoveExport
    }

};

export default AuthUX;