import React, { Component } from 'react';
import axios from '../../../axios-orders';

import Spinner from '../../../components/UI/Spinner/Spinner';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.module.css';

class ContactData extends Component {
  state = {
    name: '',
    email: '',
    address: {
      street: '',
      postalCode: ''
    },
    loading: false,
  }

  orderHandler = (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.totalPrice,
      customer: {
        name: 'Andrew Makarevich',
        address: {
          city: 'Navahrudak',
          street: 'Kalinoŭskaha 20',
          zipCode: '231400',
          country: 'Belarus'
        },
        email: 'freedom@bel.by',
        deliveryMethod: 'fastest'
      }
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

  render() {
    return (
      <div className={classes.ContactData}>
        <h4>Enter your contact data</h4>
        <form>
          {this.state.loading ? <Spinner /> :
            <React.Fragment>
              <input type="text" name="name" placeholder="Your name" className={classes.Input} />
              <input type="email" name="email" placeholder="Your Mail" className={classes.Input} />
              <input type="text" name="street" placeholder="Your street" className={classes.Input} />
              <input type="text" name="postal" placeholder="Postal code" className={classes.Input} />
              <Button btnType="Success" clicked={this.orderHandler}>ORDER</Button>
            </React.Fragment>
          }
        </form>
      </div>
    );
  }
}

export default ContactData;