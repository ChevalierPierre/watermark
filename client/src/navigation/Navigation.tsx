import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./../screens/Login";
import Home from "./../screens/Home";
import { useAuth0 } from "@auth0/auth0-react";

interface IProps {}

const Navigation: React.FC<IProps> = () => {
    const { isAuthenticated } = useAuth0();
    return (
        <BrowserRouter>
            <Routes>
                {!isAuthenticated ? (
                    <Route path="/" element={<Login />} />
                ) : (
                    <Route path="/home" element={<Home />} />
                )}
            </Routes>
        </BrowserRouter>
    );
};
export default Navigation;