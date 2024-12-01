/**
 * THIS FILE IS NOT BEING IMPORTED ANYWHERE
 *
 * This code is for the reference to Context API, previously I was using the Context API for state management of entire project.
 * Now I'm using the useReducer hook.
 */

import { createContext, useReducer, useState } from "react";
import { DUMMY_PRODUCTS } from "../dummy-products";

export const CartContext = createContext({
  items: [],
  addItemToCart: () => {}, // dummy function, cause we are getting the implementation from the App component (auto completion)
  updateItemQuantity: () => {},
});

export const CartContextProvider = ({ children }) => {
  const [shoppingCart, setShoppingCart] = useState({
    items: [],
  });

  function handleAddItemToCart(id) {
    setShoppingCart((prevShoppingCart) => {
      const updatedItems = [...prevShoppingCart.items];

      const existingCartItemIndex = updatedItems.findIndex(
        (cartItem) => cartItem.id === id
      );
      const existingCartItem = updatedItems[existingCartItemIndex];

      if (existingCartItem) {
        const updatedItem = {
          ...existingCartItem,
          quantity: existingCartItem.quantity + 1,
        };
        updatedItems[existingCartItemIndex] = updatedItem;
      } else {
        const product = DUMMY_PRODUCTS.find((product) => product.id === id);
        updatedItems.push({
          id: id,
          name: product.title,
          price: product.price,
          quantity: 1,
        });
      }

      return {
        items: updatedItems,
      };
    });
  }

  function handleUpdateCartItemQuantity(productId, amount) {
    setShoppingCart((prevShoppingCart) => {
      const updatedItems = [...prevShoppingCart.items];
      const updatedItemIndex = updatedItems.findIndex(
        (item) => item.id === productId
      );

      const updatedItem = {
        ...updatedItems[updatedItemIndex],
      };

      updatedItem.quantity += amount;

      if (updatedItem.quantity <= 0) {
        updatedItems.splice(updatedItemIndex, 1);
      } else {
        updatedItems[updatedItemIndex] = updatedItem;
      }

      return {
        items: updatedItems,
      };
    });
  }

  /*Same structure we have for the context value which we have to pass to the context provider, getting the values from
  shoppingCart state */
  const contextValue = {
    items: shoppingCart.items,
    addItemToCart: handleAddItemToCart, // sharing the state update function to the context
    updateItemQuantity: handleUpdateCartItemQuantity,
  };

  /**
   * Anything wrapped in the context provider will have access to the contextValue and the variables, functions which are shared
   * inside that context value, in this scenario, Product component can directly call the handleAddItemToCart fuction through
   * addItemToCart using the context value, no need to pass the prop.
   */

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};
