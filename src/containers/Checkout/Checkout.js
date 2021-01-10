import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';

class Checkout extends Component {
  state = {
    ingredients: {
      salad: 0,
      meat: 0,
      bacon: 0,
      cheese: 0
    },
    totalPrice: 0,
    ingrHandled: false,
  }

  checkoutCanceledHandler = () => {
    this.props.history.goBack();
  }

  checkoutContinuedHandler = () => {
    this.props.history.replace("/checkout/contact-data");
  }

  componentDidMount = () => {
    this.handleIngredients();
  }

  componentDidUpdate = () => {
    this.handleIngredients();
  }

  componentWillUnmount = () => {
    this.setState({ ingrHandled: false })
  }

  handleIngredients = () => {
    if (this.state.ingrHandled) return;
    let price = 0;
    const query = new URLSearchParams(this.props.location.search);
    let ingredients = {};
    for (let p of query.entries()) {
      if (p[0] !== 'price') ingredients[p[0]] = +p[1];
      else price = +p[1];
    }

    this.setState({
      ingredients: ingredients,
      totalPrice: price,
      ingrHandled: true
    });
  }

  render() {
    return (
      <div>
        <CheckoutSummary
          checkoutCanceled={this.checkoutCanceledHandler}
          checkoutContinued={this.checkoutContinuedHandler}
          ingredients={this.state.ingredients} />
        <Route path={this.props.match.path + "/contact-data"}
          render={(props) => (<ContactData
            ingredients={this.state.ingredients}
            totalPrice={this.state.totalPrice}
            {...props}
          />)}
        />
      </div>
    );
  }
}

export default Checkout;