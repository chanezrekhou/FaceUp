var express = require('express');
var router = express.Router();
var cloudinary = require('cloudinary').v2;
var uniqid = require('uniqid');
const fs = require('fs')
  'use strict';
  const axios = require('axios').default;

cloudinary.config({
  cloud_name: 'dech1r5le',
  api_key: '395111157943421',
  api_secret: '3UHKAPjvxmjxCacg2ZD1KsKlDhU'
});


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/upload', async function (req, res, next) {

  var imagePath = './tmp/' + uniqid() + '.jpg';
  var resultCopy = await req.files.avatar.mv(imagePath);
  var resultCloudinary = await cloudinary.uploader.upload(imagePath);
  console.log(resultCloudinary)


// Add a valid subscription key and endpoint to your environment variables.
let subscriptionKey = 'f628a19ecf7242ba8cc11c945311b321'
let endpoint = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect'

// Optionally, replace with your own image URL (for example a .jpg or .png URL).
let imageUrl = resultCloudinary.url
 
// Send a POST request
axios({
  method: 'post',
  url: endpoint,
  params : {
      detectionModel: 'detection_01',
      returnFaceAttributes: 'age,gender',
      returnFaceId: true
  },
  data: {
      url: imageUrl,
  },
  headers: { 'Ocp-Apim-Subscription-Key': subscriptionKey }
}).then(function (response) {
  console.log('Status text: ' + response.status)
  console.log('Status text: ' + response.statusText)
  console.log()
  console.log(response.data) 
  var gender = response.data[0].faceAttributes.gender
  var age = response.data[0].faceAttributes.age
  
  if (!resultCopy) {
    res.json({ resultCloudinary, gender, age});
  } else {
    res.json({ result: false, message: resultCopy });
  }
}).catch(function (error) {
  console.log(error)
});





  fs.unlinkSync(imagePath);

});



router.post('/uploadvideo', async function (req, res, next) {

  console.log("je suis sur mon back")
  var videoPath = './tmp/' + uniqid() + '.mp4';
  var thumbnailPath = './tmp/' + uniqid() + '.jpg';

  var resultCopy = await req.files.video.mv(videoPath);
  var thumbnail = await req.files.thumbnail.mv(thumbnailPath);
  var resultCloudinary = await cloudinary.uploader.upload(videoPath, { resource_type: "video" });
  var miniCloudinary = await cloudinary.uploader.upload(thumbnailPath);

  if (!resultCopy) {
    res.json({ resultCloudinary, miniCloudinary });
  } else {
    res.json({ result: false, message: resultCopy });
  }

  fs.unlinkSync(videoPath);

});

module.exports = router;
