import axios from 'axios';

const coinGeckoBaseUrl = 'https://api.coingecko.com/api/v3';

const getIdFromSymbol = (symbol) => {
    const currency = currencies.find(c => c.symbol === symbol);
    return currency ? currency.id : null;
};

const currencies = [
    {
        "id": "binancecoin",
        "symbol": "bnb",
        "name": "BNB"
    }, {
        "id": "ethereum",
        "symbol": "eth",
        "name": "Ethereum"
    },
]

export const fetchHistoricalPriceData = async (coinSymbol, conversionCurrency, {startDate, endDate}) => {

    const coinId = getIdFromSymbol(coinSymbol);
    const from = new Date(startDate).getTime() / 1000;
    const to = new Date(endDate).getTime() / 1000;
    
    const url = `${coinGeckoBaseUrl}/coins/${coinId}/market_chart/range`;

    const requestConfig = {
        params: {
            vs_currency: conversionCurrency,
            from,
            to
        }
    };

    try {
        const response = await axios.get(url, requestConfig);
        const processedData = response.data.prices.reduce((acc, [date, price]) => {
            const formattedDate = new Date(date).toISOString().split('T')[0];
            acc[formattedDate] = price;
            return acc;
        }, {});

        return processedData;
    } catch (error) {
        console.error(`Error fetching historical data for ${coinId}:`, error);
        throw error; // Rethrow the error for handling in the component
    }
};

