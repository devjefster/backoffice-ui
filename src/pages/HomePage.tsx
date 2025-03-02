import React from "react";
import {NavLink} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {itensMenu} from "../model/ItensMenu";
import {faCircle} from "@fortawesome/free-solid-svg-icons"

const HomePage: React.FC = () => {
    return (
        <div className="p-6">
            <h1 className="text-4xl font-bold text-primary mb-4">Bem-vindo(a) de volta!</h1>
            <p className="text-lg text-text-secondary mb-6">
                Utilize os cartões abaixo para navegar pelas seções disponíveis.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {itensMenu.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between hover:shadow-2xl transition-shadow"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <FontAwesomeIcon icon={item.icon} className="text-3xl text-primary" />
                            <h2 className="text-2xl font-semibold text-primary">{item.label}</h2>
                        </div>
                        <div className="flex flex-col gap-2">
                            {item.submenu ? (
                                <div className="border-t pt-4">
                                    {item.submenu.map((subItem, subIndex) => (
                                        <NavLink
                                            key={subIndex}
                                            to={subItem.path}
                                            className="flex items-center gap-2 text-primary hover:underline text-lg py-1"
                                        >
                                            <FontAwesomeIcon
                                                icon={faCircle}
                                                className="text-sm text-secondary"
                                            />
                                            {subItem.label}
                                        </NavLink>
                                    ))}
                                </div>
                            ) : (
                                <NavLink
                                    to={item.path}
                                    className="btn-primary text-center py-2 px-4 rounded-lg"
                                >
                                    Acessar
                                </NavLink>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
