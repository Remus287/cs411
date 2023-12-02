import Fuse from "fuse.js";
import { SyntheticEvent, useEffect, useState } from "react";

type Stock = {
	name: string;
	symbol: string;
	country: string;
	stockTitle: string;
};

export default function StockList({ stocksList, toRender = 10 }: { stocksList: Stock[]; toRender?: number }) {
	const fuseOptions = {
		keys: ["name", "symbol"],
	};
	const fuse: Fuse<Stock> = new Fuse(stocksList, fuseOptions);

	const [toRenderList, setToRenderList] = useState<Stock[]>([]);

	const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
	const [input, setInput] = useState<string>("AAPL");

	useEffect(() => {
		updateStockList();
	}, []);
	const onChange = (e: SyntheticEvent) => {
		e.preventDefault();
		const searchbar = e.target as HTMLInputElement;
		setInput(searchbar.value);
		if (timer) {
			clearTimeout(timer);
		}
		setTimer(
			setTimeout(() => {
				updateStockList();
			}, 500),
		);
	};
	const updateStockList = () => {
		setToRenderList([]);
		const result = fuse.search(input);
		const toRenderResult = result.slice(0, toRender);
		const toRenderList: Stock[] = toRenderResult.map((stock) => {
			return stock.item;
		});
		// now, format the stock titles to be more readable and consistent
		// SYMBOL takes up first 10 characters of the string then '|' takes up 3 characters
		// NAME takes up the rest of the characters

		const formattedToRenderList: Stock[] = toRenderList.map((stock) => {
			const symbol = stock.symbol;
			const name = stock.name;
			const country = stock.country;
			let stockTitle = symbol;
			while (stockTitle.length < 6) {
				stockTitle += " ";
			}
			stockTitle += "| ";
			stockTitle += name;
			console.log(stockTitle);
			return {
				stockTitle: stockTitle,
				symbol: symbol,
				name: name,
				country: country,
			};
		});
		setToRenderList(formattedToRenderList);
	};
	return (
		<div className={"h-full w-full"}>
			<input type={"text"} onChange={(e) => onChange(e)} />
			<ul className={"flex flex-col gap-0 px-4"}>
				{toRenderList.map((stock) => {
					return (
						<li key={stock.symbol + stock.name + stock.country} className={"border-b-2 border-black bg-blue-500 hover:bg-blue-700 transition-background duration-300"}>
							<button className={"flex flex-col gap-0  p-2 w-full"}>
								<p className={"text-lg h-4 bg-red-500 leading-4 truncate w-full text-left"}>
									<pre>{stock.stockTitle}</pre>
								</p>
								<p className={"text-sm h-4 bg-red-500 leading-4"}>{stock.country}</p>
							</button>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
