import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import OrderData from './OrderData/OrderData';


class Checkout extends Component {

  checkoutCanceledHandler = () => {
    this.props.history.goBack();
  }

  checkoutContinuedHandler = () => {
    this.props.history.replace("/checkout/order-data");
  }

  render() {
    return (
      (this.props.ingredients && !this.props.purchased) ?
        <div>
          <CheckoutSummary
            checkoutCanceled={this.checkoutCanceledHandler}
            checkoutContinued={this.checkoutContinuedHandler}
            ingredients={this.props.ingredients}
            price={this.props.price} />
          <Route path={this.props.match.path + "/order-data"} component={OrderData} />
        </div> :
        <Redirect to="/" />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ingredients: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    purchased: state.order.purchased,
  }
};


export default connect(mapStateToProps)(Checkout);