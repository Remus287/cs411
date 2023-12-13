import { Stock, StockFromAPI } from "../types";
import { SyntheticEvent, useEffect, useState } from "react";
import Link from "next/link";

export default function StockList() {
	const [stocks, setStocks] = useState<Stock[]>([]);
	const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
	useEffect(() => {
		updateStockList("AAPL").then();
	}, []);

	const handleChange = (e: SyntheticEvent) => {
		e.preventDefault();

		const target = e.target as typeof e.target & {
			value: string;
		};

		const keyword = target.value;

		if (timer) {
			clearTimeout(timer);
		}

		const newTimer = setTimeout(() => {
			if (keyword.length > 0) {
				updateStockList(keyword).then();
			} else {
				updateStockList("AAPL").then();
			}
		}, 500);

		setTimer(newTimer);
	};

	const formatStocks = (stocks: StockFromAPI[]) => {
		const formattedStocks: Stock[] = stocks.map((stock: StockFromAPI) => {
			const stockKey = stock.symbol + stock.instrument_name + stock.country;
			return {
				key: stockKey,
				symbol: stock.symbol,
				instrument_name: stock.instrument_name,
				exchange: stock.exchange,
				mic_code: stock.mic_code,
				exchange_timezone: stock.exchange_timezone,
				instrument_type: stock.instrument_type,
				country: stock.country,
				currency: stock.currency,
			};
		});
		return formattedStocks;
	};
	const updateStockList = async (keyword: string) => {
		setStocks([]);
		const response = await fetch(`https://api.twelvedata.com/symbol_search?symbol=${keyword}`);
		const json = await response.json();
		const stocks: Stock[] = formatStocks(json.data);

		const stocksUS = stocks.filter((stock) => {
			return stock.country === "United States";
		});

		setStocks(stocksUS);
	};

	return (
		<div className={"h-full w-full flex flex-col pt-8 bg-[#1c1c1c] gap-6 px-1"}>
			<Link id={"logo"} href={"/feed"} className={"text-white text-4xl font-bold text-center m-auto p-2"}>
				Stock Hub
			</Link>
			<span className={"w-full px-3 h-12 relative flex flex-row"}>
				<input placeholder={"Search for stocks"} type={"text"} onChange={handleChange} className={"w-full h-2/3 m-auto rounded-md px-4 font-medium text-sm text-black/[.7] border-2 outline-0 border-gray-300 shadow-inner"} />
			</span>
			<ul className={"flex flex-col overflow-y-auto h-full px-2"} id={"stocksList"}>
				{stocks.map((stock) => {
					return (
						<li key={stock.key} className={"text-white transition-background duration-100 hover:bg-white/[.2]"}>
							<Link href={"/feed/stock/[symbol]?interval=1day"} as={`/feed/stock/${stock.symbol}`} className={"flex flex-col gap-1 p-2 w-full"}>
								<p className={"truncate text-lg pl-4 w-full text-left"}>
									{stock.symbol} - {stock.instrument_name}
								</p>
								<p className={"overflow-clip text-sm pl-4 font-light text-right w-full underline underline-offset-2"}>{stock.country}</p>
							</Link>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
