import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import db from "../../firebase";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Modal, Box } from "@mui/material";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import StudentTable from "./StudentTable";

const GroupTable = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    const fetchGroups = async (course) => {
      if (course) {
        const groupsCollection = collection(db, "groups");
        const q = query(groupsCollection, where("course", "==", course));
        const groupsSnapshot = await getDocs(q);
        const groupsList = groupsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setGroups(groupsList);
      }
    };

    const fetchTeacherData = async () => {
      const userEmail = localStorage.getItem("userEmail");
      if (userEmail) {
        const usersCollection = collection(db, "users");
        const q = query(usersCollection, where("email", "==", userEmail));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          const course = userData.course;
          fetchGroups(course);
        } else {
          console.error("No user found with the provided email.");
        }
      } else {
        console.error("No user email found in localStorage.");
      }
    };

    fetchTeacherData();
  }, []);

  const handleOpen = (groupId) => setSelectedGroup(groupId);
  const handleClose = () => setSelectedGroup(null);

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };

  return (
    <VuiBox>
      <VuiTypography variant="h4" color="white" fontWeight="bold" mb={3}>
        Groups
      </VuiTypography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Group Name</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groups.map((group) => (
              <TableRow key={group.id}>
                <TableCell>{group.name}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleOpen(group.id)}>
                    Add Grades
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {selectedGroup && (
        <Modal open={true} onClose={handleClose}>
          <Box sx={modalStyle}>
            <StudentTable groupId={selectedGroup} onClose={handleClose} />
          </Box>
        </Modal>
      )}
    </VuiBox>
  );
};

export default GroupTable;
