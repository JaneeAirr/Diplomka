import React, { useState, useEffect } from "react";
import { Modal, Box, TextField, Button, MenuItem } from "@mui/material";
import { collection, getDocs, updateDoc, doc, query, where, arrayUnion } from "firebase/firestore";
import db from "../../firebase";

const AddStudentToGroupModal = ({ open, handleClose, fetchGroups, groupId }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const q = query(collection(db, "users"), where("role", "==", "student"));
        const querySnapshot = await getDocs(q);
        const studentsList = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((student) => !student.group); // Filter students with no group

        console.log("Fetched students:", studentsList); // Debugging log
        setStudents(studentsList);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  const handleAddStudent = async () => {
    if (selectedStudent) {
      try {
        const studentRef = doc(db, "users", selectedStudent);
        await updateDoc(studentRef, { group: groupId });

        const groupRef = doc(db, "groups", groupId);
        await updateDoc(groupRef, { students: arrayUnion(selectedStudent) });

        setSelectedStudent("");
        handleClose();
        fetchGroups();
      } catch (error) {
        console.error("Error adding student to group:", error);
      }
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
        <h2>Add Student to Group</h2>
        <TextField
          select
          fullWidth
          label="Select Student"
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          margin="normal"
          variant="outlined"
          sx={{
            backgroundColor: 'white',
            borderColor: 'black',
            '& .MuiSelect-icon': {
              color: 'black',
            },
            '& .MuiInputLabel-root': {
              color: 'black',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'black',
            },
          }}
        >
          {students.length === 0 && (
            <MenuItem disabled>No students available</MenuItem>
          )}
          {students.map((student) => (
            <MenuItem key={student.id} value={student.id}>
              {student.name}
            </MenuItem>
          ))}
        </TextField>
        <Button variant="contained" onClick={handleAddStudent}>
          Add Student
        </Button>
      </Box>
    </Modal>
  );
};

export default AddStudentToGroupModal;
