const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();

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
    // console.log(firstName, lastName, contactNumber, email);
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
    const url = "https://us6.api.mailchimp.com/3.0/lists/fef4bba2dc";
    const option = {
        method: "POST",
        auth: "Rohan07:1af4e29cec00d29c75f0cefae15abd28-us6"
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
})

app.listen(2000, function() {
    console.log("server started at port 2000");
});