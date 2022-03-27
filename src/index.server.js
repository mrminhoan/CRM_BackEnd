const express = require("express");
const app = express()
const env = require('dotenv')
const mongoose = require('mongoose');
const path = require('path')
app.use('/public', express.static(path.join(__dirname, 'uploads')))

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