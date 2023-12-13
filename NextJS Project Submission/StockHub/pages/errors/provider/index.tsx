import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function ProviderError() {
	const [timer, setTimer] = useState(5);
	const router = useRouter();

	useEffect(() => {
		const interval = setInterval(() => {
			setTimer((timer) => timer - 1);
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		if (timer === 0) {
			router.push("/").then();
		}
	}, [timer]);

	return (
		<div className={"w-full h-full flex justify-center items-center"}>
			<div className={"w-1/3 h-1/3 flex flex-col gap-4 items-center"}>
				<h1 className={"text-4xl font-medium border-b-4 border-blue-700 py-4"}>Error</h1>
				<p>There was an error signing in.</p>
				<p>Try another provider or try again later.</p>
				<p>You will be automatically redirected in {timer} seconds.</p>
			</div>
		</div>
	);
}
