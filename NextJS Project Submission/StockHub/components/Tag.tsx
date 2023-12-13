export default function Tag({ tag }: { tag: string }) {
	return (
		<div className={"flex items-center bg-blue-800 text-white px-4 py-1 rounded-md shadow-inner hover:bg-blue-900 transition-background"}>
			<p className={"text-sm font-medium cursor-default"}>{tag}</p>
		</div>
	);
}
