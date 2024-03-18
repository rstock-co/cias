import { 
  CAPPED_MOVE_DRIVE_FOLDER_ID, 
  CAPPED_MOVE_INDEX_SSID, 
  CAPPED_MOVE_TEMPLATE_SSID, 
  DISTRIBUTION_DRIVE_FOLDER_ID, 
  DISTRIBUTION_INDEX_SSID, 
  DISTRIBUTION_TEMPLATE_SSID, 
  GOOGLE_DRIVE_API_URL, 
  GOOGLE_SS_API_URL, 
} from '../lib/data';

import { 
  createNewSpreadsheetFromTemplateAndSaveToFolder,
  getTabIdByName,

} from '../lib/functions/google';

import axios from "axios";

/** ====================================
 * 
 * GOOGLE SHEET MASTER TEMPLATES - ROW AND COLUMN POSITIONS 
 * (if the google sheets master templates are re-designed, these variables may need to be edited)
 * 
 * ===================================== **/

// A. ============ DISTRIBUTIONS ============
const DISTRIBUTION_INDEX_TAB_NAME = 'index';
const DISTRIBUTION_INDEX_FIRST_COLUMN_INDEX = 'D';
const DISTRIBUTION_INDEX_FIRST_ROW_INDEX = 3;
const DISTRIBUTION_INDEX_LAST_COLUMN_INDEX = 'H';


// export new distribution (generate)
const DISTRO_TEMPLATE_TAB_NAME = 'distro-template';
const DISTRO_FIRST_COLUMN_INDEX = 'B';
const DISTRO_FIRST_ROW_INDEX = 12;
const DISTRO_TOKENS_AMOUNT_CELL = 'D5';

const DISTRO_EXPORT_LOG_TAB_NAME = 'export-log';
const DISTRO_EXPORT_LOG_FIRST_COLUMN_INDEX = 'C';


// export existing distribution (update)






// B.  ===========  CAPPED MOVES ============
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

const EXPORT_LOG_TAB_NAME = 'export-log';
const EXPORT_LOG_FIRST_COLUMN_INDEX = 'C';




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

    // Step 1: Copy the capped moves master template to create new capped move spreadsheet

    const NEW_CAPPED_MOVE_SHEET_ID = await createNewSpreadsheetFromTemplateAndSaveToFolder(accessToken, CAPPED_MOVE_TEMPLATE_SSID, NEW_CAPPED_MOVE_SHEET_NAME, CAPPED_MOVE_DRIVE_FOLDER_ID);
    console.log('Step 1 of 5: New sheet created successfully: ',  NEW_CAPPED_MOVE_SHEET_ID);

    // Step 2: Populate the new sheet with membership weighting data

    const membership_data_range = `${MEMBERSHIP_TAB_NAME}!${MEMBERSHIP_FIRST_COLUMN_INDEX}${MEMBERSHIP_FIRST_ROW_INDEX}`; 
    const updateResponse = await axios.put(
      `${GOOGLE_SS_API_URL}/${NEW_CAPPED_MOVE_SHEET_ID}/values/${membership_data_range}?valueInputOption=USER_ENTERED`,
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

    console.log('Step 2 of 5: Membership weightings populated successfully:', updateResponse.data);


    // Step 3: Update the capped move amount in the calculations tab
    
    const capped_move_amount_range = `${CALCULATIONS_TAB_NAME}!${CALCULATIONS_CAPPED_AMOUNT_CELL_INDEX}`;
    await axios.put(
      `${GOOGLE_SS_API_URL}/${NEW_CAPPED_MOVE_SHEET_ID}/values/${capped_move_amount_range}?valueInputOption=USER_ENTERED`,
      { values: [[amount]] },
      { headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' } }
    );

    console.log('Step 3 of 5: Capped Move Amount updated successfully');


    // Step 4: Update the export log

    const rowIndexLogResponse = await axios.get(
      `${GOOGLE_SS_API_URL}/${NEW_CAPPED_MOVE_SHEET_ID}/values/${EXPORT_LOG_TAB_NAME}!A1`,
      { headers: { 'Authorization': `Bearer ${accessToken}` } }
    );

    const [[EXPORT_LOG_FIRST_ROW_INDEX]] = rowIndexLogResponse.data.values;
    const export_log_range = `${EXPORT_LOG_TAB_NAME}!${EXPORT_LOG_FIRST_COLUMN_INDEX}${EXPORT_LOG_FIRST_ROW_INDEX}`;
    

    const logData = [[dateTime, amount]];

    await axios.put(
      `${GOOGLE_SS_API_URL}/${NEW_CAPPED_MOVE_SHEET_ID}/values/${export_log_range}?valueInputOption=USER_ENTERED`,
      { values: logData },
      { headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' } }
    );

    console.log('Step 4 of 5: Export Log sheet updated successfully');


    // Step 5: Update the capped moves index file with the new spreadsheet metadata

    const rowIndexResponse = await axios.get(
      `${GOOGLE_SS_API_URL}/${CAPPED_MOVE_INDEX_SSID}/values/${CAPPED_MOVE_INDEX_TAB_NAME}!A1`,
      { headers: { 'Authorization': `Bearer ${accessToken}` } }
    );

    const [[CAPPED_MOVE_INDEX_FIRST_ROW_INDEX]] = rowIndexResponse.data.values;
    const capped_move_index_range = `${CAPPED_MOVE_INDEX_TAB_NAME}!${CAPPED_MOVE_INDEX_FIRST_COLUMN_INDEX}${CAPPED_MOVE_INDEX_FIRST_ROW_INDEX}`;
    
    const capped_move_index_data = [[dateTime, moveName, amount, walletAddress, NEW_CAPPED_MOVE_SHEET_ID]];

    await axios.put(
      `${GOOGLE_SS_API_URL}/${CAPPED_MOVE_INDEX_SSID}/values/${capped_move_index_range}?valueInputOption=USER_ENTERED`,
      { values: capped_move_index_data },
      { headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' } }
    );

    console.log('Step 5 of 5: Capped Move index sheet updated successfully');

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
  const NEW_DISTRIBUTION_TAB_NAME = `distro-${DISTRO_NUM}-${dateTime}`;

  try {
    // Step 1: Copy the template spreadsheet
    const copyResponse = await axios.post(
      `${GOOGLE_DRIVE_API_URL}/${DISTRIBUTION_TEMPLATE_SSID}/copy`,
      { 
        name: NEW_DISTRIBUTION_SHEET_NAME, 
        parents: [DISTRIBUTION_DRIVE_FOLDER_ID] 
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Step 1 of 7: New distribution sheet created successfully:');
    const NEW_DISTRIBUTION_SHEET_ID = copyResponse.data.id;
    

    // Step 2a: get the tab ID of the "distro-template" tab

    const tabIdResponse = await getTabIdByName(NEW_DISTRIBUTION_SHEET_ID, DISTRO_TEMPLATE_TAB_NAME, accessToken);
    console.log(`Step 2a of 7:  Found tab ID for ${DISTRO_TEMPLATE_TAB_NAME}: ${tabIdResponse}`);
    
    // Step 2b: Copy the "distro-template" tab 

    const duplicateSheetResponse = await axios.post(
      `https://sheets.googleapis.com/v4/spreadsheets/${NEW_DISTRIBUTION_SHEET_ID}:batchUpdate`,
      {
        requests: [
          {
            duplicateSheet: {
              sourceSheetId: tabIdResponse,
              insertSheetIndex: 0,
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
    console.log('Step 2b of 7: New distribution tab created successfully:', duplicateSheetResponse.data);
    

    // Step 3: Rename the newly copied tab

    const NEW_DISTRIBUTION_TAB_ID = duplicateSheetResponse.data.replies[0].duplicateSheet.properties.sheetId;
    await axios.post(
      `https://sheets.googleapis.com/v4/spreadsheets/${NEW_DISTRIBUTION_SHEET_ID}:batchUpdate`,
      {
        requests: [
          {
            updateSheetProperties: {
              properties: {
                sheetId: NEW_DISTRIBUTION_TAB_ID,
                title: NEW_DISTRIBUTION_TAB_NAME,
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
    console.log('Step 3 of 7: New distribution tab created successfully:', NEW_DISTRIBUTION_TAB_NAME);


    // Step 4: Populate the specified sheet in the new spreadsheet with data

    const distributionDataRange = `${NEW_DISTRIBUTION_TAB_NAME}!${DISTRO_FIRST_COLUMN_INDEX}${DISTRO_FIRST_ROW_INDEX}`; // Update this based on your actual start cell
    await axios.put(
      `https://sheets.googleapis.com/v4/spreadsheets/${NEW_DISTRIBUTION_SHEET_ID}/values/${distributionDataRange}?valueInputOption=USER_ENTERED`,
      { values: data },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Step 4 of 7: Distribution data populated successfully');

  
  // Step 5: Update the distribution amount in the new distribution tab

  const token_amount_range = `${NEW_DISTRIBUTION_TAB_NAME}!${DISTRO_TOKENS_AMOUNT_CELL}`;
  await axios.put(
    `${GOOGLE_SS_API_URL}/${NEW_DISTRIBUTION_SHEET_ID}/values/${token_amount_range}?valueInputOption=USER_ENTERED`,
    { values: [[amount]] },
    { headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' } }
  );

  console.log('Step 5 of 7: Number of tokens to distribute updated successfully');

  
  // Step 6: Update the distribution export log

  const rowIndexLogResponse = await axios.get(
    `${GOOGLE_SS_API_URL}/${NEW_DISTRIBUTION_SHEET_ID}/values/${DISTRO_EXPORT_LOG_TAB_NAME}!A1`,
    { headers: { 'Authorization': `Bearer ${accessToken}` } }
  );

  const [[DISTRO_EXPORT_LOG_FIRST_ROW_INDEX]] = rowIndexLogResponse.data.values;
  const distro_export_log_range = `${DISTRO_EXPORT_LOG_TAB_NAME}!${DISTRO_EXPORT_LOG_FIRST_COLUMN_INDEX}${DISTRO_EXPORT_LOG_FIRST_ROW_INDEX}`;
  
  const distro_export_log_data = [[dateTime, amount]];

  await axios.put(
    `${GOOGLE_SS_API_URL}/${NEW_DISTRIBUTION_SHEET_ID}/values/${distro_export_log_range}?valueInputOption=USER_ENTERED`,
    { values: distro_export_log_data },
    { headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' } }
  );

  console.log('Step 6 of 7: Export Log sheet updated successfully');


  // Step 7: Update the distribution index file with the new spreadsheet metadata

  const rowIndexResponse = await axios.get(
    `${GOOGLE_SS_API_URL}/${DISTRIBUTION_INDEX_SSID}/values/${DISTRIBUTION_INDEX_TAB_NAME}!A1`,
    { headers: { 'Authorization': `Bearer ${accessToken}` } }
  );

  const [[DISTRIBUTION_INDEX_FIRST_ROW_INDEX]] = rowIndexResponse.data.values;
  const distribution_index_range = `${DISTRIBUTION_INDEX_TAB_NAME}!${DISTRIBUTION_INDEX_FIRST_COLUMN_INDEX}${DISTRIBUTION_INDEX_FIRST_ROW_INDEX}`;
  

  const distribution_index_data = [[dateTime, moveName, amount, walletAddress, NEW_DISTRIBUTION_SHEET_ID]];

  await axios.put(
    `${GOOGLE_SS_API_URL}/${DISTRIBUTION_INDEX_SSID}/values/${distribution_index_range}?valueInputOption=USER_ENTERED`,
    { values: distribution_index_data },
    { headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' } }
  );

  console.log('Step 7 of 7: Distribution index sheet updated successfully');

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
    const range = `${EXPORT_EXISTING_CAPPED_MOVE_TAB_NAME}!A1`; // Starting cell to populate data
    const updateResponse = await axios.put(
      `${GOOGLE_SS_API_URL}/${CAPPED_SSID}/values/${range}?valueInputOption=USER_ENTERED`,
      { values: data },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Step 1: Sheet updated successfully:', updateResponse.data);

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