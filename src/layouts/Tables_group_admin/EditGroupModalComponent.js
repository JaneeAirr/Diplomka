import React, { useState, useEffect } from "react";
import { Modal, Box, TextField, Button, Typography, styled } from "@mui/material";
import { doc, updateDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { useSnackbar } from 'notistack';
import db from "../../firebase";

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

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    borderRadius: "10px",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
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
    color: "#000",
    fontWeight: "bold",
    fontSize: "0.9rem",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#007BFF",
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

const EditGroupModal = ({ open, handleClose, fetchGroups, groupId }) => {
  const [groupName, setGroupName] = useState("");
  const [groupSize, setGroupSize] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [currentStudentCount, setCurrentStudentCount] = useState(0);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchGroupDetails = async () => {
      const groupDoc = await getDoc(doc(db, "groups", groupId));
      if (groupDoc.exists()) {
        const groupData = groupDoc.data();
        setGroupName(groupData.name);
        setGroupSize(groupData.size);
        setSelectedCourse(groupData.course);
        setCurrentStudentCount(groupData.students.length);
      }
    };

    if (open) {
      fetchGroupDetails();
    }
  }, [open, groupId]);

  const handleEditGroup = async () => {
    if (groupName && groupSize > 0 && selectedCourse) {
      if (groupSize < currentStudentCount) {
        enqueueSnackbar(`Cannot set size to ${groupSize}. The group already has ${currentStudentCount} students.`, {
          variant: "warning",
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          }
        });
        return;
      }

      await updateDoc(doc(db, "groups", groupId), {
        name: groupName,
        size: groupSize,
        course: selectedCourse,
      });

      setGroupName("");
      setGroupSize(0);
      setSelectedCourse("");
      handleClose();
      fetchGroups();

      enqueueSnackbar("Group updated successfully!", {
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
          Edit Group
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
        />
        <StyledTextField
          fullWidth
          label="Course"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          margin="normal"
          variant="outlined"
        />
        <StyledButton variant="contained" onClick={handleEditGroup} fullWidth>
          Save Changes
        </StyledButton>
      </StyledBox>
    </Modal>
  );
};

export default EditGroupModal;
