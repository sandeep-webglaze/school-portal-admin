import { AimOutlined } from '@ant-design/icons';

const EnquiryPages = {
  id: 'EnquiryPages',
  title: 'Form Data',
  type: 'group',
  canSubAdminView: false,
  children: [
    {
      id: 'register-enquiryPages-page',
      title: 'Register School Enquiry',
      type: 'item',
      url: '/register-school-enquiry',
      icon: AimOutlined
    },
    {
      id: 'EnquiryPages-page',
      title: 'Enquiry Form',
      type: 'item',
      isHeading: false,
      breadcrumbs: false,
      url: '/enquiry',
      icon: AimOutlined
    },
    {
      id: 'CtaPages-page',
      title: 'CTA Form',
      type: 'item',
      url: '/call-to-action',
      icon: AimOutlined
    }
  ]
};
export default EnquiryPages;
