import {signIn, useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {useEffect} from "react";

export default function Home(){
	const router = useRouter ();
	const {status} = useSession()
	useEffect(() => {
		if (status === 'authenticated'){
			router.push('/feed')
		}
	},[status])
	
	const handleSubmit  = async (e) => {
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
		
		const res = await fetch('/api/auth/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newUser),
		});
		
		const resLogIn = await signIn('credentials', {
			redirect: false,
			username: username,
			password: password,
		})
		
		if (!resLogIn.error){
			router.push('/feed')
		}
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
