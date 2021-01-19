import React from 'react';

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import { Route, Switch } from 'react-router-dom';
import Checkout from './containers/Checkout/Checkout';
import Auth from './containers/Auth/Auth';
import Logout from './containers/Auth/Logout/Logout';
import Orders from './containers/Orders/Orders';


function App() {
  return (
    <div >
      <Layout>
        <Switch>
          <Route path="/auth" component={Auth} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/orders" component={Orders} />
          <Route path="/logout" component={Logout} />
          <Route path="/" exact component={BurgerBuilder} />
        </Switch>
      </Layout>
    </div>
  );
}

export default App;
