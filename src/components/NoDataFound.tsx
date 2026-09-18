import { Container, Typography } from '@mui/material';
import NoPropertyImg from 'assets/images/property/house-searching-landing-page.png';
import { dark } from 'config';

const NoDataFound = () => (
  <Container sx={{ minHeight: '50vh', display: 'grid', placeContent: 'center', placeItems: 'center' }}>
    <Typography variant="h3" my={4} color={dark.darkBlue.main}>
      No Seen properties Found
    </Typography>
    <img src={NoPropertyImg} width={400} height={400} alt="No Property" />
  </Container>
);

export default NoDataFound;
