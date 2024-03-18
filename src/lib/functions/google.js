import axios from 'axios';

/**
 * Prepares a 2D array representing a table of data formatted for easy insertion into a Google Sheet. 
 * The output array includes a title row based on the wallet name, a blank spacer row, column headers, 
 * and the data rows from the sorted allocation table data.
 *
 * @param {Array<Object>} sortedAllocationTableData An array of objects containing the allocation data for each entry.
 * Each object in the array should include at least 'memberWallet', 'share', and 'usdAmount' keys.
 * @param {string} walletName The name of the wallet, which is used to create the title row. The function
 * automatically formats this name by replacing "Allocation Table" with "Distribution" and removing "' Wallet".
 *
 * @returns {Array<Array<string|number>>} A 2D array where the first row is the formatted title based on the walletName,
 * followed by a spacer row, then a row of column headers ['Wallet Address', 'Share %', 'USD Amount'], and finally,
 * the rows of data extracted from sortedAllocationTableData. Each data row includes the wallet address, the share percentage
 * formatted as a percentage string, and the USD amount formatted to four decimal places.
*/   

export const generateCappedMoveData = (sortedAllocationTableData, moveName, dateTime) => {
  
    // Prepare title, headers
    const titleRow = [moveName];
    const subTitleRow = [`generated on ${dateTime}`]; // One row space
    const spacerRow = [``]; // One row space
    const headersRow = ['Wallet Address', 'Share %', 'USD Amount'];
  
    // Initialize the 2D array with the title, spacer, and headers
    let tableDataArray = [titleRow, subTitleRow, spacerRow, headersRow];
  
    // Map over sortedAllocationTableData to format each row of data
    sortedAllocationTableData.forEach(({ memberWallet, share, adjustedNetAmount }) => {
      const walletAddress = memberWallet; // Wallet address
      const weightingPercentage = (share * 100).toFixed(8); // Convert share to percentage and format
  
      // Ensure usdAmount is calculated or defined elsewhere in your code as needed
      // Here, usdAmount is added directly; ensure it's in the correct format
  
      // Add this row of data to the 2D array
      tableDataArray.push([walletAddress, `${weightingPercentage}%`, adjustedNetAmount.toFixed(2)]);
    });

    console.log("TABLE ARRAY FOR EXPORT: ", tableDataArray)
  
    return tableDataArray;
  };

  

/** 
 * Utility function to get a spreadsheet tab's ID given its name.
*/
  
export const getTabIdByName = async (spreadsheetId, tabName, accessToken) => {
    try {
      const response = await axios.get(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      const { sheets } = response.data;
      const matchingTab = sheets.find(tab => tab.properties.title === tabName);
  
      if (matchingTab) {
        return matchingTab.properties.sheetId;
      } else {
        throw new Error(`Tab named "${tabName}" not found.`);
      }
    } catch (error) {
      console.error('Error getting tab ID:', error);
      throw error; // Rethrow or handle as needed
    }
  };


/**
 * Copies a Google Spreadsheet to a specified Google Drive folder with a new name.
 * 
 * @param {string} accessToken - Google OAuth 2.0 access token with permissions to access the Drive API.
 * @param {string} templateSpreadsheetId - The source spreadsheet ID to copy.
 * @param {string} newSpreadsheetName - The name for the newly copied spreadsheet.
 * @param {string} driveFolderId - The ID of the Google Drive folder where the new spreadsheet will be placed.
 * @returns {Promise<string>} - The ID of the newly created spreadsheet.
 */
export const copySpreadsheetToFolder = async (
    accessToken, 
    templateSpreadsheetId, 
    newSpreadsheetName, 
    driveFolderId
) => {
    try {
        const response = await axios.post(
          `${GOOGLE_DRIVE_API_URL}/${templateSpreadsheetId}/copy`,
          {
            name: newSpreadsheetName,
            parents: [driveFolderId],
          },
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
    
        console.log('Spreadsheet copied successfully:', response.data);
        return response.data.id; // Return the ID of the newly created spreadsheet
      } catch (error) {
        console.error('Error copying spreadsheet:', error.response ? error.response.data : error.message);
        throw error; // Rethrow the error for handling by the caller
      }
    }
  
  