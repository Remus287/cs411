import {InferGetServerSidePropsType} from "next";
import {getServerSideProps} from "../index";
import {signOut, useSession} from "next-auth/react";
import {useRouter} from "next/router";

export default function Home() {
	const router = useRouter ();
	const {status} = useSession({
		required: true,
		onUnauthenticated() {
			router.push('/login')
		}
	})
	return (
		<div>
			<h1>Blah BLah Balls</h1>
			<button onClick={() => signOut()} className={'bg-[#381f98] text-white py-2 px-8 mt-5 w-40'}>
				Sign Out
			</button>
		</div>
	)
}