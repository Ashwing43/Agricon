import { ContractData, LoadingContainer } from '@drizzle/react-components';
import { DrizzleProvider } from '@drizzle/react-plugin';
import React, { Component } from 'react';
import { Spinner } from 'react-bootstrap';
// reactstrap components
import { Button, Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Farm from "../artifacts/Farm.json";
import "../card.css";
import getWeb3 from "../getWeb3";
import '../index.css';

const drizzleOptions = {
    contracts: [Farm]
}

var verified;
var row = [];
var farmerarr = [];
var businessarr = [];
var reqsarr = [];

class Admin1Dashboard extends Component {
    constructor(props) {
        super(props)

        this.state = {
            FarmInstance: undefined,
            account: null,
            web3: null,
            verified: '',
        }
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
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = Farm.networks[networkId];
            const instance = new web3.eth.Contract(
                Farm.abi,
                deployedNetwork && deployedNetwork.address,
            );

            this.setState({ FarmInstance: instance, web3: web3, account: accounts[0] });

            var verified = await this.state.FarmInstance.methods.isAdmin1(currentAddress).call();
            this.setState({ verified: verified });

            farmerarr.push(<ContractData contract="Farm" method="getFarmersCount" />);
            businessarr.push(<ContractData contract="Farm" method="getBusinessCount" />);
            reqsarr.push(<ContractData contract="Farm" method="getTotalRequestCount" />);

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
                        <div className="main-section">
                            <Row>
                                <Col lg="4">
                                    <div class="dashbord dashbord-skyblue">
                                        <div class="icon-section">
                                            <i class="fa fa-users" aria-hidden="true"></i><br />
                                            <medium>Total Farmers</medium><br />
                                            <p> {farmerarr} </p>
                                        </div>
                                        <div class="detail-section"><br />
                                        </div>
                                    </div>
                                </Col>
                                <Col lg="4">
                                    <div class="dashbord dashbord-blue">
                                        <div class="icon-section">
                                            <i class="fa fa-bell" aria-hidden="true"></i><br />
                                            <medium>Total Requests</medium><br />
                                            <p>{reqsarr}</p>
                                        </div>
                                        <div class="detail-section">
                                            <br />
                                        </div>
                                    </div>
                                </Col>
                                <Col lg="4">
                                    <div class="dashbord dashbord-orange">
                                        <div class="icon-section">
                                            <i class="fa fa-users" aria-hidden="true"></i><br />
                                            <medium>Total Business</medium><br />
                                            <p>{businessarr}</p>
                                        </div>
                                        <div class="detail-section"><br />
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <Row>
                            <Col lg="4">
                                <Card>
                                    <CardHeader>
                                        <h5 className="title">Farmers Information</h5>
                                    </CardHeader>
                                    <CardBody>
                                        <div className="chart-area">

                                            <Button href="/Admin1/FarmerInfo" className="btn-fill" color="primary">
                                                Verify Farmers
                                            </Button>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col lg="4">
                                <Card>
                                    <CardHeader>
                                        <h5 className="title">Contract Extension Requests</h5>
                                    </CardHeader>
                                    <CardBody>
                                        <div className="chart-area">

                                            <Button href="/LI/TransactionInfo" className="btn-fill" color="primary">
                                                Approve Extension Requests
                                            </Button>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col lg="4">
                                <Card>
                                    <CardHeader>
                                        <h5 className="title">Business Information</h5>
                                    </CardHeader>
                                    <CardBody>
                                        <div className="chart-area">

                                            <Button href="/Admin1/BusinessInfo" className="btn-fill" color="primary">
                                                Verify Businesses
                                            </Button>
                                        </div>
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

export default Admin1Dashboard;