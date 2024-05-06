import {
    LoadingContainer
} from '@drizzle/react-components';
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


var BusinessCount;
var BusinessMap = [];
var BusinessTable = [];

class BusinessInfo extends Component {
    constructor(props) {
        super(props)

        this.state = {
            FarmInstance: undefined,
            account: null,
            web3: null,
            businesses: 0,
            verified: '',
            not_verified: '',
            BusinessTable : []
        }
    }

    verifyBusiness = (item) => async () => {
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
        console.log(window.location.hash);

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

            BusinessCount = await this.state.FarmInstance.methods.getBusinessCount().call();
            console.log(BusinessCount);

            BusinessMap = await this.state.FarmInstance.methods.getBusinesses().call();

            var verified = await this.state.FarmInstance.methods.isAdmin1(currentAddress).call();
            //console.log(verified);
            this.setState({ verified: verified });


            for (let i = 0; i < BusinessCount; i++) {
                var business = await this.state.FarmInstance.methods.getBusinessDetails(BusinessMap[i]).call();
                console.log(business[4]);
                var business_verify = await this.state.FarmInstance.methods.isVerified1(BusinessMap[i]).call();
                console.log(business_verify);
                business.verified = business_verify;

                //business.push(business_verify);
                var not_verify = await this.state.FarmInstance.methods.isRejected(BusinessMap[i]).call();
                console.log(not_verify);

                // BusinessTable.push(<tr><td>{i + 1}</td><td>{BusinessMap[i]}</td><td>{business[0]}</td><td>{business[1]}</td><td>{business[2]}</td><td>{business[3]}</td><td>{business[5]}</td><td><a href={`https://ipfs.io/ipfs/${business[4]}`} target="_blank">Click Here</a></td>
                BusinessTable.push(<tr><td>{i + 1}</td><td>{BusinessMap[i]}</td><td>{business[0]}</td><td>{business[1]}</td><td>{business[2]}</td><td>{business[3]}</td><td>{business[5]}</td><td><a href={`http://192.168.129.32:8080/ipfs/${business[4]}`} target="_blank">Click Here</a></td>
                                                                                                                                                                                                                      {/* ^ */}
                                                                                                                                                                                                                      {/* | */}
                                                                                                                                                                                                      {/* here you have to put host address for your ipfs server */}
                                                                                                                                                        
                    <td>{business.verified.toString()}</td>
                    <td>
                        <Button onClick={this.verifyBusiness(BusinessMap[i])} disabled={business_verify || not_verify} className="button-vote">
                            Verify
                        </Button>
                    </td>
                    <td>
                        <Button onClick={this.reject(BusinessMap[i])} disabled={business_verify || not_verify} className="btn btn-danger">
                            Reject
                        </Button>
                    </td></tr>)
                // console.log(business[5]);
            };
            this.setState({ BusinessTable : BusinessTable });

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
                                        <CardTitle tag="h4">Business Info</CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                        <Table sclassName="tablesorter" responsive color="black">
                                            <thead className="text-primary">
                                                <tr>
                                                    <th>#</th>
                                                    <th>Account Address</th>
                                                    <th>Business Name</th>
                                                    <th>City</th>
                                                    <th>Reg. No/</th>
                                                    <th>GST Number</th>
                                                    <th>Email</th>
                                                    <th>License</th>
                                                    <th>Verification Status</th>
                                                    <th>Verify Business</th>
                                                    <th>Reject Business</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.BusinessTable}
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

export default BusinessInfo;
