import React, { useState, useEffect } from "react";
import { Modal, Box, Button, List, ListItem, ListItemText, IconButton, Typography, styled } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { useSnackbar } from 'notistack';
import db from "../../firebase";
import { saveAs } from "file-saver";

const StyledBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "rgba(255, 255, 255, 0.15)",
  boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.3)",
  p: 4,
  borderRadius: "15px",
  backdropFilter: "blur(10px)",
  animation: "fadeIn 0.5s",
  "@keyframes fadeIn": {
    "0%": { opacity: 0 },
    "100%": { opacity: 1 },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#007BFF",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#0056b3",
  },
  marginTop: theme.spacing(2),
  padding: theme.spacing(1.5),
  borderRadius: "10px",
  fontSize: "1rem",
  width: "100%",
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: "white",
}));

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  color: "rgba(255, 255, 255, 0.85)",
}));

const ShowGroupModal = ({ open, handleClose, groupId, groupName }) => {
  const [students, setStudents] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchStudents = async () => {
      if (groupId) {
        const groupRef = doc(db, "groups", groupId);
        const groupDoc = await getDoc(groupRef);
        const groupData = groupDoc.data();

        if (groupData && groupData.students) {
          const studentsPromises = groupData.students.map(studentId => getDoc(doc(db, "users", studentId)));
          const studentsDocs = await Promise.all(studentsPromises);
          const studentsList = studentsDocs.map(doc => ({ id: doc.id, ...doc.data() }));
          setStudents(studentsList);
        }
      }
    };

    fetchStudents();
  }, [groupId]);

  const handleRemoveStudent = async (studentId) => {
    try {
      const groupRef = doc(db, "groups", groupId);
      await updateDoc(groupRef, {
        students: arrayRemove(studentId),
      });

      const studentRef = doc(db, "users", studentId);
      await updateDoc(studentRef, {
        group: null,
      });

      setStudents(students.filter((student) => student.id !== studentId));
      enqueueSnackbar("Student removed successfully!", {
        variant: "success",
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        }
      });
    } catch (error) {
      console.error("Error removing student from group:", error);
      enqueueSnackbar("Error removing student from group.", {
        variant: "error",
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        }
      });
    }
  };

  const exportToCSV = () => {
    const csvRows = [];
    const headers = ["Group Name", "Student Name", "Total Students", "Completion"];
    csvRows.push(headers.join(","));

    students.forEach(student => {
      const values = [groupName, student.name, students.length, `${(students.length / 10) * 100}%`];
      csvRows.push(values.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'group_details.csv');
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <StyledBox>
        <StyledTypography variant="h5" align="center" gutterBottom>
          Students in {groupName}
        </StyledTypography>
        <List>
          {students.map((student) => (
            <ListItem
              key={student.id}
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveStudent(student.id)}>
                  <DeleteIcon sx={{ color: 'red' }} />
                </IconButton>
              }
              sx={{
                borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '8px 0',
              }}
            >
              <StyledListItemText primary={student.name} />
            </ListItem>
          ))}
        </List>
        <StyledButton variant="contained" onClick={exportToCSV}>
          Export CSV
        </StyledButton>
        <StyledButton variant="contained" onClick={handleClose}>
          Close
        </StyledButton>
      </StyledBox>
    </Modal>
  );
};

export default ShowGroupModal;
