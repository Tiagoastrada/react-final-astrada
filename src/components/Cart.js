import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';

const Cart = () => {
    const navigate = useNavigate();
    const { cartItems, setCartItems, clearCart, updateCart } = useCart();
    const [showCheckout, setShowCheckout] = useState(false);
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        address: '',
    });

    const handleRemoveFromCart = (itemId) => {
        setCartItems(cartItems.filter((item) => item.id !== itemId));
    };

    const handleQuantityChange = (itemId, newQuantity) => {
        const updatedCartItems = cartItems.map((item) =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedCartItems);
    };

    const handleBuy = async () => {
        if (cartItems.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Carrito Vacío',
                text: 'El carrito está vacío. Agrega productos antes de comprar.',
                confirmButtonText: 'Aceptar',
            });
            return;
        }

        if (!userData.name || !userData.email || !userData.address) {
            Swal.fire({
                icon: 'error',
                title: 'Campos Incompletos',
                text: 'Por favor, completa todos los campos de información del usuario.',
                confirmButtonText: 'Aceptar',
            });
            return;
        }

        updateCart();

        try {
            const db = getFirestore();
            const orderRef = await addDoc(collection(db, 'orders'), {
                userData,
                cartItems,
                createdAt: new Date(),
            });

            const orderNumber = orderRef.id;

            Swal.fire({
                icon: 'success',
                title: 'Compra Satisfactoria',
                text: `Tu número de pedido es: ${orderNumber}`,
                confirmButtonText: 'Aceptar',
            });

            clearCart();
            setShowCheckout(false);
            setUserData({
                name: '',
                email: '',
                address: '',
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ha ocurrido un error al procesar tu compra. Por favor, intenta nuevamente.',
                confirmButtonText: 'Aceptar',
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const toggleCheckout = () => {
        setShowCheckout(!showCheckout);
    };

    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const taxes = subtotal * 0.21;
    const total = subtotal + taxes;

    return (
        <div className="small-container cart-page">
            <div id="contenedor-carrito">
                {cartItems.length > 0 && (
                    <table id="tabla-de-carrito">
                        <thead>
                            <tr>
                                <th>Imagen</th>
                                <th>Nombre</th>
                                <th>Cantidad</th>
                                <th>Precio</th>
                                <th>Eliminar</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <img src={item.image} alt={item.name} />
                                    </td>
                                    <td>{item.name}</td>
                                    <td>
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                                        />
                                    </td>
                                    <td>${item.price}</td>
                                    <td>
                                        <button className="btn-eliminar" onClick={() => handleRemoveFromCart(item.id)}>
                                            X
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                <div className="total-price">
                    <table>
                        <tbody>
                            <tr>
                                <td>Subtotal</td>
                                <td id="subtotal">${subtotal.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td>Impuestos</td>
                                <td id="tax">${taxes.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td>Total</td>
                                <td id="total">${total.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {!showCheckout ? (
                    <button type="button" onClick={toggleCheckout}>
                        Comprar
                    </button>
                ) : (
                    <div className="user-info">
                        <h2>Datos del usuario</h2>
                        <form>
                            <div className="input-group">
                                <label htmlFor="name">Nombre y Apellido</label>
                                <input type="text" id="name" name="name" value={userData.name} onChange={handleInputChange} />
                            </div>
                            <div className="input-group">
                                <label htmlFor="email">Email</label>
                                <input type="email" id="email" name="email" value={userData.email} onChange={handleInputChange} />
                            </div>
                            <div className="input-group">
                                <label htmlFor="address">Dirección</label>
                                <input type="text" id="address" name="address" value={userData.address} onChange={handleInputChange} />
                            </div>
                            <button type="button" onClick={handleBuy}>
                                Comprar
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
