var express = require('express');
var app = express();
var multer = require('multer')
var cors = require('cors');
var path = require('path')
const ipfsClient = require("ipfs-api");
const ipfs = new ipfsClient();
const fs = require('fs');



 
//IPFS Part
const addFile = async (fileName, filePath) => {
  const file = fs.readFileSync(filePath);
  const filesAdded = await ipfs.add({ path: fileName, content: file }, {
  progress: (len) => console.log("Uploading file..." + len)
});
  console.log(filesAdded);
  console.log("Hash:",filesAdded[0].hash);
  const fileHash = filesAdded[0].hash;
 
  return fileHash;
};


var date = Date.now()
app.use(cors())
var opsys = process.platform;
if (opsys == "darwin" || opsys == "linux") {
  var location = 'public/'
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {    
      cb(null, location)
    },
    filename: function (req, file, cb) {
      var filename = date + '-' + file.originalname
      console.log("in multer"+file.originalname)
      cb(null, filename)
    }
  })
}
else if (opsys == "win32" || opsys == "win64") {
  var location = path.join(__dirname, '..', 'public')+'\\'
  var storage = multer.diskStorage({
    //var location = Date.now() + '-' + file.originalname
    destination: function (req, file, cb) {
      //var location = path.join(__dirname, '..', 'public')
      cb(null, location)
    },
    filename: function (req, file, cb) {
      var filename = date + '-' + file.originalname
      //watermarking(file, location, filename)
      cb(null, filename)
    }
  })
}



async function watermarking(file, location, filename){
  const dw = require('digital-watermarking');
      const watermarkText = "Cornelius"
      const fontSize = 1.1
      let encodeFileName = location + "encode" + filename
      console.log("transforming Image"+location+filename)
      await dw.transformImageWithText(
        location + filename,
        watermarkText,
        fontSize,
        encodeFileName)
      console.log("Image transformed")
      let deCodeFileName = "deCode.png"
      await dw.getTextFormImage(encodeFileName, deCodeFileName)
      console.log("success")
}

var upload = multer({ storage: storage }).array('file')
app.post('/upload', function (req, res) {

  upload(req, res, function (err) {

    var filenames = req.files.map(function(file) {
      return file.filename; // or file.originalname
    });
    console.log("filenam"+filenames)
    console.log("filenam"+req.filename)
    console.log("origname:"+req.files)
    console.log("path:"+req.files.path)
    console.log("destination:"+req.files.destination)
    // Still needs the path and name of the encoded file
    const fileHash = addFile(filenames, location + filenames);
    console.log("File Hash received __>", fileHash);
    watermarking(req.file, location, filenames)
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err)
    } else if (err) {
      return res.status(500).json(err)
    }
    return res.status(200).send(req.file)

  })

});

app.listen(8000, function () {

  console.log('App running on port 8000');

});