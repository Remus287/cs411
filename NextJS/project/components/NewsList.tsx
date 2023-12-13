import NewsCard from "@components/NewsCard";
import React, { useEffect, useState } from "react";

export default function NewsList({ news }: { news: News[] }) {
	const [totalSentiment, setTotalSentiment] = useState<number>(0);
	useEffect(() => {
		let res = 0;
		news.map((news) => {
			console.log(news.sentiment);
			switch (news.sentiment) {
				case "Negative":
					res -= 1;
					break;
				case "Positive":
					res += 1;
					break;
				default:
					break;
			}
		});
		setTotalSentiment((res / 3).toFixed(2));
	}, []);
	if (news.length === 0) {
		return (
			<div className={"h-4/5 flex flex-col"}>
				<p className={"text-white text-3xl font-medium"}>News</p>
				<p className={"text-white text-xl font-light"}>No news available</p>
			</div>
		);
	}
	return (
		<div className={"h-4/5 flex flex-col gap-6"}>
			<p className={"text-white text-3xl font-medium"}>News</p>
			<p className={"text-white text-xl font-light"}>Sentiment Score: {totalSentiment}</p>
			<div className={"w-full flex flex-col gap-4 overflow-y-auto"}>
				<div className={"w-full max-h-full flex flex-col p-4 gap-4 overflow-y-auto shadow-inner shadow-gray-900"}>
					{news?.map((value, index) => {
						return <NewsCard news={value} key={index} />;
					})}
				</div>
			</div>
		</div>
	);
}
