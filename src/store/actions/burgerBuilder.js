import axios from '../../axios-orders';
import * as actionTypes from './actionTypes';


export const addIngredient = (name) => {
  return {
    type: actionTypes.ADD_INGREDIENT,
    ingredientName: name
  }
}

export const removeIngredient = (name) => {
  return {
    type: actionTypes.REMOVE_INGREDIENT,
    ingredientName: name
  }
}

export const setInitData = (data) => {
  return {
    type: actionTypes.SET_INGREDIENTS,
    init: data
  }
}

export const fetchInitDataFailed = () => {
  return {
    type: actionTypes.FETCH_INGREDENTS_FAILED
  }
}

export const initData = () => {
  return (dispatch) => {
    axios.get('/init.json')
      .then(response => {
        dispatch(setInitData(response.data));
      })
      .catch(error => {
        dispatch(fetchInitDataFailed());
      });
  }
}