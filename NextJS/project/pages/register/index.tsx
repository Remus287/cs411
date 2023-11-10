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
	
	
	const handleSubmit  = (e) => {
		e.preventDefault()
		let username = e.target[0].value
		let password = e.target[1].value
		let email = e.target[3].value
		let firstName = e.target[4].elements[0].value
		let lastName = e.target[4].elements[1].value
		
		const newUser = {
			username: username,
			password: password,
			email: email,
			firstName: firstName,
			lastName: lastName,
		}
		
		// send to api register route
		
		fetch('/api/auth/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newUser),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data)
			})
			.catch((err) => console.log(err))
	}
	
	return (
		<div className={'w-full h-full flex justify-end'} style={{
			backgroundImage: 'url(./assets/background.jpg)',
			backgroundSize: 'calc(200% / 3) 100vh',
			backgroundPosition: 'left',
			backgroundRepeat: 'no-repeat',
			
		}}>
			<section className={"w-1/3 h-full flex py-20 px-20 bg-white flex-col gap-6"}>
				<h1 className={'text-4xl font-medium border-b-4 border-blue-700 py-4'}>Register</h1>
				<form className={'flex flex-col w-full gap-2 items-end'} onSubmit={(e) => {handleSubmit(e)}}>
					<label className={'w-full flex flex-col gap-1'}>
						<label className={'text-gray-700 text-lg pl-2'}>Username</label>
						<input type={'text'} className={'px-4 py-2 bg-white/[.9] outline outline-1 outline-gray-300 w-full'} />
					</label>
					<label className={'w-full flex flex-col gap-1'}>
						<label className={'text-gray-700 text-lg pl-2'}>Password</label>
						<input type={'password'} className={'px-4 py-2 bg-white/[.9] outline outline-1 outline-gray-300 w-full'} />
					</label>
					<label className={'w-full flex flex-col gap-1'}>
						<label className={'text-gray-700 text-lg pl-2'}>Confirm Password</label>
						<input type={'password'} className={'px-4 py-2 bg-white/[.9] outline outline-1 outline-gray-300 w-full'} />
					</label>
					<label className={'w-full flex flex-col gap-1'}>
						<label className={'text-gray-700 text-lg pl-2'}>Email</label>
						<input type={'email'} className={'px-4 py-2 bg-white/[.9] outline outline-1 outline-gray-300 w-full'} />
					</label>
					<fieldset className={'flex flex-row justify-between gap-4 w-full'}>
						<label className={'flex flex-col gap-1 w-full'}>
							<label className={'text-gray-700 text-lg pl-2'}>First Name</label>
							<input type={'text'} className={'px-4 py-2 bg-white/[.9] outline outline-1 outline-gray-300 w-full'} />
						</label>
						<label className={'flex flex-col gap-1 w-full'}>
							<label className={'text-gray-700 text-lg pl-2'}>Last Name</label>
							<input type={'text'} className={'px-4 py-2 bg-white/[.9] outline outline-1 outline-gray-300 w-full'} />
						</label>
					</fieldset>
					<button type={'submit'} className={'bg-[#381f98] text-white py-2 px-8 mt-5 w-40'}>Register</button>
				</form>
			</section>
		</div>
	)
}
