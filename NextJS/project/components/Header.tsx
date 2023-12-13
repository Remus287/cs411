import ProfileButton from "@components/ProfileButton";
import StockHeader from "@components/StockHeader";

export default function Header({ image, name = "", meta, userEmail }: { image: string; name: string; meta?: Meta; userEmail?: string }) {
	if (!meta || !userEmail) {
		return (
			<div className={"flex items-center flex-row h-24 py-4 px-10 w-full justify-end flex-none"}>
				<ProfileButton image={image} name={name} />
			</div>
		);
	}
	return (
		<div className={"flex items-center flex-row h-24 py-4 px-10 w-full float-right justify-end"}>
			<StockHeader userEmail={userEmail} meta={meta} />
			<ProfileButton image={image} name={name} />
		</div>
	);
}
