import { 
  CAPPED_MOVE_DRIVE_FOLDER_ID, 
  CAPPED_MOVE_INDEX_SSID, 
  CAPPED_MOVE_TEMPLATE_SSID, 
  DISTRIBUTION_DRIVE_FOLDER_ID, 
  DISTRIBUTION_INDEX_SSID, 
  DISTRIBUTION_TEMPLATE_SSID, 
  GOOGLE_SS_API_URL, 
} from '../lib/data';

import { 
  createNewSpreadsheetFromTemplateAndSaveToFolder,
  duplicateTab,
  fetchCell,
  getTabIdByName,
  populateCell,
  populateRange,
  renameTab,

} from '../lib/functions/google';

import axios from "axios";

/** ====================================
 * GOOGLE SHEET MASTER TEMPLATES
 * (row and column references) 
 * 
 * if the google sheets master templates are re-designed, these variables may need to be edited)
 * 
 * ===================================== */

/** ================
 *  A. DISTRIBUTIONS
 *  ================ */ 
const DISTRIBUTION_INDEX_TAB_NAME = 'index';
const DISTRIBUTION_INDEX_FIRST_COLUMN_INDEX = 'D';
const DISTRIBUTION_INDEX_FIRST_ROW_INDEX = 3;
const DISTRIBUTION_INDEX_LAST_COLUMN_INDEX = 'H';


// export new distribution (generate)
const DISTRO_TEMPLATE_TAB_NAME = 'distro-template';
const DISTRO_WALLETS_FIRST_COLUMN_INDEX = 'B';
const DISTRO_SHARE_FIRST_COLUMN_INDEX = 'E';
const DISTRO_FIRST_ROW_INDEX = 12;
const DISTRO_TOKENS_AMOUNT_CELL = 'E5';

const DISTRO_EXPORT_LOG_TAB_NAME = 'export-log';
const DISTRO_EXPORT_LOG_FIRST_COLUMN_INDEX = 'C';


// export existing distribution (update)






/** ===============
 *  B. CAPPED MOVES
 *  =============== */  
const CAPPED_MOVE_INDEX_TAB_NAME = 'index';
const CAPPED_MOVE_INDEX_FIRST_COLUMN_INDEX = 'D';
const CAPPED_MOVE_INDEX_FIRST_ROW_INDEX = 3;
const CAPPED_MOVE_INDEX_LAST_COLUMN_INDEX = 'H';



// export new capped move (generate)
const MEMBERSHIP_TAB_NAME = 'membership-weighting';
const MEMBERSHIP_FIRST_COLUMN_INDEX = 'A';
const MEMBERSHIP_FIRST_ROW_INDEX = 1;

const CALCULATIONS_TAB_NAME = 'calculations';
const CALCULATIONS_CAPPED_AMOUNT_CELL_INDEX = 'L3';

const CAPPED_MOVE_EXPORT_LOG_TAB_NAME = 'export-log';
const CAPPED_MOVE_EXPORT_LOG_FIRST_COLUMN_INDEX = 'C';




// export existing capped move (update)
const EXPORT_EXISTING_CAPPED_MOVE_TAB_NAME = 'txn-data';









  
/**
 * Copy a template spreadsheet and populate a specified sheet within the new spreadsheet with data, then update index file with metadata.
 * 
 * @param {string} accessToken Google Oauth2.0 access token with required permissions to create a new spreadsheet and write data to it.
 * @param {Array<Array<string|number>>} data 2D array of data to populate in the sheet.
 * @param {string} dateTime Date and time of NOW (in MST), as a string to append to the new spreadsheet name.
 * @param {string} indexTabName Name of the tab in the index sheet to store metadata
 * @param {string} moveName Name of the capped move
 * @param {string} walletAddress Wallet address for the capped move
 * @param {number} amount Capped amount for the move
 */

export const createNewCappedMove = async ({
    accessToken, 
    data, 
    dateTime, 
    moveName, 
    walletAddress, 
    amount 
}) => {

  const NEW_CAPPED_MOVE_SHEET_NAME = `${dateTime}_${moveName}`;
  try {

    // Step 1: Create new capped move spreadsheet from the master template spreadsheet

    const NEW_CAPPED_MOVE_SHEET_ID = await createNewSpreadsheetFromTemplateAndSaveToFolder(
      accessToken, CAPPED_MOVE_TEMPLATE_SSID, NEW_CAPPED_MOVE_SHEET_NAME, CAPPED_MOVE_DRIVE_FOLDER_ID);

    console.log('Step 1 of 5: New sheet created successfully: ',  NEW_CAPPED_MOVE_SHEET_ID);


    // Step 2: Populate the new sheet with membership weighting data

    const membership_data_range = `${MEMBERSHIP_TAB_NAME}!${MEMBERSHIP_FIRST_COLUMN_INDEX}${MEMBERSHIP_FIRST_ROW_INDEX}`; 
    const updateSheetResponse = await populateRange(NEW_CAPPED_MOVE_SHEET_ID, membership_data_range, data, accessToken);

    console.log('Step 2 of 5: Membership weightings populated successfully: ', updateSheetResponse);


    // Step 3: Update the capped move amount in the calculations tab
    
    const capped_move_amount_range = `${CALCULATIONS_TAB_NAME}!${CALCULATIONS_CAPPED_AMOUNT_CELL_INDEX}`;
    const updateCellResponse = await populateCell(NEW_CAPPED_MOVE_SHEET_ID, capped_move_amount_range, amount, accessToken); 

    console.log('Step 3 of 5: Capped Move Amount updated successfully: ', updateCellResponse);


    // Step 4: Update the capped move export log

    const CAPPED_MOVE_EXPORT_LOG_FIRST_ROW_INDEX = await fetchCell(NEW_CAPPED_MOVE_SHEET_ID, `${CAPPED_MOVE_EXPORT_LOG_TAB_NAME}A1`, accessToken);
    const export_log_range = `${CAPPED_MOVE_EXPORT_LOG_TAB_NAME}!${CAPPED_MOVE_EXPORT_LOG_FIRST_COLUMN_INDEX}${CAPPED_MOVE_EXPORT_LOG_FIRST_ROW_INDEX}`;
    const logData = [[dateTime, amount]];
    const updateLogResponse = await populateRange(NEW_CAPPED_MOVE_SHEET_ID, export_log_range, logData, accessToken); 

    console.log('Step 4 of 5: Export Log sheet updated successfully: ', updateLogResponse);


    // Step 5: Update the capped moves index file with the new spreadsheet metadata

    const CAPPED_MOVE_INDEX_FIRST_ROW_INDEX = await fetchCell(CAPPED_MOVE_INDEX_SSID, `${CAPPED_MOVE_INDEX_TAB_NAME}!A1`, accessToken);
    const capped_move_index_range = `${CAPPED_MOVE_INDEX_TAB_NAME}!${CAPPED_MOVE_INDEX_FIRST_COLUMN_INDEX}${CAPPED_MOVE_INDEX_FIRST_ROW_INDEX}`;
    const capped_move_index_data = [[dateTime, moveName, amount, walletAddress, NEW_CAPPED_MOVE_SHEET_ID]];
    const updateIndexResponse = await populateRange(CAPPED_MOVE_INDEX_SSID, capped_move_index_range, capped_move_index_data, accessToken);

    console.log('Step 5 of 5: Capped Move index sheet updated successfully: ', updateIndexResponse);

  } catch (error) {
    console.error('Error copying or populating spreadsheet:', error.response ? error.response.data : error.message);
  }
}



/**
 * Copy a template spreadsheet and populate a specified sheet within the new spreadsheet with data, then update index file with metadata.
 * 
 * @param {string} accessToken Google Oauth2.0 access token with required permissions to create a new spreadsheet and write data to it.
 * @param {Array<Array<string|number>>} data 2D array of data to populate in the sheet.
 * @param {string} dateTime Date and time of NOW (in MST), as a string to append to the new spreadsheet name.
 * @param {string} indexTabName Name of the tab in the index sheet to store metadata
 * @param {string} moveName Name of the capped move
 * @param {string} walletAddress Wallet address for the capped move
 * @param {number} amount Amount of tokens to distribute
 */

export const createDistribution = async ({
  accessToken, 
  data, 
  dateTime, 
  moveName, 
  walletAddress, 
  amount 
}) => {

  const NEW_DISTRIBUTION_SHEET_NAME = `${dateTime}_${moveName}`;
  const DISTRO_NUM = 1;  // always 1 for the first distribution
  const NEW_DISTRIBUTION_TAB_NAME = `distro-${DISTRO_NUM}  |  ${dateTime}`;

  try {
    // Step 1: Create new distribution spreadsheet from the master template spreadsheet
    
    const NEW_DISTRIBUTION_SHEET_ID = await createNewSpreadsheetFromTemplateAndSaveToFolder(
      accessToken, DISTRIBUTION_TEMPLATE_SSID, NEW_DISTRIBUTION_SHEET_NAME, DISTRIBUTION_DRIVE_FOLDER_ID);

    console.log('Step 1 of 7: New distribution sheet created successfully: ',  NEW_DISTRIBUTION_SHEET_ID);
    

    // Step 2a: get the tab ID of the "distro-template" tab

    const tabIdResponse = await getTabIdByName(NEW_DISTRIBUTION_SHEET_ID, DISTRO_TEMPLATE_TAB_NAME, accessToken);

    console.log(`Step 2a of 7:  Found tab ID for ${DISTRO_TEMPLATE_TAB_NAME}: ${tabIdResponse}`);
    

    // Step 2b: Copy the "distro-template" tab 

    const NEW_DISTRIBUTION_TAB_ID = await duplicateTab(NEW_DISTRIBUTION_SHEET_ID, tabIdResponse, 0, accessToken);

    console.log('Step 2b of 7: New distribution tab created successfully with ID:', NEW_DISTRIBUTION_TAB_ID);

    // Step 3: Rename the newly copied tab

    const renameTabResponse = await renameTab(NEW_DISTRIBUTION_SHEET_ID, NEW_DISTRIBUTION_TAB_ID, NEW_DISTRIBUTION_TAB_NAME, accessToken);

    console.log('Step 3 of 7: New distribution tab renamed successfully:', renameTabResponse);


    // Step 4: Populate the new tab with distribution data

    const walletDataRange = `${NEW_DISTRIBUTION_TAB_NAME}!${DISTRO_WALLETS_FIRST_COLUMN_INDEX}${DISTRO_FIRST_ROW_INDEX}`; 
    const updateWalletResponse = await populateRange(NEW_DISTRIBUTION_SHEET_ID, walletDataRange, data.walletsArray, accessToken);

    const shareDataRange = `${NEW_DISTRIBUTION_TAB_NAME}!${DISTRO_SHARE_FIRST_COLUMN_INDEX}${DISTRO_FIRST_ROW_INDEX}`; 
    const updateShareResponse = await populateRange(NEW_DISTRIBUTION_SHEET_ID, shareDataRange, data.shareArray, accessToken);
    
    console.log('Step 4 of 7: Distribution data populated successfully: ', updateWalletResponse, updateShareResponse);

  
  // Step 5: Update the distribution amount in the new distribution tab

  const token_amount_range = `${NEW_DISTRIBUTION_TAB_NAME}!${DISTRO_TOKENS_AMOUNT_CELL}`;
  const updateCellResponse = await populateCell(NEW_DISTRIBUTION_SHEET_ID, token_amount_range, amount, accessToken); 

  console.log('Step 5 of 7: Number of tokens to distribute updated successfully: ', updateCellResponse);

  
  // Step 6: Update the distribution export log

  const DISTRO_EXPORT_LOG_FIRST_ROW_INDEX = await fetchCell(NEW_DISTRIBUTION_SHEET_ID, `${DISTRO_EXPORT_LOG_TAB_NAME}!A1`, accessToken);
  const distro_export_log_range = `${DISTRO_EXPORT_LOG_TAB_NAME}!${DISTRO_EXPORT_LOG_FIRST_COLUMN_INDEX}${DISTRO_EXPORT_LOG_FIRST_ROW_INDEX}`;
  const distro_export_log_data = [[dateTime, amount]];
  const updateDistroLogResponse = await populateRange(NEW_DISTRIBUTION_SHEET_ID, distro_export_log_range, distro_export_log_data, accessToken); 

  console.log('Step 6 of 7: Export Log sheet updated successfully: ', updateDistroLogResponse);


  // Step 7: Update the distribution index file with the new spreadsheet metadata

  const DISTRIBUTION_INDEX_FIRST_ROW_INDEX = await fetchCell(DISTRIBUTION_INDEX_SSID, `${DISTRIBUTION_INDEX_TAB_NAME}!A1`, accessToken);
  const distribution_index_range = `${DISTRIBUTION_INDEX_TAB_NAME}!${DISTRIBUTION_INDEX_FIRST_COLUMN_INDEX}${DISTRIBUTION_INDEX_FIRST_ROW_INDEX}`;
  const distribution_index_data = [[dateTime, moveName, amount, walletAddress, NEW_DISTRIBUTION_SHEET_ID]];
  const updateIndexResponse = await populateRange(DISTRIBUTION_INDEX_SSID, distribution_index_range, distribution_index_data, accessToken);

  console.log('Step 7 of 7: Distribution index sheet updated successfully: ', updateIndexResponse);

} catch (error) {
  console.error('Error copying or populating spreadsheet:', error.response ? error.response.data : error.message);
}
}




/**
 * Update a specified sheet within an existing spreadsheet with data, and update index file with metadata.
 * 
 * @param {string} accessToken Google Oauth2.0 access token with required permissions to update the spreadsheet and write data to it.
 * @param {Array<Array<string|number>>} data 2D array of data to populate in the sheet.
 * @param {string} dateTime Date and time of NOW (in MST), as a string to append to the updated data.
 * @param {string} targetTabName Name of the tab in the target sheet to store data
 * @param {string} moveName Name of the capped move
 * @param {string} walletAddress Wallet address for the capped move
 * @param {number} cappedMoveAmount Capped amount for the move
 * @param {string} spreadsheetId ID of the spreadsheet to update.
 */

export const updateExistingCappedMove = async ({
  accessToken,
  data,
  // dateTime,
  // moveName,
  // walletAddress,
  // cappedMoveAmount,
  CAPPED_SSID
}) => {

  try {

    // Step 1: Update the specified sheet with new data

    const updateResponse = populateRange(CAPPED_SSID, `${EXPORT_EXISTING_CAPPED_MOVE_TAB_NAME}!A1`, data, accessToken);
    
    console.log('Step 1: Sheet updated successfully:', updateResponse);

    // Step 2: Update the log sheet with the new metadata

    // const rowIndexResponse = await axios.get(
    //   `${GOOGLE_SS_API_URL}/${CAPPED_MOVE_INDEX_SSID}/values/${indexTabName}!A1`,
    //   { headers: { 'Authorization': `Bearer ${accessToken}` } }
    // );

    // const [[rowIndex]] = rowIndexResponse.data.values;
    // const metaDataRange = `${indexTabName}!A${parseInt(rowIndex) + 1}`; // Assuming you're appending to the end

    // const metaData = [
    //   [dateTime, moveName, cappedMoveAmount, walletAddress, spreadsheetId]
    // ];

    // await axios.put(
    //   `${GOOGLE_SS_API_URL}/${CAPPED_MOVE_INDEX_SSID}/values/${metaDataRange}?valueInputOption=USER_ENTERED`,
    //   { values: metaData },
    //   { headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' } }
    // );

    // console.log('Step 2: Index sheet updated successfully');
  } catch (error) {
    console.error('Error updating spreadsheet:', error.response ? error.response.data : error.message);
  }
}

/**
 * Imports capped move metadata from a specified range in the Google Sheets index file and updates a React state variable.
 * 
 * The fetched data is stored in a 2D array and intended to be used to update a React state variable.
 *
 * @param {string} accessToken Google OAuth2.0 access token with required permissions to read data from the spreadsheet.
 * @param {Function} setStateCallback The React state setter function to update the state with the imported data.
 * 
 * @returns {void} This function does not return a value. It updates the React state directly via the setStateCallback.
 */

export const importCappedMoveData = async ( {accessToken, setStateCallback} ) => {

  try {

    // Step 1: Fetch the index data for all capped moves from capped moves index spreadsheet

    const rowIndexResponse = await axios.get(
      `${GOOGLE_SS_API_URL}/${CAPPED_MOVE_INDEX_SSID}/values/${CAPPED_MOVE_INDEX_TAB_NAME}!A1`,
      { headers: { 'Authorization': `Bearer ${accessToken}` } }
    );

    const [[CAPPED_MOVE_INDEX_LAST_ROW_INDEX]] = rowIndexResponse.data.values;

    const import_capped_move_range = `${CAPPED_MOVE_INDEX_TAB_NAME}!${CAPPED_MOVE_INDEX_FIRST_COLUMN_INDEX}${CAPPED_MOVE_INDEX_FIRST_ROW_INDEX}:${CAPPED_MOVE_INDEX_LAST_COLUMN_INDEX}${CAPPED_MOVE_INDEX_LAST_ROW_INDEX}`;

    const dataResponse = await axios.get(
      `${GOOGLE_SS_API_URL}/${CAPPED_MOVE_INDEX_SSID}/values/${import_capped_move_range}`,
      { headers: { 'Authorization': `Bearer ${accessToken}` } }
    );

    const data = dataResponse.data.values;

    console.log('Step 1 of 2: Capped Move data obtained successfully: ', data);


    // Step 2: Update the React state with the fetched data

    if (data && Array.isArray(data)) {
      setStateCallback(data);
      console.log('Step 2 of 2: State updated successfully');
    } else {
      console.error('No data found in the specified range:', dataRange);
    }

  } catch (error) {
    console.error('Error importing data:', error.response ? error.response.data : error.message);
  }
};



/**
 * Imports distribution metadata from a specified range in the Google Sheets index file and updates a React state variable.
 * 
 * The fetched data is stored in a 2D array and intended to be used to update a React state variable.
 *
 * @param {string} accessToken Google OAuth2.0 access token with required permissions to read data from the spreadsheet.
 * @param {Function} setStateCallback The React state setter function to update the state with the imported data.
 * 
 * @returns {void} This function does not return a value. It updates the React state directly via the setStateCallback.
 */

export const importDistributionData = async ( {accessToken, setStateCallback} ) => {

  try {

    // Step 1: Fetch the index data for all capped moves from capped moves index spreadsheet
    
    const rowIndexResponse = await axios.get(
      `${GOOGLE_SS_API_URL}/${DISTRIBUTION_INDEX_SSID}/values/${DISTRIBUTION_INDEX_TAB_NAME}!A1`,
      { headers: { 'Authorization': `Bearer ${accessToken}` } }
    );

    const [[DISTRIBUTION_INDEX_LAST_ROW_INDEX]] = rowIndexResponse.data.values;

    const import_distribution_range = `${DISTRIBUTION_INDEX_TAB_NAME}!${DISTRIBUTION_INDEX_FIRST_COLUMN_INDEX}${DISTRIBUTION_INDEX_FIRST_ROW_INDEX}:${DISTRIBUTION_INDEX_LAST_COLUMN_INDEX}${DISTRIBUTION_INDEX_LAST_ROW_INDEX}`;

    const dataResponse = await axios.get(
      `${GOOGLE_SS_API_URL}/${DISTRIBUTION_INDEX_SSID}/values/${import_distribution_range }`,
      { headers: { 'Authorization': `Bearer ${accessToken}` } }
    );

    const data = dataResponse.data.values;

    console.log('Step 1 of 2: Capped Move data obtained successfully: ', data);


    // Step 2: Update the React state with the fetched distribution data

    if (data && Array.isArray(data)) {
      setStateCallback(data);
      console.log('Step 2 of 2: State updated successfully');
    } else {
      console.error('No data found in the specified range:', dataRange);
    }

  } catch (error) {
    console.error('Error importing data:', error.response ? error.response.data : error.message);
  }
};