// ==============================|| MENU ITEMS - SEO ||============================== //

import { GlobalOutlined, HomeOutlined } from '@ant-design/icons';

const SeoPages = {
  id: 'seo',
  title: 'SEO Settings',
  type: 'group',
  children: [
    {
      id: 'home-page-seo',
      title: 'Home Page SEO',
      caption: 'Google title & description for the home page',
      type: 'item',
      url: '/basic-seo',
      breadcrumbs: false,
      icon: HomeOutlined
    },
    {
      id: 'combination-slugs',
      title: 'Landing Pages (Slugs)',
      caption: 'SEO pages like british-schools-in-dubai',
      type: 'item',
      url: '/slug',
      breadcrumbs: false,
      icon: GlobalOutlined
    }
  ]
};

export default SeoPages;
