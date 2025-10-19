//Importing the Conect and URL packages
const connect = require('connect');
const url = require('url');

// Create the app using Connect
const app = connect();

// Define the /lab03 route
function calculate(req, res) {
  const query = url.parse(req.url, true).query;
  const method = query.method;
  const x = parseFloat(query.x);
  const y = parseFloat(query.y);

  let result;
  let symbol;

  if (method === 'add') {
    result = x + y;
    symbol = '+';
  } else if (method === 'subtract') {
    result = x - y;
    symbol = '-';
  } else if (method === 'multiply') {
    result = x * y;
    symbol = '*';
  } else if (method === 'divide') {
    result =  x / y;
    symbol = '/';
  } else {
    res.end('Error message: Invalid method. Use add, subtract, multiply, or divide.');
    return;
  }

  res.end(`${x} ${symbol} ${y} = ${result}`);
}

// Using this middleware to handle requests
app.use('/lab03', calculate);

//for starting server:
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000/lab03');
});

console.log(query);
console.log(method, x, y);
