import { createContext } from 'react';
import { MenuAction } from './MenuContext.provider';

export interface IMenu {
  openItem: string[];
  defaultId: string;
  openComponent: string;
  drawerOpen: boolean;
  componentDrawerOpen: boolean;
}
export type IMenuState = {
  menu: IMenu;
  setMenu: React.Dispatch<MenuAction>;
};
const DEFAULT_VALUE: IMenuState = {
  menu: {
    openItem: ['dashboard'],
    defaultId: 'dashboard',
    openComponent: 'buttons',
    drawerOpen: false,
    componentDrawerOpen: true
  },
  setMenu: () => {}
};

export const MenuContext = createContext(DEFAULT_VALUE);
