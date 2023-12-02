import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import StockList from "../../components/StockList";

export default function Home() {
	const router = useRouter();
	const { status } = useSession({
		required: true,
		onUnauthenticated() {
			router.push("/login");
		},
	});

	return (
		<div className={"h-full"}>
			<section className={"h-full fixed w-1/6"}>
				<StockList />
			</section>
			<section className={"h-full w-5/6 ml-auto"}>
				<button onClick={() => signOut()} className={"absolute top-0 right-0 mt-4 mr-4 px-4 py-2 bg-blue-950 text-white rounded-lg"}>
					Sign Out
				</button>
			</section>
		</div>
	);
}
