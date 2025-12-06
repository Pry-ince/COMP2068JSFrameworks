var express = require('express');
var Task = require('../models/task');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
    try {
        const publicTasks = await Task.find({}).limit(5).sort({createdAt: -1});
        res.render('index', { 
            title: 'Todo App', 
            user: req.user, 
            publicTasks 
        });
    } catch (err) {
        res.render('index', { title: 'Todo App', user: req.user });
    }
});

module.exports = router;
