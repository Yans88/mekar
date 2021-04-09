import React from "react";
import { NavLink, useLocation } from 'react-router-dom';
import { FaList, FaGripHorizontal } from "react-icons/fa";
import { BsCardList, BsFillPersonLinesFill, BsFillImageFill, BsFillPersonCheckFill, BsGearFill, BsFillPersonDashFill } from "react-icons/bs";

const MenuSidebar = ({ menuCollapse }) => {
    const location = useLocation();
    const lastPathName = location.pathname.replace("/", "");

    return (
        <>
            <aside className="main-sidebar sidebar-dark-primary">
                {/* Brand Logo */}
                <NavLink to='/' className="brand-link text-center">
                    <span className="brand"><strong>{menuCollapse ? "ADM" : "Admin Mekar"}</strong></span>
                </NavLink>
                <div className="sidebar">
                    <nav className="mt-2" style={{ marginTop: '1rem!important' }}>
                        <ul className="nav nav-pills nav-sidebar flex-column text-sm" data-widget="treeview" role="menu" data-accordion="false">
                            <li className="nav-item">
                                <NavLink
                                    exact={true}
                                    to='/'
                                    className="nav-link nav-custom">
                                    <BsFillImageFill className="nav-icon" />
                                    <p>Banners</p>
                                </NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink
                                    to='/news'
                                    className={lastPathName === "add_news" ? ("nav-link nav-custom active") : ("nav-link nav-custom")}
                                >
                                    <FaGripHorizontal className="nav-icon" />
                                    <p>News</p>
                                </NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink
                                    to='/members'
                                    className="nav-link nav-custom">
                                    <BsFillPersonDashFill className="nav-icon" />
                                    <p>Members</p>
                                </NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink
                                    to='/satgas'
                                    className="nav-link nav-custom">
                                    <BsFillPersonCheckFill className="nav-icon" />
                                    <p>Satgas</p>
                                </NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink
                                    to='/pengaduan'
                                    className="nav-link nav-custom">
                                    <BsCardList className="nav-icon" />
                                    <p>Pengaduan</p>
                                </NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink
                                    to='/mkasus'
                                    className="nav-link nav-custom">
                                    <FaList className="nav-icon" />
                                    <p>Master Kasus</p>
                                </NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink
                                    to='/users'
                                    className="nav-link nav-custom">
                                    <BsFillPersonLinesFill className="nav-icon" />
                                    <p>Users</p>
                                </NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink
                                    to='/setting'
                                    className="nav-link nav-custom">
                                    <BsGearFill className="nav-icon" />
                                    <p>Setting</p>
                                </NavLink>
                            </li>
                        </ul>
                    </nav>

                </div>
            </aside>
        </>
    );
};

export default MenuSidebar;