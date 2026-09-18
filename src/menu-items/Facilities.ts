import { HomeOutlined } from '@ant-design/icons';

const FacilitiesPages = {
  id: 'facilityPages',
  title: 'Facilities',
  type: 'group',
  canSubAdminView: false,
  children: [
    {
      id: 'facilityPages-page',
      title: 'List of All Facilities',
      type: 'item',
      url: '/school-facilities',
      icon: HomeOutlined
    }
  ]
};
export default FacilitiesPages;
