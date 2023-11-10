import Head from 'next/head'
import clientPromise from '../../lib/mongodb'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import {useRouter} from "next/router";

type ConnectionStatus = {
	isConnected: boolean
}

export const getServerSideProps: GetServerSideProps<
	ConnectionStatus
> = async () => {
	try {
		await clientPromise
		return {
			props: { isConnected: true },
		}
	} catch (e) {
		console.error(e)
		return {
			props: { isConnected: false },
		}
	}
}

export default function Home({
	isConnected,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const router = useRouter ();
	const handleSubmit  = (e) => {
		e.preventDefault ()
		let username = e.target[0].value
		let password = e.target[1].value
		
		const user = {
			username: username, password: password,
		}
		
		fetch ('/api/auth/login', {
			method: 'POST', headers: {
				'Content-Type': 'application/json',
			}, body: JSON.stringify (user),
		})
			.then ((res) => {
				console.log (res.status)
				if (res.status === 200) {
					router.push ('/feed')
				}
				return res.json ()
			})
			.then ((data) => {
				console.log (data)
			}).catch ((err) => console.log (err))
	}
	return (
		<div className={'w-full h-full flex justify-start'} style={{
			backgroundImage: 'url(./assets/background.jpg)',
			backgroundSize: 'calc(200% / 3) 100vh',
			backgroundPosition: 'right',
			backgroundRepeat: 'no-repeat',
			
		}}>
			<section className={"w-1/3 h-full flex py-20 px-20 bg-white flex-col gap-10"}>
				<h1 className={'text-4xl font-medium border-b-4 border-blue-700 py-4'}>Log In</h1>
				<form className={'flex flex-col w-full gap-4 items-end'} onSubmit={(e)=>{handleSubmit(e)}}>
					<label className={'w-full flex flex-col gap-1'}>
						<label className={'text-gray-700 text-lg pl-2'}>Username</label>
						<input type={'text'} className={'px-4 py-2 bg-white/[.9] outline outline-1 outline-gray-300 w-full'} />
					</label>
					<label className={'w-full flex flex-col gap-1'}>
						<label className={'text-gray-700 text-lg pl-2'}>Password</label>
						<input type={'password'} className={'px-4 py-2 bg-white/[.9] outline outline-1 outline-gray-300 w-full'} />
					</label>
					<button type={'submit'} className={'bg-[#381f98] text-white py-2 px-8 mt-5 w-40'}>Login</button>
				</form>
				<a href={'#'} className={'text-blue-700 underline text-right'}>Forgot Username or Password?</a>
			</section>
		</div>
	)
}
