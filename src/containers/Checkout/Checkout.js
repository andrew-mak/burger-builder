import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import OrderData from './OrderData/OrderData';
import Button from '../../components/UI/Button/Button';
import classes from './Checkout.module.css';



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
      </div> : <div className={classes.successfulOrder}>
        <h2>Thanks for your order!</h2>
        <ul>
          <li>Your order has been successfully accepted.</li>
          <li>You can check it in your orders history.</li>
          <li>The delivery service will contact you.</li>
        </ul>
        <Button btnType="Success" clicked={() => props.history.push('/')} >OK</Button>
      </div>
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