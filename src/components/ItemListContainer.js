import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

function ItemListContainer() {
    const { id } = useParams();
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [categoryName, setCategoryName] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const db = getFirestore();
            let collectionRef = collection(db, 'items');

            if (id) {
                const querySnapshot = await getDocs(collection(db, 'categories'));
                const categories = querySnapshot.docs.map(doc => doc.data());
                const selectedCategory = categories.find(category => category.id === id);
                setCategoryName(selectedCategory ? selectedCategory.name : '');

                collectionRef = query(collectionRef, where('category', '==', id));
            }

            const querySnapshot = await getDocs(collectionRef);
            const items = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setCategoryProducts(items);
        };

        fetchData();
    }, [id]);

    return (
        <div className="page-container">
            {categoryName && <h1>{`Nuestros productos de ${categoryName}`}</h1>}
            <div className="row">
                {categoryProducts.map(product => (
                    <div className="col-lg-4" key={product.id}>
                        <div className="card h-100" style={{ margin: '10px' }}>
                            <img
                                src={product.image}
                                className="card-img-top"
                                alt={product.name}
                                style={{ height: '300px', objectFit: 'contain' }}
                            />
                            <div className="card-body">
                                <h5 className="card-title">{product.name}</h5>
                                <p className="card-text">${product.price}</p>
                                <a href={`/item/${product.id}`} className="btn btn-primary">
                                    Ver detalles
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ItemListContainer;
