const IPFS = require('ipfs-http-client');

//Use this for localhost
const ipfs = new IPFS({ host: 'localhost', port: 5001, protocol: 'http' });

// Use this to use ipfs in network(Uncomment below line and comment above line 
// and also configure .ipfs/config file)
// const ipfs = new IPFS({ host: 'host_address', port: 5001, protocol: 'http' });

export default ipfs;