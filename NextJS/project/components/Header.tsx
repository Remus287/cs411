import { signOut } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Tag from "@components/Tag";
import Link from "next/link";
import { TbArrowBackUp } from "react-icons/tb";

export default function Header({ image, name = "", meta }: { image: string; name: string; meta?: Meta }) {
	const router = useRouter();
	const [avatar, setAvatar] = useState<JSX.Element | null>(null);

	useEffect(() => {
		let elem = <img src={image} alt={"profile picture"} className={"w-full h-full object-cover rounded-full"} />;
		if (image === "") {
			const firstLetter = name?.charAt(0);
			elem = <div className={"h-full w-full flex justify-center items-center bg-blue-950 text-white rounded-full text-2xl"}>{firstLetter}</div>;
		}
		setAvatar(elem);
	}, []);

	useEffect(() => {
		// add event listener to document so that the dropdown closes when the user clicks outside of it
		const dropdown = document.querySelector("#dropdown") as HTMLDivElement;

		const button = document.querySelector("#profile-button") as HTMLButtonElement;

		const handleClickOutside = (event: any) => {
			if (dropdown && !dropdown.contains(event.target) && !button.contains(event.target)) {
				dropdown.classList.remove("visible");
				dropdown.classList.remove("opacity-100");
				dropdown.classList.add("opacity-0");

				setTimeout(() => {
					dropdown.classList.add("invisible");
				}, 300);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
	}, []);
	const openDropdown = () => {
		const dropdown = document.querySelector("#dropdown") as HTMLDivElement;

		dropdown.classList.remove("invisible");
		dropdown.classList.add("visible");
		dropdown.classList.remove("opacity-0");
		dropdown.classList.add("opacity-100");
	};
	if (!meta) {
		return (
			<section className={"flex items-center flex-row h-24 py-4 px-10 w-full justify-end flex-none"}>
				<span className={"relative"}>
					<button onClick={() => openDropdown()} className={"w-12 aspect-square"} id={"profile-button"}>
						{avatar}
					</button>
					<div id={"dropdown"} className={"absolute top-13 right-0 bg-white rounded-md shadow-md w-48 h-auto flex flex-col gap-2 p-2 opacity-0 invisible transition-opacity duration-300"}>
						<button className={"w-full h-12 flex items-center justify-center rounded-md hover:bg-blue-950 hover:text-white transition-background"}>Profile</button>
						<button
							className={"w-full h-12 flex items-center justify-center rounded-md hover:bg-blue-950 hover:text-white transition-background"}
							onClick={() => {
								signOut().then();
								router.push("/").then();
							}}
						>
							Sign Out
						</button>
					</div>
				</span>
			</section>
		);
	}
	return (
		<div className={"flex items-center flex-row h-24 py-4 px-10 w-full float-right justify-end bg-red-500"}>
			<div className={"flex flex-row justify-between flex-1 items-center pr-12"}>
				<div className={"flex flex-row gap-x-2 gap-y-0 flex-wrap"}>
					<span className={"w-full"}>
						<pre className={"text-5xl font-medium text-white"}>{meta.symbol} </pre>
					</span>
					<Tag tag={meta.currency} />
					<Tag tag={meta.exchange} />
					<Tag tag={meta.type} />
					<Tag tag={meta.interval} />
					<Tag tag={meta.exchange_timezone} />
					<Tag tag={meta.mic_code} />
					<Tag tag={meta.type} />
				</div>
				<Link href={"/feed"} className={"bg-blue-900 text-white font-medium text-3xl px-6 text-center h-fit py-px rounded-lg hover:bg-blue-950 transition-background "}>
					<TbArrowBackUp />
				</Link>
			</div>
			<span className={"relative"}>
				<button onClick={() => openDropdown()} className={"w-12 aspect-square"} id={"profile-button"}>
					{avatar}
				</button>
				<div id={"dropdown"} className={"absolute top-13 right-0 bg-white rounded-md shadow-md w-48 h-auto flex flex-col gap-2 p-2 opacity-0 invisible transition-opacity duration-300"}>
					<button className={"w-full h-12 flex items-center justify-center rounded-md hover:bg-blue-950 hover:text-white transition-background"}>Profile</button>
					<button
						className={"w-full h-12 flex items-center justify-center rounded-md hover:bg-blue-950 hover:text-white transition-background"}
						onClick={() => {
							signOut().then();
							router.push("/").then();
						}}
					>
						Sign Out
					</button>
				</div>
			</span>
		</div>
	);
}
