var express = require('express');
var Task = require('../models/task');
var router = express.Router();

console.log('🚀 TASKS ROUTE LOADED');  // ADD THIS LINE
router.get('/', function(req, res) {    // TEMP SIMPLE TEST
    console.log('📋 /tasks HIT');
    res.send('<h1>Tasks page works! User: ' + (req.user ? req.user.username : 'Not logged in') + '</h1>');
});

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
    console.log('📋 CREATE TASK - Body:', req.body);
    console.log('👤 Logged in user:', req.user._id);
    
    try {
        const task = new require('../models/task')({
            title: req.body.title || '',
            description: req.body.description || '',
            dueDate: req.body.dueDate || null,
            user: req.user._id
        });
        console.log('💾 Saving task:', task);
        await task.save();
        console.log('✅ Task saved successfully:', task._id);
        res.redirect('/tasks');
    } catch (err) {
        console.error('❌ Task save ERROR:', err.message);
        res.render('tasks/add', { user: req.user, error: err.message });
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