import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import db from "../../firebase";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import GradeForm from "./GradeForm";

const StudentTable = ({ groupId, onClose }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const groupDoc = await getDocs(query(collection(db, "groups"), where("__name__", "==", groupId)));
        const groupData = groupDoc.docs[0].data();

        if (!groupData.students || groupData.students.length === 0) {
          console.error("No students found for this group.");
          return;
        }

        const studentIds = groupData.students;
        const usersCollection = collection(db, "users");
        const q = query(usersCollection, where("role", "==", "student"), where("__name__", "in", studentIds));
        const usersSnapshot = await getDocs(q);

        const studentsList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setStudents(studentsList);
      } catch (error) {
        console.error("Error fetching students: ", error);
      }
    };

    fetchStudents();
  }, [groupId]);

  return (
    <VuiBox>
      <VuiTypography variant="h6" color="white" mb={3}>
        Students
      </VuiTypography>
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
                  <Button variant="contained" color="primary" onClick={() => setSelectedStudent(student.id)}>
                    Add Grade
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {selectedStudent && (
        <GradeForm studentId={selectedStudent} groupId={groupId} onClose={() => setSelectedStudent(null)} />
      )}
    </VuiBox>
  );
};

export default StudentTable;
