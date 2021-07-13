require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();

console.log(process.env.URL, process.env.API_KEY);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.secondName;
    const contactNumber = req.body.contactNumber;
    const email = req.body.email;
    let data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName,
                PHONE: contactNumber
            }
        }]
    };

    const jsonData = JSON.stringify(data);
    const url = process.env.URL;
    const option = {
        method: "POST",
        auth: "Rohan07:" + process.env.API_KEY
    };
    const request = https.request(url, option, function(response) {
        console.log(response.statusCode);
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function(data) {
            console.log(JSON.parse(jsonData));
        });
    });
    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res) {
    res.redirect("/");
});

app.post("/success", function(req, res) {
    res.redirect("/");
});

let port = process.env.PORT;
if (port == null || port == "") {
    port = 2000;
}

app.listen(port, function() {
    console.log("server started at port 2000");
});