import { useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

type Props = {
  monthlySales: number[];
  monthlyRevenue: number[];
};

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export default function StatisticsChart({
  monthlySales,
  monthlyRevenue,
}: Props) {
  const [selected, setSelected] = useState<"monthly" | "quarterly" | "annually">("monthly");
  const [selectedMonth, setSelectedMonth] = useState<string>("Jan");

  const getButtonClass = (
    option:"monthly" | "quarterly" | "annually"
  ) =>
    selected === option
      ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
      : "text-gray-500 dark:text-gray-400";

  const getSeriesData = () => {
    switch (selected) {
      case "quarterly":
        return [
          {
            name: "Sales",
            data: [
              monthlySales.slice(0, 3).reduce((a, b) => a + b, 0),
              monthlySales.slice(3, 6).reduce((a, b) => a + b, 0),
              monthlySales.slice(6, 9).reduce((a, b) => a + b, 0),
              monthlySales.slice(9, 12).reduce((a, b) => a + b, 0),
            ],
          },
          {
            name: "Revenue",
            data: [
              monthlyRevenue.slice(0, 3).reduce((a, b) => a + b, 0),
              monthlyRevenue.slice(3, 6).reduce((a, b) => a + b, 0),
              monthlyRevenue.slice(6, 9).reduce((a, b) => a + b, 0),
              monthlyRevenue.slice(9, 12).reduce((a, b) => a + b, 0),
            ],
          },
        ];
      case "annually":
        return [
          {
            name: "Sales",
            data: [monthlySales.reduce((a, b) => a + b, 0)],
          },
          {
            name: "Revenue",
            data: [monthlyRevenue.reduce((a, b) => a + b, 0)],
          },
        ];
      case "monthly":
      default:
        return [
          { name: "Sales", data: monthlySales },
          { name: "Revenue", data: monthlyRevenue },
        ];
    }
  };

  const getCategories = () => {
    if (selected === "quarterly") return ["T1", "T2", "T3", "T4"];
    if (selected === "annually") return ["Total"];
    return MONTHS;
  };

  const options: ApexOptions = {
    legend: { show: false, position: "top", horizontalAlign: "left" },
    colors: ["#465FFF", "#9CB9FF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line",
      toolbar: { show: false },
    },
    stroke: { curve: "straight", width: [2, 2] },
    fill: {
      type: "gradient",
      gradient: { opacityFrom: 0.55, opacityTo: 0 },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: { size: 6 },
    },
    grid: {
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    dataLabels: { enabled: false },
    tooltip: { enabled: true },
    xaxis: {
      type: "category",
      categories: getCategories(),
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false },
    },
    yaxis: {
      labels: {
        style: { fontSize: "12px", colors: ["#6B7280"] },
      },
      title: { text: "", style: { fontSize: "0px" } },
    },
  };

  const series = getSeriesData();

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Statistiques
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Objectifs{" "}
            {{
              monthly: "mensuels",
              quarterly: "trimestriels",
              annually: "annuels",
            }[selected]}{" "}
            atteints
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <button
            onClick={() => setSelected("monthly")}
            className={`px-3 py-2 font-medium rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(
              "monthly"
            )}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setSelected("quarterly")}
            className={`px-3 py-2 font-medium rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(
              "quarterly"
            )}`}
          >
            Quarterly
          </button>
          <button
            onClick={() => setSelected("annually")}
            className={`px-3 py-2 font-medium rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(
              "annually"
            )}`}
          >
            Annually
          </button>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <Chart options={options} series={series} type="area" height={310} />
        </div>
      </div>
    </div>
  );
}
