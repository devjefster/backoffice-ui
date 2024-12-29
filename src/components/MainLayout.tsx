import React from "react";
import Sidebar from "./Sidebar";
import {Outlet} from "react-router-dom";
import AuthCheck from "@utils/config/utils/AuthCheck";

const MainLayout = () => {
    return (
        <AuthCheck>
            <div className="flex">
                <Sidebar/>
                <main className="ml-64 p-6 w-full bg-background min-h-screen">
                    <Outlet/>
                </main>
            </div>
        </AuthCheck>
    );
};

export default MainLayout;
