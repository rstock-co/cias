import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { times } from '../../components/lookup/vcMoveTimes';

// Use "America/Denver" for Mountain Standard Time
// convertTime(1684786992, 'America/Denver'); 

export const convertTime = (timestamp, timeZone) => {
    const date = new Date(timestamp);
    const zonedDate = utcToZonedTime(date, timeZone);
    return format(zonedDate, "MMMM d, yyyy h:mm a");
}

export const checkMoveType = (walletType, unixTime) => {
    for (const move of times) {
        const openTime = new Date(move.open).getTime();
        const closeTime = new Date(move.close).getTime();

        if (unixTime >= openTime && unixTime <= closeTime) {
            return move.moveName;
        }
    }

    return walletType;
};

