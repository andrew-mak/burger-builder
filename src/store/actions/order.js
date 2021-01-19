import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const purchaseOrderStart = () => {
  return {
    type: actionTypes.PURCHASE_ORDER_START
  };
};

export const purchaseOrderSuccess = (id, orderData) => {
  return {
    type: actionTypes.PURCHASE_ORDER_SUCCESS,
    orderId: id,
    orderData: orderData
  };
};

export const purchaseOrderFail = (error) => {
  return {
    type: actionTypes.PURCHASE_ORDER_FAIL,
    error: error
  };
};

export const purchaseOrder = (orderData, token) => {
  return dispatch => {
    dispatch(purchaseOrderStart());
    axios.post('/orders.json?auth=' + token, orderData)
      .then(response => {
        dispatch(purchaseOrderSuccess(response.data.name, orderData));
      })
      .catch(error => {
        dispatch(purchaseOrderFail(error));
      });
  }
};

export const initPurchase = () => {
  return {
    type: actionTypes.PURCHASE_INIT
  }
};

export const fetchOrdersStart = () => {
  return {
    type: actionTypes.FETCH_ORDERS_START,
  }
};

export const fetchOredersSuccess = (orders) => {
  return {
    type: actionTypes.FETCH_ORDERS_SUCCESS,
    orders: orders
  }
};

export const fetchOrdersFail = (error) => {
  return {
    type: actionTypes.FETCH_ORDERS_FAIL,
    error: error
  }
};

export const fetchOrders = (token) => {
  return dispatch => {
    dispatch(fetchOrdersStart());
    axios.get('/orders.json?auth=' + token)
      .then(res => {
        const fetchedOrders = [];
        for (const key in res.data) {
          fetchedOrders.push({
            ...res.data[key],
            id: key,
          });
        }
        dispatch(fetchOredersSuccess(fetchedOrders));
      })
      .catch(error => {
        dispatch(fetchOrdersFail(error));
      })
  }
};