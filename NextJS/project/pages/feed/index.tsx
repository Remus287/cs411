import {InferGetServerSidePropsType} from "next";
import {getServerSideProps} from "../index";

export default function Home({
	isConnected,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	return (
		<div>
			<h1>Blah BLah Balls</h1>
		</div>
	)
}