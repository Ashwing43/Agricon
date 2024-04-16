import {
  ContractData, LoadingContainer
} from '@drizzle/react-components';
import { DrizzleProvider } from '@drizzle/react-plugin';
import React, { Component } from "react";
import { Spinner } from 'react-bootstrap';
// reactstrap components
import {
  Button, Card, CardBody, CardHeader, CardTitle, Col, Row, Table
} from "reactstrap";
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Farm from "../artifacts/Farm.json";
import "../card.css";
import getWeb3 from "../getWeb3";


const drizzleOptions = {
  contracts: [Farm]
}

var countBusiness;

class Dashboard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      // Initialize loading state
      loading: true,
      FarmInstance: undefined,
      account: null,
      web3: null,
      count: 0,
      requested: false,
      row: [], // Initialize row as empty array
    };
  }

  async componentDidMount() {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      console.log(accounts);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Farm.networks[networkId];
      const instance = new web3.eth.Contract(
        Farm.abi,
        deployedNetwork && deployedNetwork.address
      );

      this.setState({ FarmInstance: instance, web3: web3, account: accounts[0] });

      const currentAddress = await web3.currentProvider.selectedAddress;
      var registered = await this.state.FarmInstance.methods.isFarmer(currentAddress).call();
      this.setState({ registered: registered });

      var count = await this.state.FarmInstance.methods.getCropReqCount().call();
      count = parseInt(count);
      this.setState({ count: count });

      countBusiness = await this.state.FarmInstance.methods.getFarmersCount().call();

      var rowIndex = [];
      var rowBusinessId = [];
      var rowCropName = [];
      var rowQuant = [];
      var rowPricePerKg = [];
      var rowDeliveryTime = [];
      var rowTotalPrice = [];
      var rowAdvPay = [];
      var rowStatus = [];
      var rowBusinessName = [];
      var rowRequest = [];

      for (var i = 0; i < count; i++) {
        rowIndex.push(i);
        const businessId = await this.state.FarmInstance.methods.getCropRequirementBusiness(i).call();
        rowBusinessId.push(businessId);
        var business = await this.state.FarmInstance.methods.getBusinessDetails(businessId).call();
        rowBusinessName.push(business[0]);
        rowCropName.push(await this.state.FarmInstance.methods.getCropRequirementCropName(i).call());
        rowQuant.push(await this.state.FarmInstance.methods.getCropRequirementQuantity(i).call());
        rowPricePerKg.push(await this.state.FarmInstance.methods.getCropRequirementPrice(i).call());
        rowDeliveryTime.push(await this.state.FarmInstance.methods.getCropRequirementDelTime(i).call());
        rowTotalPrice.push(await this.state.FarmInstance.methods.getCropRequirementTotalPrice(i).call());
        rowAdvPay.push(await this.state.FarmInstance.methods.getCropRequirementAdvPayment(i).call());
        rowStatus.push(await this.state.FarmInstance.methods.getCropRequirementStatus(i).call());
        rowRequest.push(await this.state.FarmInstance.methods.isRequested(i).call());
        // console.log(rowRequest[i]);
      }

      var ind = 0;
      var row = [];
      for (var i = 0; i < count; i++) {
        ind++;
        // console.log(rowStatus[i]);
        if (!rowStatus[i]) {
          row.push(
            <tr key={i}>
              <td>{ind}</td>
              <td>{rowBusinessName[i]}</td>
              <td>{rowCropName[i]}</td>
              <td>{rowQuant[i]}</td>
              <td>{rowPricePerKg[i]}</td>
              <td>{rowDeliveryTime[i]}</td>
              <td>{rowTotalPrice[i]}</td>
              <td>{rowAdvPay[i]}</td>
              <td>
                <Button onClick={this.request(i)} disabled={rowRequest[i]} className="btn btn-danger">
                  Request
                </Button>
              </td>
            </tr>
          );
        }
        // console.log(rowRequest[i]);
      }

      this.setState({ row: row, loading: false }); // Update row and loading state

    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }

  request = (item) => async () => {
    await this.state.FarmInstance.methods.requestContract(
      item
    ).send({
      from: this.state.account,
      gas: 2100000
    });

    window.location.reload(false);
  }
  // Remaining code...

  render() {
    // Destructure state variables
    const { loading, web3, registered, row } = this.state;

    // Handle loading state
    if (loading || !web3) {
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

    // Handle unregistered state
    if (!registered) {
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

    // Render the dashboard once data is loaded
    return (
      <>
        <div className="content">
          {/* Render dashboard content here */}
          <DrizzleProvider options={drizzleOptions}>
            <LoadingContainer>
              <div className="main-section">
                <Row>
                  <Col lg="4">
                    <div class="dashbord dashbord-skyblue">
                      <div class="icon-section">
                        <i class="fa fa-users" aria-hidden="true"></i><br />
                        <medium>Total Business</medium><br />
                        <p> {countBusiness} </p>
                      </div>
                      <div class="detail-section"><br />
                      </div>
                    </div>
                  </Col>
                  <Col lg="4">
                    <div class="dashbord dashbord-orange">
                      <div class="icon-section">
                        <i class="fa fa-landmark" aria-hidden="true"></i><br />
                        <medium>Registered Crop Requirement Count</medium><br />
                        <p>{row.length}</p>
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
            <Col lg="4">
              <Card>
                <CardHeader>
                  <h5 className="title">Profile</h5>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">
                    <Button href="/admin/farmerProfile" className="btn-fill" color="primary">
                      View Profile
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg="4">
              <Card>
                <CardHeader>
                  <h5 className="title">Signed Contracts</h5>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">
                    <Button href="/admin/ViewContractsFarmer" className="btn-fill" color="primary">
                      View Your Signed Contracts
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          {/* For example, render the table with fetched data */}
          <Row>
            <Col lg="12" md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">New Crop Requirements</CardTitle>
                </CardHeader>
                <CardBody>
                  <Table className="tablesorter" responsive color="black">
                    <thead className="text-primary">
                      <tr>
                        <th>#</th>
                        <th>Business</th>
                        <th>Crop name</th>
                        <th>Quantity(kg)</th>
                        <th>Price(kg)</th>
                        <th>Delivery Time</th>
                        <th>Total Price</th>
                        <th>Advanced Payment</th>
                        <th>Request Contract</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Render the populated rows */}
                      {row}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}
export default Dashboard;