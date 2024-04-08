import React, { useState } from 'react';
import { BrowserRouter as Router, Link, Route, Switch, useLocation } from 'react-router-dom';
import { useKeycloak } from "@react-keycloak/web";
import { AuthButton } from '../auth/AuthButton';
import { About } from '../About';
import { MainBestellung } from '../bestellung/MainBestellung';
import { MainEinkauf } from '../einkauf/MainEinkauf';
import { MainManagement } from '../MainManagement';
import { MainKontrolle } from '../kontrolle/MainKontrolle';
import { PrivateRoute } from '../auth/PrivateRoute';
import { Home } from '../Home';
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from '@mui/material/Divider';
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react';
import { Link, Route, BrowserRouter as Router, Switch, useLocation } from 'react-router-dom';
import { About } from '../About';
import { Home } from '../Home';
import { MainManagement } from '../MainManagement';
import { AuthButton } from '../auth/AuthButton';
import { PrivateRoute } from '../auth/PrivateRoute';
import { MainBestellung } from '../bestellung/MainBestellung';
import { MainEinkauf } from '../einkauf/MainEinkauf';
import { MainKontrolle } from '../kontrolle/MainKontrolle';
import './AppRouter.css';

export const AppRouter = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = (newOpen) => () => {
    setMenuOpen(newOpen);
  };

  return (
    <Router>
      <AppContent menuOpen={menuOpen} toggleMenu={toggleMenu} />
    </Router>
  );
};

const AppContent = ({ menuOpen, toggleMenu }) => {
  const location = useLocation();
  const { keycloak } = useKeycloak();

  const getPageName = () => {
    const routeToPageName = {
      '/home': 'Home',
      '/mainBestellung': 'Bestellung',
      '/mainEinkauf': 'Einkauf',
      '/mainManagement': 'Management',
      '/mainBestellungskontrolle': 'Bestellungskontrolle',
      '/mainBestellungskontrolle': 'Bestellungskontrolle',
      '/about': 'Impressum',
    };

    return routeToPageName[location.pathname] || 'Home';
  };

  const itemsList = () => (
      <Box sx={{ width: 350 }} role="presentation" onClick={toggleMenu(false)}>
        {!keycloak.authenticated && (
          <>
            <List>
              <Typography variant="h6" sx={{ color: "grey", textAlign: "center", padding: 1, margin: 2}}>
                Sie müssen sich anmelden, um die Anwendung nutzen zu können.
              </Typography>
            </List>
          </>
        )}
        {keycloak.authenticated && (
          <>
            <List>
              <Link to="/home">
                <ListItemButton sx={{ color: "grey"}}>
                  <ListItemIcon> 
                    <HomeIcon/>
                  </ListItemIcon>
                  <Typography variant="h6">
                    Home
                  </Typography>
                </ListItemButton>
              </Link>
              <Link to="/mainBestellung">
                <ListItemButton sx={{ color: "grey" }}>
                  <ListItemIcon> 
                    <AddShoppingCartIcon/>
                  </ListItemIcon>
                  <Typography variant="h6">
                  Bestellung
                </Link>
              </li>
              <li>
                <Link to="/mainEinkauf" onClick={toggleMenu}>
                  Einkauf
                </Link>
              </li>
              <li>
                <Link to="/mainManagement" onClick={toggleMenu}>
                  Management
                </Link>
              </li>
              <li>
                <Link to="/mainBestellungskontrolle" onClick={toggleMenu}>
                  Bestellungskontrolle
                </Link>
              </li>
              <li>
                <AuthButton />
              </li>
            </ul>
          </nav>
        )}
        <h1 className='CurrentSiteName'>{getPageName()}</h1>
        <Link to="/home">
          <img className="LogoImage" src="manifest-icon-512.png" alt="logo" />
        </Link>
      </div>
      <Switch>
        <Route exact path="/login" component={AuthButton} />
        <Route exact path="/about" component={About} />
        <PrivateRoute roles={["Einkäufer"]} path="/mainBestellung" component={MainBestellung} />
        <PrivateRoute roles={["Einkäufer"]} path="/mainEinkauf" component={MainEinkauf} />
        <PrivateRoute roles={["Einkäufer"]} path="/mainManagement" component={MainManagement} />
        <PrivateRoute roles={["Einkäufer"]} path="/mainBestellungskontrolle" component={MainKontrolle} />
        <PrivateRoute roles={["Einkäufer"]} path="/mainBestellungskontrolle" component={MainKontrolle} />
        <Route path="/" component={Home} />
      </Switch>
    </div>
  );
};

const BurgerMenuButton = styled(Button)({

  fontSize: '30px',
  backgroundColor: '#333', 
  '&:hover': {
    backgroundColor: '#555',
    boxShadow: 'none',
  },
});
