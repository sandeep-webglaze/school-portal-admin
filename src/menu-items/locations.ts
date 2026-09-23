import { AimOutlined } from '@ant-design/icons';

const locationsPages = {
  id: 'locationsPages',
  title: 'Locations',
  type: 'group',
  canSubAdminView: false,
  children: [
    {
      id: 'locationsPages-page',
      title: 'Cities & Areas',
      type: 'item',
      url: '/locations',
      icon: AimOutlined
    }
  ]
};
export default locationsPages;
