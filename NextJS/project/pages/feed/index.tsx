import { signIn, signOut } from "next-auth/react";
import Navbar from "../../components/Navbar";
import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import * as console from "console";

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
			name: session.user?.name,
			email: session.user?.email,
			image: session.user?.image,
		},
	};
}
/* { name, email, image }*/
export default function Home({}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const router = useRouter();

	return (
		<div className={"h-full"}>
			<Navbar />
			<section className={"h-full w-5/6 ml-auto"}>
				<button onClick={() => signOut({ callbackUrl: "/" })} className={"absolute top-0 right-0 mt-4 mr-4 px-4 py-2 bg-blue-950 text-white rounded-lg"}>
					Sign Out
				</button>
			</section>
		</div>
	);
}
