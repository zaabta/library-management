import { type ReactNode } from "react"
import { BookOutlined, UsergroupAddOutlined, HeatMapOutlined } from "@ant-design/icons"
import { Divider } from "antd"
import { NavLink } from 'react-router-dom'
import './style.scss'

export const NavSide = ({ children }: { children: ReactNode }) => {
    return (
    <div className="navbar-wrapper">
        <nav>
            <div className="header">
                <HeatMapOutlined />
                <h1>Library Management</h1>
            </div>
            <Divider style={{ borderColor: 'white' }}/>
            <ul>
                <li>
                    <NavLink to="/users" className={({ isActive }) => isActive ? 'is-active' : ''}>
                    <UsergroupAddOutlined />
                        <label>Users</label>
                    </NavLink> 
                </li>
                <li>
                    <NavLink to="/books" className={({ isActive }) => isActive ? 'is-active' : ''}>
                        <BookOutlined />
                        <label>Books</label>
                    </NavLink>
                </li>
            </ul>
            <Divider style={{ borderColor: 'white' }}/>
            <p className="footer">Ali Almanea</p>
        </nav>
        <>
        {children}
        </>
    </div>
    );
};

