const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('db connected'))
.catch(err => console.log('db connection failed: ', err.message || err))