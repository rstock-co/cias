import { createNewCappedMove, generateCappedMoveData } from '../../../api/google';
import { useEffect, useState } from 'react';
import { generateAllocationTableTitle } from "../../../lib/functions/format";
import { getNowMST } from '../../../lib/functions/time';
import { useAuth } from '../../../auth/google';

const AuthUX = ({sortedAllocationTableData, selectedWallets, cappedMoveAmount }) => {

    console.log("SORTED DATA: ", sortedAllocationTableData)

    const { accessToken, initiateGoogleLogin } = useAuth();
    const [isExporting, setIsExporting] = useState(false);
    const dateTime = getNowMST();
    const moveName = 'test-move'

    useEffect(() => {
        console.log("USE EFFECT FOR GOOGLE AUTH TRIGGERED")
        const handleCappedMove = async () => {
            if (accessToken && isExporting) {
                console.log("ATTEMPTING TO CREATE CAPPED MOVE")
                try {
                    await createNewCappedMove({
                        accessToken,
                        data: generateCappedMoveData(sortedAllocationTableData, generateAllocationTableTitle(selectedWallets), moveName, dateTime), 
                        dateTime,
                        indexTabName: 'index', // Assuming this is predefined or coming from props
                        moveName,
                        walletAddress: '0x13k4as983423klakl942032340934jk', // Adjust as needed
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
            console.log('No access token available, initiating login.');
            initiateGoogleLogin();
            setIsExporting(true); // Set the flag to indicate an export attempt is pending
        } else {
            setIsExporting(true); // If already logged in, immediately attempt to export
        }
    };

    return {
        isExporting,
        setIsExporting,
        handleCappedMoveExport
    }

};

export default AuthUX;