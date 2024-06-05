import React, { useState, useEffect } from "react";
import { Modal, Box, TextField, Button, Typography, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { doc, updateDoc, getDoc, query, where, getDocs, collection } from "firebase/firestore";
import { styled } from "@mui/system";
import { useSnackbar } from 'notistack';
import db from "../../firebase";

// Custom styles
const StyledBox = styled(Box)(({ theme }) => ({
  width: 400,
  bgcolor: "rgba(255, 255, 255, 0.15)", // Semi-transparent background
  boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.3)",
  p: 4,
  borderRadius: "15px",
  backdropFilter: "blur(10px)", // Blur background
  animation: "fadeIn 0.5s", // Fade-in animation
  position: "relative" // Ensure the close button is correctly positioned
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    borderRadius: "10px",
    backgroundColor: "rgb(15, 21, 53) !important",
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
    color: "#ffffff", // Black label color
    fontWeight: "bold", // Bold text
    fontSize: "0.9rem", // Smaller text size
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#007BFF", // Blue label color when focused
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

const EditSubjectModal = ({ open, handleClose, subjectId, fetchSubjects }) => {
  const [subjectName, setSubjectName] = useState("");
  const [course, setCourse] = useState("");
  const { enqueueSnackbar } = useSnackbar();

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
        // Check if a subject with the same name and course already exists
        const q = query(
          collection(db, "subjects"),
          where("name", "==", subjectName),
          where("course", "==", course)
        );
        const querySnapshot = await getDocs(q);

        // Check if there are any duplicates except the current subject
        const duplicate = querySnapshot.docs.find(doc => doc.id !== subjectId);

        if (duplicate) {
          enqueueSnackbar('Subject with the same name and course already exists!', {
            variant: 'warning',
            autoHideDuration: 5000,
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            }
          });
          return;
        }

        const docRef = doc(db, "subjects", subjectId);
        await updateDoc(docRef, {
          name: subjectName,
          course: course,
        });

        setSubjectName("");
        setCourse("");
        handleClose();
        fetchSubjects();

        enqueueSnackbar('Subject updated successfully!', {
          variant: 'success',
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          }
        });
      } catch (error) {
        console.error("Error updating subject:", error);
        enqueueSnackbar('Error updating subject', {
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
          backgroundColor: "rgba(0, 0, 0, 0.7)", // Dark background when modal is open
        },
      }}
    >
      <StyledBox>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h5" align="center" gutterBottom color="white">
          Edit Subject
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
        <StyledButton variant="contained" onClick={handleEditSubject} fullWidth>
          Save Changes
        </StyledButton>
      </StyledBox>
    </Modal>
  );
};

export default EditSubjectModal;
