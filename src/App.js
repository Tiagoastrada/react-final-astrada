import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { getFirestore } from 'firebase/firestore';
import Navbar from './components/NavBar';
import ItemListContainer from './components/ItemListContainer';
import ItemDetailContainer from './components/ItemDetailContainer';
import { CartProvider } from './components/CartContext';
import Cart from './components/Cart';
import Footer from './components/footer';

import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyBXmxb0pJg05tFBng2bMeRGk-OyLdz5xWI",
  authDomain: "compugarza-db0b9.firebaseapp.com",
  projectId: "compugarza-db0b9",
  storageBucket: "compugarza-db0b9.appspot.com",
  messagingSenderId: "935161468294",
  appId: "1:935161468294:web:f399b14772f16c19f28807"
};

initializeApp(firebaseConfig);

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<ItemListContainer />} />
          <Route path="/category/:id" element={<ItemListContainer />} />
          <Route path="/item/:id" element={<ItemDetailContainer />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
        <Footer />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
