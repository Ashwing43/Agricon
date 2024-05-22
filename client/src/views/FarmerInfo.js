import { LoadingContainer } from '@drizzle/react-components';
import { DrizzleProvider } from '@drizzle/react-plugin';
import React, { Component } from 'react';
import { Spinner } from 'react-bootstrap';
// reactstrap components
import {
    Button, Card, CardBody, CardHeader, CardTitle, Col, Row, Table
} from "reactstrap";
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Farm from "../artifacts/Farm.json";
import getWeb3 from "../getWeb3";
import '../index.css';


const drizzleOptions = {
    contracts: [Farm]
}

var farmerTable = [];
// var completed = true;

// function sendMail(email, name) {
//     // alert(typeof(name));

//     var tempParams = {
//         from_name: email,
//         to_name: name,
//         function: 'request and buy any land/property',
//     };

//     window.emailjs.send('service_vrxa1ak', 'template_zhc8m9h', tempParams)
//         .then(function (res) {
//             alert("Mail sent successfully");
//         })
// }

class FarmerInfo extends Component {
    constructor(props) {
        super(props)

        this.state = {
            FarmInstance: undefined,
            account: null,
            web3: null,
            farmers: 0,
            verified: '',
            farmerTable : []
        }
    }


    verifyFarmer = (item) => async () => {
        //console.log("Hello");
        //console.log(item);

        await this.state.FarmInstance.methods.verify(
            item
        ).send({
            from: this.state.account,
            gas: 2100000
        });

        //Reload
        window.location.reload(false);

    }

    reject = (item) => async () => {
        await new Promise(resolve => setTimeout(resolve, 10000));

        await this.state.FarmInstance.methods.reject(
            item
        ).send({
            from: this.state.account,
            gas: 2100000
        });

        window.location.reload(false);
    }

    componentDidMount = async () => {
        //For refreshing page only once
        if (!window.location.hash) {
            window.location = window.location + '#loaded';
            window.location.reload();
        }

        try {
            //Get network provider and web3 instance
            const web3 = await getWeb3();

            const accounts = await web3.eth.getAccounts();

            const currentAddress = await web3.currentProvider.selectedAddress;
            //console.log(currentAddress);
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = Farm.networks[networkId];
            const instance = new web3.eth.Contract(
                Farm.abi,
                deployedNetwork && deployedNetwork.address,
            );

            this.setState({ FarmInstance: instance, web3: web3, account: accounts[0] });


            var farmersCount = await this.state.FarmInstance.methods.getFarmersCount().call();
            // console.log(farmersCount + " Ashiwn");


            var farmersMap = [];
            farmersMap = await this.state.FarmInstance.methods.getFarmers().call();
            // console.log(farmersMap);

            var verified = await this.state.FarmInstance.methods.isAdmin1(currentAddress).call();
            //console.log(verified);
            this.setState({ verified: verified });

            for (let i = 0; i < farmersCount; i++) {
            //     // var i =3;
                var farmer = await this.state.FarmInstance.methods.getFarmerDetails(farmersMap[i]).call();
                // console.log(farmer);
                var farmer_verify = await this.state.FarmInstance.methods.isVerified1(farmersMap[i]).call();
                console.log(farmer_verify);
                farmer.verified = farmer_verify;

                var not_verify = await this.state.FarmInstance.methods.isRejected(farmersMap[i]).call();
                console.log(not_verify);
                // farmerTable.push(<tr><td>{i + 1}</td><td>{farmersMap[i]}</td><td>{farmer[0]}</td><td>{farmer[1]}</td><td>{farmer[2]}</td><td>{farmer[3]}</td><td>{farmer[4]}</td><td><a href={`https://ipfs.io/ipfs/${farmer[5]}`} target="_blank" rel="noreferrer">Click Here</a></td>
                farmerTable.push(<tr><td>{i + 1}</td><td>{farmersMap[i]}</td><td>{farmer[0]}</td><td>{farmer[1]}</td><td>{farmer[2]}</td><td>{farmer[3]}</td><td>{farmer[4]}</td><td><a href={`http://127.0.0.1:8080/ipfs/${farmer[5]}`} target="_blank" rel="noreferrer">Click Here</a></td>
                                                                                                                                                                                                      {/* ^ */}
                                                                                                                                                                                                      {/* | */}
                                                                                                                                                                                       {/* here you have to put host address for your ipfs server */}
                    
                    <td>{farmer.verified.toString()}</td>
                    <td>
                        <Button onClick={this.verifyFarmer(farmersMap[i])} disabled={farmer_verify || not_verify} className="button-vote">
                            Verify
                        </Button>
                    </td>
                    <td>
                        <Button onClick={this.reject(farmersMap[i])} disabled={farmer_verify || not_verify} className="btn btn-danger">
                            Reject
                        </Button>
                    </td>
                </tr>)
            };
            this.setState({ farmerTable : farmerTable });

        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };



    render() {
        if (!this.state.web3) {
            return (
                <div>
                    <div>
                        <h1>
                            <Spinner animation="border" variant="primary" />
                        </h1>
                    </div>

                </div>
            );
        }

        if (!this.state.verified) {
            return (
                <div className="content">
                    <div>
                        <Row>
                            <Col xs="6">
                                <Card className="card-chart">
                                    <CardBody>
                                        <h1>
                                            You are not verified to view this page
                                        </h1>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </div>
            );
        }

        return (
            <DrizzleProvider options={drizzleOptions}>
                <LoadingContainer>
                    <div className="content">
                        <Row>
                            <Col xs="12">
                                <Card>
                                    <CardHeader>
                                        <CardTitle tag="h5">Farmers Info</CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                        <Table className="tablesorter" responsive color="black">
                                            <thead className="text-primary">
                                                <tr>
                                                    <th>#</th>
                                                    <th>Account Address</th>
                                                    <th>Name</th>
                                                    <th>Age</th>
                                                    <th>City</th>
                                                    <th>Aadhar Number</th>
                                                    <th>Pan Number</th>
                                                    <th>Land Document</th>
                                                    <th>Verification Status</th>
                                                    <th>Verify Farmer</th>
                                                    <th>Reject Farmer</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.farmerTable}
                                            </tbody>

                                        </Table>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </LoadingContainer>
            </DrizzleProvider>
        );

    }
}

export default FarmerInfo;
