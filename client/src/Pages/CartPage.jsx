import React from 'react';
import Banner from '../Components/Banner/Banner';
import Cart from '../Components/Cart/Cart';

const CartPage = () => {
  return (
    <>
      <Banner title="Your Cart" />
      <Cart />
    </>
  );
};

export default CartPage;
