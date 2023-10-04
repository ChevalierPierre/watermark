import React from "react";
import { Button } from 'react-bootstrap';

interface IProps {}

const LogoutButton: React.FC<IProps> = () => {

    return (
        <Button size="sm" className="primary" type="button">
            Log Out
        </Button>
    );
};

export default LogoutButton;