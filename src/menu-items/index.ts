// project import
import SettingPage from './Setting';
import AuthorPages from './authors';
import dashboard from './dashboard';
import EnquiryPages from './enquiry';
import LeadPages from './leads';
import SchoolsPages from './schools';
import SlugsPages from './slugs';
import UserPages from './users';
// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [dashboard, UserPages, SchoolsPages, SlugsPages, AuthorPages, EnquiryPages, LeadPages, SettingPage]
};

export type IMenuItems = typeof menuItems;
export default menuItems;
