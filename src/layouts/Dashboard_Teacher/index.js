import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import db from "../../firebase";
import Grid from "@mui/material/Grid";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Card } from "@mui/material";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

// Vision UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";

// Vision UI Dashboard React base styles
import colors from "assets/theme/base/colors";

// Dashboard layout components
import WelcomeMark from "layouts/Dashboard_Teacher/components/WelcomeMark";
import Projects from "layouts/Dashboard_Teacher/components/Projects";
import OrderOverview from "layouts/Dashboard_Teacher/components/OrderOverview";
import SatisfactionRate from "layouts/Dashboard_Teacher/components/SatisfactionRate";
import ReferralTracking from "layouts/Dashboard_Teacher/components/ReferralTracking";

// React icons
import { IoIosRocket } from "react-icons/io";
import { IoGlobe } from "react-icons/io5";
import { IoBuild } from "react-icons/io5";
import { IoWallet } from "react-icons/io5";
import StudentIcon from "assets/icons/Student.png";
import TeacherIcon from "assets/icons/teacher.png";
import linearGradient from "../../assets/theme/functions/linearGradient";
import VuiProgress from "../../components/VuiProgress";
import BarChart from "examples/Charts/BarCharts/BarChart";
import { barChartDataDashboard } from "layouts/Dashboard_Teacher/data/barChartData";
import { barChartOptionsDashboard } from "layouts/Dashboard_Teacher/data/barChartOptions";

function Dashboard() {
  const { gradients } = colors;
  const { cardContent } = gradients;

  const [teacherCount, setTeacherCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [subjectCount, setSubjectCount] = useState(0); // State for subject count
  const [userName, setUserName] = useState("");
  const [teacherSubject, setTeacherSubject] = useState(""); // State for teacher subject
  const [groups, setGroups] = useState([]); // State for groups taught by the teacher
  const [upcomingLessons, setUpcomingLessons] = useState([]);
  const [groupNames, setGroupNames] = useState({});
  const [roomNames, setRoomNames] = useState({});
  const [averageAttendance, setAverageAttendance] = useState({});

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

    const fetchGroups = async (course) => {
      if (course) {
        const groupsCollection = collection(db, "groups");
        const q = query(groupsCollection, where("course", "==", course));
        const groupsSnapshot = await getDocs(q);
        const groupsList = groupsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setGroups(groupsList);

        // Store group names in an object for easy lookup
        const groupNamesObj = {};
        groupsSnapshot.docs.forEach((doc) => {
          groupNamesObj[doc.id] = doc.data().name;
        });
        setGroupNames(groupNamesObj);
      }
    };

    const fetchRooms = async () => {
      const roomsCollection = collection(db, "rooms");
      const roomsSnapshot = await getDocs(roomsCollection);
      const roomsList = roomsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      // Store room names in an object for easy lookup
      const roomNamesObj = {};
      roomsSnapshot.docs.forEach((doc) => {
        roomNamesObj[doc.id] = doc.data().name;
      });
      setRoomNames(roomNamesObj);
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

          // Fetch the subject for the teacher
          if (userData.role === "teacher") {
            const subjects = Array.isArray(userData.subject) ? userData.subject.map(sub => sub.name).join(", ") : userData.subject;
            setTeacherSubject(subjects || "No subject assigned");

            // Fetch groups corresponding to the teacher's course
            if (userData.course) {
              fetchGroups(userData.course);
            }
          }
        } else {
          console.log("No user found with the provided email.");
        }
      } else {
        console.log("No userEmail found in localStorage.");
      }
    };

    const fetchUpcomingLessons = async () => {
      const classesCollection = collection(db, "classes");
      const q = query(classesCollection, where("startTime", ">=", new Date().toISOString()));
      const querySnapshot = await getDocs(q);
      const classesList = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((lesson) => new Date(lesson.endTime) >= new Date());
      setUpcomingLessons(classesList);
    };

    const fetchAverageAttendance = async () => {
      const attendanceCollection = collection(db, "attendance");
      const attendanceSnapshot = await getDocs(attendanceCollection);
      const attendanceList = attendanceSnapshot.docs.map((doc) => doc.data());

      // Calculate average attendance per group
      const attendanceSum = {};
      const attendanceCount = {};

      attendanceList.forEach((record) => {
        const { groupId, present } = record;
        if (!attendanceSum[groupId]) {
          attendanceSum[groupId] = 0;
          attendanceCount[groupId] = 0;
        }
        attendanceSum[groupId] += present;
        attendanceCount[groupId] += 1;
      });

      const averageAttendanceObj = {};
      Object.keys(attendanceSum).forEach((groupId) => {
        averageAttendanceObj[groupId] = attendanceSum[groupId] / attendanceCount[groupId];
      });

      setAverageAttendance(averageAttendanceObj);
    };

    fetchTeachers();
    fetchStudents();
    fetchSubjects();
    fetchUserData();
    fetchRooms();
    fetchUpcomingLessons();
    fetchAverageAttendance();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <VuiBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8} xl={8}>
              <MiniStatisticsCard
                title={{ text: "Мой предмет" }}
                count={teacherSubject}
                icon={{
                  color: "info",
                  component: <img src={TeacherIcon} alt="Teacher Icon" style={{ width: "20px", height: "20px" }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={4} xl={4}>
              {groups.map((group) => (
                <MiniStatisticsCard
                  key={group.id}
                  title={{ text: group.name, fontWeight: "regular" }}
                  count={group.students.length}
                  icon={{
                    color: "info",
                    component: <img src={StudentIcon} alt="Group Icon" style={{ width: "20px", height: "20px" }} />,
                  }}
                />
              ))}
            </Grid>
          </Grid>
        </VuiBox>
        <VuiBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <VuiBox
                  mb="24px"
                  height="220px"
                  sx={{
                    background: linearGradient(
                      cardContent.main,
                      cardContent.state,
                      cardContent.deg
                    ),
                    borderRadius: "20px",
                  }}
                >
                  <BarChart
                    barChartData={barChartDataDashboard}
                    barChartOptions={barChartOptionsDashboard}
                  />
                </VuiBox>
                <VuiTypography variant="lg" color="white" fontWeight="bold" mb="5px">
                  Active Users
                </VuiTypography>
                <VuiBox display="flex" alignItems="center" mb="40px">
                  <VuiTypography variant="button" color="success" fontWeight="bold">
                    (+23){" "}
                    <VuiTypography variant="button" color="text" fontWeight="regular">
                      than last week
                    </VuiTypography>
                  </VuiTypography>
                </VuiBox>
                <Grid container spacing="50px">
                  <Grid item xs={6} md={3} lg={3}>
                    <VuiTypography color="white" variant="lg" fontWeight="bold" mb="8px">
                      Средняя посещаемость групп
                    </VuiTypography>
                    {Object.keys(averageAttendance).map((groupId) => (
                      <VuiTypography key={groupId} color="text" variant="button" fontWeight="medium">
                        {groupNames[groupId]}: {averageAttendance[groupId].toFixed(2)}
                      </VuiTypography>
                    ))}
                  </Grid>
                </Grid>
              </Card>
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
          <VuiBox mb={3}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Group</TableCell>
                        <TableCell>Room</TableCell>
                        <TableCell>Subject</TableCell>
                        <TableCell>Start Time</TableCell>
                        <TableCell>End Time</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {upcomingLessons.length > 0 ? (
                        upcomingLessons.map((lesson) => (
                          <TableRow key={lesson.id}>
                            <TableCell>{groupNames[lesson.groupId] || lesson.groupId}</TableCell>
                            <TableCell>{roomNames[lesson.roomId] || lesson.roomId}</TableCell>
                            <TableCell>{lesson.subject}</TableCell>
                            <TableCell>{new Date(lesson.startTime).toLocaleString()}</TableCell>
                            <TableCell>{new Date(lesson.endTime).toLocaleString()}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            No upcoming lessons
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </VuiBox>
        </VuiBox>
      </VuiBox>
    </DashboardLayout>
  );
}

export default Dashboard;
