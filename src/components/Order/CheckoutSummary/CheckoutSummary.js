import React from 'react';
import Burger from '../../Burger/Burger';
import Button from '../../UI/Button/Button';
import classes from './CheckoutSummary.module.css';

const checkoutSummary = (props) => {
  return (
    <div className={classes.checkoutSummary}>
      <h1>We hope you would like it!</h1>
      <div className={classes.BurgerContainer}>
        <Burger ingredients={props.ingredients} />
        <div className={classes.Price}>$ {props.price.toFixed(2).replace('-0', '0')}</div>
      </div>
      <Button
        clicked={props.checkoutCanceled}
        btnType="Danger">CANCEL</Button>
      <Button
        clicked={props.checkoutContinued}
        btnType="Success">CONTINUE</Button>
    </div>
  );
}

export default checkoutSummary;