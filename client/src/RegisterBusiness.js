import React, { Component } from 'react';
import { Button, FormControl, FormFile, FormGroup, Spinner } from 'react-bootstrap';
import FarmContract from "./artifacts/Farm.json";
import getWeb3 from "./getWeb3";
import ipfs from './ipfs';

//import Navigation from './Navigation'

class RegisterBusiness extends Component {
    constructor(props) {
        super(props)

        this.state = {
            FarmInstance: undefined,
            account: null,
            web3: null,
            business_name: '',
            city: '',
            companyRegistrationNumber: '',
            GSTNumber: '',
            email: '',
            isVerified: false,
            buffer2: null,
            document: '',
        }
        this.captureDoc = this.captureDoc.bind(this);
        this.addDoc = this.addDoc.bind(this);
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


        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };
    addDoc = async () => {
           // alert('In add image')
           await ipfs.files.add(this.state.buffer2, (error, result) => {
            if (error) {
                alert(error)
                return
            }

            //   alert(result[0].hash)
            this.setState({ document: result[0].hash });
            console.log('document:', this.state.document);
        })
    }

    RegisterBusiness = async () => {
        this.addDoc();
        // alert('After add image')
        await new Promise(resolve => setTimeout(resolve, 10000));
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);

        if (this.state.business_name == '' || this.state.city == '' || this.state.companyRegistrationNumber == '' || this.state.GSTnumber == '') {
            alert("All the fields are compulsory!");
        } else if (!Number(this.state.companyRegistrationNumber) || this.state.companyRegistrationNumber.length != 12) {
            alert("company Registration Number should be 12 digits long!");
        } else if (this.state.GSTnumber.length != 10) {
            alert("GST Number should be a 10 digit unique number!");
        } else if (this.state.email == '' || !pattern.test(this.state.email)) {
            alert('Please enter a valid email address\n');
        }
        else {
            await this.state.FarmInstance.methods.addBusiness(
                this.state.business_name,
                this.state.city,
                this.state.companyRegistrationNumber,
                this.state.GSTnumber,
                this.state.document,
                this.state.email,
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

    updateBusinessName = event => (
        this.setState({ business_name: event.target.value })
    )

    updateCity = event => (
        this.setState({ city: event.target.value })
    )
    updateEmail = event => (
        this.setState({ email: event.target.value })
    )
    updateCompanyRegistrationNumber = event => (
        this.setState({ companyRegistrationNumber: event.target.value })
    )
    updateGST = event => (
        this.setState({ GSTnumber: event.target.value })
    )
    captureDoc(event) {
        event.preventDefault()
        const file2 = event.target.files[0]
        const reader2 = new window.FileReader()
        reader2.readAsArrayBuffer(file2)
        reader2.onloadend = () => {
            this.setState({ buffer2: Buffer(reader2.result) })
            console.log('buffer2', this.state.buffer2)
        }
        console.log('caoture doc...')
    }


    render() {
        if (!this.state.web3) {
            return (
                <div className="bodyC">

                    <div className="img-wrapper">
                        <img src="https://www.kultivate.in/images/contract.png" className="logo" />
                        <div className="wine-text-container">
                            <div className="site-title wood-text">Contract Farming</div>
                        </div>
                    </div>
                    <div className="auth-wrapper">
                        <div className="auth-inner">
                            <div>
                                <div>
                                    <h1>
                                        <Spinner animation="border" variant="warning" />
                                    </h1>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="bodyC">
                <div className="img-wrapper">
                    <img src="https://www.kultivate.in/images/contract.png" className="logo" />
                    <div className="wine-text-container">
                        <div className="site-title wood-text">AGRICON</div>
                    </div>
                </div>
                <div className="auth-wrapper">
                    <div className="auth-inner">
                        <div className="App">

                            <div>
                                <div>
                                    <h1 style={{ color: "black" }}>
                                        Business Registration
                                    </h1>
                                </div>
                            </div>



                            <div className="form">

                                <FormGroup>
                                    <div className="form-label">
                                        Enter Business Name --
                                    </div>
                                    <div className="form-input">
                                        <FormControl
                                            input='text'
                                            value={this.state.business_name}
                                            onChange={this.updateBusinessName}
                                        />
                                    </div>
                                </FormGroup>

                                <FormGroup>
                                    <div className="form-label">
                                        Enter City --
                                    </div>
                                    <div className="form-input">
                                        <FormControl
                                            input='text'
                                            value={this.state.city}
                                            onChange={this.updateCity}
                                        />
                                    </div>
                                </FormGroup>

                                <FormGroup>
                                    <div className="form-label">
                                        Enter Company Registration Number --
                                    </div>
                                    <div className="form-input">
                                        <FormControl
                                            input='text'
                                            value={this.state.companyRegistrationNumber}
                                            onChange={this.updateCompanyRegistrationNumber}
                                        />
                                    </div>
                                </FormGroup>

                                <FormGroup>
                                    <div className="form-label">
                                        Enter GST no --
                                    </div>
                                    <div className="form-input">
                                        <FormControl
                                            input='text'
                                            value={this.state.GSTnumber}
                                            onChange={this.updateGST}
                                        />
                                    </div>
                                </FormGroup>

                                <FormGroup>
                                    <div className="form-label">
                                        Enter Email Address --
                                    </div>
                                    <div className="form-input">
                                        <FormControl
                                            input='text'
                                            value={this.state.email}
                                            onChange={this.updateEmail}
                                        />
                                    </div>
                                </FormGroup>

                                <FormGroup>
                                    <label>Add Business License (PDF Format)</label>
                                    <FormFile
                                        id="File2"
                                        onChange={this.captureDoc}
                                    />
                                </FormGroup>

                                <Button onClick={this.RegisterBusiness} className="button-vote">
                                    Register as Business
                                </Button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );

    }
}

export default RegisterBusiness;