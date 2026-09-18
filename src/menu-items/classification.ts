// ==============================|| MENU ITEMS - PROPERTY PAGE ||============================== //

import { HomeOutlined } from '@ant-design/icons';

const ClassificationPages = {
  id: 'classification-type',
  title: 'Classifications',
  type: 'group',
  children: [
    {
      id: 'classification',
      title: 'List of All classification',
      type: 'item',
      url: '/school-classifications',
      isHeading: false,
      breadcrumbs: false,
      icon: HomeOutlined
    }
  ]
};

export default ClassificationPages;
