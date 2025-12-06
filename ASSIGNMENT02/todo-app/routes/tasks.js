var express = require('express');
var Task = require('../models/task');
var router = express.Router();

// Authentication middleware
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/auth/login');
}

// List tasks
router.get('/', ensureAuthenticated, async function(req, res) {
    try {
        const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.render('tasks/index', { user: req.user, tasks });
    } catch (err) {
        res.render('tasks/index', { user: req.user, tasks: [], error: 'Failed to load tasks' });
    }
});

// Add task form
router.get('/add', ensureAuthenticated, function(req, res) {
    res.render('tasks/add', { user: req.user });
});

// Create task
router.post('/', ensureAuthenticated, async function(req, res) {
    try {
        const task = new Task({
            title: req.body.title,
            description: req.body.description,
            dueDate: req.body.dueDate,
            user: req.user._id
        });
        await task.save();
        res.redirect('/tasks');
    } catch (err) {
        res.render('tasks/add', { user: req.user, error: 'Failed to create task' });
    }
});

// Edit task form
router.get('/edit/:id', ensureAuthenticated, async function(req, res) {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
        if (!task) return res.redirect('/tasks');
        res.render('tasks/edit', { user: req.user, task });
    } catch (err) {
        res.redirect('/tasks');
    }
});

// Update task
router.post('/edit/:id', ensureAuthenticated, async function(req, res) {
    try {
        await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { title: req.body.title, description: req.body.description, dueDate: req.body.dueDate }
        );
        res.redirect('/tasks');
    } catch (err) {
        res.redirect('/tasks');
    }
});

// Toggle complete
router.post('/:id/toggle', ensureAuthenticated, async function(req, res) {
    try {
        await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { completed: { $not: { $cond: [{ $ifNull: ['$completed', false] }, true, false] } } }
        );
        res.redirect('/tasks');
    } catch (err) {
        res.redirect('/tasks');
    }
});

// Delete task
router.post('/delete/:id', ensureAuthenticated, async function(req, res) {
    try {
        await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        res.redirect('/tasks');
    } catch (err) {
        res.redirect('/tasks');
    }
});

module.exports = router;
