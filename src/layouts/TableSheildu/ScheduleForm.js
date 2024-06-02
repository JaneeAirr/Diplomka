import React, { useEffect, useState } from "react";
import { collection, addDoc, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import db from "../../firebase";
import { Button, TextField, MenuItem, Box, FormControl, InputLabel, Select } from "@mui/material";

const ScheduleForm = ({ userEmail, editMode, currentClass, onClose }) => {
  const [groups, setGroups] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [subject, setSubject] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(currentClass ? currentClass.groupId : "");
  const [selectedRoom, setSelectedRoom] = useState(currentClass ? currentClass.roomId : "");
  const [startTime, setStartTime] = useState(currentClass ? currentClass.startTime : "");
  const [endTime, setEndTime] = useState(currentClass ? currentClass.endTime : "");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGroups = async () => {
      const groupsCollection = collection(db, "groups");
      const groupsSnapshot = await getDocs(groupsCollection);
      const groupsList = groupsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGroups(groupsList);
    };

    const fetchRooms = async () => {
      const roomsCollection = collection(db, "rooms");
      const roomsSnapshot = await getDocs(roomsCollection);
      const roomsList = roomsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRooms(roomsList);
    };

    const fetchTeacherSubject = async () => {
      if (!userEmail) {
        console.error("User email is undefined");
        setError("User email is undefined");
        return;
      }

      const q = query(collection(db, "users"), where("email", "==", userEmail));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        setSubject(userData.subject);
      } else {
        console.error("No user found with the provided email.");
        setError("No user found with the provided email.");
      }
    };

    fetchGroups();
    fetchRooms();
    fetchTeacherSubject();
  }, [userEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();

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
          subject,
          startTime,
          endTime,
        });
      } else {
        await addDoc(classesCollection, {
          groupId: selectedGroup,
          roomId: selectedRoom,
          subject,
          startTime,
          endTime,
          userEmail,
        });
      }
      setError("");
      alert("Class scheduled successfully");
      onClose();
    } catch (error) {
      setError("Error scheduling class: " + error.message);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <FormControl fullWidth>
        <InputLabel id="group-label">Group</InputLabel>
        <Select
          labelId="group-label"
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
        >
          {groups.map((group) => (
            <MenuItem key={group.id} value={group.id}>
              {group.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="room-label">Room</InputLabel>
        <Select
          labelId="room-label"
          value={selectedRoom}
          onChange={(e) => setSelectedRoom(e.target.value)}
        >
          {rooms.map((room) => (
            <MenuItem key={room.id} value={room.id}>
              {room.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        type="datetime-local"
        label="Start Time"
        InputLabelProps={{
          shrink: true,
        }}
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
      />
      <TextField
        type="datetime-local"
        label="End Time"
        InputLabelProps={{
          shrink: true,
        }}
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
      />
      {error && <Box color="red">{error}</Box>}
      <Button type="submit" variant="contained" color="primary">
        {editMode ? "Update Class" : "Schedule Class"}
      </Button>
    </Box>
  );
};

export default ScheduleForm;
