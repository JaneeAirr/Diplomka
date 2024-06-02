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

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";

// Vision UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// Billing page components
import Transactions from "layouts/TableSheildu/components/Transactions";

function Billing() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox mt={4}>
        <VuiBox my={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Transactions />
            </Grid>
          </Grid>
        </VuiBox>
      </VuiBox>
    </DashboardLayout>
  );
}

export default Billing;
