import React, { useState, useEffect } from "react";
import { Modal, Box, TextField, Button } from "@mui/material";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import db from "../../firebase";

const EditSubjectModal = ({ open, handleClose, subjectId, fetchSubjects }) => {
  const [subjectName, setSubjectName] = useState("");
  const [course, setCourse] = useState("");

  useEffect(() => {
    const fetchSubject = async () => {
      if (subjectId) {
        const docRef = doc(db, "subjects", subjectId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSubjectName(data.name);
          setCourse(data.course);
        }
      }
    };
    fetchSubject();
  }, [subjectId]);

  const handleEditSubject = async () => {
    if (subjectName && course) {
      try {
        const docRef = doc(db, "subjects", subjectId);
        await updateDoc(docRef, {
          name: subjectName,
          course: course,
        });
        setSubjectName("");
        setCourse("");
        handleClose();
        fetchSubjects();
      } catch (error) {
        console.error("Error updating subject:", error);
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
        <h2>Edit Subject</h2>
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
        <Button variant="contained" onClick={handleEditSubject}>
          Save Changes
        </Button>
      </Box>
    </Modal>
  );
};

export default EditSubjectModal;
