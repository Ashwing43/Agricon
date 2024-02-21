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
import "../index.css";


const drizzleOptions = {
  contracts: [Farm]
}

var farmer;
var farmerTable = [];
var verification = [];

class farmerProfile extends Component {
  constructor(props) {
    super(props)

    this.state = {
      FarmInstance: undefined,
      account: null,
      web3: null,
      buyers: 0,
      sellers: 0,
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
      console.log(currentAddress);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Farm.networks[networkId];
      const instance = new web3.eth.Contract(
        Farm.abi,
        deployedNetwork && deployedNetwork.address,
      );

      this.setState({ FarmInstance: instance, web3: web3, account: accounts[0] });

      var farmer_verify = await this.state.FarmInstance.methods.isVerified1(currentAddress).call();
      this.setState({ verified: farmer_verify });
      var not_verify = await this.state.FarmInstance.methods.isRejected(currentAddress).call();
      if (farmer_verify) {
        verification.push(<p id="verified">Verified <i class="fas fa-user-check"></i></p>);
      } else if (not_verify) {
        verification.push(<p id="rejected">Rejected <i class="fas fa-user-times"></i></p>);
      } else {
        verification.push(<p id="unknown">Not Yet Verified <i class="fas fa-user-cog"></i></p>);
      }

      farmer = await this.state.FarmInstance.methods.getFarmerDetails(currentAddress).call();
      // console.log(buyer);
      // console.log(buyer[0]);

      farmerTable.push(<>
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
        <Row>
          <Col md="12">
            <FormGroup>
              <label>Name</label>
              <Input
                disabled
                type="text"
                value={farmer[0]}
              />
            </FormGroup>
          </Col>

        </Row>
        <Row>
          <Col md="12">
            <FormGroup>
              <label>Age</label>
              <Input
                disabled
                type="text"
                value={farmer[1]}
              />
            </FormGroup>
          </Col>

        </Row>
        {/* <Row>
          <Col md="12">
            <FormGroup>
              <label>Email Address </label>
              <Input
                disabled
                type="text"
                value={buyer[4]}
              />
            </FormGroup>
          </Col>
        </Row> */}
        <Row>
          <Col md="12">
            <FormGroup>
              <label>City</label>
              <Input
                disabled
                type="text"
                value={farmer[2]}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <FormGroup>
              <label>Aadhar Number</label>
              <Input
                disabled
                type="text"
                value={farmer[3]}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <FormGroup>
              <label>Pan Number</label>
              <Input
                disabled
                type="text"
                value={farmer[4]}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <FormGroup>
              <label>Your Aadhar Document</label>
              <div class="post-meta"><span class="timestamp"> <a href={`https://ipfs.io/ipfs/${farmer[5]}`} target="_blank">Here</a></span></div>
            </FormGroup>
          </Col>
        </Row>
      </>);

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

    return (
      <div className="content">
        <DrizzleProvider options={drizzleOptions}>
          <LoadingContainer>
            <Row>
              <Col md="8">
                <Card>
                  <CardHeader>
                    <h5 className="title">Farmer Profile</h5>
                    <h5 className="title">{verification}</h5>

                  </CardHeader>
                  <CardBody>
                    <Form>
                      {farmerTable}
                    </Form>
                    <Button href="/admin/updateFarmer" className="btn-fill" disabled={!this.state.verified} color="primary">
                      Edit Profile
                    </Button>
                  </CardBody>
                  <CardFooter>

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

export default farmerProfile;