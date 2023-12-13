let mongoose = require('mongoose')



MONGODB_URL = '' // add your mongodb url here

// connect to db

mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch(err => {
        console.log(err)
    })

// load the stocks.json file in the same folder as this script

const filename = '' // add your file name here

const stocks = require(filename)



const collectionName = '' // add your collection name here

const collection = mongoose.connection.collection(collectionName)

// insert the stocks into the collection

collection.insertMany(stocks, (err, result) => {
    if (err) {
        console.log(err)
    } else {
        console.log(`${result.insertedCount} stocks inserted`)
    }
    mongoose.connection.close()
});