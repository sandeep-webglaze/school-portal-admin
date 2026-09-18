import { SnackbarContext } from 'contexts/SnackBarContext';
import { isEmpty } from 'helpers';
import { useContext } from 'react';

const useSnackBarContext = () => {
  const snackBarContextState = useContext(SnackbarContext);

  if (isEmpty(snackBarContextState)) throw new Error('Invalid Hook Call SnackbarContext does not exsist');

  return { ...snackBarContextState };
};

export default useSnackBarContext;
