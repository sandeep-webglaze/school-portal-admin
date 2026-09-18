import { AimOutlined } from '@ant-design/icons';

const CtaPages = {
  id: 'CtaPages',
  title: 'CTA',
  type: 'group',
  canSubAdminView: false,
  children: [
    {
      id: 'CtaPages-page',
      title: 'List of All CTA',
      type: 'item',
      url: '/call-to-action',
      icon: AimOutlined
    }
  ]
};
export default CtaPages;
