import React, { useState, useEffect } from "react";
import { Modal, Box, Button, Typography, styled, TextField, MenuItem } from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import { collection, getDocs, updateDoc, doc, query, where, arrayUnion, getDoc } from "firebase/firestore";
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

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: "10px",
    backgroundColor: "rgb(15, 21, 53) !important",
    color: "#fff",
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: "rgba(255, 255, 255, 0.5)",
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: "#fff",
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: "#fff",
    },
    '& .MuiInputLabel-root': {
      color: "#fff",
      fontWeight: "bold",
      fontSize: "0.9rem",
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: "#007BFF",
    },
    '& .MuiSelect-icon': {
      color: "#fff",
    },
  },
  '& .MuiAutocomplete-endAdornment': {
    '& .MuiAutocomplete-popupIndicator': {
      color: "#fff",
    },
  },
  '& .MuiInputBase-input': {
    textAlign: 'center',
    fontSize: '0.8rem',
  }
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  backgroundColor: "rgb(0, 117, 255) !important",
  color: "#fff",
  '& .MuiChip-deleteIcon': {
    color: "#fff",
  },
}));

const AddStudentToGroupModal = ({ open, handleClose, fetchGroups, groupId }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [groupSize, setGroupSize] = useState(0);
  const [currentStudentCount, setCurrentStudentCount] = useState(0);
  const { enqueueSnackbar } = useSnackbar();

  const fetchGroupDetails = async () => {
    try {
      const groupDoc = await getDoc(doc(db, "groups", groupId));
      if (groupDoc.exists()) {
        const groupData = groupDoc.data();
        setGroupSize(groupData.size);
        setCurrentStudentCount(groupData.students.length);
      }
    } catch (error) {
      console.error("Error fetching group details:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const q = query(collection(db, "users"), where("role", "==", "student"));
      const querySnapshot = await getDocs(q);
      const studentsList = querySnapshot.docs
        .map((doc) => ({ id: doc.id, name: doc.data().name, group: doc.data().group })) // assuming the student's name is stored in `name` field
        .filter((student) => !student.group); // Filter students with no group

      setStudents(studentsList);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchStudents();
      fetchGroupDetails();
    }
  }, [open]);

  const handleAddStudents = async () => {
    const totalStudentsToAdd = currentStudentCount + selectedStudents.length;

    if (totalStudentsToAdd > groupSize) {
      enqueueSnackbar(`Cannot add students. Maximum group size is ${groupSize}.`, {
        variant: "warning",
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        }
      });
      return;
    }

    if (selectedStudents.length > 0) {
      try {
        const groupRef = doc(db, "groups", groupId);

        await Promise.all(
          selectedStudents.map(async (student) => {
            const studentRef = doc(db, "users", student.id);
            await updateDoc(studentRef, { group: groupId });
            await updateDoc(groupRef, { students: arrayUnion(student.id) });
          })
        );

        setSelectedStudents([]);
        handleClose();
        fetchGroups();

        enqueueSnackbar("Students added to group successfully!", {
          variant: "success",
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          }
        });
      } catch (error) {
        console.error("Error adding students to group:", error);
        enqueueSnackbar("Error adding students to group", {
          variant: "error",
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
    <Modal open={open} onClose={handleClose}>
      <StyledBox>
        <Typography variant="h5" align="center" gutterBottom color="white">
          Add Students to Group
        </Typography>
        <StyledAutocomplete
          multiple
          options={students}
          getOptionLabel={(option) => option.name}
          value={selectedStudents}
          onChange={(event, newValue) => setSelectedStudents(newValue)}
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => (
              <StyledChip label={option.name} {...getTagProps({ index })} />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Students"
              variant="outlined"
              sx={{
                backgroundColor: 'rgb(15, 21, 53) !important',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#fff',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#fff',
                },
                '& .MuiInputLabel-root': {
                  color: '#fff',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#007BFF',
                },
                '& .MuiSelect-icon': {
                  color: '#fff',
                },
              }}
            />
          )}
        />
        <StyledButton variant="contained" onClick={handleAddStudents} fullWidth>
          Add Students
        </StyledButton>
      </StyledBox>
    </Modal>
  );
};

export default AddStudentToGroupModal;
