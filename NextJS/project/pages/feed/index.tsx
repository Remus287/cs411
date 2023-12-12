import { signOut } from "next-auth/react";
import Navbar from "../../components/Navbar";
import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import Header from "@components/Header";

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
export default function Home({ name, image }: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const router = useRouter();

	return (
		<div className={"h-full"}>
			<Navbar />
			<Header image={image} name={name} />
		</div>
	);
}
