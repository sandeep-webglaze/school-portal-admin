// ==============================|| MENU ITEMS - PROPERTY PAGE ||============================== //

import { HomeOutlined } from '@ant-design/icons';

const SchoolsTypePages = {
  id: 'schools-type',
  title: 'School Type',
  type: 'group',
  children: [
    {
      id: 'school-type',
      title: 'List of All Schools Type',
      type: 'item',
      url: '/school-type',
      isHeading: false,
      breadcrumbs: false,
      icon: HomeOutlined
    }
  ]
};

export default SchoolsTypePages;
