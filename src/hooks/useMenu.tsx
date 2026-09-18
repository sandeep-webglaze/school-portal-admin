import { MenuContext } from 'contexts/MenuContext/MenuContext';
import { isEmpty } from 'helpers';
import { useContext } from 'react';

const useMenu = () => {
  const menueContextVal = useContext(MenuContext);

  if (isEmpty(menueContextVal)) throw new Error('Invalid Hook Call MenuContext does not exsist');

  return { ...menueContextVal };
};

export default useMenu;
