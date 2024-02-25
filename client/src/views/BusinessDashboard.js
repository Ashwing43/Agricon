import { ContractData, LoadingContainer } from '@drizzle/react-components';
import { DrizzleProvider } from '@drizzle/react-plugin';
import React, { Component } from 'react';
import { Spinner } from 'react-bootstrap';
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row, Table } from "reactstrap";
import Farm from "../artifacts/Farm.json";
import getWeb3 from "../getWeb3";
import "../index.css";
import "../card.css"

const drizzleOptions = {
  contracts: [Farm]
}

var userarr;
var countarr;

class BusinessDashboard extends Component {
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
      id: '',
      row: [],
    }
  }

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Farm.networks[networkId];
      const instance = new web3.eth.Contract(
        Farm.abi,
        deployedNetwork && deployedNetwork.address,
      );

      const currentAddress = await web3.currentProvider.selectedAddress;
      this.setState({ FarmInstance: instance, web3: web3, account: accounts[0] });

      const verified = await this.state.FarmInstance.methods.isVerified1(currentAddress).call();
      this.setState({ verified: verified });

      const registered = await this.state.FarmInstance.methods.isBusiness(currentAddress).call();
      this.setState({ registered: registered });

      const count = await this.state.FarmInstance.methods.getCropReqCount().call();
      this.setState({ count: parseInt(count) });

      userarr = await this.state.FarmInstance.methods.getFarmersCount().call();


      const row = [];
      for (let i = 0; i < count; i++) {
        const businessId = await this.state.FarmInstance.methods.getCropRequirementBusiness(i).call();
        const status = await this.state.FarmInstance.methods.getCropRequirementStatus(i).call();
        if (businessId.toLowerCase() === currentAddress.toLowerCase() && !status) {
          const cropName = await this.state.FarmInstance.methods.getCropRequirementCropName(i).call();
          const quantity = await this.state.FarmInstance.methods.getCropRequirementQuantity(i).call();
          const pricePerKg = await this.state.FarmInstance.methods.getCropRequirementPrice(i).call();
          const deliveryTime = await this.state.FarmInstance.methods.getCropRequirementDelTime(i).call();
          const totalPrice = await this.state.FarmInstance.methods.getCropRequirementTotalPrice(i).call();
          const advPayment = await this.state.FarmInstance.methods.getCropRequirementAdvPayment(i).call();
          row.push({ cropName, quantity, pricePerKg, deliveryTime, totalPrice, advPayment });
        }
      }
      this.setState({ row: row });
      // countarr = row.length;

    } catch (error) {
      alert(`Failed to load web3, accounts, or contract. Check console for details.`);
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

    if (!this.state.registered) {
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
      <>
        <div className="content">
          <DrizzleProvider options={drizzleOptions}>
            <LoadingContainer>
              <div className="main-section">
                <Row>
                  <Col lg="4">
                    <div class="dashbord dashbord-skyblue">
                      <div class="icon-section">
                        <i class="fa fa-users" aria-hidden="true"></i><br />
                        <medium>Total Farmers</medium><br />
                        <p> {userarr} </p>
                      </div>
                      <div class="detail-section"><br />
                      </div>
                    </div>
                  </Col>
                  <Col lg="4">
                    <div class="dashbord dashbord-orange">
                      <div class="icon-section">
                        <i class="fa fa-landmark" aria-hidden="true"></i><br />
                        <medium>Added CropRquirements Count</medium><br />
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
          <Row>
            <Col lg="3">
              <Card>
                <CardHeader>
                  <h5 className="title">Wish to Add Crop Requirement !</h5>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">

                    <Button href="/Business/AddRequirement" disabled={!this.state.verified} className="btn-fill" color="primary">
                      Add Crop Requirement
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg="3">
              <Card>
                <CardHeader>
                  <h5 className="title">Profile</h5>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">
                    <Button href="/Business/BusinessProfile" className="btn-fill" color="primary">
                      View Profile
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg="3">
              <Card>
                <CardHeader>
                  <h5 className="title">Requests</h5>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">
                    <Button href="/Business/ApproveRequest" disabled={!this.state.verified} className="btn-fill" color="primary">
                      View all Requests
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg="3">
              <Card>
                <CardHeader>
                  {/* <CardTitle>View Signed Contracts!</CardTitle> */}
                  <h5 className="title">View Signed Contracts!</h5>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">
                    <Button href="/Seller/viewImage" className="btn-fill" color="primary">
                      View contracts
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <DrizzleProvider options={drizzleOptions}>
            <LoadingContainer>
              <Row>
                <Col lg="12" md="12">
                  <Card>
                    <CardHeader>
                      <CardTitle tag="h4">Crop Requirement Info</CardTitle>
                    </CardHeader>
                    <CardBody>
                      <Table className="tablesorter" responsive color="black">
                        <thead className="text-primary">
                          <tr>
                            <th>#</th>
                            <th>Crop name</th>
                            <th>Quantity(kg)</th>
                            <th>Price(kg)</th>
                            <th>Delivery Time</th>
                            <th>Total Price</th>
                            <th>Advanced Payment</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.row.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item.cropName}</td>
                              <td>{item.quantity}</td>
                              <td>{item.pricePerKg}</td>
                              <td>{item.deliveryTime}</td>
                              <td>{item.totalPrice}</td>
                              <td>{item.advPayment}</td>
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

export default BusinessDashboard;