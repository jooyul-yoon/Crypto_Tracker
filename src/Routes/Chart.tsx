import { useQuery } from "react-query";
import { fetchCoinHistory } from "../api";
import ApexChart from "react-apexcharts";

interface ChartProps {
  coinId: string;
}

interface IHistorical {
  time_open: string;
  time_close: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  market_cap: number;
}

function Chart({ coinId }: ChartProps) {
  const { isLoading, data } = useQuery<IHistorical[]>("ohlcv", () =>
    fetchCoinHistory(coinId)
  );
  return (
    <div>
      {isLoading ? (
        "Loading chart..."
      ) : (
        <ApexChart
          type="line"
          series={[{ name: "price", data: data?.map((price) => price.close) }]}
          options={{
            theme: { mode: "dark" },
            chart: {
              width: 500,
              height: 500,
              toolbar: { show: false },
              background: "transparent",
            },
            stroke: { curve: "smooth", width: 3 },
            yaxis: { labels: { show: false } },
            xaxis: {
              type: "datetime",
              axisBorder: { show: false },
              labels: { show: false },
              axisTicks: { show: false },
              categories: data?.map((price) => price.time_close),
            },
            grid: { show: false },
            fill: {
              type: "gradient",
              gradient: { gradientToColors: ["#badc58"], stops: [0, 100] },
            },
            colors: ["#ffbe76"],
            tooltip: {
              y: {
                formatter: (value) => `$${Math.round(value).toLocaleString()}`,
              },
            },
          }}
        />
      )}
    </div>
  );
}

export default Chart;
