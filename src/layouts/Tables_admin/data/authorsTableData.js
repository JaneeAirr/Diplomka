import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, doc, deleteDoc, getDoc, query, where } from "firebase/firestore";
import { useSnackbar } from 'notistack';
import db from "../../../firebase"; // Ensure this path is correct
import { saveAs } from "file-saver";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiButton from "components/VuiButton";

export default function useAuthorsTableData() {
  const { enqueueSnackbar } = useSnackbar();
  const [rows, setRows] = useState([]);
  const [studentsList, setStudentsList] = useState([]);

  const fetchStudents = useCallback(async () => {
    try {
      const q = query(collection(db, "users"), where("role", "==", "student"));
      const querySnapshot = await getDocs(q);
      const studentsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      console.log("Fetched students:", studentsList); // Debugging log
      setStudentsList(studentsList);

      // Fetch group information for each student
      const studentRows = await Promise.all(studentsList.map(async (student) => {
        let groupName = "N/A";
        if (student.group) {
          try {
            const groupDocRef = doc(db, "groups", student.group);
            const groupDoc = await getDoc(groupDocRef);
            if (groupDoc.exists()) {
              groupName = groupDoc.data().name || "N/A";
            }
          } catch (error) {
            console.error("Error fetching group data:", error);
          }
        }

        // Check if createdAt field exists and convert it
        let registeredDate = "N/A";
        if (student.createdAt && student.createdAt.seconds) {
          registeredDate = new Date(student.createdAt.seconds * 1000).toLocaleDateString();
        }

        return {
          id: student.id,
          name: (
            <VuiTypography variant="button" color="white" fontWeight="medium">
              {student.name}
            </VuiTypography>
          ),
          email: (
            <VuiTypography variant="caption" color="text">
              {student.email}
            </VuiTypography>
          ),
          group: (
            <VuiTypography variant="caption" color="text">
              {groupName}
            </VuiTypography>
          ),
          registered: (
            <VuiTypography variant="caption" color="white" fontWeight="medium">
              {registeredDate}
            </VuiTypography>
          ),
          action: (
            <VuiButton
              variant="outlined"
              color="error"
              onClick={() => handleDelete(student.id)}
            >
              Delete
            </VuiButton>
          ),
          hasBorder: true
        };
      }));

      setRows(studentRows);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "users", id));
      fetchStudents();
      enqueueSnackbar('Student successfully deleted', { variant: 'success' });
    } catch (error) {
      console.error("Error deleting student:", error);
      enqueueSnackbar('Error deleting student', { variant: 'error' });
    }
  };

  const exportToCSV = () => {
    const csvRows = [];
    const headers = ["Name", "Email", "Group", "Registered"];
    csvRows.push(headers.join(","));

    studentsList.forEach(student => {
      let groupName = "N/A";
      if (student.group) {
        try {
          const groupDocRef = doc(db, "groups", student.group);
          const groupDoc = getDoc(groupDocRef);
          if (groupDoc.exists()) {
            groupName = groupDoc.data().name || "N/A";
          }
        } catch (error) {
          console.error("Error fetching group data:", error);
        }
      }

      const registeredDate = student.createdAt ? new Date(student.createdAt.seconds * 1000).toLocaleDateString() : "N/A";
      const values = [
        `"${student.name}"`,
        `"${student.email}"`,
        `"${groupName}"`,
        `"${registeredDate}"`
      ];
      csvRows.push(values.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'students.csv');
  };

  return {
    columns: [
      { name: "name", align: "left" },
      { name: "email", align: "left" },
      { name: "group", align: "left" },
      { name: "registered", align: "center" },
      { name: "action", align: "center" },
    ],
    rows,
    exportToCSV // Expose the exportToCSV function
  };
}
