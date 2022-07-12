import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./../screens/Home";

interface IProps {}

const Navigation: React.FC<IProps> = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </BrowserRouter>
    );
};
export default Navigation;