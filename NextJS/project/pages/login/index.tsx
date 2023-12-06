import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import { SyntheticEvent, useEffect } from "react";

export default function Home({}) {
	const router = useRouter();
	const { status } = useSession();
	useEffect(() => {
		if (status === "authenticated") {
			router.push("/feed");
		}
	}, [status]);
	const handleSubmit = async (e: SyntheticEvent) => {
		e.preventDefault();
		const target = e.target as typeof e.target & {
			username: { value: string };
			password: { value: string };
		};
		let username = target.username.value;
		let password = target.password.value;

		const res = await signIn("credentials", {
			redirect: false,
			username: username,
			password: password,
		});

		if (res && !res.error) {
			router.push("/feed").then();
		}
	};
	return (
		<div
			className={"w-full h-full flex justify-start"}
			style={{
				backgroundImage: "url(./assets/background.jpg)",
				backgroundSize: "calc(200% / 3) 100vh",
				backgroundPosition: "right",
				backgroundRepeat: "no-repeat",
			}}
		>
			<section className={"w-1/3 h-full flex py-20 px-20 bg-white flex-col gap-10"}>
				<h1 className={"text-4xl font-medium border-b-4 border-blue-700 py-4"}>Log In</h1>
				<button
					onClick={() => {
						signIn("google", { callbackUrl: "http://localhost:3000/feed" });
					}}
				>
					Sign in with Google
				</button>
				<button
					onClick={() => {
						signIn("github", { callbackUrl: "http://localhost:3000/feed" });
					}}
				>
					Sign in with Github
				</button>
			</section>
		</div>
	);
}
