import React from 'react';

import classes from './Order.module.css';

const order = (props) => {

  const ingredients = [];

  for (const ingredientName in props.ingredients) {
    ingredients.push({
      name: ingredientName,
      amount: props.ingredients[ingredientName]
    });
  }

  const ingredientOutput = ingredients.map(ig => {
    return <span
      key={ig.name} className={classes.Ingredient}>
      {ig.name}: {ig.amount}
    </span>;
  });

  return (
    <div className={classes.OrderContainer}>
      <div className={classes.OrderInfo}>
        <div>{new Date(props.isoDate).toLocaleString()}</div>
        <div><strong><i>Phone:</i></strong> {props.orderData.tel}</div>
        <div><strong><i>Delivery:</i></strong> {props.orderData.city} {props.orderData.address}</div>
        <div className={classes.Price}>Check: <strong>{props.price} $</strong></div>
      </div>
      <div className={classes.Ingredients}><p>Ingredients:</p>{ingredientOutput}</div>
    </div>
  );
}

export default order;