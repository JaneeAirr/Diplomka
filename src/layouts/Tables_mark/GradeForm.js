import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import db from "../../firebase";
import { Button, Box, Modal, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

const GradeForm = ({ studentId, onClose }) => {
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState("");
  const [grade, setGrade] = useState("");

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const now = new Date(); // Current date
        console.log("Current date:", now);

        const lessonsCollection = collection(db, "classes");
        const lessonsSnapshot = await getDocs(lessonsCollection);

        const lessonsList = lessonsSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(lesson => new Date(lesson.endTime) <= now);

        setLessons(lessonsList);
        console.log("Fetched lessons:", lessonsList); // Log the fetched lessons
      } catch (error) {
        console.error("Error fetching lessons:", error);
      }
    };

    fetchLessons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "grades"), {
      studentId,
      lessonId: selectedLesson,
      grade,
      date: new Date().toISOString()
    });

    onClose();
  };

  return (
    <Modal open onClose={onClose}>
      <Box sx={{ ...modalStyle }}>
        <VuiTypography variant="h6" color="textPrimary" mb={3}>
          Add Grade
        </VuiTypography>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="lesson-label">Lesson</InputLabel>
            <Select
              labelId="lesson-label"
              value={selectedLesson}
              onChange={(e) => setSelectedLesson(e.target.value)}
            >
              {lessons.length > 0 ? (
                lessons.map((lesson) => (
                  <MenuItem key={lesson.id} value={lesson.id}>
                    {lesson.subject} - {new Date(lesson.startTime).toLocaleString()}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No lessons found</MenuItem>
              )}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Grade (%)"
            type="number"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Submit
          </Button>
        </form>
      </Box>
    </Modal>
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

export default GradeForm;
