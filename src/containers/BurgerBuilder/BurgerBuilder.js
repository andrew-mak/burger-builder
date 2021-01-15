import React, { Component } from 'react';
import axios from '../../axios-orders';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';

import Burger from '../../components/Burger/Burger';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import BuildControls from '../../components/Burger/BuildCintrols/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

class BurgerBuilder extends Component {

  state = {
    purchasing: false,
    loading: false,
    error: false,
  }

  componentDidMount() {
    // axios.get('/ingredients.json')
    //   .then(response => {
    //     this.setState({ ingredients: response.data });
    //   })
    //   .catch(error => {
    //     this.setState({ error: true })
    //     console.log(error);
    //   });
  }

  updatePurchaseState() {
    const sum = Object.keys(this.props.ingredients)
      .map(ingName => {
        return this.props.ingredients[ingName]
      })
      .reduce((sum, amount) => {
        return sum + amount;
      }, 0);

    return sum > 0
  }

  purchaseHandler = () => {
    this.setState({ purchasing: true });
  }

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false })
  }

  purchaseContinueHandler = () => {
    this.props.history.push({ pathname: '/checkout/' });
  }

  render() {

    const disableInfo = {
      ...this.props.ingredients
    };

    for (const key in disableInfo) {
      disableInfo[key] = disableInfo[key] <= 0
    }
    //{salad: true, meat: false, ...}

    let burger = this.state.error ? <p style={{ textAlign: 'center', margin: 'auto' }}>
      Problem with loading ingredients from the server :(</p> : <Spinner />
    let orderSummary = null;

    if (this.props.ingredients) {

      burger = (
        <Aux>
          <Burger
            ingredients={this.props.ingredients} />
          <BuildControls
            ingredientAdded={(ingrName) => this.props.onIngredientAdded(ingrName)}
            ingredientRemoved={(ingrName) => this.props.onIngredientRemoved(ingrName)}
            disabled={disableInfo}
            price={this.props.totalPrice}
            purchasable={this.updatePurchaseState()}
            ordered={this.purchaseHandler}
          />
        </Aux>);

      orderSummary = <OrderSummary
        ingredients={this.props.ingredients}
        totalPrice={this.props.totalPrice}
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

const mapStateToProps = (state) => {
  return {
    ingredients: state.ingredients,
    totalPrice: state.totalPrice
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onIngredientAdded: (ingrName) => dispatch({ type: actionTypes.ADD_INGREDIENT, ingredientName: ingrName }),
    onIngredientRemoved: (ingrName) => dispatch({ type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingrName })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));