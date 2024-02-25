import {
    LoadingContainer
} from '@drizzle/react-components';
import { DrizzleProvider } from '@drizzle/react-plugin';
import React, { Component } from 'react';
import { Spinner } from 'react-bootstrap';
// reactstrap components
import {
    Button, Card, CardBody, CardHeader, CardTitle, Table
} from "reactstrap";
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Farm from "../artifacts/Farm.json";
import getWeb3 from "../getWeb3";
import '../index.css';

const drizzleOptions = {
    contracts: [Farm]
}

class ApproveRequest extends Component {
    constructor(props) {
        super(props)

        this.state = {
            FarmInstance: undefined,
            account: null,
            web3: null,
            approved: '',
            flag: null,
            verified: '',
            registered: '',
            count: 0,
            id: '',
            row: [],
            val: 0,
        }
    }
    approveRequest = (reqId) => async () => {

        await this.state.FarmInstance.methods.approveRequest(
            reqId
        ).send({
            from: this.state.account,
            gas: 2100000,
            value: this.state.value
        });
        //Reload
        window.location.reload(false);

    }

    rejectRequest = (reqId) => async () => {

        await this.state.FarmInstance.methods.approveRequest(
            reqId
        ).send({
            from: this.state.account,
            gas: 2100000,
            value: this.state.value
        });
        //Reload
        window.location.reload(false);

    }

    getRequirement = (reqId) => async () => {

        await this.state.FarmInstance.methods.getCropRequirementCropName(
            reqId
        ).send({
            from: this.state.account,
            gas: 2100000
        });
        //Reload
        window.location.reload(false);

    }

    getFarmer = (address) => async () => {
        await this.state.FarmInstance.methods.getFarmerDetails(address).send({
            from: this.state.account,
            gas: 2100000,

        })
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
            this.setState({ FarmInstance: instance, web3: web3, account: accounts[0] });

            var registered = await this.state.FarmInstance.methods.isBusiness(currentAddress).call();
            this.setState({ registered: registered });

            var count = await this.state.FarmInstance.methods.getCropReqCount().call();
            this.setState({ count: parseInt(count) });

            // var requestsCount = await this.state.FarmInstance.methods.getRequestsCount().call();
            // console.log(requestsCount);
            const row = [];
            var ind = 0;
            for (let i = 0; i < count; i++) {
                ind++;
                const businessId = await this.state.FarmInstance.methods.getCropRequirementBusiness(i).call();
                const status = await this.state.FarmInstance.methods.getCropRequirementStatus(i).call();
                const isRequested = await this.state.FarmInstance.methods.isRequested(i).call();

                if (businessId.toLowerCase() === currentAddress.toLowerCase() && !status && isRequested) {
                    const farmerId = await this.state.FarmInstance.methods.requestMapping(i).call();
                    const farmerDetails = await this.state.FarmInstance.methods.getFarmerDetails(farmerId).call();
                    const deliveryTime = await this.state.FarmInstance.methods.getCropRequirementDelTime(i).call();
                    const totalPrice = await this.state.FarmInstance.methods.getCropRequirementTotalPrice(i).call();
                    const advPayment = await this.state.FarmInstance.methods.getCropRequirementAdvPayment(i).call();
                    row.push(<tr key={i}>
                        <td>
                            {ind}
                        </td>
                        <td>
                            <Button onClick={this.getRequirement(i)} className="btn btn-danger">
                                Crop Requirement
                            </Button>
                        </td>
                        <td>
                            <Button onClick={this.getFarmer(farmerId)} className="btn btn-danger">
                                Farmer Details
                            </Button>
                        </td>
                        <td>
                            <Button onClick={this.approveRequest(i)} className="btn btn-danger">
                                Approve
                            </Button>
                            <a> </a>
                            <Button onClick={this.rejectRequest(i)} className="btn btn-danger">
                                Reject
                            </Button>
                        </td>
                    </tr>);
                }
            }
            this.setState({ row: row });
            // console.log(requestTable);

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
                        <h1>
                            You are not authorized to view this page.
                        </h1>
                    </div>

                </div>
            );
        }

        return (
            <div className="content">
                <DrizzleProvider options={drizzleOptions}>
                    <LoadingContainer>
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h4">Requests Info</CardTitle>
                            </CardHeader>
                            <CardBody>

                                <Table className="tablesorter" responsive color="black">
                                    <thead className="text-primary">
                                        <tr>
                                            <th>#</th>
                                            <th>Crop Requirements</th>
                                            <th>Farmer ID</th>
                                            <th>Approve Request</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.row}
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>

                    </LoadingContainer>
                </DrizzleProvider>
            </div>
        );

    }
}

export default ApproveRequest;
