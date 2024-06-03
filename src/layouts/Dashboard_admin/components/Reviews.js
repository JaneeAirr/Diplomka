import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { Box, Typography } from '@mui/material';
import db from '../../../firebase';

const colors = ['#4caf50', '#ffeb3b', '#f44336', '#ffffff', '#00bcd4', '#e91e63','#800080','#87CEEB'];

const Reviews = () => {
  const [groups, setGroups] = useState([]);
  const [progressValues, setProgressValues] = useState({});

  useEffect(() => {
    const fetchGroups = async () => {
      const groupsCollection = collection(db, 'groups');
      const groupsSnapshot = await getDocs(groupsCollection);
      const groupsList = groupsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGroups(groupsList);

      const initialProgressValues = groupsList.reduce((acc, group) => {
        acc[group.id] = 0;
        return acc;
      }, {});
      setProgressValues(initialProgressValues);
    };

    fetchGroups();
  }, []);

  useEffect(() => {
    const intervals = groups.map((group, index) => {
      const targetValue = group.size ? (group.students.length / group.size) * 100 : 0;
      const increment = targetValue / 50; // Adjust the speed of the animation
      return setInterval(() => {
        setProgressValues(prev => {
          const newValue = Math.min((prev[group.id] || 0) + increment, targetValue);
          return { ...prev, [group.id]: newValue };
        });
      }, 50); // Adjust the interval time
    });

    return () => {
      intervals.forEach(clearInterval);
    };
  }, [groups]);

  return (
    <Box sx={{
      '-webkit-font-smoothing': 'antialiased',
      'text-size-adjust': '100%',
      fontFamily: '"Plus Jakarta Display", Helvetica, Arial, sans-serif',
      fontSize: '1.25rem',
      fontWeight: 400,
      lineHeight: 1.625,
      overflowWrap: 'break-word',
      listStyle: 'none',
      boxSizing: 'inherit',
      margin: 0,
      padding: '8px 0',
      opacity: 1,
      background: 'transparent',
      color: 'rgb(52, 71, 103)',
      marginBottom: '28px',
      display: 'flex',
      flexDirection: 'column',
      backdropFilter: 'blur(120px)',
      position: 'relative',
      overflowWrap: 'break-word',
      boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem',
      height: '100%',
      transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      overflow: 'hidden',
      background: 'linear-gradient(127.09deg, rgba(6, 11, 40, 0.94) 19.41%, rgba(10, 14, 35, 0.49) 76.65%) border-box',
      padding: '22px',
      borderWidth: 0,
      borderStyle: 'solid',
      borderColor: 'rgba(0, 0, 0, 0.125)',
      borderImage: 'initial',
      borderRadius: '1.25rem',
    }}>
      <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 'bold', marginBottom: 2 }}>
        Groups
      </Typography>
      {groups.map((group, index) => (
        <Box key={group.id} sx={{ marginBottom: 2 }}>
          <Typography variant="body2" sx={{
            color: 'rgb(52, 71, 103)',
            fontFamily: '"Plus Jakarta Display", Helvetica, Arial, sans-serif',
            fontSize: '1.25rem',
            fontWeight: 400,
            lineHeight: 1.625,
            marginBottom: 1
          }}>
            {group.name}
          </Typography>
          <Box sx={{
            height: 6,
            borderRadius: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <Box sx={{
              height: '100%',
              width: `${progressValues[group.id] || 0}%`,
              backgroundColor: colors[index % colors.length],
              transition: 'width 0.5s ease-in-out'
            }} />
          </Box>
          <Typography variant="body2" sx={{
            color: 'rgb(52, 71, 103)',
            fontFamily: '"Plus Jakarta Display", Helvetica, Arial, sans-serif',
            fontSize: '1.25rem',
            fontWeight: 400,
            lineHeight: 1.625,
            textAlign: 'right'
          }}>
            {(progressValues[group.id] || 0).toFixed(2)}%
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default Reviews;
