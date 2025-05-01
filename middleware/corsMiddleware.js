
const cors = require('cors');

const corsOptions = {
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
};

// Export the CORS middleware
module.exports = cors(corsOptions);