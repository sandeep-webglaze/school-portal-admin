import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import BoardsList from 'pages/Boards/BoardsList';
import ClassificationList from 'pages/Classification/ClassificationList';
import CtaList from 'pages/Cta/CtaList';
import EnquiryList from 'pages/Enquiry/EnquiryList';
import MasterLeads from 'pages/MasterLeads';
import RegisterSchoolEnquiries from 'pages/RegisterSchoolEnquiry';
import FacilitiesList from 'pages/SchoolFacility/FacilitiesLists';
import SchoolTypeList from 'pages/SchoolType';
import AddSchool from 'pages/Schools/AddSchool';
import SchoolsList from 'pages/Schools/SchoolsList';
import SeoSettings from 'pages/SeoSettings';
import SlugList from 'pages/Slug';
import AddSlug from 'pages/Slug/AddSlug';
import AuthorList from 'pages/Author';
import AddAuthor from 'pages/Author/AddAuthor';
import Transactions from 'pages/Transactions';
import Setting from 'pages/setting';
import DeleteAccountRequest from 'pages/users/DeleteAccountRequest';
import UserWallet from 'pages/users/UserWallet';

// render - subAdmin

// render - users
const UsersList = Loadable(lazy(() => import('pages/users/UsersList')));

// render - profile
const Profile = Loadable(lazy(() => import('pages/Profile')));

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));

const ListOfLocations = Loadable(lazy(() => import('pages/location/ListOfLocations')));

// ==============================|| MAIN ROUTING ||============================== //

const ROUTES = {
  USER: {
    USER_LIST: '/users',
    USER_ACTIVITY: '/user-activity',
    USER_WALLETS: '/user-wallets',
    DELETE_ACCOUNT_REQUESTS: '/account-delete-requests'
  },
  SLUG: '/slug',
  ADD_SLUG: '/add-slug',
  AUTHORS: '/authors',
  ADD_AUTHOR: '/add-author',
  SETTING: '/setting',
  SCHOOL: {
    SCHOOL_LIST: '/school-list',
    SCHOOL_ADD: '/school-add',
    SCHOOL_REQUESTS: '/school-requests',
    SCHOOL_DETAIL: '/school-detail/:id',
    SCHOOL_TYPE: '/school-type',
    SCHOOL_CLASSIFICATIONS: '/school-classifications',
    SCHOOL_BOARSDS: '/school-boards',
    SCHOOL_FACILITIES: '/school-facilities'
  },
  SUBADMIN: {
    SUBADMIN_LIST: '/sub-admins'
  },
  PROFILE: '/profile',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  TRANSACTIONS: '/transactions',
  LOCATIONS: '/locations',
  ENQUIRIES: '/enquiry',
  REGISTER_SCHOOL_ENQ: '/register-school-enquiry',
  CTA: '/call-to-action',
  BASIC_SEO: '/basic-seo',
  EDIT_SEO: '/edit-seo',
  LEADS: '/leads'
};

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: ROUTES.USER.USER_LIST,
      element: <UsersList />
    },
    {
      path: ROUTES.PROFILE,
      element: <Profile />
    },
    {
      path: ROUTES.LOCATIONS,
      element: <ListOfLocations />
    },
    {
      path: ROUTES.SCHOOL.SCHOOL_LIST,
      element: <SchoolsList />
    },
    {
      path: ROUTES.SCHOOL.SCHOOL_ADD,
      element: <AddSchool />
    },
    {
      path: ROUTES.SCHOOL.SCHOOL_TYPE,
      element: <SchoolTypeList />
    },
    {
      path: ROUTES.SCHOOL.SCHOOL_CLASSIFICATIONS,
      element: <ClassificationList />
    },
    {
      path: ROUTES.SCHOOL.SCHOOL_BOARSDS,
      element: <BoardsList />
    },
    {
      path: ROUTES.SCHOOL.SCHOOL_FACILITIES,
      element: <FacilitiesList />
    },
    {
      path: ROUTES.SLUG,
      element: <SlugList />
    },
    {
      path: ROUTES.ADD_SLUG,
      element: <AddSlug />
    },
    {
      path: ROUTES.AUTHORS,
      element: <AuthorList />
    },
    {
      path: ROUTES.ADD_AUTHOR,
      element: <AddAuthor />
    },
    {
      path: ROUTES.SETTING,
      element: <Setting />
    },
    {
      path: ROUTES.REGISTER_SCHOOL_ENQ,
      element: <RegisterSchoolEnquiries />
    },
    {
      path: ROUTES.ENQUIRIES,
      element: <EnquiryList />
    },
    {
      path: ROUTES.CTA,
      element: <CtaList />
    },
    {
      path: ROUTES.BASIC_SEO,
      element: <SeoSettings />
    },
    {
      path: ROUTES.EDIT_SEO,
      element: <SeoSettings />
    },
    {
      path: ROUTES.LEADS,
      element: <MasterLeads />
    },
    {
      path: ROUTES.USER.USER_WALLETS,
      element: <UserWallet />
    },
    {
      path: ROUTES.USER.DELETE_ACCOUNT_REQUESTS,
      element: <DeleteAccountRequest />
    },
    {
      path: ROUTES.TRANSACTIONS,
      element: <Transactions />
    }
  ]
};

export default MainRoutes;
export { ROUTES };
