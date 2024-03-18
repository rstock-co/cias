import {  
    GOOGLE_DRIVE_API_URL, 
    GOOGLE_SS_API_URL, 
} from '../../lib/data';
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
  
      // Add this row of data to the 2D array
      tableDataArray.push([walletAddress, `${weightingPercentage}%`, adjustedNetAmount.toFixed(2)]);
    });

    console.log("TABLE ARRAY FOR EXPORT: ", tableDataArray)
  
    return tableDataArray;
  };

  export const generateDistributionData = (sortedAllocationTableData) => {
  
    let walletsArray = [];
    let shareArray = [];
    // Map over sortedAllocationTableData to format each row of data
    sortedAllocationTableData.forEach(({ memberWallet, share }) => {
      const walletAddress = memberWallet; // Wallet address
      const weightingPercentage = (share * 100).toFixed(8); // Convert share to percentage and format
  
      // Add this row of data to the 2D array
      walletsArray.push([walletAddress]);
      shareArray.push([`${weightingPercentage}%`]);
    });
  
    return { walletsArray, shareArray };
  };

  

/** 
 * Utility function to get a spreadsheet tab's ID given its name.
*/
  
export const getTabIdByName = async (spreadsheetId, tabName, accessToken) => {
    try {
      const response = await axios.get(
        `${GOOGLE_SS_API_URL}/${spreadsheetId}?fields=sheets.properties`,
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

export const createNewSpreadsheetFromTemplateAndSaveToFolder = async (
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
    
        return response.data.id; // Return the ID of the newly created spreadsheet for subsequent actions
      } catch (error) {
        console.error('Error copying spreadsheet:', error.response ? error.response.data : error.message);
        throw error; // Rethrow the error for handling by the caller
      }
    }

/**
 * Populates a specified range in a Google Sheet with given data.
 *
 * @param {string} spreadsheetId The ID of the Google Spreadsheet to update.
 * @param {string} range The A1 notation of the range to update.
 * @param {Array<Array<string|number>>} data The 2D array of data to populate in the specified range.
 * @param {string} accessToken A valid Google OAuth 2.0 access token with permissions to modify the spreadsheet.
 * @returns {Promise<Object>} A promise that resolves to the response data from the Google Sheets API.
 * @throws {Error} Throws an error if the request fails, with the response data from the Google Sheets API if available.
 */

export const populateRange = async (spreadsheetId, range, data, accessToken) => {
    try {
    const response = await axios.put(
        `${GOOGLE_SS_API_URL}/${spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED`,
        { values: data },
        {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
        }
    );

    return response.data; // Contains details of the update operation
    } catch (error) {
    console.error('Error populating sheet:', error.response ? error.response.data : error.message);
    throw error; // Rethrow to handle the error outside the function if needed
    }
};

/**
 * Updates a specific cell or range in a Google Sheet with a given value.
 *
 * @param {string} spreadsheetId The unique identifier for the Google Spreadsheet.
 * @param {string} cellRange The A1 notation of the cell or range to update.
 * @param {Array<Array<string|number>>} value The value to populate in the specified cell or range. This should be a 2D array even if updating a single cell.
 * @param {string} accessToken A valid Google OAuth 2.0 access token with permissions to modify the spreadsheet.
 * @returns {Promise<Object>} A promise that resolves to the response data from the Google Sheets API, indicating the result of the update operation.
 * @throws {Error} Throws an error if the request fails, including the error response from the Google Sheets API if available.
 */

export const populateCell = async (spreadsheetId, cellRange, value, accessToken) => {
    try {
      const response = await axios.put(
        `${GOOGLE_SS_API_URL}/${spreadsheetId}/values/${cellRange}?valueInputOption=USER_ENTERED`,
        { values: [[value]] },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      return response.data; // Returns details of the update operation
    } catch (error) {
      console.error('Error updating cell(s):', error.response ? error.response.data : error.message);
      throw error; // Rethrow the error for external handling
    }
  };

  /**
 * Fetches the value of a specific cell or range from a Google Sheet.
 *
 * This function sends an HTTP GET request to the Google Sheets API to retrieve
 * the value(s) of a specified cell or range. It requires the spreadsheet ID,
 * the A1 notation of the cell or range to fetch, and a valid Google OAuth 2.0
 * access token with permissions to read from the spreadsheet.
 *
 * @param {string} spreadsheetId The unique identifier for the Google Spreadsheet.
 * @param {string} range The A1 notation of the cell or range to fetch.
 * @param {string} accessToken A valid Google OAuth 2.0 access token with permissions to read from the spreadsheet.
 * @returns {Promise<Array<Array<string|number>>>} A promise that resolves to the value(s) retrieved from the specified cell or range, typically returned as a 2D array.
 * @throws {Error} Throws an error if the request fails, including the error response from the Google Sheets API if available.
 */

  export const fetchCell = async (spreadsheetId, range, accessToken) => {
    try {
      const response = await axios.get(
        `${GOOGLE_SS_API_URL}/${spreadsheetId}/values/${range}`,
        { headers: { 'Authorization': `Bearer ${accessToken}` } }
      );
  
      const value = response.data.values?.[0]?.[0]; // Safely access the first value
      return value; // Returns the single value from the specified cell
    } catch (error) {
      console.error('Error fetching cell value:', error.response ? error.response.data : error.message);
      throw error; // Rethrow the error for external handling
    }
  };

  /**
 * Duplicates a tab within a Google Sheets spreadsheet.
 *
 * @param {string} spreadsheetId The unique identifier for the Google Spreadsheet.
 * @param {number} tabId The unique identifier (ID) of the tab to be duplicated.
 * @param {number} insertTabIndex The zero-based index where the duplicated tab should be inserted.
 * @param {string} accessToken A valid Google OAuth 2.0 access token with permissions to modify the spreadsheet.
 * @returns {Promise<Object>} A promise that resolves to the response data from the Google Sheets API, indicating details of the duplicated sheet.
 * @throws {Error} Throws an error if the request fails, including the error response from the Google Sheets API if available.
 */

export const duplicateTab = async (spreadsheetId, tabId, newTabIndex, accessToken) => {
    try {
      const response = await axios.post(
        `${GOOGLE_SS_API_URL}/${spreadsheetId}:batchUpdate`,
        {
          requests: [
            {
              duplicateSheet: {
                sourceSheetId: tabId,
                insertSheetIndex: newTabIndex,
              },
            },
          ],
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      return response.data.replies[0].duplicateSheet.properties.sheetId; // tab Id for newly duplicated tab
    } catch (error) {
      console.error('Error duplicating tab:', error.response ? error.response.data : error.message);
      throw error; // Rethrow the error for external handling
    }
  };

  /**
 * Renames a tab within a Google Sheets spreadsheet.
 *
 * @param {string} spreadsheetId The unique identifier for the Google Spreadsheet.
 * @param {number} tabId The unique identifier (ID) of the tab to be renamed.
 * @param {string} newTitle The new name to assign to the sheet.
 * @param {string} accessToken A valid Google OAuth 2.0 access token with permissions to modify the spreadsheet.
 * @returns {Promise<Object>} A promise that resolves to the response data from the Google Sheets API, indicating the result of the rename operation.
 * @throws {Error} Throws an error if the request fails, including the error response from the Google Sheets API if available.
 */
export const renameTab = async (spreadsheetId, tabId, newTitle, accessToken) => {
    try {
      const response = await axios.post(
        `${GOOGLE_SS_API_URL}/${spreadsheetId}:batchUpdate`,
        {
          requests: [
            {
              updateSheetProperties: {
                properties: {
                  sheetId: tabId,
                  title: newTitle,
                },
                fields: 'title',
              },
            },
          ],
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      return response.data; // Returns details of the rename operation
    } catch (error) {
      console.error('Error renaming tab:', error.response ? error.response.data : error.message);
      throw error; // Rethrow the error for external handling
    }
  };
  
  
  
  
    
  
  