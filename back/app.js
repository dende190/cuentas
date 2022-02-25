const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const {config} = require('./config/config');
const usersRoute = require('./routes/users');
const debtorRoute = require('./routes/debtor');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors());
app.use('/images', express.static(__dirname + '/assets/images'));

//Routes
usersRoute(app);
debtorRoute(app);

app.listen(process.env.PORT, () => {
  console.log('Servidor escuchando en el puerto', process.env.PORT);
});
