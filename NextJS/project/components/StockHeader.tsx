import Tag from "@components/Tag";
import Link from "next/link";
import { TbArrowBackUp } from "react-icons/tb";
import React, { SyntheticEvent, useEffect } from "react";
import { FaRegStar, FaStar } from "react-icons/fa6";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
export default function StockHeader({ userEmail, meta }: { userEmail: string; meta: Meta }) {
	const addFavorite = async (e: SyntheticEvent) => {
		e.preventDefault();
		const res = await fetch("/api/user/addFavorite?", {
			method: "POST",
			body: JSON.stringify({ email: userEmail, symbol: meta.symbol }),
			headers: {
				"Content-Type": "application/json",
			},
		});
		await res.json();
	};
	return (
		<div className={"flex flex-row justify-between flex-1 pr-12"}>
			<div className={"flex flex-row gap-x-2 gap-y-2 flex-wrap"}>
				<span className={"w-full flex flex-row gap-4"}>
					<pre className={"text-5xl font-medium text-white"}>{meta.symbol}</pre>
					<button onClick={addFavorite} className={"w-fit text-4xl hover:text-yellow-500 transition-colors"}>
						<FaRegStar />
					</button>
				</span>
				<Tag tag={meta.currency} />
				<Tag tag={meta.exchange} />
				<Tag tag={meta.type} />
				<Tag tag={meta.interval} />
				<Tag tag={meta.exchange_timezone} />
				<Tag tag={meta.mic_code} />
				<Tag tag={meta.type} />
			</div>
			<Link href={"/feed"} className={"bg-blue-900 text-white font-medium text-3xl px-6 text-center h-fit py-px rounded-lg hover:bg-blue-950 transition-background "}>
				<TbArrowBackUp />
			</Link>
		</div>
	);
}
