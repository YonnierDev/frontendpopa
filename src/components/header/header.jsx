import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import logo from "../../assets/logos.png";
import "./header.css";

const Header = ({ userName }) => {
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <header className="header navbar navbar-light bg-light shadow-sm">
            <div className="container-fluid d-flex justify-content-between align-items-center">
                {/* Logo */}
                <img src={logo} alt="Logo" className="logo" />

                {/* Sección de usuario */}
                <div className="user-section">
                    <FaUserCircle
                        className="user-icon"
                        onClick={() => setShowDropdown(!showDropdown)}
                    />
                    {showDropdown && (
                        <div className="user-dropdown">
                            <p>Bienvenido, {userName}</p>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
