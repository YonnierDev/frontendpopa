import React from 'react'
import portada from '../../assets/portada_popayan.jpg';
const Hero = () => {
  return (
    <div className="text-center position-relative">
      <img
        src={portada}
        alt="Popayán Nocturna"
        className="img-fluid w-100"
        style={{ maxHeight: '500px', objectFit: 'cover' }}
      />
      <h1 className="position-absolute top-50 start-50 translate-middle text-white fw-bold display-4 shadow-lg">
        Descubre la vida nocturna de Popayán
      </h1>
    </div>
  )
}

export default Hero
