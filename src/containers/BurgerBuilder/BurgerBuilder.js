import React, { Component } from 'react';

import Burger from '../../components/Burger/Burger';
import Aux from '../../hoc/Auxiliary';
import BuildControls from '../../components/Burger/BuildCintrols/BuildControls';

const INGREDIENT_PRICES = {
  salad: 1.0,
  cheese: 1.2,
  bacon: 1.4,
  meat: 1.5,
}

class BurgerBuilder extends Component {

  state = {
    ingredients: {
      salad: 0,
      bacon: 0,
      cheese: 0,
      meat: 0,
    },
    totalPrice: 0,
  }

  addIngredientHandler = (type) => {
    const updatedCount = this.state.ingredients[type] + 1;

    const updatedIngredients = {
      ...this.state.ingredients
    };

    updatedIngredients[type] = updatedCount;
    const updatedPrice = this.state.totalPrice + INGREDIENT_PRICES[type];
    this.setState({ ingredients: updatedIngredients, totalPrice: updatedPrice });
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
  }

  render() {

    const disableInfo = {
      ...this.state.ingredients
    };

    for (const key in disableInfo) {
      disableInfo[key] = disableInfo[key] <= 0
    }
    //{salad: true, meat: false, ...}
    return (
      <Aux>
        <Burger ingredients={this.state.ingredients} />
        <BuildControls
          ingredientAdded={this.addIngredientHandler}
          ingredientRemoved={this.removeIngredientHandler}
          disabled={disableInfo}
          price={this.state.totalPrice}
        />
      </Aux>
    );
  }
}

export default BurgerBuilder;