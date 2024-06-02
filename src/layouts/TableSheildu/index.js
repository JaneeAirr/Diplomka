import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import VuiBox from "components/VuiBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ScheduleTable from "layouts/TableSheildu/components/Transactions";
import ScheduleForm from "./ScheduleForm";

import VuiButton from "components/VuiButton";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

function Billing({ userEmail }) {
  const [formOpen, setFormOpen] = useState(false);

  const handleOpenForm = () => {
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox mt={4}>
        <VuiBox my={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <ScheduleTable />
            </Grid>
            <Grid item xs={12}>
              <VuiButton variant="contained" color="info" onClick={handleOpenForm}>
                Add Schedule
              </VuiButton>
              <Dialog open={formOpen} onClose={handleCloseForm}>
                <DialogTitle>Add Schedule</DialogTitle>
                <DialogContent>
                  <ScheduleForm userEmail={userEmail} handleClose={handleCloseForm} />
                </DialogContent>
                <DialogActions>
                  <VuiButton onClick={handleCloseForm} color="info">
                    Cancel
                  </VuiButton>
                </DialogActions>
              </Dialog>
            </Grid>
          </Grid>
        </VuiBox>
      </VuiBox>
    </DashboardLayout>
  );
}

export default Billing;
