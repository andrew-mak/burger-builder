import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import axios from '../../axios-orders';

import Burger from '../../components/Burger/Burger';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import BuildControls from '../../components/Burger/BuildCintrols/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';

const BurgerBuilder = props => {
  const { onInitIngredients, ingredients } = props;
  const [orderReady, setOrderReady] = useState(false);

  useEffect(() => {
    onInitIngredients();
  }, [onInitIngredients]);

  const updatePurchaseState = useCallback(() => {
    const sum = Object.keys(ingredients)
      .map(ingName => {
        return ingredients[ingName]
      })
      .reduce((sum, amount) => {
        return sum + amount;
      }, 0);

    return sum > 0
  }, [ingredients]);

  const purchaseHandler = () => {
    if (props.isAuthenticated) setOrderReady(true);
    else {
      props.onSetAuthRedirectPath('/checkout');
      props.history.push('/auth');
    }
  };

  const purchaseCancelHandler = () => {
    setOrderReady(false)
  };

  const purchaseContinueHandler = () => {
    props.onInitPurchase();
    props.history.push({ pathname: '/checkout/' });
  };


  const disableInfo = {
    ...props.ingredients
  };

  for (const key in disableInfo) {
    disableInfo[key] = disableInfo[key] <= 0
  }
  //{salad: true, meat: false, ...}
  let burger = props.error ? <p style={{ textAlign: 'center', margin: 'auto' }}>
    Problem with loading data from the server :(</p> : <Spinner />
  let orderSummary = null;

  if (props.ingredients) {

    burger = (
      <Aux>
        <Burger
          ingredients={props.ingredients} />
        <BuildControls
          ingredientAdded={(ingrName) => props.onIngredientAdded(ingrName)}
          ingredientRemoved={(ingrName) => props.onIngredientRemoved(ingrName)}
          disabled={disableInfo}
          isAuthenticated={props.isAuthenticated}
          price={props.totalPrice}
          purchasable={updatePurchaseState()}
          ordered={purchaseHandler}
        />
      </Aux>);

    orderSummary = <OrderSummary
      ingredients={props.ingredients}
      totalPrice={props.totalPrice}
      purchaseCancelled={purchaseCancelHandler}
      purchaseContinued={purchaseContinueHandler}
    />;
  };

  return (
    <Aux>
      <Modal
        show={orderReady}
        modalClosed={purchaseCancelHandler}>
        {orderSummary}
      </Modal>
      {burger}
    </Aux>
  );
};

const mapStateToProps = (state) => {
  return {
    ingredients: state.burgerBuilder.ingredients,
    totalPrice: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    isAuthenticated: state.auth.token !== null,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onIngredientAdded: (ingrName) => dispatch(actions.addIngredient(ingrName)),
    onIngredientRemoved: (ingrName) => dispatch(actions.removeIngredient(ingrName)),
    onInitIngredients: () => dispatch(actions.initData()),
    onInitPurchase: () => dispatch(actions.initPurchase()),
    onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path)),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));