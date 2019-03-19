"use strict";

const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = "mongodb://localhost:27017/images";

MongoClient.connect(MONGODB_URI, (err, db) => {
    if (err) {
        console.error(`Failed to connect: ${MONGODB_URI}`);
        throw err;
    }

    // We have a connection to the "images" db, starting here.
    console.log(`Connected to mongodb: ${MONGODB_URI}`);

    // ==> Refactored and wrapped as new, image-specific function:

    function getImages(callback) {
        db.collection("test").find().toArray((err, images) => {
            if (err) {
                return callback(err);
            }
            callback(null, images);
        });
    }

    // ==> Later it can be invoked. Remember even if you pass
    //     `getImages` to another scope, it still has closure over
    //     `db`, so it will still work. Yay!

    getImages((err, images) => {
        if (err) throw err;

        console.log("Logging each image:");
        for (let image of images) {
            console.log(image);
        }

        db.close();
    });

});