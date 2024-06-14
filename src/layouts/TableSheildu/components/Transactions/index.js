import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import db from "../../../../firebase";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Card, IconButton } from "@mui/material";
import VuiTypography from "components/VuiTypography";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ScheduleTable = ({ userEmail, onEdit }) => {
  const [classes, setClasses] = useState([]);
  const [groups, setGroups] = useState({});
  const [rooms, setRooms] = useState({});

  useEffect(() => {
    const fetchClasses = async () => {
      const classesCollection = collection(db, "classes");
      const classesSnapshot = await getDocs(classesCollection);
      const classesList = classesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setClasses(classesList);
    };

    const fetchGroups = async () => {
      const groupsCollection = collection(db, "groups");
      const groupsSnapshot = await getDocs(groupsCollection);
      const groupsData = groupsSnapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = doc.data().name;
        return acc;
      }, {});
      setGroups(groupsData);
    };

    const fetchRooms = async () => {
      const roomsCollection = collection(db, "rooms");
      const roomsSnapshot = await getDocs(roomsCollection);
      const roomsData = roomsSnapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = doc.data().name;
        return acc;
      }, {});
      setRooms(roomsData);
    };

    fetchClasses();
    fetchGroups();
    fetchRooms();
  }, []);

  const handleDelete = async (classId) => {
    await deleteDoc(doc(db, "classes", classId));
    setClasses(classes.filter(classItem => classItem.id !== classId));
  };

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const classesByDay = (day) => {
    return classes.filter((classItem) => {
      const dayOfWeek = new Date(classItem.startTime).toLocaleString('en-us', { weekday: 'long' });
      return dayOfWeek === day;
    });
  };

  const cellStyle = { color: "#1A1A2E" };

  return (
    <Card sx={{ padding: 3, backgroundColor: "#1A1A2E", borderRadius: "12px" }}>
      <VuiTypography variant="h4" color="white" fontWeight="bold" mb={3}>
        Weekly Schedule
      </VuiTypography>
      {daysOfWeek.map((day) => (
        <React.Fragment key={day}>
          <Typography variant="h6" component="div" style={{ padding: "16px", color: "#E94560" }}>
            {day}
          </Typography>
          <TableContainer component={Paper} sx={{ marginBottom: 3, backgroundColor: "#162447" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={cellStyle}>Group</TableCell>
                  <TableCell sx={cellStyle}>Room</TableCell>
                  <TableCell sx={cellStyle}>Subject</TableCell>
                  <TableCell sx={cellStyle}>Start Time</TableCell>
                  <TableCell sx={cellStyle}>End Time</TableCell>
                  <TableCell sx={cellStyle}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {classesByDay(day).map((classItem) => (
                  <TableRow key={classItem.id}>
                    <TableCell sx={cellStyle}>{groups[classItem.groupId]}</TableCell>
                    <TableCell sx={cellStyle}>{rooms[classItem.roomId]}</TableCell>
                    <TableCell sx={cellStyle}>{classItem.subject}</TableCell>
                    <TableCell sx={cellStyle}>{new Date(classItem.startTime).toLocaleString()}</TableCell>
                    <TableCell sx={cellStyle}>{new Date(classItem.endTime).toLocaleString()}</TableCell>
                    <TableCell sx={cellStyle}>
                      {classItem.userEmail === userEmail && (
                        <>
                          <IconButton onClick={() => onEdit(classItem)} color="primary">
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(classItem.id)} color="secondary">
                            <DeleteIcon />
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </React.Fragment>
      ))}
    </Card>
  );
};

export default ScheduleTable;
