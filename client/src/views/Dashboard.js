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
// import "../card.css";
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
      }

      var ind = 0;
      var row = [];
      for (var i = 0; i < count; i++) {
        ind++;
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
              <Button onClick={this.request(i)} disabled = {!rowRequest[i]} className="btn btn-danger">
                Request
              </Button>
            </td>
          </tr>
        );
        console.log(rowRequest[i]);
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
                  <Col lg="4">
                    <div class="dashbord dashbord-blue">
                      <div class="icon-section">
                        <i class="fa fa-bell" aria-hidden="true"></i><br />
                        <medium>Total Requests</medium><br />
                        {/* <p>{reqsarr}</p> */}
                      </div>
                      <div class="detail-section">
                        <br />
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
                    <Button href="/admin/OwnedLands" className="btn-fill" color="primary">
                      View Your Signed Contracts
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg="4">
              <Card>
                <CardHeader>
                  <h5 className="title">View Requested Contracts</h5>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">
                    <Button href="/admin/MakePayment" className="btn-fill" color="primary">
                      View Requested Contract
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



// var row = [];
// var countarr = [];
// var userarr = [];

// var reqsarr = [];
// var landOwner = [];
// var requested = false;

// class Dashboard extends Component {
//   constructor(props) {
//     super(props)

//     this.state = {
//       FarmInstance: undefined,
//       account: null,
//       web3: null,
//       count: 0,
//       requested: false,
//     }
//   }

//   // requestLand = (seller_address, land_id) => async () => {

//   //   console.log(seller_address);
//   //   console.log(land_id);
//   //   // this.setState({requested: true});
//   //   // requested = true;
//   //   await this.state.FarmInstance.methods.requestLand(
//   //     seller_address,
//   //     land_id
//   //   ).send({
//   //     from: this.state.account,
//   //     gas: 2100000
//   //   }).then(response => {
//   //     this.props.history.push("#");
//   //   });

//   //   //Reload
//   //   window.location.reload(false);

//   // }

//   componentDidMount = async () => {
//     //For refreshing page only once
//     if (!window.location.hash) {
//       console.log(window.location.hash);
//       window.location = window.location + '#loaded';
//       window.location.reload();
//     }

//     try {
//       //Get network provider and web3 instance
//       const web3 = await getWeb3();

//       const accounts = await web3.eth.getAccounts();

//       const networkId = await web3.eth.net.getId();
//       const deployedNetwork = Farm.networks[networkId];
//       const instance = new web3.eth.Contract(
//         Farm.abi,
//         deployedNetwork && deployedNetwork.address,
//       );

//       this.setState({ FarmInstance: instance, web3: web3, account: accounts[0] });

//       const currentAddress = await web3.currentProvider.selectedAddress;
//       // console.log(currentAddress);
//       var registered = await this.state.FarmInstance.methods.isFarmer(currentAddress).call();
//       // console.log(registered);
//       this.setState({ registered: registered });
//       var count = await this.state.FarmInstance.methods.getCropReqCount().call();
//       count = parseInt(count);
//       // console.log(typeof (count));
//       // console.log(count);
//       var verified = await this.state.FarmInstance.methods.isVerified1(currentAddress).call();
//       // console.log(verified);

//       // var countBusiness = await this.state.FarmInstance.methods.getFarmersCount().call();
//       // var countFarmer = await this.state.FarmInstance.methods.getBusinessCount().call();
//       // userarr.push(<p>{countseller.toString()}</p>);

//       // countarr.push(<p>{count.toString()}</p>);
//       countarr.push(<ContractData contract="Farm" method="getCropReqCount" />);
//       userarr.push(<ContractData contract="Farm" method="getBusinessCount" />);
//       // reqsarr.push(<ContractData contract="Farm" method="getRequestsCount" />);

//       // var rowsArea = [];
//       // var rowsCity = [];
//       // var rowsState = [];
//       // var rowsPrice = [];
//       // var rowsPID = [];
//       // var rowsSurvey = [];


//       // var dict = {}
//       // for (var i = 1; i < count + 1; i++) {
//       //   var address = await this.state.FarmInstance.methods.getLandOwner(i).call();
//       //   dict[i] = address;
//       // }

//       // console.log(dict[1]);

//       // for (var i = 1; i < count + 1; i++) {
//       //   rowsArea.push(<ContractData contract="Land" method="getArea" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
//       //   rowsCity.push(<ContractData contract="Land" method="getCity" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
//       //   rowsState.push(<ContractData contract="Land" method="getState" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
//       //   rowsPrice.push(<ContractData contract="Land" method="getPrice" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
//       //   rowsPID.push(<ContractData contract="Land" method="getPID" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
//       //   rowsSurvey.push(<ContractData contract="Land" method="getSurveyNumber" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
//       // }

//       // for (var i = 0; i < count; i++) {
//       //   var requested = await this.state.FarmInstance.methods.isRequested(i + 1).call();
//       //   // console.log(requested);

//       //   row.push(<tr><td>{i + 1}</td><td>{rowsArea[i]}</td><td>{rowsCity[i]}</td><td>{rowsState[i]}</td><td>{rowsPrice[i]}</td><td>{rowsPID[i]}</td><td>{rowsSurvey[i]}</td>
//       //     <td>
//       //       <Button onClick={this.requestLand(dict[i + 1], i + 1)} disabled={!verified || requested} className="button-vote">
//       //         Request Land
//       //       </Button>
//       //     </td>
//       //   </tr>)
//       // }
//       // console.log(row);
//       var rowIndex = [];
//       var rowBusinessId = [];
//       var rowCropName = [];
//       var rowQuant = [];
//       var rowPricePerKg = [];
//       var rowDeliveryTime = [];
//       var rowTotalPrice = [];
//       var rowAdvPay = [];
//       var rowStatus = [];
//       var rowBusinessName = [];


//       for (var i = 0; i < count; i++) {
//         // console.log(<ContractData contract="Farm" method="getCropRequirementBusiness" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
//         // rowBusinessId.push(<ContractData contract="Farm" method="getCropRequirementBusiness" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
//         rowIndex.push(i);
//         const businessId = await this.state.FarmInstance.methods.getCropRequirementBusiness(i).call();
//         // console.log(businessId);
//         rowBusinessId.push(businessId);
//         var business;
//         business = await this.state.FarmInstance.methods.getBusinessDetails(businessId).call();
//         rowBusinessName.push(business[0]);
//         rowCropName.push(<ContractData contract="Farm" method="getCropRequirementCropName" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
//         rowQuant.push(<ContractData contract="Farm" method="getCropRequirementQuantity" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
//         rowPricePerKg.push(<ContractData contract="Farm" method="getCropRequirementPrice" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
//         //We have to take care of delivery time, as it is in seconds.
//         rowDeliveryTime.push(<ContractData contract="Farm" method="getCropRequirementDelTime" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
//         rowTotalPrice.push(<ContractData contract="Farm" method="getCropRequirementTotalPrice" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
//         rowAdvPay.push(<ContractData contract="Farm" method="getCropRequirementAdvPayment" methodArgs={[i, { from: "0xa42A8B478E5e010609725C2d5A8fe6c0C4A939cB" }]} />);
//         const status = await this.state.FarmInstance.methods.getCropRequirementStatus(i).call();
//         rowStatus.push(status);
//       }

//       var ind = 0;
//       for (var i = 0; i < count; i++) {
//         // var isRequestedToContract = false;
//         var isRequestedToContract = await this.state.FarmInstance.methods.isRequested(i).call();
//         // console.log(isRequestedToContract);
//         // if (rowStatus[i] == false) {
//           ind++;
//           row.push(<tr><td>{ind}</td><td>{rowBusinessName[i]}</td><td>{rowCropName[i]}</td><td>{rowQuant[i]}</td><td>{rowPricePerKg[i]}</td><td>{rowDeliveryTime[i]}</td><td>{rowTotalPrice[i]}</td><td>{rowAdvPay[i]}</td>
//             <td>
//               <Button onClick={this.request(i)} className="btn btn-danger">
//                 Request
//               </Button>
//             </td>
//           </tr>
//           )
//         // }
//       }
//       console.log(row);

//     } catch (error) {
//       // Catch any errors for any of the above operations.
//       alert(
//         `Failed to load web3, accounts, or contract. Check console for details.`,
//       );
//       console.error(error);
//     }
//   };

//   // request => (item) 
//   request = (item) => async () => {

//     await this.state.FarmInstance.methods.requestContract(
//       item
//     ).send({
//       from: this.state.account,
//       gas: 2100000
//     });

//     window.location.reload(false);
//   }

//   render() {
//     if (!this.state.web3) {
//       return (
//         <div>
//           <div>
//             <h1>
//               <Spinner animation="border" variant="primary" />
//             </h1>
//           </div>

//         </div>
//       );
//     }

//     if (!this.state.registered) {
//       return (
//         <div className="content">
//           <div>
//             <Row>
//               <Col xs="6">
//                 <Card className="card-chart">
//                   <CardBody>
//                     <h1>
//                       You are not verified to view this page
//                     </h1>
//                   </CardBody>
//                 </Card>
//               </Col>
//             </Row>
//           </div>

//         </div>
//       );
//     }

//     return (
//       <>
//         <div className="content">
//           <DrizzleProvider options={drizzleOptions}>
//             <LoadingContainer>
//               <div className="main-section">
//                 <Row>
//                   <Col lg="4">
//                     <div class="dashbord dashbord-skyblue">
//                       <div class="icon-section">
//                         <i class="fa fa-users" aria-hidden="true"></i><br />
//                         <medium>Total Business</medium><br />
//                         <p> {userarr} </p>

//                       </div>
//                       <div class="detail-section"><br />
//                       </div>
//                     </div>
//                   </Col>
//                   <Col lg="4">
//                     <div class="dashbord dashbord-orange">
//                       <div class="icon-section">
//                         <i class="fa fa-landmark" aria-hidden="true"></i><br />
//                         <medium>Registered Crop Requirement Count</medium><br />
//                         <p>{countarr}</p>
//                       </div>
//                       <div class="detail-section"><br />
//                       </div>
//                     </div>
//                   </Col>
//                   <Col lg="4">
//                     <div class="dashbord dashbord-blue">
//                       <div class="icon-section">
//                         <i class="fa fa-bell" aria-hidden="true"></i><br />
//                         <medium>Total Requests</medium><br />
//                         {/* <p>{reqsarr}</p> */}
//                       </div>
//                       <div class="detail-section">
//                         <br />
//                       </div>
//                     </div>
//                   </Col>
//                 </Row>
//               </div>
//             </LoadingContainer>
//           </DrizzleProvider>
//           <Row>
//             <Col lg="4">
//               <Card>
//                 <CardHeader>
//                   <h5 className="title">Profile</h5>
//                 </CardHeader>
//                 <CardBody>
//                   <div className="chart-area">

//                     <Button href="/admin/farmerProfile" className="btn-fill" color="primary">
//                       View Profile
//                     </Button>
//                   </div>
//                 </CardBody>
//               </Card>
//             </Col>
//             <Col lg="4">
//               <Card>
//                 <CardHeader>
//                   <h5 className="title">Signed Contracts</h5>
//                 </CardHeader>
//                 <CardBody>
//                   <div className="chart-area">

//                     <Button href="/admin/OwnedLands" className="btn-fill" color="primary">
//                       View Your Signed Contracts
//                     </Button>
//                   </div>
//                 </CardBody>
//               </Card>
//             </Col>
//             <Col lg="4">
//               <Card>
//                 <CardHeader>
//                   <h5 className="title">View Requested Contracts</h5>
//                 </CardHeader>
//                 <CardBody>
//                   <div className="chart-area">

//                     <Button href="/admin/MakePayment" className="btn-fill" color="primary">
//                       View Requested Contract
//                     </Button>
//                   </div>
//                 </CardBody>
//               </Card>
//             </Col>
//           </Row>
//           <DrizzleProvider options={drizzleOptions}>
//             <LoadingContainer>
//               <Row>
//                 <Col lg="12" md="12">
//                   <Card>
//                     <CardHeader>
//                       <CardTitle tag="h4">New Crop Requirements</CardTitle>
//                     </CardHeader>
//                     <CardBody>
//                       <Table className="tablesorter" responsive color="black">
//                         <thead className="text-primary">
//                           <tr>
//                             <th>#</th>
//                             <th>Business</th>
//                             <th>Crop name</th>
//                             <th>Quantity(kg)</th>
//                             <th>Price(kg)</th>
//                             <th>Delivery Time</th>
//                             <th>Total Price</th>
//                             <th>Advanced Payment</th>
//                             <th>Request Contract</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {/* {console.log("Ashwin")} */}
//                           {/* {row.length} */}
//                           {/* {console.log(row)} */}
//                           {row.map((rowData, index) => (
//                             <tr key={index}>{rowData}</tr>
//                           ))}
//                         </tbody>
//                       </Table>
//                     </CardBody>
//                   </Card>
//                 </Col>
//               </Row>
//             </LoadingContainer>
//           </DrizzleProvider>
//         </div>
//       </>
//     );
//   }
// }


// export default Dashboard;