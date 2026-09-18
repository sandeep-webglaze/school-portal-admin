// ==============================|| MENU ITEMS - PROPERTY PAGE ||============================== //

import { HomeOutlined } from '@ant-design/icons';

const BoardsPages = {
  id: 'boards-type',
  title: 'Boards',
  type: 'group',
  children: [
    {
      id: 'boards',
      title: 'List of All boards',
      type: 'item',
      url: '/school-boards',
      isHeading: false,
      breadcrumbs: false,
      icon: HomeOutlined
    }
  ]
};

export default BoardsPages;
