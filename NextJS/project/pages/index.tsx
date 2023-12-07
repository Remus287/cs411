import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import { SyntheticEvent, useEffect } from "react";
import Link from "next/link";
export default function Home({}) {
	const router = useRouter();
	const { status } = useSession();
	useEffect(() => {
		if (status === "authenticated") {
			// router.push("/feed");
		}
	}, [status]);

	const handleSubmit = async (e: SyntheticEvent) => {
		e.preventDefault();
		const target = e.target as typeof e.target & {
			email: { value: string };
			password: { value: string };
		};

		const email = target.email.value;
		const password = target.password.value;

		const res = await signIn("credentials", {
			redirect: false,
			email: email,
			password: password,
		});

		if (res && !res.error) {
			router.push("/feed").then();
		}

		if (res && res.error) {
			console.log(res.error);
		}
	};
	let providerSignIn = async (provider: string) => {
		await signIn(provider, { callbackUrl: "/feed" });
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
				<form
					className={"flex flex-col gap-4"}
					onSubmit={(e) => {
						handleSubmit(e).then();
					}}
				>
					<label className={""}>
						<label className={"text-lg"}>email</label>
						<input className={"border-2 border-blue-700 rounded-md p-2"} type="text" name="email" />
					</label>
					<label className={""}>
						<label className={"text-lg"}>Password</label>
						<input className={"border-2 border-blue-700 rounded-md p-2"} type="password" name="password" />
					</label>
				</form>
				<button
					onClick={() => {
						providerSignIn("google").then();
					}}
				>
					Sign in with Google
				</button>
				<button
					onClick={() => {
						providerSignIn("github").then();
					}}
				>
					Sign in with Github
				</button>
				<Link href={"/register"}>Don't have an account? Register here.</Link>
			</section>
		</div>
	);
}
