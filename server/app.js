require('dotenv').config();
const express = require('express');
const request = require('request'); // "Request" library
const cors = require('cors');
const querystring = require('query-string');
const app = express();
app.use(express.static(__dirname + '/public'))
    .use(cors());

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;
const server_address = process.env.SERVER_ADDRESS;
const server_port = process.env.SERVER_PORT;
const frontend_server_address = process.env.FRONTEND_SERVER_ADDRESS;
const scope = 'user-read-email';

app.get('/login', function (req, res) {
    // redirect to Spotify login page
    res.writeHead(302, {
        'Location': encodeURI(`https://accounts.spotify.com/authorize` +
            `?client_id=${client_id}` +
            `&response_type=code` +
            `&redirect_uri=${redirect_uri}` +
            `&scope=${scope}` +
            `&show_dialog=true`)
    });
    res.send();
});

app.get('/callback', function (req, res) { //change '/callback' if your redirect_uri has different ending (without slash at the end)
                                           // after successful login make api call to get you profile's data
    const code = req.query.code || null;
    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
    };

    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            const access_token = body.access_token;
            const refresh_token = body.refresh_token;
            //pass the tokens to the browser as a query params to make requests from there
            res.redirect(frontend_server_address + '?' +
                querystring.stringify({
                    access_token: access_token,
                    refresh_token: refresh_token
                }));
        } else {
            res.redirect(server_address +
                querystring.stringify({
                    error: 'invalid_token'
                }));
        }
    })
});

// port on with your Vue app is running
console.log('listening on port ' + server_port)
app.listen(server_port);
