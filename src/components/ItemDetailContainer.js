import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useCart } from './CartContext';

function ItemDetailContainer() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            const db = getFirestore();
            const docRef = doc(db, 'items', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setProduct(docSnap.data());
            } else {

            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (product) {
            addToCart(product, 1);
        }
    };

    return (
        <div>
            {product ? (
                <div>
                    <h1>{product.name}</h1>
                    <div className="card mb-3">
                        <div className="row g-0">
                            <div className="col-md-4">
                                <img src={product.image} alt={product.name} className="img-fluid rounded-start" />
                            </div>
                            <div className="col-md-8">
                                <div className="card-body">
                                    <h5 className="card-title">Descripción:</h5>
                                    <p className="card-text">{product.description}</p>
                                    <h5 className="card-title">Precio:</h5>
                                    <p className="card-text">${product.price}</p>
                                    <button className="btn btn-primary" onClick={handleAddToCart}>
                                        Agregar al Carrito
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <p>Cargando...</p>
            )}
        </div>
    );
}

export default ItemDetailContainer;
