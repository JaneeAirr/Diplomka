import React, { useState, useEffect } from "react";
import { Modal, Box, TextField, Button, MenuItem, Typography, styled } from "@mui/material";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { useSnackbar } from 'notistack';
import db from "../../firebase";

const StyledBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "rgba(255, 255, 255, 0.15)", // Semi-transparent background
  boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.3)",
  p: 4,
  borderRadius: "15px",
  backdropFilter: "blur(10px)", // Blur background
  animation: "fadeIn 0.5s", // Fade-in animation
  "@keyframes fadeIn": {
    "0%": { opacity: 0 },
    "100%": { opacity: 1 },
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    borderRadius: "10px",
    backgroundColor: "rgb(15, 21, 53) !important",
    color: "#000",
    "& input[type=number]": {
      // Hide the increment and decrement arrows
      "-moz-appearance": "textfield",
      "-webkit-appearance": "none",
      appearance: "none",
      "&::-webkit-outer-spin-button": {
        "-webkit-appearance": "none",
        margin: 0,
      },
      "&::-webkit-inner-spin-button": {
        "-webkit-appearance": "none",
        margin: 0,
      },
    },
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

const AddGroupModal = ({ open, handleClose, fetchGroups }) => {
  const [groupName, setGroupName] = useState("");
  const [groupSize, setGroupSize] = useState("");
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchCourses = async () => {
      const coursesSnapshot = await getDocs(collection(db, "courses"));
      const coursesList = coursesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCourses(coursesList);
    };

    fetchCourses();
  }, []);

  const handleAddGroup = async () => {
    if (groupName && groupSize > 0 && selectedCourse) {
      const q = query(
        collection(db, "groups"),
        where("name", "==", groupName),
        where("course", "==", selectedCourse)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        enqueueSnackbar("A group with this name and course already exists.", {
          variant: "warning",
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          }
        });
        return;
      }

      await addDoc(collection(db, "groups"), {
        name: groupName,
        size: groupSize,
        course: selectedCourse,
        students: [],
      });

      setGroupName("");
      setGroupSize("");
      setSelectedCourse("");
      handleClose();
      fetchGroups();

      enqueueSnackbar("Group added successfully!", {
        variant: "success",
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        }
      });
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <StyledBox>
        <Typography variant="h5" align="center" gutterBottom color="white">
          Add Group
        </Typography>
        <StyledTextField
          fullWidth
          label="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          margin="normal"
          variant="outlined"
        />
        <StyledTextField
          fullWidth
          label="Group Size"
          type="number"
          value={groupSize}
          onChange={(e) => setGroupSize(Number(e.target.value))}
          margin="normal"
          variant="outlined"
          inputProps={{ min: 1 }} // Ensuring that the value is always greater than 0
        />
        <StyledTextField
          fullWidth
          label="Course"
          type="number"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          margin="normal"
          variant="outlined"
          inputProps={{ min: 1 }} // Ensuring that the value is always greater than 0
        />
        <StyledButton variant="contained" onClick={handleAddGroup} fullWidth>
          Add Group
        </StyledButton>
      </StyledBox>
    </Modal>
  );
};

export default AddGroupModal;
