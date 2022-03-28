import React, { useState, SyntheticEvent } from 'react';
import { Button, Form, Toast, Image, Row, Col, ToastContainer } from 'react-bootstrap';
import { useAuth0 } from '@auth0/auth0-react';
import UsageModal from './UsageModal';
import {
    validateFileSize,
    validateFileType,
} from '../service/fileValidatorService';
import FileService from '../service/fileService';


function FileUpload() {
    const model = {
        show: false,
        url: '',
        message: {
            title: '',
            body: ''
        }
    }
    const { getAccessTokenSilently } = useAuth0();
    const tokenPromise = getAccessTokenSilently();
    const [isUsageModalOpen, setIsUsageModalOpen] = useState<boolean>(false);
    const [uploadFormError, setUploadFormError] = useState<string>('');
    const [embedPic, setEmbedPic] = useState<HTMLInputElement>();
    const [decryptPic, setDecryptPic] = useState<HTMLInputElement>();
    const [mark, setMark] = useState<string>('');
    const [embed, setEmbed] = useState(model);
    const [decrypt, setDecrypt] = useState(model);

    const handleFileUpload = async (element: HTMLInputElement, text: string, bool: boolean) => {
        const file = element.files;
        if (!file) {
            return;
        }
        const validFileSize = await validateFileSize(file[0].size);
        const validFileType = await validateFileType(
            FileService.getFileExtension(file[0].name)
        );
        if (!validFileSize.isValid) {
            setUploadFormError(validFileSize.errorMessage);
            return;
        }
        if (!validFileType.isValid) {
            setUploadFormError(validFileType.errorMessage);
            return;
        }
        if (uploadFormError && validFileSize.isValid) {
            setUploadFormError('');
        }
        const fileService = new FileService(file[0], text);
        const token = await tokenPromise;
        if (bool === true) {
            const url = await fileService.embedFile(token).then(data => data);
            if (url && url != "error") {
                setEmbed({
                    show: true,
                    url: url,
                    message: {
                        title: 'Success',
                        body: 'Text is successfully embeded in picture'
                    }
                });
            }
            if (url == "error" || !url) {
                setEmbed({
                    show: true,
                    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Feedbin-Icon-error.svg/1280px-Feedbin-Icon-error.svg.png',
                    message: {
                        title: 'Error',
                        body: 'Error in handling text embeded in file'
                    }
                });
            }
            setEmbedPic(undefined);
            setMark("");
        }
        if (bool === false) {
            const url = await fileService.decryptFile(token);
            if (url && url != "error") {
                setEmbed({
                    show: true,
                    url: url,
                    message: {
                        title: 'Success',
                        body: 'Text is successfully decrypted from picture'
                    }
                });
            }
            if (url == "error" || !url) {
                setEmbed({
                    show: true,
                    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Feedbin-Icon-error.svg/1280px-Feedbin-Icon-error.svg.png',
                    message: {
                        title: 'Error',
                        body: 'Error in decrypting text from picture'
                    }
                });
            }
            setDecryptPic(undefined);
        }
        element.value = '';
    };

    return (
        <>
            <ToastContainer position="top-end" className="rounded me-2">
                <Toast onClose={() => setDecrypt({
                    show: false,
                    url: decrypt.url,
                    message: decrypt.message
                })} show={decrypt.show} delay={6000} autohide>
                    <Toast.Header>
                        <img src={decrypt.url} width="50" />
                        <strong className="me-auto">{decrypt.message.title}</strong>
                        <small className="text-muted">just now</small>
                    </Toast.Header>
                    <Toast.Body>{decrypt.message.title}</Toast.Body>
                </Toast>
                <Toast onClose={() => setEmbed({
                    show: false,
                    url: embed.url,
                    message: embed.message
                })} show={embed.show} delay={6000} autohide>
                    <Toast.Header>
                        <img src={embed.url} width="50" />
                        <strong className="me-auto">{embed.message.title}</strong>
                        <small className="text-muted">just now</small>
                    </Toast.Header>
                    <Toast.Body>{embed.message.body}</Toast.Body>
                </Toast>
            </ToastContainer>
            <Form id="form" >
                <Row className="justify-content-md-center">
                    <Col>
                        <Button size="sm" className="primary" type="button" onClick={() => setIsUsageModalOpen(true)}>
                            Usage
                        </Button>
                        <UsageModal
                            isOpen={isUsageModalOpen}
                            onClose={() => setIsUsageModalOpen(false)}
                        />
                        {uploadFormError && <div>{uploadFormError}</div>}
                    </Col>
                </Row>
                <Row className="justify-content-md-center d-flex align-items-center">
                    <Col>
                            <Form.Group>
                                <Form.Label>Embed text in picture</Form.Label>
                                <Form.Label>Text</Form.Label>
                                <Form.Control
                                    size="sm"
                                    type="text"
                                    className="m-2"
                                    value={mark}
                                    pattern="^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{1,49}$"
                                    onChange={(e) => setMark(e.target.value)} />
                                <Form.Label>Picture</Form.Label>
                                <Form.Control
                                    className="m-2"
                                    size="sm"
                                    type="file"
                                    accept="image/png"
                                    onChange={(e: SyntheticEvent) =>
                                        setEmbedPic(e.currentTarget as HTMLInputElement)
                                    } />
                                <Button size="sm" className="primary" type="button" disabled={!mark || mark == "" || !embedPic} onClick={() =>
                                    handleFileUpload(embedPic!, mark, true)}>Embed</Button>
                            </Form.Group>
                    </Col>
                    <Col>
                            <Form.Group>
                                <Form.Label>Decrypt text from picture</Form.Label>
                                <Form.Control
                                    className="m-2"
                                    size="sm"
                                    type="file"
                                    accept="image/png"
                                    onChange={(e: SyntheticEvent) =>
                                        setDecryptPic(e.currentTarget as HTMLInputElement)
                                    } />
                                <Button size="sm" className="primary" type="button" disabled={!decryptPic} onClick={() =>
                                    handleFileUpload(decryptPic!, "", false)}>Decrypt</Button>
                            </Form.Group>
                    </Col>
                </Row>
            </Form>
        </>
    );
}

export default FileUpload;
