import NewsCard from "@components/NewsCard";
import React from "react";

export default function NewsList({ news }: { news: News[] }) {
	if (news.length === 0) {
		return (
			<div className={"h-4/5 flex flex-col"}>
				<p className={"text-white text-3xl font-medium"}>News</p>
				<p className={"text-white text-xl font-light"}>No news available</p>
			</div>
		);
	}
	return (
		<div className={"h-4/5 flex flex-col"}>
			<p className={"text-white text-3xl font-medium"}>News</p>
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
