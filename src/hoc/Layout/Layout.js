import React, { useState } from 'react';

import Aux from '../Auxiliary/Auxiliary';
import classes from './Layout.module.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import { connect } from 'react-redux';

const Layout = props => {

  const [sideDrawerVisibllity, setSideDrawerVisibllity] = useState(false);

  const sideDrawerClosedHandler = () => {
    setSideDrawerVisibllity(false);
  };

  const sideDrawerHandler = () => {
    setSideDrawerVisibllity(!sideDrawerVisibllity);
  };

  return (
    <Aux>
      <Toolbar
        isAuth={props.isAuthenticated}
        drawerToggleClicked={sideDrawerHandler} />
      <SideDrawer
        isAuth={props.isAuthenticated}
        open={sideDrawerVisibllity}
        closed={sideDrawerClosedHandler} />
      <main className={classes.Content}>
        {props.children}
      </main>
    </Aux >
  );

};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

export default connect(mapStateToProps)(Layout);