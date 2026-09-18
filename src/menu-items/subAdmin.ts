// ==============================|| MENU ITEMS - SUB ADMIN PAGES ||============================== //

import { UserOutlined } from '@ant-design/icons';

const subAdmin = {
  id: 'subadmin',
  title: 'Sub Admin',
  type: 'group',
  canSubAdminView: false,
  children: [
    {
      id: 'sub-admin-page',
      title: 'List of All Sub Admins',
      type: 'item',
      url: '/sub-admins',
      icon: UserOutlined
    }
  ]
};

export default subAdmin;
