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

export const getHistoricalPrice = (currency, timestamp, historicalBNBPrices, historicalETHPrices) => {
    console.log(`Retrieving historical price for currency: ${currency} and timestamp: ${timestamp}`)
    if (!timestamp || isNaN(timestamp)) {
        console.error('Invalid or missing timestamp for transaction.');
        return 0;
    }

    // Convert timestamp to date string
    const [dateString] = new Date(timestamp).toISOString().split('T');

    // Determine which historical prices object to use based on currency
    const historicalPrices = currency === 'ETH' ? historicalETHPrices : historicalBNBPrices;

    // Check if historical prices are loaded and have the required date
    if (!historicalPrices || !historicalPrices.hasOwnProperty(dateString)) {
        console.error(`Historical price data not available for ${currency} on ${dateString}.`);
        return 0;
    }

    // Retrieve the historical price for the given date
    const historicalPrice = historicalPrices[dateString];

    // Optional: log the retrieved price for debugging
    console.log(`Historical price for ${currency} on ${dateString}: ${historicalPrice}`);

    return historicalPrice;
};

