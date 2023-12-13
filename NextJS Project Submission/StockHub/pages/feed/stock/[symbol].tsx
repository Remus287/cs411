import { InferGetServerSidePropsType } from "next";
import React, { useEffect } from "react";
import CandleStickChart from "@components/CandleStickChart";
import useSWR from "swr";
import Navbar from "@components/Navbar";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { authOptions } from "../../api/auth/[...nextauth]";
import Header from "@components/Header";
import NewsList from "@components/NewsList";
import Link from "next/link";

export async function getServerSideProps(context: any) {
	const session = await getServerSession(context.req, context.res, authOptions);

	if (!session) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}
	return {
		props: {
			symbol: context.query.symbol,
			interval: context.query.interval || "1day",
			email: session.user?.email || "",
			image: session.user?.image || "",
			name: session.user?.name || "",
		},
	};
}

const CircularProgress = () => {
	return (
		<div className="loader loader--style1" title={"0"}>
			<svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 40 40" enableBackground="new 0 0 40 40" xmlSpace="preserve">
				<path
					opacity="0.2"
					fill="#000"
					d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
    s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
    c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"
				/>
				<path
					fill="#000"
					d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
    C22.32,8.481,24.301,9.057,26.013,10.047z"
				>
					<animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="0.5s" repeatCount="indefinite" />
				</path>
			</svg>
		</div>
	);
};
const fetcher = (url: string) => fetch(url).then((res) => res.json());

function getStockTimeSeries(symbol: string, interval: string) {
	return useSWR(`/api/stock/timeSeries/${symbol}?interval=${interval}`, fetcher);
}
function getStockNews(symbol: string) {
	return useSWR(`/api/stock/news/${symbol}`, fetcher);
}
export default function Stock({ symbol, name, email, image, interval }: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const router = useRouter();
	useSession({
		required: true,
		onUnauthenticated() {
			router.push("/").then();
		},
	});

	let { data: timeSeries, error: timeSeriesError } = getStockTimeSeries(symbol, interval);
	const { data: news, error: newsError } = getStockNews(symbol);

	let meta = timeSeries?.meta as Meta;
	let timeSeriesData = timeSeries?.timeSeries;
	const newsData = news?.news.data;

	const [timeSeriesComponent, setTimeSeriesComponent] = React.useState<JSX.Element>(
		<div className={"w-full h-full flex justify-center items-center"}>
			<CircularProgress />
		</div>,
	);

	const [newsComponent, setNewsComponent] = React.useState<JSX.Element>(
		<div className={"w-full h-full flex justify-center items-center"}>
			<CircularProgress />
		</div>,
	);

	useEffect(() => {
		if (timeSeriesData) {
			setTimeSeriesComponent(<CandleStickChart data={timeSeriesData} />);
		}
	}, [timeSeriesData]);

	useEffect(() => {
		if (newsData) {
			setNewsComponent(<NewsList news={newsData} />);
		}
	}, [newsData]);

	return (
		<div className={"w-full max-h-screen h-screen  flex flex-col"}>
			<Navbar />
			<div className={"flex-1 ml-auto w-5/6 max-h-full flex h-screen flex-col "}>
				<Header name={name} image={image} meta={meta} userEmail={email} />
				<div className={"w-full flex flex-row gap-10 h-[calc(100%-90px)] p-4"}>
					<div className={"h-full w-1/3 flex flex-col "}>
						<div className={"h-1/5 w-full flex flex-col gap-6"}>
							<p className={"text-white text-3xl font-medium"}>Interval</p>
							<div className={"flex flex-row gap-4"} id={"intervalLinks"}>
								<Link href={"/feed/stock/[symbol]?interval=5min"} as={`/feed/stock/${symbol}`} className={"w-fit bg-blue-700 text-white px-2 py-1 rounded-md"} id={"1min"}>
									5min
								</Link>
								<Link href={"/feed/stock/[symbol]?interval=1h"} as={`/feed/stock/${symbol}`} className={"w-fit bg-blue-700 text-white px-2 py-1 rounded-md"} id={"1h"}>
									1hour
								</Link>
								<Link href={"/feed/stock/[symbol]?interval=1day"} as={`/feed/stock/${symbol}`} className={"w-fit bg-blue-700 text-white px-2 py-1 rounded-md"} id={"1day"}>
									1day
								</Link>
								<Link href={"/feed/stock/[symbol]?interval=1week"} as={`/feed/stock/${symbol}`} className={"w-fit bg-blue-700 text-white px-2 py-1 rounded-md"} id={"1week"}>
									1week
								</Link>
								<Link href={"/feed/stock/[symbol]?interval=1month"} as={`/feed/stock/${symbol}`} className={"w-fit bg-blue-700 text-white px-2 py-1 rounded-md"} id={"1month"}>
									1month
								</Link>
							</div>
						</div>
						{newsComponent}
					</div>
					<div className={"w-2/3 flex flex-1 flex-col gap-6"}>
						<p className={"text-white text-3xl font-medium"}>Chart</p>
						<div className={"shadow-inner shadow-gray-900 h-full p-4 overflow-hidden"}>{timeSeriesComponent}</div>
					</div>
				</div>
			</div>
		</div>
	);
}
