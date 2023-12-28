import React from 'react';
import "./Navbar.css";
import { MdAccountCircle } from 'react-icons/md';

const Navbar = () => {
    return (
        <div className='navbar'>
            <h3 className='logo'>MOVIEFIX</h3>
            <div className='user-icon'>
                <MdAccountCircle className='icon' />
                <span>Account</span>
            </div>
        </div>
    );
};

export default Navbar;
