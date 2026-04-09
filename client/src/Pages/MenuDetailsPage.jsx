import React from 'react';
import Banner from '../Components/Banner/Banner';
import MenuDetails from '../Components/MenuDetails/MenuDetails';
import Comments from '../Components/Comments/Comments';

const MenuDetailsPage = () => {
  return (
    <>
        <Banner title="Menu Details" />
        <MenuDetails />
        <Comments />
    </>
  );
}

export default MenuDetailsPage;
