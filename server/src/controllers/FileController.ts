import express from 'express'
import path from 'path'
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
                await transformImageWithText(request.file.buffer, request.body.text, 1.1)
                response.sendFile("picture.png", {
                    root: path.resolve("picture.png").slice(0,-11)
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    async decryptFile(request: express.Request, response: express.Response) {
        try {
            if (request.file) {
                await getTextFromImage(request.file.buffer)
                response.sendFile("text.png", {
                    root: path.resolve("text.png").slice(0,-8)
                })
            }
        } catch (error) {
            console.log(error)
        }
    }
}

export default FileController.getInstance()