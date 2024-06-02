import React, { useState } from "react";
import { Modal, Box, TextField, Button } from "@mui/material";
import { collection, addDoc } from "firebase/firestore";
import db from "../../firebase";

const AddGroupModal = ({ open, handleClose, fetchGroups }) => {
  const [groupName, setGroupName] = useState("");
  const [groupSize, setGroupSize] = useState(0);

  const handleAddGroup = async () => {
    if (groupName && groupSize > 0) {
      await addDoc(collection(db, "groups"), {
        name: groupName,
        size: groupSize,
        students: [],
      });
      setGroupName("");
      setGroupSize(0);
      handleClose();
      fetchGroups();
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
        <h2>Add Group</h2>
        <TextField
          fullWidth
          label="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Group Size"
          type="number"
          value={groupSize}
          onChange={(e) => setGroupSize(Number(e.target.value))}
          margin="normal"
        />
        <Button variant="contained" onClick={handleAddGroup}>
          Add Group
        </Button>
      </Box>
    </Modal>
  );
};

export default AddGroupModal;
