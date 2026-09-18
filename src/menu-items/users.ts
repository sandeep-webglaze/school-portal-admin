import { DeleteOutlined, UserOutlined } from '@ant-design/icons';

const UserPages = {
  id: 'users',
  title: 'Users',
  type: 'group',
  canSubAdminView: false,
  children: [
    {
      id: 'users-list',
      title: 'Users List',
      type: 'item',
      url: '/users',
      icon: UserOutlined
    },
    {
      id: 'users-wallet',
      title: 'User Wallet ',
      type: 'item',
      url: '/user-wallets',
      icon: UserOutlined
    },
    {
      id: 'users-delete-req',
      title: 'Account Delete Request',
      type: 'item',
      url: '/account-delete-requests',
      icon: DeleteOutlined
    }
  ]
};

export default UserPages;
