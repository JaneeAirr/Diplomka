import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import db from "../../firebase";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
import VuiBox from "components/VuiBox";
import { IoWallet, IoGlobe, IoDocumentText } from "react-icons/io5";
import colors from "assets/theme/base/colors";
import WelcomeMark from "layouts/Dashboard_Teacher/components/WelcomeMark";

function Dashboard() {
  const { gradients } = colors;
  const { cardContent } = gradients;
  const [averageAttendance, setAverageAttendance] = useState(null);
  const [averageGrade, setAverageGrade] = useState(null);
  const [nearestClass, setNearestClass] = useState(null);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [groupId, setGroupId] = useState("");

  useEffect(() => {
    const auth = getAuth();

    const fetchUserName = () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          setUserId(user.uid); // Store the user ID
          console.log("Authenticated user ID:", user.uid); // Debugging line
          try {
            const usersCollection = collection(db, "users");
            const userQuery = query(usersCollection, where("uid", "==", user.uid));
            const userSnapshot = await getDocs(userQuery);
            if (!userSnapshot.empty) {
              const userData = userSnapshot.docs[0].data();
              setUserName(userData.name || "User");
              setGroupId(userData.groupId || "");
              console.log("Fetched user data:", userData); // Debugging line
            } else {
              console.log("No user found with the provided user ID.");
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        } else {
          setUserName("Guest");
          setUserId(""); // Reset the user ID
          setGroupId("");
        }
      });
    };

    const fetchAttendanceData = async () => {
      if (!userId) return; // If no user is authenticated, skip fetching attendance

      try {
        const attendanceCollection = collection(db, "attendance");
        const attendanceQuery = query(attendanceCollection, where("studentId", "==", userId));
        const attendanceSnapshot = await getDocs(attendanceQuery);
        let totalPresent = 0;
        let totalCount = 0;

        attendanceSnapshot.forEach(doc => {
          const data = doc.data();
          if (data.status === "Present") {
            totalPresent++;
          }
          totalCount++;
        });

        if (totalCount > 0) {
          setAverageAttendance((totalPresent / totalCount) * 100);
        } else {
          setAverageAttendance(0);
        }
      } catch (error) {
        console.error("Error fetching attendance data:", error);
        setAverageAttendance(0);
      }
    };

    const fetchAverageGrade = async () => {
      if (!userId) return; // If no user is authenticated, skip fetching grades

      try {
        const gradesCollection = collection(db, "grades");
        const gradesQuery = query(gradesCollection, where("studentId", "==", userId));
        const gradesSnapshot = await getDocs(gradesQuery);
        let totalGrades = 0;
        let totalCount = 0;

        gradesSnapshot.forEach(doc => {
          const data = doc.data();
          if (data.grade) { // Assuming 'grade' is a numeric field
            totalGrades += data.grade;
            totalCount++;
          }
        });

        if (totalCount > 0) {
          setAverageGrade(totalGrades / totalCount);
        } else {
          setAverageGrade(0);
        }
      } catch (error) {
        console.error("Error fetching grade data:", error);
        setAverageGrade(0);
      }
    };

    const fetchNearestClass = async () => {
      if (!groupId) return; // If no group ID, skip fetching classes

      try {
        const classesCollection = collection(db, "classes");
        const now = new Date();
        const classesQuery = query(
          classesCollection,
          where("groupId", "==", groupId),
          where("startTime", ">", now),
          orderBy("startTime"),
          limit(1)
        );
        const classesSnapshot = await getDocs(classesQuery);
        if (!classesSnapshot.empty) {
          const nearestClassData = classesSnapshot.docs[0].data();
          setNearestClass(nearestClassData);
        } else {
          setNearestClass(null);
        }
      } catch (error) {
        console.error("Error fetching nearest class:", error);
        setNearestClass(null);
      }
    };

    fetchUserName();
    fetchAttendanceData();
    fetchAverageGrade();
    fetchNearestClass();
  }, [userId, groupId]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <VuiBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Average Attendance", fontWeight: "regular" }}
                count={averageAttendance !== null ? `${averageAttendance.toFixed(2)}%` : "Loading..."}
                icon={{ color: "info", component: <IoWallet size="22px" color="white" /> }}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Average Grade" }}
                count={averageGrade !== null ? `${averageGrade.toFixed(2)}` : "Loading..."}
                icon={{ color: "info", component: <IoGlobe size="22px" color="white" /> }}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Nearest Class" }}
                count={nearestClass !== null ? `${nearestClass.subject} at ${new Date(nearestClass.startTime).toLocaleString()}` : "No upcoming classes"}
                icon={{ color: "info", component: <IoDocumentText size="22px" color="white" /> }}
              />
            </Grid>
          </Grid>
        </VuiBox>
        <VuiBox py={3}>
          <VuiBox mb={3}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <WelcomeMark userName={userName} />
              </Grid>
            </Grid>
          </VuiBox>
        </VuiBox>
      </VuiBox>
    </DashboardLayout>
  );
}

export default Dashboard;
