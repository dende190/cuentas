const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const {config} = require('./config/config');
const billsRoute = require('./routes/bills');
const usersRoute = require('./routes/users');
const debtorRoute = require('./routes/debtor');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors());

//Routes
usersRoute(app);
billsRoute(app);
debtorRoute(app);

app.listen(process.env.PORT, () => {
  console.log('Servidor escuchando en el puerto', process.env.PORT);
});
