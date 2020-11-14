
const fs = require('fs');
const express = require('express');
const app = express();
const path = require('path');
const profileFile = __dirname + "\\" + "models\\profiles.json";
const profiles = getProfiles(profileFile);
const rootUrl = "/api/profiles";
const cors = require('cors')

let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
};

function getProfiles() {
    try {
        return JSON.parse(fs.readFileSync(profileFile, 'utf8'));
    }
    catch (e) {
        console.log(e);
    }
    return;
}

//Middleware processing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.raw());
app.use(express.static('content'))
app.use(cors())

//GET /
app.get('/', function (_, res) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.sendFile(path.join(__dirname, "index.htm"));
});

// //GET /api/profiles
app.get(rootUrl, (req, res) => {
    res.status(200).json({
        status: "success",
        data: profiles
    })
});

// //GET /api/profiles/:id
app.get(`${rootUrl}/:id`, (req, res) => {
    let chosenProfile = profiles[req.params.id]

    console.log(chosenProfile)
    if (chosenProfile) {
        res.json({
            status: "Success",
            data: chosenProfile
        })
    } else {
        res.status(404).json({
            message: "Could not find profile"
        })
    }
});

// //POST /api/profiles
app.post(rootUrl, (req, res) => {

    const existingIds = Object.keys(profiles)
    const largestKey = Math.max(...existingIds)

    const newKey = largestKey + 1

    profiles[newKey] = req.body

    res.status(201).json({
        status: "Success",
        message: `Created a profile with the id of ${newKey}`,
        data: profiles
    })
    console.log(newKey)
});

// //PUT /api/profiles
app.put(`${rootUrl}/:id`, (req, res) => {
    const profileToReplace = req.params.id


    if (profileToReplace) {
        profiles[profileToReplace] = req.body
        res.status(200).json({
            message: `user ${profileToReplace} updated`,
            data: profiles
      })
    } else {
        res.status(404).json({
            message: "Could not find profile"
        })
    }
    });

// //PATCH /api/profiles
app.patch(`${rootUrl}/:id`, (req, res) => {
    const profileToUpdate = req.params.id

    profiles[profileToUpdate] = {
        ...profiles[profileToUpdate],
        ...req.body
    }

    if (profileToUpdate) {
        res.status(200).json({
            message: `user ${profileToUpdate} updated`,
            data: profiles
          })
    } else {
        res.status(404).json({
            message: "Could not find profile"
        })
    }
    });

// //DELETE /api/profiles/:id
app.delete(`${rootUrl}/:id`, (req, res) => {

    const profileToDelete = profiles[req.params.id]

    if (profileToDelete) {
        delete profiles[req.params.id]
        res.status(200).json({
            status: "Success",
            message: `deleted profile ${req.params.id}`,
            data: profiles
              })
    } else {
        res.status(404).json({
            message: "Could not find profile"
        })
    }
});

app.listen(port, function () {
    console.log(`Node server is running... http://localhost:${port} #Winning`);
});

module.exports = app;