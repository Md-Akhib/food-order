import React from 'react';
import Banner from '../Components/Banner/Banner';
import Order from '../Components/Orders/Orders';

const OrderPage = () => {
  return (
    <>
      <Banner title="Your Orders" />
      <Order />
    </>
  );
};

export default OrderPage;
