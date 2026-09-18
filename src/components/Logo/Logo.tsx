import { Typography, Box } from '@mui/material';

// ==============================|| LOGO ||============================== //

const Logo = () => {
  return (
    <>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '10px',
          background: 'linear-gradient(135deg,#1e4fa3,#3b6fd4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(30,79,163,0.35)'
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3 1 8l11 5 9-4.09V15h2V8L12 3z" fill="#d4af37" />
          <path d="M5 12.2V16c0 1.66 3.13 3 7 3s7-1.34 7-3v-3.8l-7 3.18-7-3.18z" fill="#ffffff" />
        </svg>
      </Box>
      <Typography variant="h5" fontWeight={700} sx={{ mx: 1 }}>
        Education{' '}
        <Typography component="span" fontSize={'inherit'} fontWeight={700} sx={{ color: '#d4af37' }}>
          Portal
        </Typography>
      </Typography>
    </>
  );
};

export default Logo;
