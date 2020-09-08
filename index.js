const fetch = require('node-fetch');

const client_id = 'your_client_id';
const client_sercet = 'your_secret_id';
const upstream = 'your_ip_host';
const basic_url = 'https://' + upstream + '/auth';
const base64data = 'Basic ' + Buffer.from(client_id + ':' + client_sercet).toString('base64');

const headers_auth = {
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': base64data,
};

const details = {
    grant_type : 'password', 
    username : 'username',
    password : 'password',
};

const formBody = Object.keys(details).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key])).join('&');

async function request(url = '', data = '', headers = '') {
   const response = await fetch(url, {
        method: 'GET',
    });
    return response.json();
}

request(basic_url, formBody, headers_auth).then((data) => {
    const identity_url = Object.values(data._links['auth:identity-providers'][0]).toString();
    fetch(identity_url, { method: 'GET'}).then((identity_res) => {
        return identity_res.json();
    }).then((auth_res) => {
        const auth_url = Object.values(auth_res._embedded['auth:identity-provider'][1]._links['auth:ropc-default'][0]).toString();
        const response = fetch(auth_url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: headers_auth,
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *client
            body: formBody, // body data type must match "Content-Type" header
        }).then((token_res) => {
            return token_res.json();
        }).then((token) => {
            const access_token = Object.values(token)[0];
            const ctms_registry_url = 'https://' + upstream + '/apis/avid.ctms.registry;version=0;realm=global';
            const req_headers = {
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
                'Content-Type': 'application/hal+json;charset=UTF-8',
                'Authorization': 'Barer ' + access_token,
            };
            fetch(ctms_registry_url, { method: 'GET', headers: req_headers}).then((res) => {
                return res.json();
            }).then((json) => {
                const serviceroot_url = Object.values(json._links['registry:serviceroots']).toString();
                fetch(serviceroot_url.split('{')[0], { method: 'GET', headers: req_headers}).then((result) => {
                    return result.json();
                }).then((res_body) => {
                    const assets_url = Object.values(res_body.resources['aa:assets'][1])[0].toString();
                    fetch(assets_url, { method: 'GET', headers: req_headers}).then((resp) => {
                        return resp.json();
                    }).then((resp_) => {
                        const import_url = Object.values(resp_._links['ma:file-check-in']).toString();
                        const am_body = {'file': 'full_path_&_name_of_the_file',
                            'assetType': 'VIDEO',
                            'usage': 'browse',
                            'fileType': 'video',
                            'carrier': 'PROXY',
                            'params': {
                                'videoAnalysis': true,
                                'qualityControl': true,
                            }};
                        fetch(import_url, { method: 'POST', body: JSON.stringify(am_body), headers: req_headers}).then((import_res) => {
                            return import_res.json();
                        }).then((import_resp) => {
                            console.log('import ' + JSON.stringify(import_resp));
                        });
                    });
                });
            });
        });
    });
});
