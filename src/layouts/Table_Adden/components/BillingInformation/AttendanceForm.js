import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, query, where, doc, getDoc } from "firebase/firestore";
import db from "../../../../firebase";
import { Button, Box, MenuItem, FormControl, InputLabel, Select, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

const AttendanceForm = ({ groupId, onClose }) => {
  const [students, setStudents] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedLesson, setSelectedLesson] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState("");
  const [openLessonModal, setOpenLessonModal] = useState(false);

  useEffect(() => {
    const fetchGroupStudents = async () => {
      try {
        const groupDocRef = doc(db, "groups", groupId);
        const groupDoc = await getDoc(groupDocRef);
        if (groupDoc.exists()) {
          const groupData = groupDoc.data();
          const studentIds = groupData.students || [];

          const studentPromises = studentIds.map(async (studentId) => {
            const studentDocRef = doc(db, "users", studentId);
            const studentDoc = await getDoc(studentDocRef);
            if (studentDoc.exists()) {
              return { id: studentDoc.id, ...studentDoc.data() };
            }
            return null;
          });

          const studentsList = await Promise.all(studentPromises);
          setStudents(studentsList.filter((student) => student !== null));
          console.log("Fetched students:", studentsList);
        } else {
          console.error("Group document does not exist.");
        }
      } catch (error) {
        console.error("Error fetching group students:", error);
      }
    };

    const fetchLessons = async () => {
      try {
        const now = new Date();
        const recentLessonsQuery = query(collection(db, "classes"), where("groupId", "==", groupId));
        const lessonsSnapshot = await getDocs(recentLessonsQuery);
        const lessonsList = lessonsSnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((lesson) => new Date(lesson.endTime) < now);
        setLessons(lessonsList);
        console.log("Fetched lessons:", lessonsList);
      } catch (error) {
        console.error("Error fetching lessons:", error);
      }
    };

    fetchGroupStudents();
    fetchLessons();
  }, [groupId]);

  const handleOpenLessonModal = (studentId) => {
    setSelectedStudent(studentId);
    setOpenLessonModal(true);
  };

  const handleSubmit = async () => {
    if (selectedStudent && selectedLesson && attendanceStatus) {
      try {
        const attendanceCollection = collection(db, "attendance");
        await addDoc(attendanceCollection, {
          studentId: selectedStudent,
          lessonId: selectedLesson,
          date: new Date().toISOString(),
          status: attendanceStatus,
        });
        setOpenLessonModal(false);
        setSelectedStudent("");
        setSelectedLesson("");
        setAttendanceStatus("");
        onClose();
      } catch (error) {
        console.error("Error marking attendance:", error);
      }
    }
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };

  return (
    <Box>
      <VuiBox mb={2}>
        <VuiTypography variant="h6" color="black">
          Mark Attendance
        </VuiTypography>
      </VuiBox>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student Name</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.name}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleOpenLessonModal(student.id)}>
                    Mark Attendance
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal open={openLessonModal} onClose={() => setOpenLessonModal(false)}>
        <Box sx={modalStyle}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="lesson-label">Lesson</InputLabel>
            <Select
              labelId="lesson-label"
              value={selectedLesson}
              onChange={(e) => setSelectedLesson(e.target.value)}
            >
              {lessons.map((lesson) => (
                <MenuItem key={lesson.id} value={lesson.id}>
                  {lesson.subject} - {new Date(lesson.startTime).toLocaleString()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              value={attendanceStatus}
              onChange={(e) => setAttendanceStatus(e.target.value)}
            >
              <MenuItem value="Present">Present</MenuItem>
              <MenuItem value="Absent">Absent</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
            Mark Attendance
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default AttendanceForm;
