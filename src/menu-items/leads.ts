import { AimOutlined } from '@ant-design/icons';

const LeadPages = {
  id: 'LeadPages',
  title: 'Master Leads',
  type: 'group',
  canSubAdminView: false,
  children: [
    {
      id: 'Leads',
      title: 'Leads',
      type: 'item',
      url: '/leads',
      isHeading: false,
      breadcrumbs: false,
      icon: AimOutlined
    }
  ]
};
export default LeadPages;
