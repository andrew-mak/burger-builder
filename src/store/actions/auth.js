import * as actionTypes from './actionTypes';
import axios from 'axios';

export const logout = () => {
  return {
    type: actionTypes.AUTH_LOGOUT
  }
}

export const checkAuthTimeout = (expirationTime) => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000)
  };
};

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  }
};

export const authSuccess = (authData) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    data: {
      token: authData.data.idToken,
      userId: authData.data.localId
    }
  }
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error
  }
};

export const auth = (email, password, isSignup) => {
  return dispatch => {
    dispatch(authStart());
    const authData = {
      email: email,
      password: password,
      returnSecureToken: true
    };
    let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyC1LFYzuxhh_xMYguzL_GyNsJuPn7uiXGw';
    if (isSignup) {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyC1LFYzuxhh_xMYguzL_GyNsJuPn7uiXGw';
    }
    axios.post(url, authData)
      .then(response => {
        dispatch(authSuccess(response));
        dispatch(checkAuthTimeout(response.data.expiresIn));
      })
      .catch(error => {
        dispatch(authFail(error.response.data.error));
      })
  }
};