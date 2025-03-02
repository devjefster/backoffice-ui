import React, {useState} from "react";
import {NavLink} from "react-router-dom";
import {Sidebar as FlowbiteSidebar} from "flowbite-react";
import {HiChevronDown, HiChevronRight} from "react-icons/hi";
import logo from "../assets/images/logo.png";
import {itensMenu} from "../model/ItensMenu";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

    return (
        <FlowbiteSidebar
            className={`transition-all duration-300 ${
                isCollapsed ? "w-20" : "w-64"
            } bg-white text-primary h-screen fixed shadow-lg`}
        >
            <div className="flex items-center justify-between p-4 border-b border-gray-300">
                {!isCollapsed && (
                    <div className="flex items-center gap-2">
                        <img src={logo} alt="Logo" className="h-10 w-10 rounded-full" />
                        <span className="text-xl font-bold text-primary">Painel</span>
                    </div>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="text-primary hover:bg-gray-100 focus:outline-none"
                >
                    ☰
                </button>
            </div>

            <FlowbiteSidebar.Items>
                <FlowbiteSidebar.ItemGroup>
                    {itensMenu.map((item) => (
                        item.submenu ? (
                            <div key={item.label}>
                                <button
                                    onClick={() =>
                                        setActiveSubmenu(activeSubmenu === item.label ? null : item.label)
                                    }
                                    className={`flex items-center gap-4 px-4 py-3 rounded-md transition ${
                                        activeSubmenu === item.label ? "bg-gray-200" : "text-gray-600"
                                    }`}
                                >
                                    <FontAwesomeIcon icon={item.icon} className="text-xl text-primary" />
                                    {!isCollapsed && <span>{item.label}</span>}
                                    {!isCollapsed && (
                                        <span className="ml-auto">
                                            {activeSubmenu === item.label ? <HiChevronDown /> : <HiChevronRight />}
                                        </span>
                                    )}
                                </button>
                                {activeSubmenu === item.label && !isCollapsed && (
                                    <div className="ml-8">
                                        {item.submenu.map((subItem) => (
                                            <NavLink
                                                key={subItem.path}
                                                to={subItem.path}
                                                className={({ isActive }) =>
                                                    `block px-4 py-2 rounded-md transition ${
                                                        isActive
                                                            ? "bg-primary text-white"
                                                            : "text-gray-600 hover:bg-gray-100"
                                                    }`
                                                }
                                            >
                                                {subItem.label}
                                            </NavLink>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-4 px-4 py-3 rounded-md transition ${
                                        isActive
                                            ? "bg-primary text-white"
                                            : "text-gray-600 hover:bg-gray-100"
                                    }`
                                }
                            >
                                <FontAwesomeIcon icon={item.icon} className="text-xl text-primary" />
                                {!isCollapsed && <span>{item.label}</span>}
                            </NavLink>
                        )
                    ))}
                </FlowbiteSidebar.ItemGroup>
            </FlowbiteSidebar.Items>
        </FlowbiteSidebar>
    );
};

export default Sidebar;
