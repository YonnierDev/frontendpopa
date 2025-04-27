import React from 'react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import CategoriesBar from '../components/CategoriesBar';
import LugaresGrid from '../components/LugaresGrid';
import BotonSesion from '../components/BotonSesion';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <Navbar />
      <div style={{ height: 70 }} /> {/* Espacio para la barra superior */}
      <div className="home-hero">
        <h1>Descubre y administra tus espacios</h1>
        <SearchBar />
        {/* <BotonSesion /> */}
      </div>
      <CategoriesBar />
      <LugaresGrid />
    </div>
  );
};

export default Home;
