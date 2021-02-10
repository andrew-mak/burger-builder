import React, { useEffect, useState } from 'react';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.module.css';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions/index';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { checkValidity } from '../../shared/utility';


const Auth = props => {
  console.log('Render Auth');
  const { buildingBurger, authRedirectPath, onSetAuthRedirectPath, error } = props;

  const [formState, setFormState] = useState({
    email: {
      elementConfig: {
        type: 'email',
        placeholder: 'E-mail',
      },
      validation: {
        required: true,
        isEmail: true,
      },
      elementType: 'input',
      value: '',
      valid: false,
      touched: false,
    },
    password: {
      elementConfig: {
        type: 'password',
        placeholder: 'Password',
      },
      validation: {
        required: true,
        minLength: 6,
      },
      elementType: 'input',
      value: '',
      valid: false,
      touched: false,
    },
    confirmPas: {
      elementConfig: {
        type: 'password',
        placeholder: 'Confirm password',
      },
      validation: {
        required: true,
        confirm: true,
        minLength: 6,
      },
      elementType: 'input',
      value: '',
      valid: false,
      touched: false,
    }
  });

  const [signupState, setSignupState] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [inputChanged, setInputChanged] = useState(false);

  useEffect(() => {
    if (!buildingBurger && authRedirectPath !== "/") {
      onSetAuthRedirectPath();
    }
  }, [buildingBurger, authRedirectPath, onSetAuthRedirectPath]);

  useEffect(() => {
    if (error && !inputChanged) {
      setErrorMessage(mapErrorMessages(error.message));
    }
    if (inputChanged) {
      setErrorMessage('');
    };
  }, [error, inputChanged]);

  const switchAuthModeHandler = () => {
    setSignupState(!signupState);
    setErrorMessage('');
  };

  const inputChangedHandler = (event, controlName) => {

    const updatedControls = {
      ...formState,
      [controlName]: {
        ...formState[controlName],
        value: event.target.value,
        valid: checkValidity(event.target.value, formState[controlName].validation),
        touched: true
      }
    };

    setFormState(updatedControls);
    setInputChanged(true);
  };

  const submitHandler = event => {
    event.preventDefault();
    if (signupState) {
      if (formState.password.value === formState.confirmPas.value) {
        setInputChanged(false);
        props.onAuth(formState.email.value, formState.password.value, signupState);
      }
      else setErrorMessage(mapErrorMessages("CONFIRM_PASSWORD"));
    }
    else {
      setInputChanged(false);
      props.onAuth(formState.email.value, formState.password.value, signupState);
    }
  };

  const mapErrorMessages = (error) => {
    switch (error) {
      case 'INVALID_PASSWORD': return "The password is invalid or the user does not have a password."
      case 'INVALID_EMAIL': return "The email address is missing or badly formatted."
      case 'EMAIL_NOT_FOUND': return "Email not found. There is no user record corresponding to this identifier.The user may have been deleted."
      case 'EMAIL_EXISTS': return "The email address is already in use by another account.";
      case 'MISSING_EMAI': return "Please, enter email.";
      case 'MISSING_PASSWORD': return "Please, enter password.";
      case 'WEAK_PASSWORD : Password should be at least 6 characters': return "Weak password: Password should be at least 6 characters."
      case 'OPERATION_NOT_ALLOWED': return "Password sign -in is disabled for this project. Operation not allowed.";
      case 'TOO_MANY_ATTEMPTS_TRY_LATER': return "We have blocked all requests from this device due to unusual activity. Try again later.";
      case 'USER_DISABLED': return "The user account has been disabled by an administrator."
      case 'CONFIRM_PASSWORD': return "Passwords don't match."
      case ' ':
      case '': return null
      default: return "Something go wrong, please try again."
    }
  };

  let formElementsArray = [];
  for (let key in formState) {
    if (key === "confirmPas" && !signupState) break

    formElementsArray.push({
      id: key,
      config: formState[key],
    });
  };

  let form = formElementsArray.map(element =>
    <Input
      key={element.id}
      elementType={element.config.elementType}
      elementConfig={element.config.elementConfig}
      value={element.config.value}
      shouldValidate={element.config.validation}
      touched={element.config.touched}
      invalid={!element.config.valid}
      changed={event => inputChangedHandler(event, element.id)}
    />
  );

  if (props.loading) form = <Spinner />;

  let authRedirect = null;
  if (props.isAuthenticated) authRedirect = <Redirect to={props.authRedirectPath} />;

  return (
    <div className={classes.Auth}>
      {authRedirect}
      <div className={classes.TopContainer}>
        <h4>Sign {signupState ? "up" : "in"}</h4>
        <Button
          clicked={switchAuthModeHandler}
          btnType="Danger">
          {signupState ? 'SIGNIN' : 'SIGNUP'}  &gt;&gt;
          </Button>
      </div>
      <form onSubmit={submitHandler}>
        {form}
        <p className={classes.AuthError}>
          {errorMessage}
        </p>
        <Button btnType="Success">Submit</Button>
      </form>
    </div >
  );
};

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null,
    buildingBurger: state.burgerBuilder.building,
    authRedirectPath: state.auth.authRedirectPath
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
    onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);