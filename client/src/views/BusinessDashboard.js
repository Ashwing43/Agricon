import {
  ContractData, LoadingContainer
} from '@drizzle/react-components';
import { DrizzleProvider } from '@drizzle/react-plugin';
import React, { Component } from 'react';
import { Spinner } from 'react-bootstrap';
// reactstrap components
import {
  Button, Card, CardBody, CardHeader, CardTitle, Col, Row, Table
} from "reactstrap";
import Farm from "../artifacts/Farm.json";
// import "../card.css";
import getWeb3 from "../getWeb3";
import "../index.css";




const drizzleOptions = {
  contracts: [Farm]
}


var verified;
var row = [];
var countarr = [];
var userarr = [];

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
    }
  }

  // viewImage = (landId) => {
  //   alert(landId);
  //   this.props.history.push({
  //     pathname: '/viewImage',
  //   })
  // }

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
      console.log(currentAddress);
      this.setState({ FarmInstance: instance, web3: web3, account: accounts[0] });
      verified = await this.state.FarmInstance.methods.isVerified1(currentAddress).call();
      console.log(verified);
      this.setState({ verified: verified });
      var registered = await this.state.FarmInstance.methods.isBusiness(currentAddress).call();
      console.log(registered);
      this.setState({ registered: registered });

      var count = await this.state.FarmInstance.methods.CropReqMapCount().call();
      count = parseInt(count);
      console.log(typeof (count));
      console.log(count);
      //this.setState({count:count});
      // var requestCount = await this.state.LandInstance.methods.getRequestCount(currentAddress).call();
      // countarr.push(<ContractData contract="Farm" method="getLandsCount" />);
      userarr.push(<ContractData contract="Farm" method="getFarmersCount" />);

      var rowBusinessId = [];
      var rowCropName = [];
      var rowQuant = [];
      var rowPricePerKg = [];
      var rowDeliveryTime = [];
      var rowTotalPrice = [];
      var rowAdvPay = [];


      for (var i = 1; i < count + 1; i++) {
        rowBusinessId.push(<ContractData contract="Farm" method="getCropRequirementBusiness" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
        rowCropName.push(<ContractData contract="Farm" method="getCropRequirementCropName" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
        rowQuant.push(<ContractData contract="Farm" method="getCropRequirementQuantity" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
        rowPricePerKg.push(<ContractData contract="Farm" method="getCropRequirementPrice" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
        rowDeliveryTime.push(<ContractData contract="Farm" method="getCropRequirementDelTime" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
        rowTotalPrice.push(<ContractData contract="Farm" method="getCropRequirementTotalPrice" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
        rowAdvPay.push(<ContractData contract="Farm" method="getCropRequirementAdvPayment" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
      }

      for (var i = 0; i < count; i++) {
        if(rowBusinessId[i] == currentAddress) row.push(<tr><td>{i + 1}</td><td>{rowCropName[i]}</td><td>{rowQuant[i]}</td><td>{rowPricePerKg[i]}</td><td>{rowDeliveryTime[i]}</td><td>{rowTotalPrice[i]}</td><td>{rowAdvPay[i]}</td>
        </tr>)
      }
      countarr.push(row.length);
      console.log(row);

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
                        <p>{countarr}</p>
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
                    <Button href="/seller/sellerProfile" className="btn-fill" color="primary">
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
                    <Button href="/Seller/ApproveRequest" disabled={!this.state.verified} className="btn-fill" color="primary">
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
                      <CardTitle tag="h4">Crop Requirement Info
                      </CardTitle>
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
                          {/* {row} */}
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