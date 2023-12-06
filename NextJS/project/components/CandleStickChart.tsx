import dynamic from "next/dynamic";

type Data = {
	open: string;
	high: string;
	low: string;
	close: string;
	datetime: string;
};

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
export default function CandleStickChart({ data }: { data: Data[] }) {
	const options = {
		title: {
			text: "CandleStick Chart",
			align: "left" as const,
		},
		xaxis: {
			type: "datetime" as const,
		},
		yaxis: {
			tooltip: {
				enabled: true,
			},
		},
	};
	const series = [
		{
			data: data.map((value) => {
				return {
					x: new Date(value.datetime),
					y: [value.open, value.high, value.low, value.close],
				};
			}),
		},
	];
	return (
		<div className={"w-full h-full flex flex-col"}>
			<Chart type={"candlestick"} options={options} series={series} height={550} />
		</div>
	);
}
