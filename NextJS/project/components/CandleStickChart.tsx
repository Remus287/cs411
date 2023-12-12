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
		xaxis: {
			type: "datetime" as const,
			labels: {
				style: {
					colors: "#ffffff",
				},
			},
		},
		yaxis: {
			tooltip: {
				enabled: true,
			},
			labels: {
				style: {
					colors: "#ffffff",
				},
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
	return <Chart type={"candlestick"} options={options} series={series} height={"100%"} />;
}
