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
      key={ig.name} style={{
        textTransform: 'capitalize', display: 'inline-block', margin: '0 8px', border: '1px solid #ccc'
      }}>
      {ig.name}: {ig.amount}
    </span>;
  });

  return (
    <div className={classes.Order}>
      <p>Ingredients: {ingredientOutput}</p>
      <p>Price: <strong>USD {props.price}</strong></p>
    </div>
  );
}

export default order;