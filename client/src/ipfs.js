const IPFS = require('ipfs-http-client');
const ipfs = new IPFS({ host: 'localhost', port: 5001, protocol: 'http' });
// host_address is ip address
// You will also need ipfs config file.
// const ipfs = new IPFS({ host: '127.0.0.1', port: 5001, protocol: 'http' });
// const ipfs = create('http://localhost:5001')
export default ipfs;