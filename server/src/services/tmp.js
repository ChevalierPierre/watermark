import Jimp from 'jimp';
import requireVm from 'require-vm';
import crypto from 'crypto';

// ...

export async function hideImageInAnother(srcFileName, watermarkText, fontSize, encryptionKey) {
    const context = await isReadyFunc();
    // @ts-ignore
    const cv = context.cv;

    // Vérifie que la clé de chiffrement est une chaîne de caractères
    if (typeof encryptionKey !== 'string') {
        throw new Error('Encryption key must be a string');
    }

    // Charge l'image source
    let jimpSrc = await Jimp.read(srcFileName);

    // Convertit l'image en matrice OpenCV
    let srcImg = new cv.matFromImageData(jimpSrc.bitmap);

    // Chiffre l'image avec AES en utilisant la clé de chiffrement
    const cipher = crypto.createCipher('aes-256-cbc', encryptionKey);
    let encryptedImageBuffer = Buffer.concat([
        cipher.update(matToBuffer(cv, srcImg)),
        cipher.final()
    ]);

    // Transforme l'image chiffrée en Jimp pour le traitement ultérieur
    const imgRes = new Jimp({
        width: srcImg.cols,
        height: srcImg.rows,
        data: encryptedImageBuffer
    });

    srcImg.delete();

    // Retourne l'image chiffrée au format Data URL
    return imgRes.getBase64Async(Jimp.MIME_PNG);
}

// Fonction pour récupérer l'image cachée
export async function retrieveHiddenImage(enCodeFileName, encryptionKey) {
    // Vérifie que la clé de chiffrement est une chaîne de caractères
    if (typeof encryptionKey !== 'string') {
        throw new Error('Encryption key must be a string');
    }

    // Charge l'image chiffrée
    let jimpSrc = await Jimp.read(enCodeFileName);

    // Déchiffre l'image avec AES en utilisant la clé de chiffrement
    const decipher = crypto.createDecipher('aes-256-cbc', encryptionKey);
    let decryptedImageBuffer = Buffer.concat([
        decipher.update(jimpSrc.bitmap.data),
        decipher.final()
    ]);

    // Convertit l'image déchiffrée en matrice OpenCV
    let comImg = new cv.matFromImageData({
        data: decryptedImageBuffer,
        width: jimpSrc.bitmap.width,
        height: jimpSrc.bitmap.height
    });

    // Obtient le texte à partir de l'image déchiffrée
    const dataUrl = await getTextFromImage(comImg);

    comImg.delete();

    return dataUrl;
}
