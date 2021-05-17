// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient;
// const ObjectID = mongodb.ObjectID

const {MongoClient , ObjectID} = require('mongodb')

//Connection properties
const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

// you can get ObjectID before a document is actually inserted
// const id = new ObjectID()
// console.log(id);

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database!');
    }

    const db = client.db(databaseName)

    //insertOne
    db.collection('users').insertOne({
        // _id: id,
        name: 'Kunal',
        age: 27

    }, (error, result) => {
        if(error){
            return console.log('Unable to insert user!');
        }


    })

    //insertMany
    db.collection('users').insertMany([
        {
            name: 'Rohit',
            age: 27
        }, {
            name: 'Nilesh',
            age: 27
        }
    ], (error, result) => {
        if(error){
           return console.log('Unable to insert users1');
        }

        console.log(result.ops);
    })

    //findOne
    db.collection('users').findOne({ _id: new ObjectID("60a29fc9e1cd9a2ef8c811c6") }, (error, user) => {
        if(error){
            return console.log('Unable to fetch user!');
        }

        console.log(user);
    })

    //find
    db.collection('users').find({ age: 27 }).toArray((error, users) => {
        if(error){
            return console.log('Unable to fetch users!');
        }

        console.log(users);
    })

    //updateOne
    const updatePromise = db.collection('users').updateOne({
        _id: new ObjectID("60a2a8a15cd8f0073c423c74")
    }, {
        $set: {
            name: 'Popo'
        },
        $inc: {
            age: 1
        }
    })

    updatePromise.then((result) => {
        console.log(result);
    }).catch((error) => {
        console.log(error);
    })

    //updateMany
    db.collection('users').updateMany({ age : 27}, {
        $inc: {
            age: -1
        }
    }).then((result) => {
        console.log(result);
    }).catch((error) => {
        console.log(error);
    })

    //deleteOne
    db.collection('users').deleteOne({ 
        _id: new ObjectID("60a2a8a15cd8f0073c423c74") 
    }).then((result) => {
        console.log(result);
    }).catch((error) => {
        console.log(error);
    })

    //deleteOne
    db.collection('users').deleteMany({ 
        age : 27
    }).then((result) => {
        console.log(result);
    }).catch((error) => {
        console.log(error);
    })

})