import React, { Component } from 'react';
import axios from '../../../axios-orders';

import Spinner from '../../../components/UI/Spinner/Spinner';
import Button from '../../../components/UI/Button/Button';
import Input from '../../../components/UI/Input/Input';
import classes from './ContactData.module.css';

class ContactData extends Component {
  state = {
    orderForm: {
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
          pattern: "[0-9]{12}",
        },
        validation: {
          required: true,
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
          minLength: 5,
          maxLength: 28,
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
      },
    },
    loading: false,
    formIsValid: false,
  }

  orderHandler = (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    const formData = {};
    for (let formElemId in this.state.orderForm) {
      formData[formElemId] = this.state.orderForm[formElemId].value;
    }
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.totalPrice,
      orderData: formData
    }
    axios.post('/orders.json', order)
      .then(response => {
        this.setState({ loading: false });
        this.props.history.push('/');
      })
      .catch(error => {
        this.setState({ loading: false });
        console.log(error);
      });
  }

  inputChangedHandler = (event, inputIdentifier) => {

    const updatedOrderForm = {
      ...this.state.orderForm
    };

    const updatedFormElement = {
      ...updatedOrderForm[inputIdentifier]
    };

    updatedFormElement.value = event.target.value;
    updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
    updatedOrderForm[inputIdentifier] = updatedFormElement;
    updatedFormElement.touched = true;

    let formIsValid = true;
    for (let inputIdentifier in updatedOrderForm) {
      formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
    }

    this.setState({ orderForm: updatedOrderForm, formIsValid: formIsValid });
  }

  checkValidity(value, rules) {
    let isValid = true;

    if (rules.required) {
      isValid = value.trim() !== '' && isValid;
    }
    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }
    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }

    return isValid;
  }

  render() {
    let formElementsArray = [];
    for (let key in this.state.orderForm) {
      formElementsArray.push({
        id: key,
        config: this.state.orderForm[key],
      });
    }

    let form = <Spinner />;
    if (!this.state.loading) {
      form = (
        <form onSubmit={this.orderHandler}>
          {formElementsArray.map(element => (
            <Input
              key={element.id}
              elementType={element.config.elementType}
              elementConfig={element.config.elementConfig}
              value={element.config.value}
              shouldValidate={element.config.validation}
              touched={element.config.touched}
              invalid={!element.config.valid}
              changed={(event,) => this.inputChangedHandler(event, element.id)}
            />
          ))}
          <Button btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
        </form>
      );
    }

    return (
      <div className={classes.ContactData}>
        <h4>Enter your contact data</h4>
        {form}
      </div>
    );
  }
}

export default ContactData;