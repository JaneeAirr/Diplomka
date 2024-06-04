// WelcomeMark.js
import React from 'react';
import { Card } from '@mui/material';
import VuiBox from 'components/VuiBox';
import VuiTypography from 'components/VuiTypography';
import gif from 'assets/images/cardimgfree.png';
import { useUser } from '../../../../UserContext' ; // Ensure correct path

const WelcomeMark = () => {
  const { user } = useUser();

  return (
    <Card
      sx={{
        height: '500px',
        width: '100%',
        py: '32px',
        backgroundImage: `url(${gif})`,
        backgroundSize: 'cover',
        backgroundPosition: '50%',
      }}
    >
      <VuiBox height='100%' display='flex' flexDirection='column' justifyContent='space-between'>
        <VuiBox>
          <VuiTypography color='text' variant='button' fontWeight='regular' mb='12px'>
            Welcome back,
          </VuiTypography>
          <VuiTypography color='white' variant='h3' fontWeight='bold' mb='18px'>
            {user ? user.name : 'Guest'}
          </VuiTypography>
          <VuiTypography color='text' variant='h6' fontWeight='regular' mb='auto'>
            Приступим к работе!
          </VuiTypography>
        </VuiBox>
      </VuiBox>
    </Card>
  );
};

export default WelcomeMark;
