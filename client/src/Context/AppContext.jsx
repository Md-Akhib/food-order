import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import toast from 'react-hot-toast';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentHero, setCurrentHero] = useState(null);
  const [categories, setCategories] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [menuitem, setMenuitem] = useState([]);
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('')
  const [searchedMenu, setSearchedMenu] = useState([]);

  // fetch user data
  const fetchUser = async () => {
    setLoadingUser(true);
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cartItems || []);
      }
    } catch (error) {
      setUser(null);
      setCartItems([]);
    } finally {
      setLoadingUser(false);
    }
  };

  // fetch Admin data
  const fetchAdmin = async () => {
    try {
      const { data } = await axios.get("/api/admin/is-auth");
      setIsAdmin(data.success);
    } catch (error) {
      setIsAdmin(false);
    }
  };

  // Fetch Hero section
  const fetchHero = async () => {
    try {
      const { data } = await axios.get('/api/hero/get');
      if (data.success) {
        setCurrentHero(data.hero);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch all categories from database
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('/api/category/get');
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const { data } = await axios.get('/api/menu/get');
      if (data.success) {
        setMenuitem(data.menuitems);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  // add to Cart 
  const addToCart = async (menuId) => {
    if (!user) {
      toast.error("Please log in to add to cart")
      return
    }
    try {
      const { data } = await axios.post('/api/user/add-to-cart', {
        menuId
      })
      if (data.success) {
        toast.success(data.message);
        await fetchUser();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  // remove product from cart
  const removeCart = async (menuId) => {
    if (!user) {
      toast.error("Please log in to manage your cart")
      return
    }
    try {
      const { data } = await axios.post('/api/user/remove-from-cart', {
        menuId
      })
      if (data.success) {
        toast.success(data.message);
        await fetchUser();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  // clear cart items 
  const clearCart = async () => {
    try {
      const { data } = await axios.post('/api/user/clear-cart');
      if (data.success) {
        await fetchUser();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  // get cart total price
  const cartAmount = () => {
    let amount = 0;

    if (user && user.cartItems) {
      for (const item of user.cartItems) {
        // FIX: Renamed inner variable to mItem to prevent shadowing the loop's 'item' variable
        let itemInfo = menuitem.find((mItem) => mItem._id === item.id);

        if (itemInfo) {
          amount += itemInfo.price * item.quantity;
        }
      }
    }

    return Math.floor(amount * 100) / 100;
  }

  // fetch orders
  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/api/order/user');
      if (data.success) {
        setOrders(data.orders)
      } else {
        setOrders([])
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    fetchHero();
    fetchCategories();
    fetchUser();
    fetchAdmin();
    fetchMenuItems();
  }, []);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const value = {
    user, setUser, loadingUser, isAdmin, setIsAdmin, navigate, axios, currentHero, fetchHero, fetchCategories,
    categories, fetchUser, menuitem, fetchMenuItems, addToCart, removeCart, cartAmount, clearCart,
    orders, setOrders, fetchOrders, search, setSearch, searchedMenu, setSearchedMenu, 
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
