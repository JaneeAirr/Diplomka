import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import db from "../../../../firebase";
import { Box, TextField, ListItem, IconButton, Card } from "@mui/material";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiButton from "components/VuiButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/system";
import { useSnackbar } from "notistack";
import { CSVLink } from "react-csv";

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    borderRadius: "20px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "#fff",
    paddingLeft: "15px",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#fff",
  },
  "& .MuiInputLabel-root": {
    color: "#fff",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#fff",
  },
}));

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState("");
  const [error, setError] = useState("");
  const { enqueueSnackbar } = useSnackbar();

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

    const existingRoom = rooms.find((room) => room.name.toLowerCase() === newRoom.toLowerCase());
    if (existingRoom) {
      enqueueSnackbar("Room already exists.", { variant: "warning" });
      return;
    }

    const roomsCollection = collection(db, "rooms");
    await addDoc(roomsCollection, { name: newRoom });
    setNewRoom("");
    setError("");

    const roomsSnapshot = await getDocs(roomsCollection);
    const roomsList = roomsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setRooms(roomsList);

    enqueueSnackbar("Room added successfully.", { variant: "success" });
  };

  const handleDeleteRoom = async (id) => {
    const roomDoc = doc(db, "rooms", id);
    await deleteDoc(roomDoc);
    setRooms(rooms.filter((room) => room.id !== id));
    enqueueSnackbar("Room deleted successfully.", { variant: "success" });
  };

  return (
    <Card id="rooms-card" sx={{ height: "100%", width: "100%" }}>
      <VuiBox mb="28px" display="flex" justifyContent="space-between" alignItems="center">
        <VuiTypography variant="h6" fontWeight="medium" color="white">
          Rooms
        </VuiTypography>
        <VuiBox display="flex" alignItems="center">
          <StyledTextField
            placeholder="New Room"
            value={newRoom}
            onChange={(e) => setNewRoom(e.target.value)}
            sx={{ marginRight: 2 }}
          />
          <VuiButton variant="contained" color="info" size="small" onClick={handleAddRoom} sx={{ marginRight: 2 }}>
            ADD ROOM
          </VuiButton>
          <CSVLink data={rooms.map((room) => ({ name: room.name }))} filename={"rooms.csv"} style={{ textDecoration: 'none' }}>
            <VuiButton variant="contained" color="info" size="small">
              Export CSV
            </VuiButton>
          </CSVLink>
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
              <VuiTypography color="white">{room.name}</VuiTypography>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteRoom(room.id)}>
                <DeleteIcon sx={{ color: "red" }} />
              </IconButton>
            </ListItem>
          ))}
        </VuiBox>
      </VuiBox>
    </Card>
  );
}

export default Rooms;
