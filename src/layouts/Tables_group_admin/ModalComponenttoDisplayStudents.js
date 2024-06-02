import React, { useState, useEffect } from "react";
import { Modal, Box, Button, List, ListItem, ListItemText, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import db from "../../firebase";

const ShowGroupModal = ({ open, handleClose, groupId, groupName }) => {
  const [students, setStudents] = useState([]);

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
    } catch (error) {
      console.error("Error removing student from group:", error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <h2>Students in {groupName}</h2>
        <List>
          {students.map((student) => (
            <ListItem
              key={student.id}
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveStudent(student.id)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={student.name} />
            </ListItem>
          ))}
        </List>
        <Button variant="contained" onClick={handleClose}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default ShowGroupModal;
