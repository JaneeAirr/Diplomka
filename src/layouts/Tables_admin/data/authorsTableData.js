import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, doc, deleteDoc, getDoc, query, where } from "firebase/firestore";
import db from "../../../firebase"; // Ensure this path is correct

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiAvatar from "components/VuiAvatar";
import VuiButton from "components/VuiButton";

// Placeholder image
import avatar from "assets/images/avatar1.png";

function Author({ image, name }) {
  return (
    <VuiBox display="flex" alignItems="center" px={1} py={0.5}>
      <VuiBox mr={2}>
        <img src={image} alt={name} width="40" height="40" />
      </VuiBox>
      <VuiBox display="flex" flexDirection="column">
        <VuiTypography variant="button" color="white" fontWeight="medium">
          {name}
        </VuiTypography>
      </VuiBox>
    </VuiBox>
  );
}

export default function useAuthorsTableData() {
  const [rows, setRows] = useState([]);

  const fetchStudents = useCallback(async () => {
    try {
      const q = query(collection(db, "users"), where("role", "==", "student"));
      const querySnapshot = await getDocs(q);
      const studentsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      console.log("Fetched students:", studentsList); // Debugging log

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
              {student.registered ? new Date(student.registered.seconds * 1000).toLocaleDateString() : "N/A"}
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
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  return {
    columns: [
      { name: "name", align: "left" },
      { name: "email", align: "left" },
      { name: "group", align: "left" },
      { name: "registered", align: "center" },
      { name: "action", align: "center" },
    ],
    rows
  };
}
