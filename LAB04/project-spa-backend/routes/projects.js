const express = require('express');
const router = express.Router();
const Project = require("../models/project");

// TODO configure HTTP handlers
// get /api/prohects > retrieves all projects in database
router.get("/", async (req, res, next) => {
    let projects = await Project.find();
    // http response with status code 200 OK containing the projects in json format
    res.status(200).json(projects);
})


module.exports = router;
