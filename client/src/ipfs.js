const IPFS = require('ipfs-http-client');
// const projectId = '678c84b207404581ad46ab0a1b47837a';
// const projectSecret = 'e8fb8ca5d6114d48a58748066ba8f703';

// const auth =
//     'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

export default ipfs;