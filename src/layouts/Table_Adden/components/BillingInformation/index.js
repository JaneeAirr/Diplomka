import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import db from "../../../../firebase";
import { Card, Modal, Box, Button, List, ListItem, ListItemText, IconButton } from "@mui/material";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import AddIcon from "@mui/icons-material/Add";
import AttendanceForm from "./AttendanceForm"; // Import the attendance form component

function BillingInformation() {
  const [groups, setGroups] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      const groupsCollection = collection(db, "groups");
      const groupsSnapshot = await getDocs(groupsCollection);
      const groupsList = groupsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setGroups(groupsList);
    };

    fetchGroups();
  }, []);

  const handleOpen = (group) => {
    setCurrentGroup(group);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentGroup(null);
  };

  return (
    <Card id="groups-card" sx={{ height: "100%", width: "100%" }}>
      <VuiBox mb="28px" display="flex" justifyContent="space-between" alignItems="center">
        <VuiTypography variant="h6" fontWeight="medium" color="white">
          Groups
        </VuiTypography>
      </VuiBox>
      <VuiBox>
        <List>
          {groups.map((group) => (
            <ListItem key={group.id} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <ListItemText primary={group.name} sx={{ color: "white" }} />
              <IconButton edge="end" aria-label="add" onClick={() => handleOpen(group)}>
                <AddIcon sx={{ color: "white" }} />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </VuiBox>
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          {currentGroup && <AttendanceForm groupId={currentGroup.id} onClose={handleClose} />}
        </Box>
      </Modal>
    </Card>
  );
}

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

export default BillingInformation;
