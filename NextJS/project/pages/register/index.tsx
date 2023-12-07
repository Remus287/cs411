import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { SyntheticEvent, useEffect, useState } from "react";
import Link from "next/link";
import { IoIosWarning } from "react-icons/io";
export default function Home() {
	const router = useRouter();
	const { status } = useSession();
	const [passwordStrength, setPasswordStrength] = useState(0);

	const [passwordUpdateTimeout, setPasswordUpdateTimeout] = useState<NodeJS.Timeout | null>(null);
	const [emailUpdateTimeout, setEmailUpdateTimeout] = useState<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (status === "authenticated") {
			// router.push("/feed");
		}
	}, [status]);

	const checkPasswordStrength = async (password: string) => {
		const response = await fetch("/api/auth/passwordStrength", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ password: password }),
		});

		return await response.json();
	};
	const checkEmail = async (email: string) => {
		const response = await fetch("/api/auth/emailInUse", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email: email }),
		});
		return await response.json();
	};
	const handleEmailChange = async (e: SyntheticEvent) => {
		e.preventDefault();
		const target = e.target as typeof e.target & {
			value: string;
		};
		const email = target.value;

		const json = await checkEmail(email);

		const warning = document.querySelector(".email-tooltip > .tooltip-container") as HTMLSpanElement;
		const warningIcon = warning.querySelector("svg") as SVGSVGElement;

		if (emailUpdateTimeout) {
			clearTimeout(emailUpdateTimeout);
		}

		const timeout = setTimeout(() => {
			if (json.exists) {
				warning.classList.remove("invisible");
				warningIcon.classList.remove("opacity-0");
				warning.classList.add("visible");
				warningIcon.classList.add("opacity-100");
			} else {
				warning.classList.remove("visible");
				warningIcon.classList.remove("opacity-100");
				warningIcon.classList.add("opacity-0");

				setTimeout(() => {
					warning.classList.add("invisible");
				}, 500);
			}
		}, 500);

		setEmailUpdateTimeout(timeout);

		return json.exists;
	};

	const comparePasswords = async (e: SyntheticEvent) => {
		e.preventDefault();

		const target = e.target as typeof e.target & {
			value: string;
		};

		const password2 = target.value;
		const password1 = document.getElementById("password") as HTMLInputElement;

		if (passwordUpdateTimeout) {
			clearTimeout(passwordUpdateTimeout);
		}
		const warning = document.querySelector(".password-tooltip > .tooltip-container") as HTMLSpanElement;
		const warningIcon = warning.querySelector("svg") as SVGSVGElement;

		const timeout = setTimeout(() => {
			if (password2.length !== 0 && password2 !== password1.value) {
				warning.classList.remove("invisible");
				warningIcon.classList.remove("opacity-0");
				warning.classList.add("visible");
				warningIcon.classList.add("opacity-100");
			} else {
				warning.classList.remove("visible");
				warningIcon.classList.remove("opacity-100");
				warningIcon.classList.add("opacity-0");

				setTimeout(() => {
					warning.classList.add("invisible");
				}, 500);
			}
		}, 500);

		setPasswordUpdateTimeout(timeout);

		return password2 === password1.value;
	};
	const updatePasswordStrength = async (e: SyntheticEvent) => {
		e.preventDefault();
		const target = e.target as typeof e.target & {
			value: string;
		};

		const password = target.value;
		const res = await checkPasswordStrength(password);

		const strength = res.passwordStrength;

		const bar = document.getElementById("passwordStrengthBar");

		const widths = ["w-0", "w-1/5", "w-2/5", "w-3/5", "w-4/5", "w-full"];

		const previousWidthClass = widths[passwordStrength];
		const newWidthClass = widths[strength];

		const previousColor = "bg-passwordStrength-" + passwordStrength;
		const newColor = "bg-passwordStrength-" + strength;

		if (bar) {
			bar.classList.remove(previousWidthClass);
			bar.classList.add(newWidthClass);
			bar.classList.remove(previousColor);
			bar.classList.add(newColor);
		}

		setPasswordStrength(strength);
	};

	const handleSubmit = async (e: SyntheticEvent) => {
		e.preventDefault();
		console.log(e.target);
		const target = e.target as typeof e.target & {
			email: { value: string };
			password: { value: string };
			passwordConfirm: { value: string };
			fullName: { value: string };
		};

		const email = target.email.value;
		const password = target.password.value;
		const passwordConfirm = target.passwordConfirm.value;
		const fullName = target.fullName.value;

		const passwordMatch = password === passwordConfirm;
		const emailExists = await checkEmail(email);

		if (!passwordMatch || emailExists) {
			// pick the two icons and make them visible
			// run scale animation on the icons

			let emailWarning = document.querySelector(".tooltip-container") as HTMLSpanElement;
			let emailWarningIcon = emailWarning.querySelector("svg") as SVGSVGElement;
			let passwordWarning = emailWarning.nextElementSibling as HTMLSpanElement;
			let passwordWarningIcon = passwordWarning.querySelector("svg") as SVGSVGElement;

			emailWarning.classList.remove("invisible");
			emailWarningIcon.classList.remove("opacity-0");
			passwordWarning.classList.remove("invisible");
			passwordWarningIcon.classList.remove("opacity-0");
			emailWarning.classList.add("visible");
			emailWarningIcon.classList.add("opacity-100");
			passwordWarning.classList.add("visible");
			passwordWarningIcon.classList.add("opacity-100");

			// add scale-animation class to both icons

			emailWarningIcon.classList.add("scale-animation");
			passwordWarningIcon.classList.add("scale-animation");

			setTimeout(() => {
				emailWarningIcon.classList.remove("scale-animation");
				passwordWarningIcon.classList.remove("scale-animation");
			}, 1000);
		}

		const newUser = {
			email: email,
			password: password,
			fullName: fullName,
		};

		const res = await fetch("/api/auth/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newUser),
		});

		if (res) {
			const signedIn = await signIn("credentials", {
				redirect: false,
				email: email,
				password: password,
			});

			if (signedIn) {
				router.push("/feed").then();
			}
		}
	};

	return (
		<div
			className={"w-full h-full flex justify-end"}
			style={{
				backgroundImage: "url(./assets/background.jpg)",
				backgroundSize: "calc(200% / 3) 100vh",
				backgroundPosition: "left",
				backgroundRepeat: "no-repeat",
			}}
		>
			<section className={"w-1/3 h-full flex py-20 px-20 bg-white flex-col gap-6"}>
				<h1 className={"text-4xl font-medium border-b-4 border-blue-700 py-4"}>Register</h1>
				<form
					className={"flex flex-col w-full gap-2 items-end"}
					onSubmit={(e) => {
						handleSubmit(e).then();
					}}
				>
					<label className={"w-full flex flex-col gap-1"}>
						<label className={"text-gray-700 text-lg pl-2"}>Email</label>
						<span className={"relative email-tooltip"}>
							<span className={"absolute top-1/2 -translate-y-1/2 -translate-x-8 text-red-800 tooltip-container invisible"}>
								<IoIosWarning className={"text-2xl opacity-0 transition-opacity duration-500"} />
								<p className={"tooltip absolute w-40 text-xs font-medium text-center rounded-md bg-blue-900 text-white p-2 -translate-x-full -translate-y-full top-0 opacity-0"}>Email already in use</p>
							</span>
							<input type={"text"} className={"px-4 py-2 bg-white/[.9] outline outline-1 outline-gray-300 w-full"} name={"email"} onChange={handleEmailChange} required />
						</span>
					</label>
					<label className={"w-full flex flex-col gap-1"}>
						<label className={"text-gray-700 text-lg pl-2"}>Password</label>
						<span>
							<p className={"text-gray-700 text-sm pl-2"}>Password Strength</p>
							<div className={"w-full h-2 bg-black"}>
								<div className={"w-0 h-full bg-red-500 transition-passwordStrength duration-300"} id={"passwordStrengthBar"}></div>
							</div>
							<input type={"password"} className={"px-4 py-2 bg-white/[.9] outline outline-1 outline-gray-300 w-full"} onChange={updatePasswordStrength} maxLength={24} minLength={8} id={"password"} required name={"password"} />
						</span>
					</label>
					<label className={"w-full flex flex-col gap-1"}>
						<label className={"text-gray-700 text-lg pl-2"}>Confirm Password</label>
						<span className={"relative password-tooltip"}>
							<span className={"absolute top-1/2 -translate-y-1/2 -translate-x-8 text-red-800 tooltip-container invisible"}>
								<IoIosWarning className={"text-2xl opacity-0 transition-opacity duration-500"} />
								<p className={"tooltip absolute w-40 text-xs font-medium text-center rounded-md bg-blue-900 text-white p-2 -translate-x-full -translate-y-full top-0 opacity-0"}>Passwords do not match</p>
							</span>
							<input type={"password"} className={"px-4 py-2 bg-white/[.9] outline outline-1 outline-gray-300 w-full"} maxLength={24} minLength={8} onChange={comparePasswords} required name={"passwordConfirm"} />
						</span>
					</label>
					<label className={"flex flex-col gap-1 w-full"}>
						<label className={"text-gray-700 text-lg pl-2"}>Name</label>
						<input type={"text"} className={"px-4 py-2 bg-white/[.9] outline outline-1 outline-gray-300 w-full"} required name={"fullName"} />
					</label>
					<button type={"submit"} className={"bg-[#381f98] text-white py-2 px-8 mt-5 w-40"}>
						Register
					</button>
				</form>
				<Link href={"/"}>Already have an account? Log in.</Link>
			</section>
		</div>
	);
}
