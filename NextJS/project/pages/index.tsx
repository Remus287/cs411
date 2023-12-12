import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import { SyntheticEvent, useEffect } from "react";
import Link from "next/link";
export default function Home({}) {
	const router = useRouter();
	const { status } = useSession();

	useEffect(() => {
		console.log(status);
		if (status === "authenticated") {
			router.push("/feed").then();
		}
	}, [status]);

	const handleSubmit = async (e: SyntheticEvent) => {
		e.preventDefault();
		const target = e.target as typeof e.target & {
			username: { value: string };
			password: { value: string };
		};

		const username = target.username.value;
		const password = target.password.value;

		const res = await signIn("credentials", {
			redirect: false,
			username: username,
			password: password,
		});

		if (res && res.error) {
			alert(res.error);
		}

		if (res && !res.error) {
			router.push("/feed").then();
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
					<label className={"w-full flex flex-col gap-1"}>
						<label className={"text-gray-700 text-lg pl-2"}>Username</label>
						<input type={"text"} className={"px-4 py-2 bg-white/[.9] outline outline-1 outline-gray-300 w-full"} required name={"username"} />
					</label>
					<label className={"w-full flex flex-col gap-1"}>
						<label className={"text-gray-700 text-lg pl-2"}>Password</label>
						<input type={"password"} className={"px-4 py-2 bg-white/[.9] outline outline-1 outline-gray-300 w-full"} maxLength={24} minLength={8} id={"password"} required name={"password"} />
					</label>
					<button className={"bg-blue-700 text-white rounded-md p-2"} type="submit">
						Sign In
					</button>
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
