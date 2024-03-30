import axios from 'axios';

const coinGeckoBaseUrl = 'https://api.coingecko.com/api/v3';

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

const getIdFromSymbol = (symbol) => {
    const currency = currencies.find(c => c.symbol === symbol);
    return currency ? currency.id : null;
};

export const getLastDateFromData = (historicalData) => Object.keys(historicalData).pop(); 

export const fetchHistoricalPriceData = async (coinSymbol, conversionCurrency, {startDate, endDate}) => {

    const coinId = getIdFromSymbol(coinSymbol);
    const from = new Date(startDate).setUTCHours(0, 0, 0, 0) / 1000;
    const to = new Date(endDate).setUTCHours(23, 59, 59, 999) / 1000;
    
    const url = `${coinGeckoBaseUrl}/coins/${coinId}/market_chart/range`;

    console.log("Coin gecko url", url)

    const requestConfig = {
        params: {
            vs_currency: conversionCurrency,
            from,
            to
        }
    };

    console.log("Request config", requestConfig)

    try {
        const response = await axios.get(url, requestConfig);
        const processedData = response.data.prices.reduce((acc, [date, price]) => {
            const [formattedDate] = new Date(date).toISOString().split('T');
            acc[formattedDate] = price;
            return acc;
        }, {});

        return processedData;
    } catch (error) {
        console.error(`Error fetching historical data for ${coinId}:`, error);
        throw error; // Rethrow the error for handling in the component
    }
};

