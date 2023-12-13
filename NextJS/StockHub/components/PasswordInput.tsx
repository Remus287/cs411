export default function PasswordInput({ strength, label, ...props }) {
	return (
		<label className={"w-full flex flex-col gap-1"}>
			<label className={"text-gray-700 text-lg pl-2"}>{label}</label>
			<span>
				<p className={"text-gray-700 text-sm pl-2"}>Password Strength</p>
				<div className={"w-full h-1"}>
					<div className={"w-full h-full bg-red-500"} style={{ width: `${strength * 25}%` }} />
				</div>
				<input type={"password"} className={"px-4 py-2 bg-white/[.9] outline outline-1 outline-gray-300 w-full"} {...props} />
			</span>
		</label>
	);
}
