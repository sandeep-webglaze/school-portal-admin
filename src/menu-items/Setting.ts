// ==============================|| MENU ITEMS - PROPERTY PAGE ||============================== //

import { SettingOutlined } from '@ant-design/icons';

const SettingPage = {
  id: 'setting',
  title: 'Setting',
  type: 'group',
  children: [
    {
      id: 'setting',
      title: 'Settings',
      type: 'item',
      url: '/setting',
      isHeading: false,
      breadcrumbs: false,
      icon: SettingOutlined
    }
  ]
};

export default SettingPage;
