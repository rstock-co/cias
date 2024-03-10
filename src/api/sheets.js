import { CAPPED_MOVE_DRIVE_FOLDER_ID, CAPPED_MOVE_TEMPLATE_SSID } from '../lib/data';
import axios from "axios";


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

export const generateCappedMoveData = (sortedAllocationTableData, walletName) => {
    const formattedWalletName = walletName.replace("Allocation Table", "Capped Move Table").replace("' Wallet", "");

    console.log()
  
    // Prepare title, headers
    const titleRow = [formattedWalletName];
    const spacerRow = ['']; // One row space
    const headersRow = ['Wallet Address', 'Share %', 'USD Amount'];
  
    // Initialize the 2D array with the title, spacer, and headers
    let tableDataArray = [titleRow, spacerRow, headersRow];
  
    // Map over sortedAllocationTableData to format each row of data
    sortedAllocationTableData.forEach(({ memberWallet, share, adjustedNetAmount }) => {
      const walletAddress = memberWallet; // Wallet address
      const weightingPercentage = (share * 100).toFixed(8); // Convert share to percentage and format
  
      // Ensure usdAmount is calculated or defined elsewhere in your code as needed
      // Here, usdAmount is added directly; ensure it's in the correct format
  
      // Add this row of data to the 2D array
      tableDataArray.push([walletAddress, `${weightingPercentage}%`, adjustedNetAmount.toFixed(2)]);
    });

    console.log("TABLE ARRAY FOR CAPPED MOVE: ", tableDataArray)
  
    return tableDataArray;
  };
  
  


/**
 * Copy a template spreadsheet and populate a specified sheet within the new spreadsheet with data.
 * 
 * @param {string} accessToken Google auth access token with required permissions to create a new spreadsheet and write data to it.
 * @param {Array<Array<string|number>>} data 2D array of data to populate in the sheet.
 * @param {string} newSheetName Name for the new spreadsheet.
 * @param {string} templateCopyToSheetName Name of the sheet in the new spreadsheet to populate with data.
 */

export const duplicateCappedMovesTemplate = async (accessToken, data, newSheetName, templateCopyToSheetName) => {
  try {

    // Step 1: Copy the template spreadsheet
    const copyResponse = await axios.post(
      `https://www.googleapis.com/drive/v3/files/${CAPPED_MOVE_TEMPLATE_SSID}/copy`,
      { 
        name: newSheetName, // Set the new spreadsheet's name
        parents: [CAPPED_MOVE_DRIVE_FOLDER_ID] // Set the parent folder ID, 
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const newSpreadsheetId = copyResponse.data.id; // ID of the newly created spreadsheet

    // Step 2: Populate the specified sheet in the new spreadsheet with data
    const range = `${templateCopyToSheetName}!A1`; // Starting cell to populate data
    const updateResponse = await axios.put(
      `https://sheets.googleapis.com/v4/spreadsheets/${newSpreadsheetId}/values/${range}?valueInputOption=USER_ENTERED`,
      {
        values: data
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Sheet populated successfully:', updateResponse.data);
  } catch (error) {
    console.error('Error copying or populating spreadsheet:', error.response ? error.response.data : error.message);
  }
}


// Example usage
// const data = [
//   ['Header1', 'Header2', 'Header3'],
//   [1, 2, 3],
//   [4, 5, 6]
// ];
// copyAndPopulateSheet(data, 'New Spreadsheet Name', 'RawData');

