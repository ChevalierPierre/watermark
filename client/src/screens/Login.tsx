import React from "react";
import LoginButton from "./../components/LoginButton";

interface IProps { }

const Login: React.FC<IProps> = () => {

    return (
        <div className="App">
            <LoginButton />
        </div>
    );
};
export default Login;