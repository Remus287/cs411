type Stock = {
	key: string;
	symbol: string;
	instrument_name: string;
	exchange: string;
	mic_code: string;
	exchange_timezone: string;
	instrument_type: string;
	country: string;
	currency: string;
};
type StockFromAPI = {
	symbol: string;
	instrument_name: string;
	exchange: string;
	mic_code: string;
	exchange_timezone: string;
	instrument_type: string;
	country: string;
	currency: string;
};

export type { Stock, StockFromAPI };
