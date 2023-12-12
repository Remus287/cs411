declare global {
	declare interface Meta {
		symbol: string;
		interval: string;
		currency: string;
		exchange_timezone: string;
		exchange: string;
		mic_code: string;
		type: string;
	}
	interface News {
		date: string;
		image_url: string;
		news_url: string;
		sentiment: string;
		source_name: string;
		text: string;
		tickers: string[];
		title: string;
		topics: string[];
		type: string;
	}
	interface StockProps {
		meta: Meta;
		news: News[] | null;
		timeSeries: Values[];
	}
	interface TimeSeries {
		meta: Meta;
		values: Values[];
	}
	interface Values {}
}

export {};
