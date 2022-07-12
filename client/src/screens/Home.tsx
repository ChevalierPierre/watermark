import React from 'react';
import '../App.css';
import LogoutButton from './../components/LogoutButton';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import FileUpload from '../components/FileUpload';

interface IProps { }

const Home: React.FC<IProps> = () => {
    return (
        <div className="App">
            <Container>
                    <Col>
                        <Card className="justify-content-md-center">
                            <Card.Body>
                                <FileUpload />
                                <br />
                                <br />
                            </Card.Body>
                        </Card>
                    </Col>
            </Container>
        </div>
    );
};
export default Home;
