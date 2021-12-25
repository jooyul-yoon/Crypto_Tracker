import { useQuery } from "react-query";
import { fetchCoinHistory } from "../api";
import ApexChart from "react-apexcharts";
import Loader from "./Loader";
import { isDarkAtom } from "../atoms";
import { useRecoilValue } from "recoil";

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
  const isDark = useRecoilValue(isDarkAtom);
  const { isLoading, data } = useQuery<IHistorical[]>(
    "ohlcv",
    () => fetchCoinHistory(coinId),
    { refetchInterval: 5000 }
  );
  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <ApexChart
          type="candlestick"
          series={[
            {
              name: "Hello",
              data: data?.map((val) => [
                Date.parse(val.time_close),
                val.open.toFixed(0),
                val.high.toFixed(0),
                val.low.toFixed(0),
                val.close.toFixed(0),
              ]),
            },
          ]}
          options={{
            theme: { mode: isDark ? "dark" : "light" },
            chart: {
              width: 480,
              height: 200,
              toolbar: { show: false },
              background: "rgba(0, 0, 0, 0.6)",
            },
            title: { text: "Price over 30 days", align: "center" },
            yaxis: { labels: { show: true } },
            xaxis: {
              type: "datetime",
              axisBorder: { show: false },
              labels: { show: false },
              axisTicks: { show: false },
              categories: data?.map((price) => price.time_close),
            },
            grid: { show: false },
            fill: { colors: ["whitesmoke"] },
            tooltip: {
              enabled: true,
              y: {
                formatter: (value) => value.toLocaleString(),
              },
            },
            plotOptions: {
              candlestick: {
                colors: { upward: "#686de0", downward: "#ff7979" },
                wick: { useFillColor: true },
              },
            },
          }}
        />
      )}
    </div>
  );
}

export default Chart;
