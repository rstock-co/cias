import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

export const convertTime = (timestamp, timeZone) => {
    const date = new Date(timestamp * 1000); // convert seconds to milliseconds
    const zonedDate = utcToZonedTime(date, timeZone);
    return format(zonedDate, "MMMM d, yyyy h:mm a");
}

// Use "America/Denver" for Mountain Standard Time
// convertTime(1684786992, 'America/Denver'); 