import React from "react";
import { Button } from 'react-bootstrap';

interface IProps {}

const LoginButton: React.FC<IProps> = () => {

    return (
        <Button onClick={ () => {
        }}>Log In</Button>
    );
};

export default LoginButton;