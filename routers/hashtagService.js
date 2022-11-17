const express = require('express');
const router = express.Router();

const axios = require('axios');
const cors = require('cors');
const apiAdapter = require('./apiAdapter');

// Imposto le cors
const corsOption = {
    origin: '*'
}

async function waitFor(tester) {
    try {
        const result = await tester;
        return [ null, result ];
    }
    catch (error) {
        return [ error, undefined ];
    }
}

const getToken = async () => {
    const basicUrl = 'https://serverondemand.sandeza.com/fmi/data/vLatest/databases/SEPROM/sessions'
    const basicAuth = btoa('Admin:JolPac173');
    const options = {
        headers: { 'Authorization': 'Basic ' + basicAuth }
    };

    // SHORTHAND METHOD
    const [error, response] = await waitFor(axios.post(basicUrl, {}, options));

    if (error) {
        console.log(error);
        throw error;
    }

    return response.data.response.token;
};

const logoutSession = async (token) => {

    const basicUrl = 'https://serverondemand.sandeza.com/fmi/data/vLatest/databases/SEPROM/sessions/' + token;
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

const getEvents = async (token) => {

    const basicUrl = 'https://serverondemand.sandeza.com/fmi/data/vLatest/databases/SEPROM/layouts/PIA_APIList/records';
    const options = {
        headers: {
            'Authorization': 'Bearer ' + token
        },
        params: {
            _limit: 2000
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


router.get('/eventi', cors(corsOption), async (req, res) => {

    const [error, tokenFm] = await waitFor(getToken());

    const [errorEvents, data] = await waitFor(getEvents(tokenFm));
    const events = data.data;
    res.send(JSON.stringify(events));

    const [errorLogout, logout] = await waitFor(logoutSession(tokenFm));
    console.log(logout);

})

module.exports = router