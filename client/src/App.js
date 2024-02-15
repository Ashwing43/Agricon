import {
    ContractData
} from '@drizzle/react-components';
import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Farm from './artifacts/Farm.json';
import './index.css';


const drizzleOptions = {
    contracts: [Farm]
}

var rows = [];
for (var i = 1; i < 5; i++) {
    rows.push(<ContractData contract="Farm" method="getCropRequirementPrice" methodArgs={[i, { from: "0xe0786c396EEf88a42782cfd63D2329cA14b62C4C" }]} />);
}

function App() {
    return (
        <></>
    );
}
export default App;
