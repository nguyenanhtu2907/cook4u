import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

import route from './app/routes/index.js';

const app = express();

app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

// connect to mongo atlas and run server
const CONNECTION_URL = "mongodb+srv://anhtu2907:anhtu2907@cluster0.kvcyy.mongodb.net/cook4u?retryWrites=true&w=majority"
const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => {
        console.log('Server running on port: ' + PORT);
    }))
    .catch((error) => {
        console.log(error.message);
    })
mongoose.set('useFindAndModify', false);

route(app);