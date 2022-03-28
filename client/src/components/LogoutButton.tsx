import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from 'react-bootstrap';

interface IProps {}

const LogoutButton: React.FC<IProps> = () => {
    const { logout } = useAuth0();

    return (
        <Button size="sm" className="primary" type="button" onClick={() => logout({ returnTo: window.location.origin })}>
            Log Out
        </Button>
    );
};

export default LogoutButton;