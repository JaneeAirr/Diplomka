import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, addDoc, updateDoc, doc } from "firebase/firestore";
import { Modal, Box, Button, Typography, styled, TextField, MenuItem, FormControl, InputLabel, Select } from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import db from "../../firebase";
import { useSnackbar } from 'notistack';

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

const StyledFormControl = styled(FormControl)(({ theme }) => ({
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
  },
  marginBottom: theme.spacing(2),
}));

const StyledSelect = styled(Select)(({ theme }) => ({
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
      right: "10px",
    },
    '& .MuiSelect-select': {
      display: 'flex',
      justifyContent: 'space-between',
    }
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
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
  },
  marginBottom: theme.spacing(2),
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

const ScheduleForm = ({ userEmail, editMode, currentClass, onClose }) => {
  const [groups, setGroups] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(currentClass ? currentClass.subject : "");
  const [selectedGroup, setSelectedGroup] = useState(currentClass ? currentClass.groupId : "");
  const [selectedRoom, setSelectedRoom] = useState(currentClass ? currentClass.roomId : "");
  const [startTime, setStartTime] = useState(currentClass ? currentClass.startTime : "");
  const [endTime, setEndTime] = useState(currentClass ? currentClass.endTime : "");
  const [error, setError] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchGroups = async (course) => {
      if (course) {
        const groupsCollection = collection(db, "groups");
        const q = query(groupsCollection, where("course", "==", course));
        const groupsSnapshot = await getDocs(q);
        const groupsList = groupsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setGroups(groupsList);
      }
    };

    const fetchRooms = async () => {
      const roomsCollection = collection(db, "rooms");
      const roomsSnapshot = await getDocs(roomsCollection);
      const roomsList = roomsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRooms(roomsList);
    };

    const fetchTeacherSubjects = async () => {
      if (!userEmail) {
        console.error("User email is undefined");
        setError("User email is undefined");
        return;
      }

      const q = query(collection(db, "users"), where("email", "==", userEmail));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        const subjectsArray = Array.isArray(userData.subject) ? userData.subject : [userData.subject];
        setSubjects(subjectsArray);
        fetchGroups(userData.course);
      } else {
        console.error("No user found with the provided email.");
        setError("No user found with the provided email.");
      }
    };

    fetchRooms();
    fetchTeacherSubjects();
  }, [userEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSubject) {
      setError("Subject is required.");
      return;
    }

    const classesCollection = collection(db, "classes");
    const q = query(classesCollection, where("roomId", "==", selectedRoom));
    const querySnapshot = await getDocs(q);
    const conflictingClasses = querySnapshot.docs.filter(doc => {
      const classData = doc.data();
      return (
        (startTime >= classData.startTime && startTime < classData.endTime) ||
        (endTime > classData.startTime && endTime <= classData.endTime) ||
        (startTime <= classData.startTime && endTime >= classData.endTime)
      );
    });

    if (conflictingClasses.length > 0) {
      setError("This room is already booked during the selected time.");
      return;
    }

    try {
      if (editMode) {
        const classDoc = doc(db, "classes", currentClass.id);
        await updateDoc(classDoc, {
          groupId: selectedGroup,
          roomId: selectedRoom,
          subject: selectedSubject,
          startTime,
          endTime,
        });
      } else {
        await addDoc(classesCollection, {
          groupId: selectedGroup,
          roomId: selectedRoom,
          subject: selectedSubject,
          startTime,
          endTime,
          userEmail,
        });
      }
      setError("");
      enqueueSnackbar("Class scheduled successfully", { variant: "success" });
      onClose();
    } catch (error) {
      setError("Error scheduling class: " + error.message);
    }
  };

  return (
    <Modal open onClose={onClose}>
      <StyledBox component="form" onSubmit={handleSubmit}>
        <Typography variant="h5" align="center" gutterBottom color="white">
          {editMode ? "Update Class" : "Schedule Class"}
        </Typography>
        <StyledFormControl fullWidth>
          <InputLabel id="group-label">Group</InputLabel>
          <StyledSelect
            labelId="group-label"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            IconComponent={ArrowDropDownIcon}
          >
            {groups.map((group) => (
              <MenuItem key={group.id} value={group.id}>
                {group.name}
              </MenuItem>
            ))}
          </StyledSelect>
        </StyledFormControl>
        <StyledFormControl fullWidth>
          <InputLabel id="room-label">Room</InputLabel>
          <StyledSelect
            labelId="room-label"
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            IconComponent={ArrowDropDownIcon}
          >
            {rooms.map((room) => (
              <MenuItem key={room.id} value={room.id}>
                {room.name}
              </MenuItem>
            ))}
          </StyledSelect>
        </StyledFormControl>
        <StyledTextField
          type="datetime-local"
          label="Start Time"
          InputLabelProps={{
            shrink: true,
            style: { color: '#FFF' }
          }}
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          fullWidth
        />
        <StyledTextField
          type="datetime-local"
          label="End Time"
          InputLabelProps={{
            shrink: true,
            style: { color: '#FFF' }
          }}
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          fullWidth
        />
        <StyledFormControl fullWidth>
          <InputLabel id="subject-label">Subjects</InputLabel>
          <StyledSelect
            labelId="subject-label"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            IconComponent={ArrowDropDownIcon}
          >
            {subjects.map((subject, index) => (
              <MenuItem key={index} value={subject.name}>
                {subject.name}
              </MenuItem>
            ))}
          </StyledSelect>
        </StyledFormControl>
        {error && <Box color="red">{error}</Box>}
        <StyledButton type="submit" variant="contained" color="primary">
          {editMode ? "Update Class" : "Schedule Class"}
        </StyledButton>
      </StyledBox>
    </Modal>
  );
};

export default ScheduleForm;
