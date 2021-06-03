import React, { useEffect } from 'react';
import axios from '../../axios-orders';
import * as actions from '../../store/actions/index';
import { connect } from 'react-redux';

import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Order from '../../components/Order/Order';
import Spinner from '../../components/UI/Spinner/Spinner';

const Orders = props => {
  const { token, userId, onFetchOrders } = props;
  useEffect(() => {
    onFetchOrders(token, userId);
  }, [token, userId, onFetchOrders]);

  return (
    props.loading ? <Spinner /> :
      <>
        {props.orders.map(order => (
          <Order
            key={order.id}
            ingredients={order.ingredients}
            price={order.price.toFixed(2).replace('-0', '0')}
            isoDate={order.isoDate}
            orderData={order.orderData}
          />
        ))}
      </>
  );
}

const mapStateToProps = (state) => {
  return {
    orders: state.order.orders,
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchOrders: (token, userId) => dispatch(actions.fetchOrders(token, userId))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios));