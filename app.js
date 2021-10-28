const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const https = require('https');
const app = express();
const port = 3000;
let json = require('./states_code.json');


app.use(cors());
app.set('json spaces', 2)
// Configuring body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// Returns key with a given value
function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

// To capitalize the first letter of each word in a sentence e.g. 'my name is fahad' becomes 'My Name Is Fahad'
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Return Electric power carbon dioxide emission quantity from some state from some year
app.get("/q1", (req, res) => {
    const year = req.query.year;
    const state = req.query.state.split(' ').map(capitalize).join(' ');
    const API_KEY = 'f8c39d1a3ce44b9772f00aa5ad65de14'
    const url = "https://api.eia.gov/series/?api_key=" + API_KEY + "&series_id=EMISS.CO2-TOTV-EC-CO-" + getKeyByValue(json, state) + ".A";
    let request = https.get(url, (resp) => {
        let data = '';
        resp.on('data', (x) => {
            data += x;
        });
        resp.on('end', () => {
            const dateArray = JSON.parse(data).series[0].data
            let emissionQuantity;

            dateArray.forEach(date => {
                if (date[0] == year) {
                    emissionQuantity = date[1];
                }
            });
            res.json({"State": state, "Year": year, "Emission Quantity": emissionQuantity});
        });
    }).on("error", (err) => {
        res.send(err);
    });
    request.end();
});

// total tax state x paid from period a to b
app.get("/q2", (req, res) => {
    const from = req.query.from;
    const to = req.query.to;
    const state = req.query.state.split(' ').map(capitalize).join(' ');
    const API_KEY = 'f8c39d1a3ce44b9772f00aa5ad65de14'
    const url = "https://api.eia.gov/series/?api_key=" + API_KEY + "&series_id=EMISS.CO2-TOTV-EC-CO-" + getKeyByValue(json, state) + ".A";

    let sum = 0;
    let request = https.get(url, (resp) => {
        let data = '';
        resp.on('data', (x) => {
            data += x;
        });
        resp.on('end', () => {
            const dateArray = JSON.parse(data).series[0].data

            dateArray.forEach(date => {
                if (date[0] >= from && date[0] <= to) {
                    sum = sum + date[1];
                }
            });
            res.json({"Total tax": '$' + sum + ' million'});
        });
    }).on("error", (err) => {
        res.send(err);
    });
    request.end();
});


app.listen(port, () => console.log(`Server started on port ${port}!`));