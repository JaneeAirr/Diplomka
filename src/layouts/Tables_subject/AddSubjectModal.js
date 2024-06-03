import React, { useState } from "react";
import { Modal, Box, TextField, Button } from "@mui/material";
import { collection, addDoc } from "firebase/firestore";
import db from "../../firebase";

const AddSubjectModal = ({ open, handleClose, fetchSubjects }) => {
  const [subjectName, setSubjectName] = useState("");
  const [course, setCourse] = useState("");

  const handleAddSubject = async () => {
    if (subjectName && course) {
      try {
        await addDoc(collection(db, "subjects"), {
          name: subjectName,
          course: course,
        });
        setSubjectName("");
        setCourse("");
        handleClose();
        fetchSubjects();
      } catch (error) {
        console.error("Error adding subject:", error);
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
        <h2>Add Subject</h2>
        <TextField
          fullWidth
          label="Subject Name"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Course"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          margin="normal"
        />
        <Button variant="contained" onClick={handleAddSubject}>
          Add Subject
        </Button>
      </Box>
    </Modal>
  );
};

export default AddSubjectModal;
