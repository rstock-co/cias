import { 
  CAPPED_MOVE_DRIVE_FOLDER_ID, 
  CAPPED_MOVE_INDEX_SSID, 
  CAPPED_MOVE_TEMPLATE_SSID, 
  GOOGLE_DRIVE_API_URL, 
  GOOGLE_SS_API_URL, 
} from '../lib/data';
import axios from "axios";

/** GOOGLE SHEET ROW AND COLUMN POSITIONS */
const FIRST_ROW_INDEX = 3;
const FIRST_COLUMN_INDEX = 'D';
const LAST_COLUMN_INDEX = 'H';


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

    console.log("TABLE ARRAY FOR CAPPED MOVE: ", tableDataArray)
  
    return tableDataArray;
  };
  
  
/**
 * Copy a template spreadsheet and populate a specified sheet within the new spreadsheet with data, then update index file with metadata.
 * 
 * @param {string} accessToken Google Oauth2.0 access token with required permissions to create a new spreadsheet and write data to it.
 * @param {Array<Array<string|number>>} data 2D array of data to populate in the sheet.
 * @param {string} dateTime Date and time of NOW (in MST), as a string to append to the new spreadsheet name.
 * @param {string} indexTabName Name of the tab in the index sheet to store metadata
 * @param {string} moveName Name of the capped move
 * @param {string} walletAddress Wallet address for the capped move
 * @param {number} cappedMoveAmount Capped amount for the move
 */

export const createNewCappedMove = async (model) => {
  const {accessToken, data, dateTime, indexTabName, moveName, walletAddress, cappedMoveAmount } = model;
  const newSheetName = `${moveName}_${dateTime}`;
  const newTabName = `membership-weighting-${dateTime}`;
  console.log("ACCESS TOKEN: ", accessToken)
  try {

    // Step 1a: Copy the template spreadsheet
    const copyResponse = await axios.post(
      `${GOOGLE_DRIVE_API_URL}/${CAPPED_MOVE_TEMPLATE_SSID}/copy`,
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

    console.log('Step 1a: New sheet created successfully:');
    const newSpreadsheetId = copyResponse.data.id; // ID of the newly created spreadsheet

  // Step 1b: Create a new tab with the name 'newTabName'
  await axios.post(
    `${GOOGLE_SS_API_URL}/${newSpreadsheetId}:batchUpdate`,
    {
      requests: [{
        addSheet: {
          properties: {
            title: newTabName
          }
        }
      }]
    },
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );
  console.log(`Step 1b: New tab named '${newTabName}' created successfully`);

    // Step 2: Populate the specified sheet in the new spreadsheet with data
    const range = `${newTabName}!A1`; // Starting cell to populate data
    const updateResponse = await axios.put(
      `${GOOGLE_SS_API_URL}/${newSpreadsheetId}/values/${range}?valueInputOption=USER_ENTERED`,
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

    console.log('Step 2: New sheet populated successfully:', updateResponse.data);
    
    // Step 3: Update the capped moves index file with the new spreadsheet metadata

    const rowIndexResponse = await axios.get(
      `${GOOGLE_SS_API_URL}/${CAPPED_MOVE_INDEX_SSID}/values/${indexTabName}!A1`,
      { headers: { 'Authorization': `Bearer ${accessToken}` } }
    );

    const [[rowIndex]] = rowIndexResponse.data.values;
    const metaDataRange = `${indexTabName}!${FIRST_COLUMN_INDEX}${rowIndex}`;
    

    const metaData = [
      [dateTime, moveName, cappedMoveAmount, walletAddress, newSpreadsheetId]
    ];

    await axios.put(
      `${GOOGLE_SS_API_URL}/${CAPPED_MOVE_INDEX_SSID}/values/${metaDataRange}?valueInputOption=USER_ENTERED`,
      { values: metaData },
      { headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' } }
    );

    console.log('Step 3: Index sheet updated successfully');

  } catch (error) {
    console.error('Error copying or populating spreadsheet:', error.response ? error.response.data : error.message);
  }
}

/**
 * Imports capped move metadata from a specified range in the Google Sheets index file and updates a React state variable.
 * 
 * This function fetches metadata starting from row 4, columns D to H, up to the last row number specified in cell A1 of the index sheet.
 * The fetched data is stored in a 2D array and intended to be used to update a React state variable.
 *
 * @param {string} accessToken Google OAuth2.0 access token with required permissions to read data from the spreadsheet.
 * @param {string} sheetId The ID of the Google Sheet from which to import the metadata.
 * @param {string} indexTabName Name of the tab in the index sheet from which to import metadata.
 * @param {Function} setStateCallback The React state setter function to update the state with the imported data.
 * 
 * @returns {void} This function does not return a value. It updates the React state directly via the setStateCallback.
 */

export const importCappedMoveData = async (model) => {

  const {accessToken, indexTabName, setStateCallback} = model;

  try {
    // Step 1: Get the last row number from cell A1
    const rowIndexResponse = await axios.get(
      `${GOOGLE_SS_API_URL}/${CAPPED_MOVE_INDEX_SSID}/values/${indexTabName}!A1`,
      { headers: { 'Authorization': `Bearer ${accessToken}` } }
    );

    const [[lastRow]] = rowIndexResponse.data.values;
    const lastRowNumber = Number(lastRow);

    if (!lastRowNumber || isNaN(lastRowNumber)) {
      console.error('Invalid row index retrieved: ', lastRow);
      return;
    }

    console.log(`Step 1: Last row number: '${lastRowNumber}' obtained successfully`);

    // Step 2: Fetch the data from the constructed range
    const dataRange = `${indexTabName}!${FIRST_COLUMN_INDEX}${FIRST_ROW_INDEX}:${LAST_COLUMN_INDEX}${lastRowNumber - 1}`;

    const dataResponse = await axios.get(
      `${GOOGLE_SS_API_URL}/${CAPPED_MOVE_INDEX_SSID}/values/${dataRange}`,
      { headers: { 'Authorization': `Bearer ${accessToken}` } }
    );

    const data = dataResponse.data.values;

    console.log('Step 2: Data obtained successfully: ', data);

    // Step 3: Update the React state with the fetched data
    if (data && Array.isArray(data)) {
      setStateCallback(data);
    } else {
      console.error('No data found in the specified range:', dataRange);
    }

  } catch (error) {
    console.error('Error importing data:', error.response ? error.response.data : error.message);
  }
};

