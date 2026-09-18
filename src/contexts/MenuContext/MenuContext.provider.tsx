import { FC, useReducer } from 'react';
import { IMenu, MenuContext } from './MenuContext';

type MenuContextProviderProps = {
  children: JSX.Element;
};

export interface MenuAction {
  type: ActionType;
  payload?: any;
}

export enum ActionType {
  ACTIVE_ITEM,
  ACTIVE_COMPONENT,
  OPEN_DRAWER,
  OPEN_COMPONENT_DRAWER
}

const MenuContextProvider: FC<MenuContextProviderProps> = ({ children }) => {
  const initialMenuState: IMenu = {
    openItem: ['dashboard'],
    defaultId: 'dashboard',
    openComponent: 'buttons',
    drawerOpen: false,
    componentDrawerOpen: true
  };

  function menuReducer(state: IMenu, action: MenuAction): IMenu {
    switch (action.type) {
      case ActionType.ACTIVE_COMPONENT:
        return {
          ...state,
          openComponent: action.payload
        };
      case ActionType.ACTIVE_ITEM:
        return {
          ...state,
          openItem: action.payload
        };
      case ActionType.OPEN_COMPONENT_DRAWER:
        return {
          ...state,
          componentDrawerOpen: action.payload
        };
      case ActionType.OPEN_DRAWER:
        return {
          ...state,
          drawerOpen: action.payload
        };
    }
  }

  const [menu, setMenu] = useReducer(menuReducer, initialMenuState);
  
  return(
    <MenuContext.Provider value={{ menu, setMenu }}>
      {children}
      </MenuContext.Provider>
  ) 
};


export default MenuContextProvider;
