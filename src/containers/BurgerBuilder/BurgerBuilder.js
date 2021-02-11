import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from '../../axios-orders';

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildCintrols/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';

const BurgerBuilder = props => {
  const [orderReady, setOrderReady] = useState(false);

  const dispatch = useDispatch();

  const onIngredientAdded = ingrName => dispatch(actions.addIngredient(ingrName));
  const onIngredientRemoved = ingrName => dispatch(actions.removeIngredient(ingrName));
  const onInitIngredients = useCallback(() => dispatch(actions.initData()), [dispatch]);
  const onInitPurchase = () => dispatch(actions.initPurchase());
  const onSetAuthRedirectPath = path => dispatch(actions.setAuthRedirectPath(path));

  const ingredients = useSelector(state => state.burgerBuilder.ingredients);
  const totalPrice = useSelector(state => state.burgerBuilder.totalPrice);
  const error = useSelector(state => state.burgerBuilder.error);
  const isAuthenticated = useSelector(state => state.auth.token !== null);

  useEffect(() => { onInitIngredients() }, [onInitIngredients]);

  const updatePurchaseState = () => {
    const sum = Object.keys(ingredients)
      .map(ingName => {
        return ingredients[ingName]
      })
      .reduce((sum, amount) => {
        return sum + amount;
      }, 0);

    return sum > 0
  };

  const purchaseHandler = () => {
    if (isAuthenticated) setOrderReady(true);
    else {
      onSetAuthRedirectPath('/checkout');
      props.history.push('/auth');
    }
  };

  const purchaseCancelHandler = () => {
    setOrderReady(false)
  };

  const purchaseContinueHandler = () => {
    onInitPurchase();
    props.history.push({ pathname: '/checkout/' });
  };


  const disableInfo = {
    ...ingredients
  };

  for (const key in disableInfo) {
    disableInfo[key] = disableInfo[key] <= 0
  }
  //{salad: true, meat: false, ...}
  let burger = error ? <p style={{ textAlign: 'center', margin: 'auto' }}>
    Problem with loading data from the server :(</p> : <Spinner />
  let orderSummary = null;

  if (ingredients) {

    burger = (
      <React.Fragment>
        <Burger
          ingredients={ingredients} />
        <BuildControls
          ingredientAdded={(ingrName) => onIngredientAdded(ingrName)}
          ingredientRemoved={(ingrName) => onIngredientRemoved(ingrName)}
          disabled={disableInfo}
          isAuthenticated={isAuthenticated}
          price={totalPrice}
          purchasable={updatePurchaseState()}
          ordered={purchaseHandler}
        />
      </React.Fragment>);

    orderSummary = <OrderSummary
      ingredients={ingredients}
      totalPrice={totalPrice}
      purchaseCancelled={purchaseCancelHandler}
      purchaseContinued={purchaseContinueHandler}
    />;
  };

  return (
    <React.Fragment>
      <Modal
        show={orderReady}
        modalClosed={purchaseCancelHandler}>
        {orderSummary}
      </Modal>
      {burger}
    </React.Fragment>
  );
};



export default withErrorHandler(BurgerBuilder, axios);