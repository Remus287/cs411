"use client";
import { Stock, StockFromAPI } from "../types";
import { SyntheticEvent, useEffect, useState } from "react";
import Link from "next/link";
export default function StockList() {
	const [stocks, setStocks] = useState<Stock[]>([]);
	const [keyword, setKeyword] = useState<string>("AAPL");
	const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
	useEffect(() => {
		updateStockList().then();
	}, []);

	const handleChange = (e: SyntheticEvent) => {
		e.preventDefault();
		const searchbar = e.target as HTMLInputElement;
		setKeyword(searchbar.value);

		if (timer) {
			clearTimeout(timer);
		}
		setTimer(
			setTimeout(() => {
				updateStockList().then();
			}, 1000),
		);
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
	const updateStockList = async () => {
		setStocks([]);

		const response = await fetch(`https://api.twelvedata.com/symbol_search?symbol=${keyword}&outputsize=100`);
		const json = await response.json();

		const stocks: Stock[] = formatStocks(json.data);

		const stocksUS = stocks.filter((stock) => {
			return stock.country === "United States";
		});

		setStocks(stocksUS);
	};

	return (
		<div className={"h-full w-full flex flex-col pt-8 bg-black gap-6 px-1"}>
			<p className={"text-white text-4xl font-bold text-center"}>Find Stocks</p>
			<span className={"w-full px-3 h-12 relative flex flex-row"}>
				<input type={"text"} onChange={(e) => handleChange(e)} className={"w-full h-full m-auto rounded-md px-4 font-medium text-lg text-black/[.7] border-2 outline-0 border-gray-300 shadow-inner"} />
			</span>
			<ul className={"flex flex-col overflow-y-auto h-full px-2"} id={"stocksList"}>
				{stocks.map((stock) => {
					return (
						<li key={stock.key} className={"text-white transition-background duration-100 hover:bg-white/[.2]"}>
							<Link
								href={{
									pathname: "/feed/stock/[...symbol]",
									query: {
										symbol: [stock.symbol],
									},
								}}
								className={"flex flex-col gap-1 p-2 w-full"}
							>
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
