import { HomeOutlined } from '@ant-design/icons';

const transactionsPages = {
  id: 'transactions',
  title: 'Transactions',
  type: 'group',
  canSubAdminView: false,
  children: [
    {
      id: 'transactions-page',
      title: 'List of All Transactions',
      type: 'item',
      url: '/transactions',
      icon: HomeOutlined
    }
  ]
};
export default transactionsPages;
