var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();

var app = express(); 

// Test route
app.get('/test', (req, res) => {
  res.send('Test route working! ✅');
});

// Routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var tasksRouter = require('./routes/tasks');

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

const hbs = require('hbs');
hbs.registerPartials(path.join(__dirname, 'views/partials'));

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Database & Auth
const connectDB = require('./config/db');
const session = require('express-session');
const passport = require('passport');

connectDB(); // Connect MongoDB

app.use(session({ 
  secret: process.env.SESSION_SECRET || 'fallback-secret',
  resave: false, 
  saveUninitialized: false 
}));

app.use(passport.initialize());
app.use(passport.session());

// Flash messages
app.use(require('connect-flash')());
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.messages = req.flash();
  next();
});

// Passport config (FIXED: Single require)
require('./config/passport');

// Routes (FIXED: Proper order)
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);   
app.use('/tasks', tasksRouter);

// 404 handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// Date helper
hbs.registerHelper('formatDate', function(date) {
  return new Intl.DateTimeFormat('en-CA', { 
    year: 'numeric', month: 'short', day: 'numeric', 
    hour: '2-digit', minute: '2-digit' 
  }).format(new Date(date));
});

module.exports = app;

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
