import Head from 'next/head'
import clientPromise from '../../lib/mongodb'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'

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
	return (
		<div className={'w-full h-full flex justify-start'} style={{
			backgroundImage: 'url(./assets/background.jpg)',
			backgroundSize: 'calc(200% / 3) 100vh',
			backgroundPosition: 'right',
			backgroundRepeat: 'no-repeat',
			
		}}>
			<section className={"w-1/3 h-full flex py-32 px-20 bg-white flex-col gap-10"}>
				<h1 className={'text-4xl font-medium border-b-4 border-blue-700 py-4'}>Log In</h1>
				<form className={'flex flex-col w-full gap-4 items-end'}>
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
