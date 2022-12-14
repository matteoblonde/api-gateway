const express = require('express');
const router = express.Router();
const axios = require('axios');
const cors = require('cors');
const apiAdapter = require('./apiAdapter');

const BASE_URL = 'https://serverfm.sandeza.com/fmi/data/vLatest/databases/Registries/sessions';

// Imposto le cors
const corsOption = {
  origin: '*'
}


/*****
 *
 *  COPYRIGHT MARCO CAVANNA
 *
 *
 *****/
async function waitFor(tester) {
  try {
    const result = await tester;
    return [ null, result ];
  }
  catch (error) {
    return [ error, undefined ];
  }
}


/**
 *
 * GetToken:
 * Function to get a Fm Token to connect to FileMaker Server
 *
 * @returns {TokenFm}
 */
const getToken = async () => {

  // Costruisco l'url per accedere al database (PARAMETRIZZABILE CON LE ENV)
  const basicUrl = 'https://serverfm.sandeza.com/fmi/data/vLatest/databases/Registries/sessions'

  // Costruisco la basic auth per accedere al database (PARAMETRIZZABILE CON LE ENV)
  const basicAuth = btoa('UTENTEWEB:5U1U3RDH');
  const options = {
    headers: { 'Authorization': 'Basic ' + basicAuth }
  };

  // SHORTHAND METHOD
  const [error, response] = await waitFor(axios.post(basicUrl, {}, options));

  // Se mi ritorna un errore lo mostro ed esco
  if (error) {
    console.log(error);
    throw error;
  }

  // Ritorno il Token FM
  return response.data.response.token;
};

/**
 *
 * logoutSession:
 * Function to logout from a filemaker sessions
 *
 * @returns {True / False}
 */
const logoutSession = async (token) => {

  const basicUrl = 'https://serverfm.sandeza.com/fmi/data/vLatest/databases/Registries/sessions/' + token;
  const options = {

  }

  // SHORTHAND METHOD
  const [error, response] = await waitFor(axios.delete(basicUrl, options));

  if (error) {
    console.log(error);
    throw error;
  }

  return response;

}

const getOperations = async (token) => {

  const basicUrl = 'https://serverfm.sandeza.com/fmi/data/vLatest/databases/Registries/layouts/Anagrafica Controllo/records';
  const options = {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  }

  // SHORTHAND METHOD
  const [error, response] = await waitFor(axios.get(basicUrl, options));

  if (error) {
    console.log(error);
    throw error;
  }

  return response.data.response;

}


// Quando viene fatta una chiamata con l'url 'http://localhost:3000/risorse' arriva la richiesta qua dentro e viene gestita
router.get('/anagrafiche', cors(corsOption), async (req, res) => {

  const [error, tokenFm] = await waitFor(getToken());

  const [errorOp, data] = await waitFor(getOperations(tokenFm));

  if (errorOp) {
    return res.status(500).json(data);
  }

  const opDocs = data.data;
  res.send(JSON.stringify(opDocs));

  const [errorLogout, logout] = await waitFor(logoutSession(tokenFm));

})

module.exports = router
