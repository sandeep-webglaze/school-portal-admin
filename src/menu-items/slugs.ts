// ==============================|| MENU ITEMS - PROPERTY PAGE ||============================== //

import { HomeOutlined } from '@ant-design/icons';

const SlugsPages = {
  id: 'Combination-Slug',
  title: 'Combination Slug',
  type: 'group',
  children: [
    {
      id: 'slugs',
      title: 'All Combination Slugs',
      type: 'item',
      url: '/slug',
      isHeading: false,
      breadcrumbs: false,
      icon: HomeOutlined
    }
    // {
    //   id: 'add-slug',
    //   title: 'Add Combination Slug',
    //   type: 'item',
    //   url: '/add-slug',
    //   isHeading: false,
    //   breadcrumbs: false,
    //   icon: HomeOutlined
    // }
  ]
};

export default SlugsPages;
