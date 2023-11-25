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

export const getHistoricalPrice = (txn, currency, timestamp, historicalBNBPrices, historicalETHPrices) => {
    if (!timestamp || isNaN(timestamp)) {
        console.error('Invalid or missing timestamp for transaction:', txn);
        return 0;
    }

    const [dateString] = new Date(timestamp).toISOString().split('T');
    console.log(`Retrieving historical price for date: ${dateString} and currency: ${currency}`);

    let historicalPrices = currency === 'ETH' ? historicalETHPrices : historicalBNBPrices;
    let historicalPrice = historicalPrices[dateString] || 0;

    console.log(`Historical price for ${currency} on ${dateString}: ${historicalPrice}`);
    
    return historicalPrice;
};

