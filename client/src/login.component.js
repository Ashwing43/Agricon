import React, { Component } from "react";
import { Button } from "reactstrap";
import FarmContract from "./artifacts/Farm.json";
import getWeb3 from "./getWeb3";
import './index.css';

export default class Login extends Component {
    constructor() {
        super();
        this.state = {
            role: null,
            redirect: null,
            Admin: '',
            farmer: '',
            business: '',
        }
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount = async () => {
        if (!window.location.hash) {
            window.location = window.location + '#loaded';
            window.location.reload();
        }

        try {
            //Get network provider and web3 instance
            const web3 = await getWeb3();

            const accounts = await web3.eth.getAccounts();

            const networkId = await web3.eth.net.getId();
            console.log("Network ID ", networkId)
            const deployedNetwork = FarmContract.networks[networkId];

            console.log("Deployed network address ", deployedNetwork)

            const instance = new web3.eth.Contract(
                FarmContract.abi,
                deployedNetwork && deployedNetwork.address,
            );

            const currentAddress = await web3.currentProvider.selectedAddress;
            console.log("Current address :- ", currentAddress);
            this.setState({ FarmInstance: instance, web3: web3, account: accounts[0] });
            var farmer = await this.state.FarmInstance.methods.isFarmer(currentAddress).call();
            console.log(farmer);
            this.setState({ farmer: farmer });
            var business = await this.state.FarmInstance.methods.isBusiness(currentAddress).call();
            console.log(business);
            this.setState({ business: business });
            var Admin = await this.state.FarmInstance.methods.isAdmin1(currentAddress).call();
            console.log(Admin);
            this.setState({ Admin: Admin });

        } catch (error) {
            alert(
                'Failed to load web3, accounts, or contract. Check console for details.',
            );
            console.error(error);
        }
    };

    handleInputChange(event) {
        this.setState({
            role: event.target.value,
            redirect: "/Register" + event.target.value
        });
    }
    submit() {
        this.props.history.push(this.state.redirect);
        window.location.reload(false);

    }

    render() {
        if (this.state.farmer || this.state.business || this.state.Admin) {
            return (

                <div className="bodyC">
                    <div className="img-wrapper">
                        <img alt='image1' src="https://www.kultivate.in/images/contract.png" className="logo" />
                        <div className="wine-text-container">
                            <div className="site-title wood-text">Agricon</div>
                        </div>
                    </div>
                    <div className="auth-wrapper">
                        <div className="auth-inner">
                            <h1>You are already registered.</h1>
                            <Button href="/admin/Dashboard" disabled={!this.state.farmer} className="btn-block" style={{ margin: "2px", backgroundColor: "#74B72E" }} >Farmer Dashboard</Button>
                            <br /><Button href="/Business/BusinessDashboard" disabled={!this.state.business} className="btn-block" style={{ margin: "2px", backgroundColor: "#74B72E" }}>Business Dashboard</Button>
                            <br /><Button href="/Admin1/Admin1Dashboard" disabled={!this.state.Admin} className="btn-block" style={{ margin: "2px", backgroundColor: "#74B72E" }}>Admin Dashboard</Button>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="bodyC">
                <a href="/Help" className="faq" style={{ borderRadius: "10%", textDecoration: "none", fontWeight: "bolder" }} >
                    <h3 style={{ color: "wheat" }}>Help?</h3>
                </a>
                <div className="img-wrapper">
                    <img alt = "image2" src="https://www.kultivate.in/images/contract.png" className="logo" />
                    <div className="wine-text-container">
                        <div className="site-title wood-text">AGRICON</div>
                    </div>
                </div>
                <div className="auth-wrapper">
                    <div className="auth-inner">
                        <div>
                            <h1 style={{ letterSpacing: "3px", fontWeight: 500, color: "black" }}>Welcome !</h1>
                            <h4 style={{ letterSpacing: "2px", color: 'black' }}>Blockchain Based Complete Platform for Contract Farming !</h4>
                            <hr
                                style={{
                                    color: "#696969",
                                    height: 1
                                }}
                            />

                            <div class="form-group" style={{ color: "black" }}>
                                <label class="control-label" for="Company" style={{ fontSize: "18px", padding: "2px" }}>Select Role</label>
                                <select id="Company" class="form-control" name="Company" onChange={this.handleInputChange}>
                                    <option selected="true" disabled="disabled">Select Role</option>
                                    <option value="Business">Business</option>
                                    <option value="Farmer">Farmer</option>
                                </select>
                            </div>

                            <div>
                                <button onClick={() => this.submit()} className="btn btn-primary btn-block" style={{ marginBottom: "10px", marginTop: "10px" }}>Register</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}