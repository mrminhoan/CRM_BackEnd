const express = require("express");
const app = express()
const env = require('dotenv')
const mongoose = require('mongoose');
const path = require('path')
app.use('/public', express.static(path.join(__dirname, 'uploads')))
const cors = require('cors')

// Fix permission Cors
app.use(cors())


// ************************************************************************************************
// Add headers 
// Fix lỗi Cors
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
// ************************************************************************************************

// Config data in env
env.config()
// Use Json in express
app.use(express.json())
// Connect to database
mongoose
    .connect(`mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.ojmqj.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(console.log("Connected to MongoDB"))
    .catch((err) => console.log(console.log(), err));


// routes
const userRoutes = require('./routes/user/user')
const adminRoutes = require('./routes/admin/admin')


app.use('/api', userRoutes)
app.use('/api', adminRoutes)
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})