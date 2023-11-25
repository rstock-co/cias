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