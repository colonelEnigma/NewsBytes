const express = require('express')
const app = express();
const mongoose = require('mongoose');
const routes = require('./controller/routes');
// const userRoutes = require('./routes/posts');
require('dotenv').config()
const port = process.env.PORT || 3000

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('database connected')
    app.listen(port, () => {
        console.log(`server is running on port ${port}`)
    })
}).catch(err =>
    console.log(`error while connecting DB`, err.message)
)

app.use('/', routes);
// app.use('/api/user', userRoutes)