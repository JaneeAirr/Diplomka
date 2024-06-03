import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Box, Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar } from "@mui/material";
import db from "../../firebase";
import VuiBox from "../../components/VuiBox";
// Components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
import WelcomeMark from "layouts/dashboard/components/WelcomeMark";
import Reviews from "./components/Reviews";
import { PiStudent } from "react-icons/pi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { MdOutlinePlayLesson } from "react-icons/md";

function Dashboard() {
  const [teacherCount, setTeacherCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [subjectCount, setSubjectCount] = useState(0);
  const [userName, setUserName] = useState("");
  const [users, setUsers] = useState([]); // New state for users

  useEffect(() => {
    const fetchTeachers = async () => {
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map((doc) => doc.data());
      const teachersList = usersList.filter((user) => user.role === "teacher");
      setTeacherCount(teachersList.length);
    };

    const fetchStudents = async () => {
      const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
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
      if (userEmail) {
        const usersCollection = collection(db, "users");
        const q = query(usersCollection, where("email", "==", userEmail));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setUserName(userData.name);
        }
      }
    };

    const fetchUsers = async () => {
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(query(usersCollection, orderBy("createdAt", "desc")));
      const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    };

    fetchTeachers();
    fetchStudents();
    fetchSubjects();
    fetchUserData();
    fetchUsers(); // Fetch users for the table
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
              <TableContainer component={Paper} sx={{ backgroundColor: "transparent", boxShadow: "none" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: "#ffffff", fontWeight: "bold" }}>Name</TableCell>
                      <TableCell sx={{ color: "#ffffff", fontWeight: "bold" }}>Email</TableCell>
                      <TableCell sx={{ color: "#ffffff", fontWeight: "bold" }}>Role</TableCell>
                      <TableCell sx={{ color: "#ffffff", fontWeight: "bold" }}>Registered At</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map(user => (
                      <TableRow key={user.id}>
                        <TableCell sx={{ color: "#ffffff", display: "flex", alignItems: "center" }}>
                          <Avatar src={user.photoURL} alt={user.name} sx={{ marginRight: 2 }} />
                          {user.name}
                        </TableCell>
                        <TableCell sx={{ color: "#ffffff" }}>{user.email}</TableCell>
                        <TableCell sx={{ color: "#ffffff" }}>{user.role}</TableCell>
                        <TableCell sx={{ color: "#ffffff" }}>{new Date(user.createdAt.toMillis()).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </VuiBox>
      </VuiBox>
    </DashboardLayout>
  );
}

export default Dashboard;
