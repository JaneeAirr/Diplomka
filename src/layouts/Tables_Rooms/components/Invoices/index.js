import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import db from "../../../../firebase";
import { Box, TextField, List, ListItem, ListItemText, IconButton, Card } from "@mui/material";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiButton from "components/VuiButton";
import DeleteIcon from "@mui/icons-material/Delete";

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      const roomsCollection = collection(db, "rooms");
      const roomsSnapshot = await getDocs(roomsCollection);
      const roomsList = roomsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRooms(roomsList);
    };

    fetchRooms();
  }, []);

  const handleAddRoom = async () => {
    if (newRoom.trim() === "") return;

    // Check if the room already exists
    const existingRoom = rooms.find((room) => room.name.toLowerCase() === newRoom.toLowerCase());
    if (existingRoom) {
      setError("Room already exists.");
      return;
    }

    const roomsCollection = collection(db, "rooms");
    await addDoc(roomsCollection, { name: newRoom });
    setNewRoom("");
    setError(""); // Clear the error message

    const roomsSnapshot = await getDocs(roomsCollection);
    const roomsList = roomsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setRooms(roomsList);
  };

  const handleDeleteRoom = async (id) => {
    const roomDoc = doc(db, "rooms", id);
    await deleteDoc(roomDoc);
    setRooms(rooms.filter((room) => room.id !== id));
  };

  return (
    <Card id="rooms-card" sx={{ height: "100%", width: "100%" }}>
      <VuiBox mb="28px" display="flex" justifyContent="space-between" alignItems="center">
        <VuiTypography variant="h6" fontWeight="medium" color="white">
          Rooms
        </VuiTypography>
        <VuiBox>
          <TextField
            label="New Room"
            value={newRoom}
            onChange={(e) => setNewRoom(e.target.value)}
            sx={{ marginRight: 2, background: "white", borderRadius: "4px" }}
          />
          <VuiButton variant="contained" color="info" size="small" onClick={handleAddRoom}>
            ADD ROOM
          </VuiButton>
        </VuiBox>
      </VuiBox>
      {error && (
        <VuiBox mb={2} color="red">
          <VuiTypography variant="caption" color="error">
            {error}
          </VuiTypography>
        </VuiBox>
      )}
      <VuiBox>
        <VuiBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
          {rooms.map((room) => (
            <ListItem key={room.id} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <ListItemText primary={room.name} sx={{ color: "white" }} />
              <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteRoom(room.id)}>
                <DeleteIcon sx={{ color: "white" }} />
              </IconButton>
            </ListItem>
          ))}
        </VuiBox>
      </VuiBox>
    </Card>
  );
}

export default Rooms;
