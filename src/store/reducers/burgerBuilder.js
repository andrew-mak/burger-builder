import * as actionTypes from '../actions/actionTypes';

const INGREDIENT_PRICES = {
  salad: 1.0,
  cheese: 1.2,
  bacon: 1.4,
  meat: 1.5,
}

const initState = {
  ingredients: null,
  totalPrice: 0,
  error: false
};

const addIngredient = (state, actions) => {
  return {
    ...state,
    ingredients: {
      ...state.ingredients,
      [actions.ingredientName]: state.ingredients[actions.ingredientName] + 1
    },
    totalPrice: state.totalPrice + INGREDIENT_PRICES[actions.ingredientName]
  };
}
const removeEngredient = (state, actions) => {
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
}
const setInitData = (state, actions) => {
  return {
    ...state,
    ingredients: {
      salad: actions.init.ingredients.salad,
      bacon: actions.init.ingredients.bacon,
      cheese: actions.init.ingredients.cheese,
      meat: actions.init.ingredients.meat,
    },
    totalPrice: actions.init.price,
    error: false
  }
}
const fetchInitDataFailed = (state) => {
  return {
    ...state,
    error: true
  }
}

const reducer = (state = initState, actions) => {
  switch (actions.type) {
    case actionTypes.ADD_INGREDIENT: return addIngredient(state, actions);
    case actionTypes.REMOVE_INGREDIENT: return removeEngredient(state, actions);
    case actionTypes.SET_INGREDIENTS: return setInitData(state, actions);
    case actionTypes.FETCH_INGREDENTS_FAILED: return fetchInitDataFailed(state);
    default:
      return state
  }
}

export default reducer;