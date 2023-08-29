import React, { createContext, useContext, useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(getCartFromLocalStorage() || []);
    const [itemQuantities, setItemQuantities] = useState({});

    function getCartFromLocalStorage() {
        const cartItemsString = localStorage.getItem('cartItems');
        return cartItemsString ? JSON.parse(cartItemsString) : [];
    }

    function saveCartToLocalStorage(cartItems) {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }

    const addToCart = (item, quantity = 1) => {
        const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);

        if (existingItem) {
            const newQuantity = (itemQuantities[item.id] || existingItem.quantity) + quantity;
            setItemQuantities((prevQuantities) => ({ ...prevQuantities, [item.id]: newQuantity }));
        } else {
            setCartItems([...cartItems, { ...item, quantity }]);
        }

        Swal.fire({
            icon: 'success',
            title: 'Producto Agregado',
            text: 'El producto se ha agregado al carrito exitosamente.',
            confirmButtonText: 'Aceptar',
        });
    };

    const removeFromCart = (itemId) => {
        setCartItems(cartItems.filter((item) => item.id !== itemId));

        Swal.fire({
            icon: 'success',
            title: 'Producto Eliminado',
            text: 'El producto se ha eliminado del carrito exitosamente.',
            confirmButtonText: 'Aceptar',
        });
    };

    const clearCart = () => {
        setCartItems([]);
        setItemQuantities({});
        localStorage.removeItem('cartItems');
        Swal.fire({
            icon: 'success',
            title: 'Compra Satisfactoria',
            text: 'Tu compra se ha realizado con éxito. ¡Gracias por tu pedido!',
            confirmButtonText: 'Aceptar',
        });
    };

    const updateCart = () => {
        const updatedCartItems = cartItems.map((item) => {
            const newQuantity = itemQuantities[item.id] || item.quantity;
            return { ...item, quantity: newQuantity };
        });

        setCartItems(updatedCartItems);
        setItemQuantities({});
    };

    useEffect(() => {
        saveCartToLocalStorage(cartItems);
    }, [cartItems]);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, setCartItems, handleQuantityChange: setItemQuantities, updateCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
