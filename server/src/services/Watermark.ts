/**
 Based on the idea outlined here: http://domnit.org/blog/2007/02/stepic-explanation.html
 */

import lwip from '@randy.tarampi/lwip';
import crypto from 'crypto';
import Q from 'q';

var _index = 0;
var _width = 0;
var _height = 0;
var _clone: any;
var _batch: any;
var _password: String;

/*
Reads the least significant bits of the pixel (Red, Green and Blue) and
add them to the corresponding position of the byte being constructed
*/
function unpackBit(b: any, pixel: any, position: any) {

    let color = '';

    switch (position % 3) {
        case 0:
            color = 'r';
            break;
        case 1:
            color = 'g';
            break;
        case 2:
            color = 'b';
            break;
    }

    // if pixel is set
    if (pixel[color] & 1) {
        b |= 1 << (7 - position);
    }

    return b;

};

/*
Sets the least significant bit to 1 or 0 (depending on the bit to set)
*/
function packBit(pixel: any, position: any, bit: any) {

    let color = '';

    switch (position % 3) {
        case 0:
            color = 'r';
            break;
        case 1:
            color = 'g';
            break;
        case 2:
            color = 'b';
            break;
    }

    if (bit) {
        pixel[color] |= 1;
    } else {
        pixel[color] &= ~1;
    }

    return pixel;

};

/*
Reads the next section (a section ends when the least significant bit of the
blue component of the third pixel is 0)
See http://domnit.org/blog/2007/02/stepic-explanation.html
*/
function digUpNextSection() {
    let b;
    let pixel;
    let buffer = [];
    while (_index < _width * _height) {
        b = 0;
        for (let i = 0; i < 8; i++) {
            if (i % 3 == 0) {
                pixel = _clone.getPixel(_index % _width, Math.floor(_index / _width));
                _index++;
            }
            b = unpackBit(b, pixel, i);
        }
        buffer.push(b);
        if (pixel.b & 1) {
            break;
        }
    }
    // @ts-ignore
    buffer = new Buffer(buffer);
    if (_password) {
        // @ts-ignore
        const decipher = crypto.createDecipher('aes-256-ctr', _password);
        // @ts-ignore
        buffer = Buffer.concat([decipher.update(buffer), decipher.final()]);
    }
    return buffer;
};

/*
Embeds a buffer of data
See http://domnit.org/blog/2007/02/stepic-explanation.html
*/
function embedSection(buffer: Buffer) {
    let pixel;
    if (_password) {
        // @ts-ignore
        let cipher = crypto.createCipher('aes-256-ctr', _password);
        buffer = Buffer.concat([cipher.update(buffer), cipher.final()]);
    }
    let bit;
    // TODO: I have the impression that this algorithm can be simplified...
    let octect;
    for (let i = 0; i < buffer.length; i++) {
        octect = buffer[i];
        for (let j = 0; j < 8; j++) {
            if (j % 3 == 0) {
                if (pixel) {
                    _batch.setPixel(_index % _width, Math.floor(_index / _width), pixel);
                    _index++;
                }
                pixel = _clone.getPixel(_index % _width, Math.floor(_index / _width));
            }
            if (octect & (1 << (7 - j))) {
                bit = 1;
            } else {
                bit = 0;
            }
            pixel = packBit(pixel, j, bit);
        }
        if (i == (buffer.length - 1)) {
            pixel.b |= 1;
        } else {
            pixel.b &= ~1;
        }
        _batch.setPixel(_index % _width, Math.floor(_index / _width), pixel);
        _index++;
        pixel = undefined;
    }
};

export function digUp(imageFile: Buffer, password: String) {
    let d = Q.defer();
    _password = password ? password : '';
    lwip.open(imageFile, 'png',
        function (err, image) {
            if (!err) {
                _width = image.width();
                _height = image.height();
                _clone = image;
                let buffer = digUpNextSection();
                const fileName = buffer.toString();
                buffer = digUpNextSection();
                const embededShasum = digUpNextSection();
                const bufferShasum = crypto.createHash('sha1');
                // @ts-ignore
                bufferShasum.update(buffer);
                // @ts-ignore
                if (embededShasum.equals(bufferShasum.digest())) {
                    console.log('Embedded file ' + fileName + ' found');
                    d.resolve();
                    return (buffer)
                } else {
                    console.log('Nothing to do here...');
                    d.resolve();
                }

            } else {
                d.reject(err);
            }
        }
    );
    return d.promise;
}

export function embed(imageFile: any, fileToEmbed: any, password: any) {
    const d = Q.defer();
    _password = password ? password : null;
    const shasum = crypto.createHash('sha1');
    shasum.update(fileToEmbed.buffer);
    lwip.open(imageFile.buffer,'png', function (err, image) {
            if (!err) {
                image.clone(function (err, clone) {
                    if (!err) {
                        _clone = clone;
                        _width = clone.width();
                        _height = clone.height();
                        _batch = clone.batch();
                        console.log("width:", _width,"height:",_height, "index:",_index, "clone:",_clone,"batch:", image.width(), image.height())
                        embedSection(fileToEmbed.buffer);
                        embedSection(imageFile.buffer);
                        embedSection(shasum.digest());
                        return (_batch)
                    } else {
                        d.reject(err);
                    }
                });
            } else {
                d.reject(err);
            }
        }
    );
    return d.promise;
}