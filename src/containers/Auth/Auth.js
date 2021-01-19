import React, { Component } from 'react';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.module.css';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions/index';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';


class Auth extends Component {
  state = {
    controls: {
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
    },
    isSignup: true,
    formMessage: '',
    inputChanged: false,
  }

  switchAuthModeHandler = () => {
    this.setState(prevState => {
      return { isSignup: !prevState.isSignup };
    })
  }

  inputChangedHandler = (event, controlName) => {

    const updatedControls = {
      ...this.state.controls,
      [controlName]: {
        ...this.state.controls[controlName],
        value: event.target.value,
        valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation),
        touched: true
      }
    };

    this.setState({
      controls: updatedControls,
      inputChanged: true,
    });
  }

  checkValidity(value, rules) {
    let isValid = true;
    if (!rules) {
      return true;
    }

    if (rules.required) {
      isValid = value.trim() !== '' && isValid;
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid
    }

    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid
    }

    if (rules.isEmail) {
      const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      isValid = pattern.test(value) && isValid
    }

    if (rules.isNumeric) {
      const pattern = /^\d+$/;
      isValid = pattern.test(value) && isValid
    }

    if (rules.confirm) {
      let confirmed = false;
      if (this.state.controls.password.value) {

        confirmed = this.state.controls.password.value === value;
        let formMessage = '';
        if (!confirmed) {
          formMessage = "Passwords don't match";
        }
        this.setState({ formMessage: formMessage });
      }
      isValid = confirmed && isValid;
    }

    return isValid;
  }

  submitHandler = (event) => {
    this.setState({ inputChanged: false });
    event.preventDefault();
    this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignup);
  }

  mapErrorMessages = (error) => {
    switch (error) {
      case 'INVALID_PASSWORD': return "The password is invalid or the user does not have a password."
      case 'INVALID_EMAIL': return "The email address is missing or badly formatted."
      case 'EMAIL_NOT_FOUND': return "Email not found. There is no user record corresponding to this identifier.The user may have been deleted."
      case 'EMAIL_EXISTS': return "The email address is already in use by another account.";
      case 'MISSING_PASSWORD': return "The password is missing."
      case 'WEAK_PASSWORD : Password should be at least 6 characters': return "Weak password: Password should be at least 6 characters."
      case 'OPERATION_NOT_ALLOWED': return "Password sign -in is disabled for this project. Operation not allowed.";
      case 'TOO_MANY_ATTEMPTS_TRY_LATER': return "We have blocked all requests from this device due to unusual activity. Try again later.";
      case 'USER_DISABLED': return "The user account has been disabled by an administrator."
      case ' ': return null
      default: return "Something go wrong, please try again."
    }
  }

  render() {
    let formElementsArray = [];
    for (let key in this.state.controls) {
      if (key === "confirmPas" && !this.state.isSignup) break

      formElementsArray.push({
        id: key,
        config: this.state.controls[key],
      });
    }

    let form = formElementsArray.map(element =>
      <Input
        key={element.id}
        elementType={element.config.elementType}
        elementConfig={element.config.elementConfig}
        value={element.config.value}
        shouldValidate={element.config.validation}
        touched={element.config.touched}
        invalid={!element.config.valid}
        changed={(event) => this.inputChangedHandler(event, element.id)}
      />
    );

    if (this.props.loading) form = <Spinner />;

    let authErrorMessage = null;
    if (this.props.error && !this.state.inputChanged) authErrorMessage =
      <p className={classes.AuthError}>
        {this.mapErrorMessages(this.props.error.message)}
      </p>;

    let authRedirect = null;
    if (this.props.isAuthenticated) authRedirect = <Redirect to="/" />;

    return (
      <div className={classes.Auth}>
        {authRedirect}
        <div className={classes.TopContainer}>
          <h4>Sign {this.state.isSignup ? "up" : "in"}</h4>
          <Button
            clicked={this.switchAuthModeHandler}
            btnType="Danger">
            {this.state.isSignup ? 'SIGNIN' : 'SIGNUP'}  &gt;&gt;
          </Button>
        </div>
        <form onSubmit={this.submitHandler}>
          {form}
          <div className={classes.FormMessage} > {this.state.formMessage}</div>
          {authErrorMessage}
          <Button btnType="Success">Submit</Button>
        </form>
      </div >
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);