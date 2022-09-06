const NodeCache = require( "node-cache" );
const myCache = new NodeCache({ stdTTL: 10 });

module.exports = myCache;

