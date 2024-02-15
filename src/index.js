require('express-async-errors');

const express = require('express');
const cors = require('cors');
const uploadConfig = require('./configs/upload');
const routes = require('./routes');

const errorHandler = require('./middlewares/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/files', express.static(uploadConfig.UPLOADS_FOLDER));

app.use(routes);
app.use(errorHandler);

app.listen(3001, () => console.log('Server is running on port 3001'));
