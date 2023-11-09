import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { moves } from '../lookup/moves';

// Use "America/Denver" for Mountain Standard Time
// convertTime(1684786992, 'America/Denver'); 

export const convertTime = (timestamp, timeZone) => {
    const date = new Date(timestamp);
    const zonedDate = utcToZonedTime(date, timeZone);
    return format(zonedDate, "MMM d, yyyy h:mm a");
}

export const getVCMoveName = (walletType, unixTime) => {
    for (const move of moves) {
        const openTime = new Date(move.contributionOpen).getTime();
        const closeTime = new Date(move.contributionClose).getTime();

        if (unixTime >= openTime && unixTime <= closeTime && move.contributionWallet && typeof move.contributionWallet === 'string' && move.contributionWallet.toLowerCase() === '0xb79e768bef0ca0a34e53c3fe2ac26e600acf8cca'.toLowerCase()) {
            return move.moveName;
        }
    }

    return walletType;
};

