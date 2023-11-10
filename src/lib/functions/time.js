import { utcToZonedTime } from 'date-fns-tz';
import { format, startOfMinute, addMinutes } from 'date-fns';

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