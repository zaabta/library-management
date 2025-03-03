import { type ReactNode } from "react"
import { ImLibrary } from "react-icons/im";
import { FaUsers } from "react-icons/fa";
import { PiBooksFill } from "react-icons/pi";
import { Divider } from "@heroui/divider";
import { NavLink } from 'react-router-dom'
import './style.scss'

export const NavSide = ({ children }: { children: ReactNode }) => {
    return (
    <div className="navbar-wrapper">
        <nav>
            <div className="header">
                <ImLibrary/>
                <h1>Library Management</h1>
            </div>
            <Divider/>
            <ul>
                <li>
                    <NavLink to="/users" className={({ isActive }) => isActive ? 'is-active' : ''}>
                        <FaUsers />
                        <label>Users</label>
                    </NavLink> 
                </li>
                <li>
                    <NavLink to="/books" className={({ isActive }) => isActive ? 'is-active' : ''}>
                        <PiBooksFill />
                        <label>Books</label>
                    </NavLink>
                </li>
            </ul>
            <Divider/>
            <p className="footer">Ali Almanea</p>
        </nav>
        <>
        {children}
        </>
    </div>
    );
};

