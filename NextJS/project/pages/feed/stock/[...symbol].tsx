import { InferGetServerSidePropsType } from "next";
import React, { useEffect } from "react";
import CandleStickChart from "@components/CandleStickChart";
import useSWR, { Fetcher } from "swr";
import Navbar from "@components/Navbar";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { authOptions } from "../../api/auth/[...nextauth]";
import Header from "@components/Header";
import NewsList from "@components/NewsList";

export async function getServerSideProps(context: any) {
	const session = await getServerSession(context.req, context.res, authOptions);

	if (!session) {
		return {
			redirect: {
				destination: "/login",
				permanent: false,
			},
		};
	}
	return {
		props: {
			symbol: context.params.symbol.join("/"),
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
export default function Stock({ symbol, name, image }: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const [interval, setInterval] = React.useState<string>("1day");

	const { data: timeSeriesData, error: timeSeriesError } = getStockTimeSeries(symbol, interval);
	const { data: newsData, error: newsError } = getStockNews(symbol);
	const timeSeries = timeSeriesData?.timeSeries;
	const meta = timeSeriesData?.meta as Meta;
	const news: News[] = newsData?.news.data;

	const router = useRouter();

	const { status } = useSession({
		required: true,
		onUnauthenticated() {
			router.push("/").then();
		},
	});

	const [newsComponent, setNewsComponent] = React.useState<JSX.Element>(
		<div className={"flex items-center justify-center"}>
			<CircularProgress />
		</div>,
	);
	const [timeSeriesComponent, setTimeSeriesComponent] = React.useState<JSX.Element>(
		<div className={"flex items-center justify-center"}>
			<CircularProgress />
		</div>,
	);

	useEffect(() => {
		if (news) {
			setNewsComponent(<NewsList news={news} />);
		}
	}, [news]);
	useEffect(() => {
		if (timeSeries) {
			setTimeSeriesComponent(<CandleStickChart data={timeSeries} />);
		}
	}, [timeSeries]);

	return (
		<div className={"w-full max-h-screen h-screen  flex flex-col"}>
			<Navbar />
			<div className={"flex-1 ml-auto w-5/6 max-h-full flex h-screen flex-col "}>
				<Header name={name} image={image} meta={meta} />
				<div className={"w-full flex flex-row gap-10 h-[calc(100%-90px)] p-4"}>
					<div className={"h-full w-1/3 flex flex-col "}>
						<div className={"h-1/5 w-full flex flex-col gap-6"}>
							<p className={"text-white text-3xl font-medium"}>Interval</p>
							<div className={"flex flex-row gap-4"}>
								<button className={"w-fit bg-blue-700 text-white px-2 py-1 rounded-md"}>5min</button>
								<button className={"w-fit bg-blue-700 text-white px-2 py-1 rounded-md"}>1hour</button>
								<button className={"w-fit bg-blue-700 text-white px-2 py-1 rounded-md"}>1day</button>
								<button className={"w-fit bg-blue-700 text-white px-2 py-1 rounded-md"}>1week</button>
								<button className={"w-fit bg-blue-700 text-white px-2 py-1 rounded-md"}>1month</button>
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
