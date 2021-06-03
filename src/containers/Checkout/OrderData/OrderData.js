import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from '../../../axios-orders';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions/index';
import { updateObject, checkValidity } from '../../../shared/utility';

import Spinner from '../../../components/UI/Spinner/Spinner';
import Button from '../../../components/UI/Button/Button';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import classes from './OrderData.module.css';

const ContactData = props => {
  const { onPurchaseOrder, price, ingredients, userId, token } = props;
  const formRef = useRef()

  const [orderFormState, setOrderFormState] = useState({
    name: {
      elementConfig: {
        type: 'text',
        placeholder: 'Full Name'
      },
      validation: {
        required: true,
        minLength: 2,
        maxLength: 12,
      },
      elementType: 'input',
      value: '',
      valid: false,
      touched: false,
    },
    city: {
      elementConfig: {
        type: 'text',
        placeholder: 'City'
      },
      validation: {
        required: true,
        minLength: 2,
        maxLength: 12,
      },
      elementType: 'input',
      value: '',
      valid: false,
      touched: false,
    },
    address: {
      elementConfig: {
        type: 'text',
        placeholder: 'Delivery address'
      },
      validation: {
        required: true,
        minLength: 2,
        maxLength: 20,
      },
      elementType: 'input',
      value: '',
      valid: false,
      touched: false,
    },
    tel: {
      elementConfig: {
        type: 'tel',
        placeholder: 'Telephone number',
      },
      validation: {
        required: true,
        isNumeric: true,
        minLength: 5,
        maxLength: 15,
      },
      elementType: 'input',
      value: '',
      valid: false,
      touched: false,
    },
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
    delivery: {
      elementType: 'select',
      elementConfig: {
        options: [
          { value: 'fastest', displayValue: 'Fastest' },
          { value: 'cheapest', displayValue: 'Cheapest' }
        ],
      },
      validation: {},
      value: 'fastest',
      valid: true,
    }
  });
  const [orderFormValidity, setorderFormValidity] = useState(false);

  useEffect(() => { formRef.current.scrollIntoView({ behavior: 'smooth' }) }, []);

  const orderHandler = useCallback(event => {
    event.preventDefault();
    const formData = {};
    for (let formElemId in orderFormState) {
      formData[formElemId] = orderFormState[formElemId].value;
    }
    const order = {
      userId: userId,
      ingredients: ingredients,
      price: price,
      orderData: formData,
      isoDate: new Date().toISOString(),
    }
    onPurchaseOrder(order, token);
  }, [orderFormState, onPurchaseOrder, price, ingredients, userId, token]);

  const inputChangedHandler = (event, inputIdentifier) => {

    const updatedFormElement = updateObject(orderFormState[inputIdentifier], {
      value: event.target.value,
      valid: checkValidity(event.target.value, orderFormState[inputIdentifier].validation),
      touched: true,
    });

    const updatedForm = updateObject(orderFormState, {
      [inputIdentifier]: updatedFormElement,
    });

    let formIsValid = true;
    for (let inputIdentifier in updatedForm) {
      formIsValid = updatedForm[inputIdentifier].valid && formIsValid;
    }

    setOrderFormState(updatedForm);
    setorderFormValidity(formIsValid);
  };

  let formElementsArray = [];
  for (let key in orderFormState) {
    formElementsArray.push({
      id: key,
      config: orderFormState[key],
    });
  };

  let form = <Spinner />;
  if (!props.loading) {
    form = (
      <form onSubmit={orderHandler} ref={formRef}>
        {formElementsArray.map(element => (
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
        ))}
        <Button btnType="Success" disabled={!orderFormValidity}>ORDER</Button>
      </form>
    );
  }

  return (
    <div className={classes.ContactData}>
      <h4>Enter your contact data</h4>
      {form}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    ingredients: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onPurchaseOrder: (order, token) => dispatch(actions.purchaseOrder(order, token))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));