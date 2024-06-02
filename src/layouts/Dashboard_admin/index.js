import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import db from "../../firebase";
import Grid from "@mui/material/Grid";
import { Card, LinearProgress, Stack } from "@mui/material";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

// Vision UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";

// Vision UI Dashboard React base styles
import colors from "assets/theme/base/colors";

// Dashboard layout components
import WelcomeMark from "layouts/dashboard/components/WelcomeMark";

// Icons
import StudentIcon from "assets/icons/Student.png";
import TeacherIcon from "assets/icons/teacher.png";
import SubjectIcon from "assets/icons/Subject.png";

function Dashboard() {
  const { gradients } = colors;
  const { cardContent } = gradients;

  const [teacherCount, setTeacherCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0); // State for student count
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchTeachers = async () => {
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map((doc) => doc.data());
      const teachersList = usersList.filter((user) => user.role === "teacher");
      setTeacherCount(teachersList.length);
    };

    const fetchStudents = async () => {
      const q = query(collection(db, "users"), where("role", "==", "student"));
      const querySnapshot = await getDocs(q);
      const studentsList = querySnapshot.docs.map((doc) => doc.data());
      setStudentCount(studentsList.length);
    };

    const fetchUserData = async () => {
      const userEmail = localStorage.getItem("userEmail"); // Get the logged-in user email from local storage or auth context
      console.log("Fetched userEmail from localStorage:", userEmail);
      if (userEmail) {
        const usersCollection = collection(db, "users");
        const q = query(usersCollection, where("email", "==", userEmail));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          console.log("User data fetched from Firestore:", userData);
          setUserName(userData.name);
        } else {
          console.log("No user found with the provided email.");
        }
      } else {
        console.log("No userEmail found in localStorage.");
      }
    };

    fetchTeachers();
    fetchStudents();
    fetchUserData();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <VuiBox py={3}>
          <VuiBox mb={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4} xl={4}>
                <MiniStatisticsCard
                  title={{ text: "Ученники", fontWeight: "regular" }}
                  count={studentCount}
                  icon={{
                    color: "info",
                    component: <img src={StudentIcon} alt="Student Icon" style={{ width: "20px", height: "20px" }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4} xl={4}>
                <MiniStatisticsCard
                  title={{ text: "Учителя" }}
                  count={teacherCount}
                  icon={{
                    color: "info",
                    component: <img src={TeacherIcon} alt="Teacher Icon" style={{ width: "20px", height: "20px" }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4} xl={4}>
                <MiniStatisticsCard
                  title={{ text: "Количество предметов" }}
                  count="50"
                  icon={{
                    color: "info",
                    component: <img src={SubjectIcon} alt="Subject Icon" style={{ width: "20px", height: "20px" }} />,
                  }}
                />
              </Grid>
            </Grid>
          </VuiBox>
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
