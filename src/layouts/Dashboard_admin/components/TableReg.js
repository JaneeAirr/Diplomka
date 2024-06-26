import { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, limit, query } from 'firebase/firestore';
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import db from '../../../firebase';

const RecentRegistrations = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(collection(db, "users"), orderBy("createdAt", "desc"), limit(10));
        const querySnapshot = await getDocs(q);
        const usersList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate()
        }));
        setUsers(usersList);
        console.log('Users fetched:', usersList);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();

    const interval = setInterval(() => {
      const now = new Date();
      setUsers((prevUsers) => {
        const filteredUsers = prevUsers.filter(user => {
          const createdAt = new Date(user.createdAt);
          const diff = now - createdAt;
          console.log(`User: ${user.name}, CreatedAt: ${createdAt}, Now: ${now}, Diff: ${diff}ms`);
          return diff < 3600000; // Keep user if registered within the last hour
        });
        console.log('Filtered users:', filteredUsers);
        return filteredUsers;
      });
    }, 10); // Check every minute

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, []);

  return (
    <VuiBox
      display="flex"
      flexDirection="column"
      sx={{
        backdropFilter: "blur(120px)",
        borderRadius: "1.25rem",
        background: "linear-gradient(127.09deg, rgba(6, 11, 40, 0.94) 19.41%, rgba(10, 14, 35, 0.49) 76.65%)",
        boxShadow: "rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem",
        p: "22px",
        overflow: "hidden",
      }}
    >
      <VuiTypography variant="h6" color="white" fontWeight="bold" mb="24px">
        Recent Registrations
      </VuiTypography>
      <VuiBox
        component="table"
        width="100%"
        sx={{
          borderCollapse: "collapse",
          "& th, & td": {
            borderBottom: "0.0625rem solid rgb(74, 85, 104)",
            padding: "8px",
          },
        }}
      >
        <VuiBox component="thead">
          <VuiBox component="tr">
            <VuiBox component="th" color="white" textAlign="left">Name</VuiBox>
            <VuiBox component="th" color="white" textAlign="left">Email</VuiBox>
            <VuiBox component="th" color="white" textAlign="left">Role</VuiBox>
            <VuiBox component="th" color="white" textAlign="left">Registration Date</VuiBox>
          </VuiBox>
        </VuiBox>
        <VuiBox component="tbody">
          {users.map((user) => (
            <VuiBox component="tr" key={user.id} sx={{ "&:nth-of-type(even)": { backgroundColor: "rgba(255, 255, 255, 0.1)" } }}>
              <VuiBox component="td" color="white">{user.name}</VuiBox>
              <VuiBox component="td" color="white">{user.email}</VuiBox>
              <VuiBox component="td" color="white">{user.role}</VuiBox>
              <VuiBox component="td" color="white">{user.createdAt?.toLocaleString()}</VuiBox>
            </VuiBox>
          ))}
        </VuiBox>
      </VuiBox>
    </VuiBox>
  );
};

export default RecentRegistrations;
