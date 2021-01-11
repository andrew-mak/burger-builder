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
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Full Name'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
      },
      city: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'City'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
      },
      address: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Delivery address'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
      },
      tel: {
        elementType: 'input',
        elementConfig: {
          type: 'tel',
          placeholder: 'Telephone number',
          pattern: "[0-9]{12}",
          required: true,
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
      },
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'E-mail',
          // pattern: "",
          required: true,
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
      },
      delivery: {
        elementType: 'select',
        elementConfig: {
          options: [
            { value: 'fastest', displayValue: 'Fastest' },
            { value: 'cheapest', displayValue: 'Cheapest' }
          ],
          // config: {}
        },
        value: ''
      },
    },
    loading: false,
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
    updatedOrderForm[inputIdentifier] = updatedFormElement;
    this.setState({ orderForm: updatedOrderForm });
  }

  checkValidity(value, rules) {

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
              changed={(event,) => this.inputChangedHandler(event, element.id)}
            />
          ))}
          <Button btnType="Success">ORDER</Button>
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