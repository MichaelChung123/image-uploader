const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();

const app = express();
const AWS = require('aws-sdk');
const fs = require('fs');
const fileType = require('file-type');
const bluebird = require('bluebird');
const multiparty = require('multiparty');

const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
const MONGODB_URI = 'mongodb://localhost:27017/images';
require('dotenv').config();

MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err) {
    console.log(`Failed to connect to: ${MONGODB_URI}`);
    throw err;
  }
  // // configure the keys for accessing AWS
  // AWS.config.update({
  //   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  // });

  AWS.config.setPromisesDependency(bluebird);

  const s3 = new AWS.S3();

  const uploadFile = (buffer, name, type) => {
    const params = {
      ACL: 'public-read',
      Body: buffer,
      Bucket: process.env.S3_BUCKET,
      ContentType: type.mime,
      Key: `${name}.${type.ext}`
    };
    return s3.upload(params).promise();
  }

  app.post('/test-upload', (request, response) => {
    const form = new multiparty.Form();
    form.parse(request, async (error, fields, files) => {
      if (error) throw new Error(error);
      try {
        console.log("Posting to ", process.env.S3_BUCKET);

        const path = files.file[0].path;
        const buffer = fs.readFileSync(path);
        const type = fileType(buffer);
        const timestamp = Date.now().toString();
        const fileName = `bucketFolder/${timestamp}-lg`;
        const data = await uploadFile(buffer, fileName, type);

        return response.status(200).send(data);

      } catch (error) {
        return response.status(400).send(error);
      }
    });

  });

  let bucketParams = {
    Bucket: process.env.S3_BUCKET
  };

  s3.listObjects(bucketParams, function (err, data) {
    if (err) {
      console.log("error", err);
    } else {

      for (let content of data.Contents) {
        let objectUrl = `https://s3-us-west-2.amazonaws.com/${data.Name}/${content.Key}`;

        db.collection("test").find().toArray((err, images) => {
          let duplicate = false;
          if (err) {
            return err;
          }
          for (let image of images) {
            if (objectUrl === image.URL) {
              duplicate = true;
            }
          }
          if (!duplicate) {
            db.collection("test").insertOne({
              URL: objectUrl
            });
          }
          duplicate = false;
        });
      }

      db.collection("test").find().toArray((err, images) => {
        if (err) {
          return err;
        }

        console.log("logging each image: ");
        for (let image of images) {
          console.log(image);
        }
      });
    }
  });



  app.get('/getUrls', (req, res) => {
    MongoClient.connect(MONGODB_URI, (err, db) => {
      if (err) {
        console.log(`Failed to connect to: ${MONGODB_URI}`);
        throw err;
      }

      db.collection("test").find().toArray((err, images) => {
        if (err) {
          return res.status(400);
        }

        return res.status(200).send(images);
        console.log("Sending images from server.");
      });
    });
  });

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(pino);

  app.get('/api/greeting', (req, res) => {
    const name = req.query.name || 'World';
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
  });

  app.listen(3001, () =>
    console.log('Express server is running on localhost:3001')
  );
});