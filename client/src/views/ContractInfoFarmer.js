import {
  LoadingContainer
} from '@drizzle/react-components';
import { DrizzleProvider } from '@drizzle/react-plugin';
import React, { Component } from 'react';
import { Spinner } from 'react-bootstrap';
// reactstrap components
import {
  Card, CardBody, CardHeader, CardTitle, Col, Row, Table
} from "reactstrap";
import Farm from "../artifacts/Farm.json";
import getWeb3 from "../getWeb3";




const drizzleOptions = {
  contracts: [Farm]
}


var verified;
// var row = [];


class ContractInfoFarmer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      LandInstance: undefined,
      account: null,
      web3: null,
      flag: null,
      verified: '',
      registered: '',
      count: 0,
      id: '',
      row: []
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
      var registered = await this.state.FarmInstance.methods.isFarmer(currentAddress).call();
      console.log(registered);
      this.setState({ registered: registered });

      var count = await this.state.FarmInstance.methods.getContractsCount().call();
      count = parseInt(count);
      console.log(typeof (count));
      console.log(count);
      this.setState({count:count});

      const row = [];
      for (let i = 0; i < count; i++) {
        const businessId = await this.state.FarmInstance.methods.getContractBusiness(i).call();
        const farmerId = await this.state.FarmInstance.methods.getContractFarmer(i).call();
        let business = await this.state.FarmInstance.methods.getBusinessDetails(businessId).call();
        if (farmerId.toLowerCase() === currentAddress.toLowerCase()) {
          const contractID = await this.state.FarmInstance.methods.getContractId(i).call();
          const quantity = await this.state.FarmInstance.methods.getContractQuantity(i).call();
          const cropName = await this.state.FarmInstance.methods.getContractCropName(i).call();
          const pricePerKg = await this.state.FarmInstance.methods.getContractPrice(i).call();
          const deliveryTime = await this.state.FarmInstance.methods.getContractDeadLine(i).call();
          const totalPrice = await this.state.FarmInstance.methods.getContractTotalPrice(i).call();
          const advPayment = await this.state.FarmInstance.methods.getContractAdvPayment(i).call();
          const remPayment = await this.state.FarmInstance.methods.isComplete(i).call();
          const businessName = business[0];
          // const farmerAge = farmer[1];
          // const farmerCity = farmer[2];
          // const farmerAdhar = farmer[3];
          // const farmerPan = farmer[4];
          row.push({ contractID,  businessId, cropName, quantity, businessName,
             pricePerKg, deliveryTime, totalPrice, advPayment, remPayment });
            //  farmerAge, farmerCity, farmerAdhar, farmerPan, 
        }
      }
      this.setState({ row: row });
      console.log(row)

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
              <Row>
                <Col lg="12" md="12">
                  <Card>
                    <CardHeader>
                      <CardTitle tag="h4">My Contracts
                      </CardTitle>
                    </CardHeader>
                    <CardBody>
                      <Table className="tablesorter" responsive color="black">
                      <thead className="text-primary">
                          <tr>
                            <th>#</th>
                            <th>Business ID</th>
                            <th>Business Name</th>
                            <th>Crop name</th>
                            <th>Land Doc</th>
                            <th>Quantity(kg)</th>
                            <th>Price(kg)</th>
                            <th>Delivery Time</th>
                            <th>Total Price</th>
                            <th>Advanced Payment</th>
                            <th>Remaining Payment status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.row.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item.businessId}</td>
                              <td>{item.businessName}</td>
                              <td>{item.cropName}</td>
                              {/* <td><a href={`http://10.4.0.94:8080/ipfs/${item.landDoc}`} target="_blank" rel="noreferrer">Click Here</a></td> */}
                              <td><a href={`https://ipfs.io/ipfs/${item.landDoc}`} target="_blank" rel="noreferrer">Click Here</a></td>
                              <td>{item.quantity}</td>
                              <td>{item.pricePerKg}</td>
                              <td>{item.deliveryTime}</td>
                              <td>{item.totalPrice}</td>
                              <td>{(item.advPayment) ? "Paid" : "Pending"}</td>
                              <td>{(item.remPayment) ? "Paid" : "Pending"}</td>
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

export default ContractInfoFarmer;