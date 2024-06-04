import React, { useState } from "react";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { styled } from "@mui/system";
import { useSnackbar } from 'notistack';
import db from "../../firebase";

// Custom styles
const StyledBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "rgba(255, 255, 255, 0.15)", // Полупрозрачный фон
  boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.3)",
  p: 4,
  borderRadius: "15px",
  backdropFilter: "blur(10px)", // Размытие фона
  animation: "fadeIn 0.5s", // Анимация появления
  "@keyframes fadeIn": {
    "0%": { opacity: 0 },
    "100%": { opacity: 1 },
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    borderRadius: "10px",
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Полупрозрачный фон инпута
    color: "#000",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#fff",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#fff",
  },
  "& .MuiInputLabel-root": {
    color: "#000", // Черный цвет label
    fontWeight: "bold", // Жирный текст
    fontSize: "0.9rem", // Уменьшенный размер текста
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#007BFF", // Черный цвет при фокусе
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
}));

const AddSubjectModal = ({ open, handleClose, fetchSubjects }) => {
  const [subjectName, setSubjectName] = useState("");
  const [course, setCourse] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const handleAddSubject = async () => {
    if (subjectName && course) {
      try {
        // Check if a subject with the same name and course already exists
        const q = query(
          collection(db, "subjects"),
          where("name", "==", subjectName),
          where("course", "==", course)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Subject with the same name and course already exists
          enqueueSnackbar('Subject with the same name and course already exists!', {
            variant: 'error',
            autoHideDuration: 5000,
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            }
          });
          return;
        }

        // Add new subject
        await addDoc(collection(db, "subjects"), {
          name: subjectName,
          course: course,
        });
        setSubjectName("");
        setCourse("");
        handleClose();
        fetchSubjects();
        enqueueSnackbar('Subject added successfully!', {
          variant: 'success',
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          }
        });
      } catch (error) {
        console.error("Error adding subject:", error);
        enqueueSnackbar('Error adding subject', {
          variant: 'error',
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          }
        });
      }
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "& .MuiBackdrop-root": {
          backgroundColor: "rgba(0, 0, 0, 0.7)", // Темный фон при открытии модального окна
        },
      }}
    >
      <StyledBox>
        <Typography variant="h5" align="center" gutterBottom color="white">
          Add Subject
        </Typography>
        <StyledTextField
          fullWidth
          label="Subject Name"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          margin="normal"
          variant="outlined"
        />
        <StyledTextField
          fullWidth
          label="Course"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          margin="normal"
          variant="outlined"
        />
        <StyledButton variant="contained" onClick={handleAddSubject} fullWidth>
          Add Subject
        </StyledButton>
      </StyledBox>
    </Modal>
  );
};

export default AddSubjectModal;
