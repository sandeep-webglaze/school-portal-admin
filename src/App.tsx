// project import
import ScrollTop from 'components/ScrollTop';
import MenuContextProvider from 'contexts/MenuContext/MenuContext.provider';
import SnackBarContextProvider from 'contexts/SnackBarContext/SnackBarContext.provider';
import UserContextProvider from 'contexts/UserContext/UserContext.Provider';
import Routes from 'routes';
import ThemeCustomization from 'themes';

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => (
  <ThemeCustomization>
    <ScrollTop>
      <MenuContextProvider>
        <UserContextProvider>
          <SnackBarContextProvider>
            <Routes />
          </SnackBarContextProvider>
        </UserContextProvider>
      </MenuContextProvider>
    </ScrollTop>
  </ThemeCustomization>
);

export default App;
