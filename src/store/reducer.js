import * as actionTypes from './actions';

const INGREDIENT_PRICES = {
  salad: 1.0,
  cheese: 1.2,
  bacon: 1.4,
  meat: 1.5,
}

const initState = {
  ingredients: {
    bacon: 0,
    cheese: 0,
    meat: 0,
    salad: 0
  },
  totalPrice: 0,
};

const reducer = (state = initState, actions) => {
  switch (actions.type) {
    case actionTypes.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: {
          ...state.ingredients,
          [actions.ingredientName]: state.ingredients[actions.ingredientName] + 1
        },
        totalPrice: state.totalPrice + INGREDIENT_PRICES[actions.ingredientName]
      };

    case actionTypes.REMOVE_INGREDIENT:

      if (state.ingredients[actions.ingredientName] <= 0) {
        return;
      };

      return {
        ...state,
        ingredients: {
          ...state.ingredients,
          [actions.ingredientName]: state.ingredients[actions.ingredientName] - 1
        },
        totalPrice: state.totalPrice - INGREDIENT_PRICES[actions.ingredientName]
      };

    default:
      return state
  }
}

export default reducer;