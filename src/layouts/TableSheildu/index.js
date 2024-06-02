import React, { useState, useEffect } from "react";
import { Grid, Modal, Box } from "@mui/material";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ScheduleForm from "./ScheduleForm";
import ScheduleTable from "./components/Transactions";
import VuiButton from "components/VuiButton";

const SchedulePage = () => {
  const [userEmail, setUserEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentClass, setCurrentClass] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) {
      setUserEmail(email);
    }
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setCurrentClass(null);
  };

  const handleEdit = (classItem) => {
    setCurrentClass(classItem);
    setEditMode(true);
    setOpen(true);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox mt={4}>
        <VuiBox mb={1.5}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <ScheduleTable userEmail={userEmail} onEdit={handleEdit} />
            </Grid>
          </Grid>
        </VuiBox>
        <VuiBox mb={3}>
          <VuiButton variant="contained" color="primary" onClick={handleOpen}>
            Add Schedule
          </VuiButton>
          <Modal open={open} onClose={handleClose}>
            <Box sx={{ ...modalStyle }}>
              <ScheduleForm
                userEmail={userEmail}
                editMode={editMode}
                currentClass={currentClass}
                onClose={handleClose}
              />
            </Box>
          </Modal>
        </VuiBox>
      </VuiBox>
    </DashboardLayout>
  );
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default SchedulePage;
