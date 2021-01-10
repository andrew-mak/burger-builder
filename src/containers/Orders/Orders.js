import React, { Component } from 'react';
import axios from '../../axios-orders';

import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Order from './Order/Order';

class Orders extends Component {

  state = {
    orders: [],
    loading: true
  }

  componentDidMount() {
    axios.get('/orders.json')
      .then(res => {
        const fetchedOrders = [];
        for (const key in res.data) {
          fetchedOrders.push({
            ...res.data[key],
            id: key,
          });
        }
        this.setState({
          orders: fetchedOrders,
          loading: false
        })
      })
      .catch(error => {
        this.setState({ loading: false });
      })
  }

  render() {
    return (
      <React.Fragment>
        {this.state.orders.map(order => (
          <Order
            key={order.id}
            ingredients={order.ingredients}
          price={order.price}
          />
        ))}
      </React.Fragment>
    );
  }
}

export default withErrorHandler(Orders, axios);