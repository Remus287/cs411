import { InferGetServerSidePropsType } from "next";
import React from "react";
import CandleStickChart from "../../../components/CandleStickChart";
import useSWR from "swr";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { authOptions } from "../../api/auth/[...nextauth]";
type Meta = {
	symbol: string;
	interval: string;
	currency: string;
	exchange_timezone: string;
	exchange: string;
	mic_code: string;
	type: string;
};
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
			email: session.user?.email,
			image: session.user?.image,
		},
	};
}
const fetcher = (url: string) => fetch(url).then((res) => res.json());
export default function Stock({ symbol }: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const { data, error } = useSWR(`/api/stock/${symbol}`, fetcher);
	const values = data?.values;
	const meta = data?.meta as Meta;

	const router = useRouter();

	const { status } = useSession({
		required: true,
		onUnauthenticated() {
			router.push("/login");
		},
	});

	if (error) {
		return <div>Error</div>;
	}
	if (!data) {
		return <div>Loading...</div>;
	}
	return (
		<div className={"w-full h-full flex flex-col"}>
			<Navbar />
			<div className={"w-5/6 h-full flex flex-col ml-auto items-end px-10 py-6 gap-6"}>
				<div className={"flex flex-row justify-between w-full"}>
					<div>
						<p className={"text-4xl font-medium"}>{meta.symbol}</p>
						<p className={"text-gray-700 text-lg"}>{meta.currency}</p>
						<p className={"text-gray-700 text-lg"}>{meta.exchange}</p>
						<p className={"text-gray-700 text-lg"}>{meta.exchange_timezone}</p>
						<p className={"text-gray-700 text-lg"}>{meta.interval}</p>
						<p className={"text-gray-700 text-lg"}>{meta.mic_code}</p>
						<p className={"text-gray-700 text-lg"}>{meta.type}</p>
					</div>
					<Link href={"/feed"} className={"bg-blue-900 text-white font-medium text-xl w-24 text-center py-1 rounded-lg"}>
						BACK
					</Link>
				</div>
				<div className={"w-full"}>
					<CandleStickChart data={values} />
				</div>
			</div>
		</div>
	);
}
