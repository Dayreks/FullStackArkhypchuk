const Dotenv = require('dotenv-webpack');
module.exports = {
    plugins: [
        new Dotenv()
    ],
    resolve: {
        fallback: {
          net: false,
          // add fallbacks for other Node.js core modules as necessary
        }
    }
}