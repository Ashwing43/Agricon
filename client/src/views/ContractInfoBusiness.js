import {
  LoadingContainer
} from '@drizzle/react-components';
import { DrizzleProvider } from '@drizzle/react-plugin';
import React, { Component } from 'react';
import { Spinner } from 'react-bootstrap';
// reactstrap components
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row, Table } from "reactstrap";
import Farm from "../artifacts/Farm.json";
import getWeb3 from "../getWeb3";
import "../index.css";



const drizzleOptions = {
  contracts: [Farm]
}

var verified;

class ContractInfoBusiness extends Component {
  constructor(props) {
    super(props)

    this.state = {
      FarmInstance: undefined,
      account: null,
      web3: null,
      flag: null,
      verified: '',
      registered: '',
      count: 0,
      row : [],
      id: '',
      amount : 0
    }
  }

  payRemain = ( farmerId, amount, index) => async() => {
    this.setState({amount : amount})
    console.log(this.state.amount);
    console.log(amount);
    console.log(index);
    // console.log(amount);
    await this.state.FarmInstance.methods.payRemaining(
      farmerId,
      index
    ).send({
      from: this.state.account,
      gas: 2100000,
      value: amount
    });
    window.location.reload();
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
      const deployedNetwork = Farm.networks[networkId];
      const instance = new web3.eth.Contract(
        Farm.abi,
        deployedNetwork && deployedNetwork.address,
      );

      const currentAddress = await web3.currentProvider.selectedAddress;
      // console.log(currentAddress);
      this.setState({ FarmInstance: instance, web3: web3, account: accounts[0] });
      verified = await this.state.FarmInstance.methods.isVerified1(currentAddress).call();
      // console.log(verified);
      this.setState({ verified: verified });
      var registered = true;
      this.setState({ registered: registered });

      var count = await this.state.FarmInstance.methods.getContractsCount().call();
      count = parseInt(count);
      // console.log(typeof (count));
      // console.log(count);
      this.setState({count:count});

      const row = [];
      // const rowStatus = [];
      for (let i = 0; i < count; i++) {
        const businessId = await this.state.FarmInstance.methods.getContractBusiness(i).call();
        const farmerId = await this.state.FarmInstance.methods.getContractFarmer(i).call();
        let farmer = await this.state.FarmInstance.methods.getFarmerDetails(farmerId).call();
        if (businessId.toLowerCase() === currentAddress.toLowerCase()) {
          const contractID = await this.state.FarmInstance.methods.getContractId(i).call();
          const quantity = await this.state.FarmInstance.methods.getContractQuantity(i).call();
          const cropName = await this.state.FarmInstance.methods.getContractCropName(i).call();
          const pricePerKg = await this.state.FarmInstance.methods.getContractPrice(i).call();
          const deliveryTime = await this.state.FarmInstance.methods.getContractDeadLine(i).call();
          const totalPrice = await this.state.FarmInstance.methods.getContractTotalPrice(i).call();
          const advPayment = await this.state.FarmInstance.methods.getContractAdvPayment(i).call();
          const PaymentStatus = await this.state.FarmInstance.methods.isComplete(i).call();
          // rowStatus.push(PaymentStatus);
          // if(PaymentStatus != true) PaymentStatus = false;
          // console.log(PaymentStatus);
          const farmerName = farmer[0];
          // const farmerAge = farmer[1];
          // const farmerCity = farmer[2];
          // const farmerAdhar = farmer[3];
          // const farmerPan = farmer[4];
          const landDoc = farmer[5];
          row.push({ contractID,  farmerId, cropName, quantity, farmerName, landDoc, 
             pricePerKg, deliveryTime, totalPrice, advPayment, PaymentStatus });
            //  farmerAge, farmerCity, farmerAdhar, farmerPan, 
        }
      }
      this.setState({ row: row });
      // console.log(row)



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

    if (!this.state.registered || !this.state.verified) {
      return (
        <div className="content">
          <div>
            <Row>
              <Col xs="6">
                <Card>
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
      <>
        <div className="content">
          <DrizzleProvider options={drizzleOptions}>
            <LoadingContainer>
              <div className="main-section">
                <Row>
                  {/* <Col lg="4"> */}
                    {/* <div class="dashbord dashbord-skyblue">
                      <div class="icon-section">
                        <i class="fa fa-users" aria-hidden="true"></i><br />
                        <medium>Total Farmers</medium><br />
                        {/* <p> {userarr} </p> */}
                      {/* </div>
                      <div class="detail-section"><br />
                      </div>
                    </div> */}
                  {/* </Col> */}
                  <Col lg="4">
                    <div class="dashbord dashbord-orange">
                      <div class="icon-section">
                        <i class="fa fa-landmark" aria-hidden="true"></i><br />
                        <medium>Signed Contracts Count</medium><br />
                        <p>{this.state.row.length}</p>
                      </div>
                      <div class="detail-section"><br />
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </LoadingContainer>
          </DrizzleProvider>

          <DrizzleProvider options={drizzleOptions}>
            <LoadingContainer>
              <Row>
                <Col lg="12" md="12">
                  <Card>
                    <CardHeader>
                      <CardTitle tag="h4">My Contracts</CardTitle>
                    </CardHeader>
                    <CardBody>
                      <Table className="tablesorter" responsive color="black">
                        <thead className="text-primary">
                          <tr>
                            <th>#</th>
                            <th>Farmer ID</th>
                            <th>Farmer Name</th>
                            <th>Crop name</th>
                            <th>Land Doc</th>
                            <th>Quantity(kg)</th>
                            <th>Price(kg)</th>
                            <th>Delivery Time</th>
                            <th>Total Price</th>
                            <th>Advanced Payment</th>
                            <th>Remaining Payment status</th>
                            <th>Pay Remaining</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.row.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item.farmerId}</td>
                              <td>{item.farmerName}</td>
                              <td>{item.cropName}</td>
                              {/* <td><a href={`http://127.0.0.1:8080/ipfs/${item.landDoc}`} target="_blank" rel="noreferrer">Click Here</a></td> */}
                              <td><a href={`https://ipfs.io/ipfs/${item.landDoc}`} target="_blank" rel="noreferrer">Click Here</a></td>
                              <td>{item.quantity}</td>
                              <td>{item.pricePerKg}</td>
                              <td>{item.deliveryTime}</td>
                              <td>{item.totalPrice}</td>
                              <td>{item.advPayment}</td>
                              <td>{item.PaymentStatus ? "Paid" : "Pending"}</td>
                              <td>
                                <Button onClick={this.payRemain(item.farmerId, item.totalPrice - item.advPayment, item.contractID - 1)} disabled={item.PaymentStatus} className="btn btn-danger">Pay</Button>
                              </td>
                              {/* {console.log(item.farmerId)}
                              {console.log(item.totalPrice - item.advPayment)}
                              {console.log(item.contractID)} */}
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </LoadingContainer>
          </DrizzleProvider>
        </div>
      </>

    );

  }
}

export default ContractInfoBusiness;