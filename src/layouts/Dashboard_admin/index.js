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
import Reviews from "./components/Reviews"; // Ensure the correct path
import RecentRegistrations from "./components/TableReg"; // Ensure the correct path
import { PiStudent } from "react-icons/pi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { MdOutlinePlayLesson } from "react-icons/md";

function Dashboard() {
  const { gradients } = colors;
  const { cardContent } = gradients;

  const [teacherCount, setTeacherCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [subjectCount, setSubjectCount] = useState(0);
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

    const fetchSubjects = async () => {
      const subjectsCollection = collection(db, "subjects");
      const subjectsSnapshot = await getDocs(subjectsCollection);
      setSubjectCount(subjectsSnapshot.size);
    };

    const fetchUserData = async () => {
      const userEmail = localStorage.getItem("userEmail");
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
    fetchSubjects();
    fetchUserData();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <VuiBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} xl={4}>
              <MiniStatisticsCard
                title={{ text: "Ученники", fontWeight: "regular" }}
                count={studentCount}
                icon={{
                  color: "white",
                  component: <PiStudent alt="Student Icon" style={{ width: "35px", height: "35px", color: "white" }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={4} xl={4}>
              <MiniStatisticsCard
                title={{ text: "Учителя" }}
                count={teacherCount}
                icon={{
                  color: "white",
                  component: <FaChalkboardTeacher alt="Teacher Icon" style={{ width: "30px", height: "30px", color: "white" }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={4} xl={4}>
              <MiniStatisticsCard
                title={{ text: "Количество предметов" }}
                count={subjectCount}
                icon={{
                  color: "white",
                  component: <MdOutlinePlayLesson alt="Subject Icon" style={{ width: "31px", height: "31px", color: "white" }} />,
                }}
              />
            </Grid>
          </Grid>
        </VuiBox>
        <VuiBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} xl={6}>
              <WelcomeMark userName={userName} />
            </Grid>
            <Grid item xs={12} md={6} xl={6}>
              <Reviews />
            </Grid>
          </Grid>
        </VuiBox>
        <VuiBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <RecentRegistrations />
            </Grid>
          </Grid>
        </VuiBox>
      </VuiBox>
    </DashboardLayout>
  );
}

export default Dashboard;
