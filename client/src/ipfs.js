const IPFS = require('ipfs-http-client');

//Use this for localhost
// const ipfs = new IPFS({ host: 'localhost', port: 5001, protocol: 'http' });

// Use this to use ipfs in network(Uncomment below line and comment above line 
// and also configure .ipfs/config file)
// const ipfs = new IPFS({ host: '127.0.0.1', port: 5001, protocol: 'http' });
const projectId = process.env.REACT_APP_INFURA_PROJECT_ID;
const projectSecret = process.env.REACT_APP_INFURA_PROJECT_SECRET;
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const ipfs = new IPFS({ 
    host: 'ipfs.infura.io', 
    port: 5001, 
    protocol: 'https',
    headers: {
        authorization: auth,
    },
});

export default ipfs;