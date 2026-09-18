// ==============================|| MENU ITEMS - PROPERTY PAGE ||============================== //

import { AimOutlined, FileAddOutlined, HomeOutlined } from '@ant-design/icons';

const SchoolsPages = {
  id: 'schools',
  title: 'Schools',
  type: 'group',
  children: [
    {
      id: 'school-page',
      title: 'All Schools',
      type: 'item',
      url: '/school-list',
      isHeading: false,
      breadcrumbs: false,
      icon: HomeOutlined
    },
    {
      id: 'school-add-page',
      title: 'Add School',
      type: 'item',
      isHeading: false,
      breadcrumbs: false,
      url: '/school-add',
      icon: FileAddOutlined
    },
    {
      id: 'school-type',
      title: 'Schools Type',
      type: 'item',
      url: '/school-type',
      isHeading: false,
      breadcrumbs: false,
      icon: HomeOutlined
    },
    {
      id: 'classification',
      title: 'Classification',
      type: 'item',
      url: '/school-classifications',
      isHeading: false,
      breadcrumbs: false,
      icon: HomeOutlined
    },
    {
      id: 'boards',
      title: 'Boards',
      type: 'item',
      url: '/school-boards',
      isHeading: false,
      breadcrumbs: false,
      icon: HomeOutlined
    },
    {
      id: 'locationsPages-page',
      title: 'Cities',
      type: 'item',
      url: '/locations',
      icon: AimOutlined
    },
    {
      id: 'facilityPages-page',
      title: 'Facilities',
      type: 'item',
      url: '/school-facilities',
      icon: HomeOutlined
    }
  ]
};

export default SchoolsPages;
