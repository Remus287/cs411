import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import StockList from "../../components/StockList";
import clientPromise from "../../lib/mongodb";

type Stock = {
	name: string;
	symbol: string;
	country: string;
};

export const getServerSideProps: GetServerSideProps<{ stocksList: Stock[] }> = async () => {
	const client = await clientPromise;
	const db = client.db();

	const stocks = await db.collection("stocks").find({}).toArray();

	const stocksListOnlyNames = stocks.map((stock) => {
		return {
			name: stock.name,
			symbol: stock.symbol,
			country: stock.country,
		};
	});

	return {
		props: {
			stocksList: stocksListOnlyNames,
		},
	};
};
export default function Home({ stocksList }: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const router = useRouter();
	const stockList = stocksList as Stock[];
	console.log(stockList);

	const { status } = useSession({
		required: true,
		onUnauthenticated() {
			router.push("/login");
		},
	});

	useEffect(() => {
		const fetchData = async () => {};
		fetchData().catch((err) => console.log(err));
	}, []);

	return (
		<div className={"h-full"}>
			<section className={"h-full fixed w-1/6"}>
				<StockList stocksList={stockList} />
			</section>
			<section className={"h-full w-5/6 ml-auto"}>
				<button onClick={() => signOut()} className={"absolute top-0 right-0 mt-4 mr-4 px-4 py-2 bg-blue-950 text-white rounded-lg"}>
					Sign Out
				</button>
			</section>
		</div>
	);
}
