import {
    LoadingContainer
} from '@drizzle/react-components';
import { DrizzleProvider } from '@drizzle/react-plugin';
import React, { Component } from 'react';
import { Spinner } from 'react-bootstrap';
import {
    Button,
    Card, CardBody,
    CardFooter, CardHeader, Col, Form, FormGroup, Input,
    Row
} from "reactstrap";
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Farm from "../artifacts/Farm.json";
import getWeb3 from "../getWeb3";
import '../index.css';
import ipfs from '../ipfs';
import { FormFile } from 'react-bootstrap'


const drizzleOptions = {
    contracts: [Farm]
}

// var buyers = 0;
// var sellers = 0;
var business;
var businessTable = [];
var verification = [];

class updateBusiness extends Component {
    constructor(props) {
        super(props)

        this.state = {
            FarmInstance: undefined,
            account: null,
            web3: null,
            business_name: '',
            city: '',
            companyRegistrationNumber: '',
            GSTnumber: '',
            email: '',
            isVerified: false,
            buffer2: null,
            document: '',
        }
        this.captureDoc = this.captureDoc.bind(this);
        this.addDoc = this.addDoc.bind(this);
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
            console.log(currentAddress);
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = Farm.networks[networkId];
            const instance = new web3.eth.Contract(
                Farm.abi,
                deployedNetwork && deployedNetwork.address,
            );

            this.setState({ FarmInstance: instance, web3: web3, account: accounts[0] });
            this.setState({ address: currentAddress });
            var Business_verify = await this.state.FarmInstance.methods.isVerified1(currentAddress).call();
            console.log(Business_verify);

            var not_verify = await this.state.FarmInstance.methods.isRejected(currentAddress).call();
            console.log(not_verify);
            if (Business_verify) {
                verification.push(<p id="verified">Verified <i class="fas fa-user-check"></i></p>);
            } else if (not_verify) {
                verification.push(<p id="rejected">Rejected <i class="fas fa-user-times"></i></p>);
            } else {
                verification.push(<p id="unknown">Not Yet Verified <i class="fas fa-user-cog"></i></p>);
            }

            business = await this.state.FarmInstance.methods.getBusinessDetails(currentAddress).call();
            console.log(business);
            console.log(business[0]);
            this.setState({ business_name: business[0], city: business[1], companyRegistrationNumber: business[2], GSTnumber: business[3], email: business[5], document:business[4]});
            //sellerTable.push(<div><p>Name: {seller[0]}</p><p>Age: {seller[1]}</p><p>Aadhar Number: {seller[2]}</p><p>Pan Number: {seller[3]}</p><p>Owned Lands: {seller[4]}</p></div>);
            businessTable.push(
                <Row>
                    <Col md="12">
                        <FormGroup>
                            <label>Your Wallet Address: </label>
                            <Input
                                disabled
                                type="text"
                                value={currentAddress}
                            />
                        </FormGroup>
                    </Col>
                </Row>
            );

        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };

    updateBusiness = async () => {
        this.addDoc();
        // alert('After add image')
        await new Promise(resolve => setTimeout(resolve, 10000));
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);

        if (this.state.business_name === '' || this.state.city === '' || this.state.companyRegistrationNumber === '' || this.state.GSTnumber === '') {
            alert("All the fields are compulsory!");
        } else if (!Number(this.state.companyRegistrationNumber) || this.state.companyRegistrationNumber.length !== 12) {
            alert("company Registration Number should be 12 digits long!");
        } else if (this.state.GSTnumber.length !== 10) {
            alert("GST Number should be a 10 digit unique number!");
        } else if (this.state.email === '' || !pattern.test(this.state.email)) {
            alert('Please enter a valid email address\n');
        }
        else {
            await this.state.FarmInstance.methods.updateBusiness(
                this.state.business_name,
                this.state.city,
                this.state.companyRegistrationNumber,
                this.state.GSTnumber,
                this.state.document,
                this.state.email,
            )
                .send({
                    from: this.state.account,
                    gas: 2100000
                }).then(response => {
                    this.props.history.push("/Business/BusinessDashboard");
                });

            //Reload
            window.location.reload(false);
        }
    }

    addDoc = async () => {
        // alert('In add image')
        await ipfs.files.add(this.state.buffer2, (error, result) => {
         if (error) {
             alert(error)
             return
         }

         //   alert(result[0].hash)
            this.setState({ document: result[0].hash });
            console.log('document:', this.state.document);
        })
     }

     updateBusinessName = event => (
        this.setState({ business_name: event.target.value })
    )

    updateCity = event => (
        this.setState({ city: event.target.value })
    )
    updateEmail = event => (
        this.setState({ email: event.target.value })
    )
    updateCompanyRegistrationNumber = event => (
        this.setState({ companyRegistrationNumber: event.target.value })
    )
    updateGST = event => (
        this.setState({ GSTnumber: event.target.value })
    )
    captureDoc(event) {
        event.preventDefault()
        const file2 = event.target.files[0]
        const reader2 = new window.FileReader()
        reader2.readAsArrayBuffer(file2)
        reader2.onloadend = () => {
            this.setState({ buffer2: Buffer(reader2.result) })
            console.log('buffer2', this.state.buffer2)
        }
        console.log('capture doc...')
    }

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

        return (
            <div className="content">
                <DrizzleProvider options={drizzleOptions}>
                    <LoadingContainer>
                        <Row>
                            <Col md="8">
                                <Card>
                                    <CardHeader>
                                        <h5 className="title">Business Profile</h5>
                                        <h5 className="title">{verification}</h5>

                                    </CardHeader>
                                    <CardBody>
                                        <Form>
                                            {businessTable}
                                            <Row>
                                                <Col md="12">
                                                    <FormGroup>
                                                        <label>Name</label>
                                                        <Input
                                                            type="text"
                                                            value={this.state.business_name}
                                                            onChange={this.updateBusinessName}
                                                        />
                                                    </FormGroup>
                                                </Col>

                                            </Row>
                                            <Row>
                                                <Col md="12">
                                                    <FormGroup>
                                                        <label>City</label>
                                                        <Input
                                                            type="text"
                                                            value={this.state.city}
                                                            onChange={this.updateCity}
                                                        />
                                                    </FormGroup>
                                                </Col>

                                            </Row>
                                            <Row>
                                                <Col md="12">
                                                    <FormGroup>
                                                        <label>Reg. No.</label>
                                                        <Input
                                                            type="text"
                                                            value={this.state.companyRegistrationNumber}
                                                            onChange={this.updateCompanyRegistrationNumber}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md="12">
                                                    <FormGroup>
                                                        <label>GST Number</label>
                                                        <Input
                                                            type="text"
                                                            value={this.state.GSTnumber}
                                                            onChange={this.updateGST}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md="12">
                                                    <FormGroup>
                                                        <label>Email</label>
                                                        <Input
                                                            type="text"
                                                            value={this.state.email}
                                                            onChange={this.updateEmail}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md = "12">
                                                    <FormGroup>
                                                        <label>Add Business License (PDF Format)</label>
                                                        <FormFile
                                                            id="File2"
                                                            onChange={this.captureDoc}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                        </Form>
                                    </CardBody>
                                    <CardFooter>
                                        <Button onClick={this.updateBusiness} className="btn-fill" color="primary">
                                            Update
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </Col>
                        </Row>
                    </LoadingContainer>
                </DrizzleProvider>
            </div>
        );

    }
}

export default updateBusiness;