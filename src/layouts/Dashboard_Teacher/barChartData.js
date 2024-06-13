// layouts/Dashboard_Teacher/data/barChartData.js

export const barChartDataDashboard = [
  {
    label: "Sales",
    data: [30, 40, 45, 50, 49, 60, 70],
  },
];

export const barChartOptionsDashboard = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Chart.js Bar Chart",
    },
  },
};
