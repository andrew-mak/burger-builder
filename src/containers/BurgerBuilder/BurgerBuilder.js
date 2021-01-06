import React, { Component } from 'react';

import Burger from '../../components/Burger/Burger';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import BuildControls from '../../components/Burger/BuildCintrols/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

import axios from '../../axios-orders';

const INGREDIENT_PRICES = {
  salad: 1.0,
  cheese: 1.2,
  bacon: 1.4,
  meat: 1.5,
}

class BurgerBuilder extends Component {

  state = {
    ingredients: null,
    totalPrice: 0,
    purchasable: false,
    purchasing: false,
    loading: false,
    error: false,
  }

  componentDidMount() {
    axios.get('/ingredients.json')
      .then(response => {
        this.setState({ ingredients: response.data });
      })
      .catch(error => {
        this.setState({ error: true })
        console.log(error);
      });
  }

  updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey]
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);

    this.setState({ purchasable: sum > 0 })
  }

  addIngredientHandler = (type) => {
    const updatedCount = this.state.ingredients[type] + 1;

    const updatedIngredients = {
      ...this.state.ingredients
    };

    updatedIngredients[type] = updatedCount;
    const updatedPrice = this.state.totalPrice + INGREDIENT_PRICES[type];
    this.setState({ ingredients: updatedIngredients, totalPrice: updatedPrice });
    this.updatePurchaseState(updatedIngredients);
  }

  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    if (oldCount <= 0) {
      return;
    }
    let updatedCount = oldCount - 1;
    const updatedIngredients = {
      ...this.state.ingredients
    };
    updatedIngredients[type] = updatedCount;
    let updatedPrice = this.state.totalPrice - INGREDIENT_PRICES[type];

    this.setState({ ingredients: updatedIngredients, totalPrice: updatedPrice });
    this.updatePurchaseState(updatedIngredients);
  }

  purchaseHandler = () => {
    this.setState({ purchasing: true });
  }

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false })
  }

  purchaseContinueHandler = () => {
    this.setState({ loading: true });
    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice.toFixed(2).replace('-0', '0'),
      customer: {
        name: 'Andrew Makarevich',
        address: {
          city: 'Navahrudak',
          street: 'Kalinoŭskaha 20',
          zipCode: '231400',
          country: 'Belarus'
        },
        email: 'freedom@bel.by',
        deliveryMethod: 'fastest'
      }
    }
    axios.post('/orders.json', order)
      .then(response => {
        this.setState({ loading: false, purchasing: false });
      })
      .catch(error => {
        this.setState({ loading: false, purchasing: false });
        console.log(error);
      });
  }

  render() {

    const disableInfo = {
      ...this.state.ingredients
    };

    for (const key in disableInfo) {
      disableInfo[key] = disableInfo[key] <= 0
    }
    //{salad: true, meat: false, ...}

    let burger = this.state.error ? <p style={{ textAlign: 'center', margin: 'auto' }}>
      Problem with loading ingredients from the server :(</p> : <Spinner />
    let orderSummary = null;

    if (this.state.ingredients) {
      burger = (
        <Aux>
          <Burger
            ingredients={this.state.ingredients} />
          <BuildControls
            ingredientAdded={this.addIngredientHandler}
            ingredientRemoved={this.removeIngredientHandler}
            disabled={disableInfo}
            price={this.state.totalPrice}
            purchasable={this.state.purchasable}
            ordered={this.purchaseHandler}
          />
        </Aux>);

      orderSummary = <OrderSummary
        ingredients={this.state.ingredients}
        totalPrice={this.state.totalPrice}
        purchaseCancelled={this.purchaseCancelHandler}
        purchaseContinued={this.purchaseContinueHandler}
      />;
    }

    if (this.state.loading) orderSummary = <Spinner />;

    return (
      <Aux>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

export default withErrorHandler(BurgerBuilder, axios);