import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import OrderData from './OrderData/OrderData';


const Checkout = props => {

  const checkoutCanceledHandler = () => {
    props.history.goBack();
  }

  const checkoutContinuedHandler = () => {
    props.history.replace("/checkout/order-data");
  }

  return (
    (props.ingredients && !props.purchased) ?
      <div>
        <CheckoutSummary
          checkoutCanceled={checkoutCanceledHandler}
          checkoutContinued={checkoutContinuedHandler}
          ingredients={props.ingredients}
          price={props.price} />
        <Route path={props.match.path + "/order-data"} component={OrderData} />
      </div> :
      <Redirect to="/" />
  );
};

const mapStateToProps = (state) => {
  return {
    ingredients: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    purchased: state.order.purchased,
  }
};


export default connect(mapStateToProps)(Checkout);