/*!

=========================================================
* Vision UI Free React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vision-ui-free-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)
* Licensed under MIT (https://github.com/creativetimofficial/vision-ui-free-react/blob/master LICENSE.md)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// @mui material components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import { Card, LinearProgress, Stack } from "@mui/material";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiProgress from "components/VuiProgress";

// Vision UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
import linearGradient from "assets/theme/functions/linearGradient";

// Vision UI Dashboard React base styles
import typography from "assets/theme/base/typography";
import colors from "assets/theme/base/colors";

// Dashboard layout components
import WelcomeMark from "layouts/dashboard/components/WelcomeMark";
import Projects from "layouts/dashboard/components/Projects";
import OrderOverview from "layouts/dashboard/components/OrderOverview";
import SatisfactionRate from "layouts/dashboard/components/SatisfactionRate";
import ReferralTracking from "layouts/dashboard/components/ReferralTracking";

// React icons
import { IoIosRocket } from "react-icons/io";
import { IoGlobe } from "react-icons/io5";
import { IoBuild } from "react-icons/io5";
import { IoWallet } from "react-icons/io5";
import { IoDocumentText } from "react-icons/io5";
import { FaShoppingCart } from "react-icons/fa";
import StudentIcon from "assets/icons/Student.png";
import TeacherIcon from "assets/icons/teacher.png";
import SubjectIcon from "assets/icons/Subject.png";
// Data
import LineChart from "examples/Charts/LineCharts/LineChart";
import BarChart from "examples/Charts/BarCharts/BarChart";
import { lineChartDataDashboard } from "layouts/dashboard/data/lineChartData";
import { lineChartOptionsDashboard } from "layouts/dashboard/data/lineChartOptions";
import { barChartDataDashboard } from "layouts/dashboard/data/barChartData";
import { barChartOptionsDashboard } from "layouts/dashboard/data/barChartOptions";

function Dashboard() {
  const { gradients } = colors;
  const { cardContent } = gradients;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <VuiBox py={3}>
        <VuiBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} xl={4}>
              <MiniStatisticsCard
                title={{ text: "Ученники", fontWeight: "regular" }}
                count="100"
                icon={{
                  color: "info",
                  component: <img src={StudentIcon} alt="Student Icon" style={{ width: "20px", height: "20px" }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={4} xl={4}>
              <MiniStatisticsCard
                title={{ text: "Учителя" }}
                count="2,300"
                icon={{
                  color: "info",
                  component: <img src={TeacherIcon} alt="Teacher Icon" style={{ width: "20px", height: "20px" }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={4} xl={4}>
              <MiniStatisticsCard
                title={{ text: "Количество предметов" }}
                count="50"
                icon={{
                  color: "info",
                  component: <img src={SubjectIcon} alt="Subject Icon" style={{ width: "20px", height: "20px" }} />,
                }}
              />
            </Grid>
          </Grid>
        </VuiBox>
      </VuiBox>
        <VuiBox py={3}>
          <VuiBox mb={3}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <WelcomeMark />
              </Grid>
            </Grid>
          </VuiBox>
        </VuiBox>
      </VuiBox>
    </DashboardLayout>
  );
}

export default Dashboard;
