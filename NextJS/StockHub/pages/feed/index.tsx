import { signOut } from "next-auth/react";
import Navbar from "../../components/Navbar";
import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import Header from "@components/Header";
import useSWR from "swr";
import { useEffect, useState } from "react";
import Link from "next/link";
import { IoMdClose } from "react-icons/io";

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
			name: session.user?.name || "",
			email: session.user?.email || "",
			image: session.user?.image || "",
		},
	};
}
export default function Home({ name, email, image }: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const router = useRouter();
	const [favorites, setFavorites] = useState([]);
	const [topStocks, setTopStocks] = useState(["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "BRK.B", "TSLA", "LLY", "V"]);
	useEffect(() => {
		async function getFavorites() {
			const res = await fetch("/api/user/getFavorite", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email: email }),
			});
			const json = await res.json();
			setFavorites(json.favorites);
		}
		getFavorites().then();
	}, []);

	let removeFromFavorites = (symbol: string) => async () => {
		const res = await fetch("/api/user/removeFavorite", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email: email, symbol: symbol }),
		});
		const json = await res.json();
		setFavorites(json.favorites);
	};

	return (
		<div className={"h-full"}>
			<Navbar />
			<div className={"flex-1 ml-auto w-5/6 max-h-full flex h-screen flex-col "}>
				<Header image={image} name={name} />
				<div className={"h-full flex flex-row"}>
					<div className={"w-1/2 flex items-center justify-center p-4 flex-col max-h-full overflow-y-auto gap-10"}>
						<p className={"text-4xl text-white font-bold"}>Our Favorites</p>
						<ol className={"h-full w-72  rounded-xl flex items-center flex-col overflow-clip"}>
							{topStocks.map((stock: any) => {
								return (
									<li key={stock} className={"w-full text-2xl h-fit border-b-2 transition-transform active:scale-95 flex"}>
										<Link href={"/feed/stock/" + stock} className={"text-white px-4 py-2 hover:bg-white/[.05] transition-background w-full h-full"}>
											{stock}
										</Link>
									</li>
								);
							})}
						</ol>
					</div>
					<div className={"w-1 h-full pb-14"}>
						<div className={"bg-white/[.3] h-full w-full"}></div>
					</div>
					<div className={"w-1/2 flex items-center justify-center p-4 flex-col max-h-full overflow-y-auto gap-10"}>
						<p className={"text-4xl text-white font-bold"}> Your Favorites</p>
						<ol className={"h-full w-72 rounded-xl p-4 flex items-center flex-col"}>
							{favorites.length > 0 ? (
								favorites.map((favorite: any) => {
									return (
										<li key={favorite} className={"w-full text-2xl h-fit leading-10 border-b-2 transition-transform active:scale-95 flex relative"}>
											<Link href={"/feed/stock/" + favorite} className={"text-white px-4 hover:bg-white/[.05] transition-background w-full h-full"}>
												{favorite}
											</Link>
											<button onClick={removeFromFavorites(favorite)} className={"text-white text-3xl hover:text-red-500 transition-colors absolute right-0 top-1/2 -translate-y-1/2"}>
												<IoMdClose />
											</button>
										</li>
									);
								})
							) : (
								<li className={"text-2xl text-white"}>No Favorites Found</li>
							)}
						</ol>
					</div>
				</div>
			</div>
		</div>
	);
}
