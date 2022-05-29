const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) =>{
  MongoClient.connect('mongodb+srv://thinhtran:pass123@cluster0.njciaw0.mongodb.net/?retryWrites=true&w=majority')
  .then(result => {
    console.log('Connected!');
    callback(result);
  })
  .catch(err => console.log(err));
}

module.exports = mongoConnect;