import Link from "next/link";

export default function NewsCard({ news, key }: { news: News; key: number }) {
	return (
		<div className={"w-88 flex flex-col gap-2 border-4 shadow-inner rounded-xl p-4 border-gray-500"} key={key}>
			<div className={"w-full h-fit flex flex-col gap-2"}>
				<span className={"text-white font-bold text-xl"}>{news.title}</span>
				<span className={"text-white text-sm font-light"}>{news.text}</span>
			</div>
			<div className={"w-full h-1/2 relative group active:scale-95 transition-transform duration-300"}>
				<Link href={news.news_url} target={"_blank"} className={"w-full h-full text-white opacity-0 flex absolute items-center justify-center transition-newsLink bg-black/[.4] group-hover:opacity-100 duration-300 "}>
					Read More
				</Link>
				<img src={news.image_url} alt={news.title} className={"w-full h-full object-cover -z-10 outline"} />
			</div>
			<div className={"text-gray-300 text-sm font-extralight justify-between w-full flex flex-row"}>
				<span className={"font-normal"}>{news.source_name}</span>
				<span className={"italic"}>{news.date.substring(0, news.date.length - 6)}</span>
			</div>
		</div>
	);
}
