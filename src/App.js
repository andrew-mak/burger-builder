import React, { Component } from 'react';

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import Checkout from './containers/Checkout/Checkout';
import Auth from './containers/Auth/Auth';
import { connect } from 'react-redux';
import Logout from './containers/Auth/Logout/Logout';
import Orders from './containers/Orders/Orders';
import * as actions from './store/actions/index';


class App extends Component {

  componentDidMount() {
    this.props.onTryAutoSignup();
  }

  render() {
    let routs = (
      <Switch>
        <Route path="/auth" component={Auth} />
        <Route path="/" exact component={BurgerBuilder} />
        <Redirect to="/" />
      </Switch>
    );

    if (this.props.isAuthenticated) routs = (
      <Switch>
        {this.props.tryToOrder ? <Route path="/auth" component={Auth}/> : null}
        <Route path="/checkout" component={Checkout} />
        <Route path="/orders" component={Orders} />
        <Route path="/logout" component={Logout} />
        <Route path="/" exact component={BurgerBuilder} />
        <Redirect to="/" />
      </Switch>
    );

    return (
      <div >
        <Layout>
          {routs}
        </Layout>
      </div >
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
    tryToOrder: state.burgerBuilder.building
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
