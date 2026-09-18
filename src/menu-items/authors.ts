// ==============================|| MENU ITEMS - AUTHORS ||============================== //

import { UserOutlined } from '@ant-design/icons';

const AuthorPages = {
  id: 'authors-group',
  title: 'Authors',
  type: 'group',
  children: [
    {
      id: 'authors',
      title: 'Authors / Page Experts',
      type: 'item',
      url: '/authors',
      isHeading: false,
      breadcrumbs: false,
      icon: UserOutlined
    }
  ]
};

export default AuthorPages;
