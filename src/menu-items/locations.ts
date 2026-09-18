import { AimOutlined } from '@ant-design/icons';

const locationsPages = {
  id: 'locationsPages',
  title: 'Locations',
  type: 'group',
  canSubAdminView: false,
  children: [
    {
      id: 'locationsPages-page',
      title: 'List of All Cities',
      type: 'item',
      url: '/locations',
      icon: AimOutlined
    }
  ]
};
export default locationsPages;
