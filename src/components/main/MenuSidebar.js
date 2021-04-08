import React, { useEffect, useState, useRef } from "react";
import { NavLink, Link, useLocation, useHistory } from 'react-router-dom';



import { FaList, FaGripHorizontal } from "react-icons/fa";

import { BsCardList, BsFillPersonLinesFill, BsFillImageFill, BsFillPersonCheckFill, BsGearFill, BsFillPersonDashFill } from "react-icons/bs";


const MenuSidebar = ({ menuCollapse }) => {
    const menuMasterData = ["banners", "users", "setting", "provinsi", "city", "kecamatan", "warehouse"];
    const menuProducts = ["products", "add_product", "edit_product", "list_img"];
    const dataPelanggan = ["members", "konsumen"];
    const menuArea = ["provinsi", "city", "kecamatan"];
    const dataTrans = ["waiting_payment", "payment", "completed", "trans_detail"];
    const location = useLocation();
    const lastPathName = location.pathname.replace("/", "");
    const [isActiveMenu, setIssActiveMenu] = useState({});
    const [isOpenMasterData, setIsOpenMasterData] = useState(false);
    const [isOpenDataPelanggan, setIsOpenDataPelanggan] = useState(false);
    const [isOpenDataTrans, setIsOpenDataTrans] = useState(false);
    let menuActive = menuProducts.includes(lastPathName) ? menuProducts[0] : lastPathName;
    menuActive = menuArea.includes(lastPathName) ? menuArea[0] : menuActive;
    //menuActive = dataTrans.includes(lastPathName) ? dataTrans[0] : menuActive;
    let subMenuOpen = menuMasterData.includes(lastPathName) ? "masterData" : '';
    subMenuOpen = dataPelanggan.includes(lastPathName) ? "dataPelanggan" : subMenuOpen;
    subMenuOpen = dataTrans.includes(lastPathName) ? "dataTrans" : subMenuOpen;

    useEffect(() => {
        setIsOpenMasterData(e => {
            return subMenuOpen === "masterData" ? true : false;
        })
        setIsOpenDataPelanggan(e => {
            return subMenuOpen === "dataPelanggan" ? true : false;
        })
        setIsOpenDataTrans(e => {
            return subMenuOpen === "dataTrans" ? true : false;
        })
        setIssActiveMenu({ [menuActive]: true });
    }, [menuActive, subMenuOpen]);

    const handleClickSubmenu = name => () => {
        setIsOpenMasterData(prevState => {
            const isOpen = prevState;
            return name === "masterData" ? !isOpen : isOpen;
        })
        setIsOpenDataPelanggan(prevState => {
            const isOpen = prevState;
            return name === "dataPelanggan" ? !isOpen : isOpen;
        })
        setIsOpenDataTrans(prevState => {
            const isOpen = prevState;
            return name === "dataTrans" ? !isOpen : isOpen;
        })
    };
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
                                    className="nav-link nav-custom">
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
                                    to='/products'
                                    className="nav-link nav-custom">
                                    <FaList className="nav-icon" />
                                    <p>Master Kasus</p>
                                </NavLink>

                            </li>

                            <li className="nav-item">
                                <NavLink
                                    to='/products'
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