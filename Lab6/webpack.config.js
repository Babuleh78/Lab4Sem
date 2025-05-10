const path = require('path');

module.exports = {
  entry: './main.js',       
  output: {
    filename: 'result.js',        
    path: path.resolve(__dirname, 'dist'), 
  },
  mode: 'development', 
};

