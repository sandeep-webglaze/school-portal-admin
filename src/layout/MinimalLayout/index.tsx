import useUserContext from 'hooks/useUser';
import { Navigate, Outlet } from 'react-router-dom';

// ==============================|| MINIMAL LAYOUT ||============================== //

const MinimalLayout = () => {
  const { isAuthenticated } = useUserContext();

  if (!isAuthenticated)
    return (
      <>
        <Outlet />
      </>
    );
  else return <Navigate to="/" />;
};

export default MinimalLayout;
