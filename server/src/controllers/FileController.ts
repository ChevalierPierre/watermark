import express from 'express'
import { transformImageWithText, getTextFromImage } from '../services/lib'

let instance: null | FileController = null

class FileController {
    static getInstance(): FileController {
        if (instance === null) {
            instance = new FileController()
            return instance
        }

        return instance
    }

    async embedFile(request: express.Request, response: express.Response) {
        try {
            if (request.file && request.body) {
                const url = await transformImageWithText(request.file.buffer, request.body.text, 1.1);
                response.setHeader('Content-Type', 'image/png');
                response.send(url);
            }
        } catch (error) {
            console.log(error)
        }
    }

    async decryptFile(request: express.Request, response: express.Response) {
        try {
            if (request.file) {
                const url = await getTextFromImage(request.file.buffer);
                response.setHeader('Content-Type', 'image/png');
                response.send(url);
            }
        } catch (error) {
            console.log(error)
        }
    }
}

export default FileController.getInstance()