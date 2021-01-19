import React, { Component } from 'react';
import axios from '../../axios-orders';
import * as actions from '../../store/actions/index';
import { connect } from 'react-redux';

import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Order from './Order/Order';
import Spinner from '../../components/UI/Spinner/Spinner';

class Orders extends Component {

  componentDidMount() {
    this.props.onFetchOrders(this.props.token);
  }

  render() {
    return (
      this.props.loading ? <Spinner /> :
        <React.Fragment>
          {this.props.orders.map(order => (
            <Order
              key={order.id}
              ingredients={order.ingredients}
              price={order.price}
              time={order.time}
              date={order.date}
              orderData={order.orderData}
            />
          ))}
        </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    orders: state.order.orders,
    loading: state.order.loading,
    token: state.auth.token
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchOrders: (token) => dispatch(actions.fetchOrders(token))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios));