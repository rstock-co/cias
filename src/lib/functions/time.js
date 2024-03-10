import { addMinutes, format, startOfMinute } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

// Use "America/Denver" for Mountain Standard Time

export const formatTime = (timestamp, timeZone) => {    // formatTime(1684786992, 'America/Denver'); 
    const date = new Date(timestamp);
    const zonedDate = utcToZonedTime(date, timeZone);
    return format(zonedDate, "MMM d, yyyy h:mm a");
}

export const roundToNearest5Minutes = (date) => {
    const start = startOfMinute(date);
    const remainder = start.getMinutes() % 5;
    const roundTo = remainder < 3 ? -remainder : 5 - remainder;
    return addMinutes(start, roundTo);
};

export const getTodaysDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // JavaScript months are 0-based.
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const getNowMST = () => {
    // Create a new Date object
    const now = new Date();
  
    // Convert the current time to MST assuming MST is UTC-7
    const mstOffset = 7 * 60; // in minutes
    const localOffset = now.getTimezoneOffset(); // in minutes
    const mstTime = new Date(now.getTime() + (mstOffset + localOffset) * 60000);
  
    // Extract the components
    const month = String(mstTime.getMonth() + 1).padStart(2, '0'); // getMonth() returns 0-11
    const day = String(mstTime.getDate()).padStart(2, '0');
    const year = mstTime.getFullYear();
    const hours = String(mstTime.getHours()).padStart(2, '0');
    const minutes = String(mstTime.getMinutes()).padStart(2, '0');
  
    // Format: "MM-DD-YYYY-HHMM"
    // console.log(`NOW: ${month}-${day}-${year}-${hours}${minutes}`)
    return `${month}-${day}-${year}-${hours}${minutes}`;
  }
  
export const getHistoricalPrice = (currency, timestamp, historicalBNBPrices, historicalETHPrices) => {

    if (!timestamp || isNaN(timestamp)) {
        return 0;
    }

    // Convert timestamp to date string
    const [dateString] = new Date(timestamp).toISOString().split('T');

    const historicalPrices = currency === 'ETH' ? historicalETHPrices : historicalBNBPrices;

    // Check if historical prices are loaded and have the required date
    if (!historicalPrices || !historicalPrices.hasOwnProperty(dateString)) {
        return 0;
    }

    // Retrieve the historical price for the given date
    const historicalPrice = historicalPrices[dateString];

    return historicalPrice;
};