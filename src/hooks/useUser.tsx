import { UserContext } from 'contexts/UserContext';
import { isEmpty } from 'helpers';
import { useContext } from 'react';

const useUserContext = () => {
  const userContextState = useContext(UserContext);

  if (isEmpty(userContextState)) throw new Error('Invalid Hook Call UserContext does not exsist');

  return { ...userContextState };
};

export default useUserContext;
