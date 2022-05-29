const express = require('express');
const {config} = require('../config/config');
const loginService = require('../services/login');
const usersService = require('../services/users');
const jwt = require('jsonwebtoken');

function usersRoute(app) {
  const router = express.Router();
  app.use('/usuario', router);

  router.post('/iniciar_sesion', async (req, res, next) => {
    const userData = await loginService.authUser(req.body);
    if (!Object.values(userData).length) {
      res.json({login: false});
      return;
    }

    const token = jwt.sign(
      userData,
      config.jwtKey,
      {expiresIn: '1d'}
    );

    res.status(200).json({login: true, token: token});
  });

  router.post('/registrarse', async (req, res, next) => {
    const userData = await loginService.registrate(req.body);
    if (!Object.values(userData).length) {
      res.json({login: false});
      return;
    }

    const token = jwt.sign(
      userData,
      config.jwtKey,
      {expiresIn: '1d'}
    );

    res.status(200).json({login: true, token: token});
  });

  router.post('/obtenerConfiguracion', async (req, res, next) => {
    if (!req.body.token) {
      res.status(301).json({error: true});
      return;
    }

    const userData = jwt.decode(req.body.token);
    const configuration = await usersService.getConfiguration(userData.id);
    res.status(200).json(configuration || {});
  });

  router.post('/guardarConfiguracion', async (req, res, next) => {
    if (!req.body.token) {
      res.status(301).json({error: true});
      return;
    }

    const userData = jwt.decode(req.body.token);
    const configurationValues = req.body.configuration;
    const configuration = await (
      usersService
      .saveConfiguration(
        userData.id,
        configurationValues.salary,
        configurationValues.payday,
        configurationValues.percentageAlertExpense
      )
    );

    if (configuration.user_id) {
      delete configuration.user_id;
    }

    res.status(200).json(configuration || {});
  });

  router.post('/obtenerSueldosActualYGastos', async (req, res, next) => {
    if (!req.body.token) {
      res.status(301).json({error: true});
      return;
    }

    const userData = jwt.decode(req.body.token);
    const currentSalaryAndBills = await (
      usersService
      .getCurrentSalaryAndBills(userData.id)
    );
    res.status(200).json(currentSalaryAndBills);
  });
}

module.exports = usersRoute;
