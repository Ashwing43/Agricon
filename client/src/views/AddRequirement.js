//This page will run once we create all admin panels and dashboard, so that he can mark farmers and businesses verified

import React, { Component } from 'react';
import FarmContract from "../artifacts/Farm.json";
import getWeb3 from "../getWeb3";

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";
import { Spinner} from 'react-bootstrap';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';


class AddRequirement extends Component {
  constructor(props) {
    super(props)

    this.state = {
      FarmInstance: undefined,
      account: null,
      web3: null,
      flag: null,
      crop_name: '',
      quantity_in_kg: 0,
      price_per_kg: 0,
      deliveryTime: 0,
      _total: 0,
      _advPayment : 0,
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

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = FarmContract.networks[networkId];
      const instance = new web3.eth.Contract(
        FarmContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      this.setState({ FarmInstance: instance, web3: web3, account: accounts[0] });
      const currentAddress = await web3.currentProvider.selectedAddress;
      console.log(currentAddress);
      this.setState({ FarmInstance: instance, web3: web3, account: accounts[0] });
      var verified = await this.state.FarmInstance.methods.isVerified1(currentAddress).call();
      console.log(verified);
      this.setState({ verified: verified });
      var registered = await this.state.FarmInstance.methods.isBusiness(currentAddress).call();
      console.log(registered);
      this.setState({ registered: registered });

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  //QmYdztkcPJLmGmwLmM4nyBfVatoBMRDuUjmgBupjmTodAP
  AddRequirement = async () => {
    // this.addimage();
    // this.addDoc();
    // alert('After add image')
    await new Promise(resolve => setTimeout(resolve, 15000));
    if (this.state.crop_name === '' || this.state.price_per_kg === '' || this.state.quantity_in_kg === '' || this.state.deliveryTime === '' || this.state._total === '' || this.state._advPayment === '') {
      alert("All the fields are compulsory!");
    } else if ((!Number(this.state.price_per_kg)) || (!Number(this.state.quantity_in_kg)) || (!Number(this.state._total)) || (!Number(this.state._advPayment)) || (!Number(this.state.deliveryTime))) {
      alert("price, Quantity, Total, and Advanced Payment must be a number!");
    } else {
      await this.state.FarmInstance.methods.addCropRequirement(
        this.state.crop_name,
        this.state.quantity_in_kg,
        this.state.price_per_kg,
        this.state.deliveryTime, 
        this.state._total,
        this.state._advPayment,
        // this.state.ipfsHash, 
        // this.state.document
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
  // _city,string  _state, uint landPrice, uint _propertyPID,uint _surveyNum,string memory _ipfsHash

  updateState = event => (
    this.setState({ stateLoc: event.target.value })
  )
  updateCropName = event => (
    this.setState({ crop_name: event.target.value })
  )
  updateQuantity = event => (
    this.setState({quantity_in_kg: event.target.value})
  )
  updatePrice = event => (
    this.setState({price_per_kg: event.target.value})
  )
  updateTotal = event => (
    this.setState({_total: event.target.value})
  )
  updateAdvanced = event => (
    this.setState({_advPayment: event.target.value})
  )
  updateDelTime = event => (
    this.setState({deliveryTime: event.target.value})
  )

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

    if (!this.state.registered || !this.state.verified) {
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
      <div className="content">
        <Row>
          <Col md="8">
            <Card>
              <CardHeader>
                <h5 className="title">Add Requirement</h5>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Crop Name</label>
                        <Input
                          placeholder="Crop Name"
                          type="text"
                          value={this.state.crop_name}
                          onChange={this.updateCropName}
                        />
                      </FormGroup>
                    </Col>

                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Quantity</label>
                        <Input
                          placeholder="Quantity"
                          type="number"
                          value={this.state.quantity_in_kg}
                          onChange={this.updateQuantity}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Price per Kg.</label>
                        <Input
                          placeholder="Price per Kg."
                          type="number"
                          value={this.state.price_per_kg}
                          onChange={this.updatePrice}
                        />
                      </FormGroup>
                    </Col>

                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Delivery Time</label>
                        <Input
                          placeholder="Delivery Time"
                          type="number"
                          value={this.state.deliveryTime}
                          onChange={this.updateDelTime}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Total Amount</label>
                        <Input
                          placeholder="Total Amount"
                          type="number"
                          value={this.state._total}
                          onChange={this.updateTotal}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Advanced Payment</label>
                        <Input
                          placeholder="Advanced Payment"
                          type="number"
                          value={this.state._advPayment}
                          onChange={this.updateAdvanced}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
              <CardFooter>
                <Button className="btn-fill" color="primary" onClick={this.AddRequirement}>
                  Add Requirement
                </Button>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    );

  }
}

export default AddRequirement;
