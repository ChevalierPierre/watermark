import dotenv from "dotenv";
import express from "express";
//import jwt from "express-jwt";
import cors from "cors";
import bodyParser from "body-parser";
import multer from 'multer'
//import { expressJwtSecret } from "jwks-rsa";
import fileController from './controllers/FileController'

//Initilize dotenv
dotenv.config();

//Iniltialize express server
const app = express();
const upload = multer();
const port = process.env.PORT || 8080;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

/*
//Initialize jwt protection
const jwtCheck = jwt({
    secret: expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: process.env.JWKSURI!,
    }),
    audience: process.env.AUDIENCE,
    issuer: process.env.ISSUER,
    algorithms: [process.env.ALGORITHMS],
});

// Token verification
app.use(jwtCheck);
*/

app.post("/embedFile", upload.single('file'), fileController.embedFile);
app.post("/decryptFile", upload.single('file'), fileController.decryptFile);




app.get("/protected", function (req, res) {
    res.send("Secured Resource");
});

console.log("server listening on port: ", port);
app.listen(port);