import { Box, Skeleton } from '@mui/material';

const LoadingSkeleton = () => (
  <Box
    sx={{
      height: 'max-content'
    }}
  >
    {[...Array(10)].map((_, idx) => (
      <Skeleton key={idx} variant="rectangular" sx={{ my: 4, mx: 1 }} />
    ))}
  </Box>
);

export default LoadingSkeleton;
