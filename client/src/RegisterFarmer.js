import React, { Component } from 'react'
import FarmContract from "./artifacts/Farm.json"
import getWeb3 from "./getWeb3"
import ipfs from './ipfs';

import { FormGroup, FormControl, Button, Spinner, FormFile } from 'react-bootstrap'

//import Navigation from './Navigation'

class RegisterFarmer extends Component {
    constructor(props) {
        super(props)

        this.state = {
            FarmInstance: undefined,
            account: null,
            web3: null,
            name: '',
            age: '',
            city: '',
            aadharNumber: '',
            panNumber: '',
            land_document: '',
            isVerified: false,
            buffer2: null,
        }
        this.captureDoc = this.captureDoc.bind(this);
        this.addDoc = this.addDoc.bind(this);
    }

    addDoc = () => {
        // alert('In add image')
        // event.preventDefault()
        ipfs.add(this.state.buffer2, (error, result) => {
            console.log('Ipfs result', result)
            if (error) {
                // alert(error)
                return
            }
            // alert(result[0].hash)
            this.setState({ land_document: result[0].hash });
            console.log('land_document:', result);
        })
    }
    
    captureDoc = (event) => {
        event.preventDefault()
        console.log("capturing the doc")
        const file2 = event.target.files[0]
        const reader2 = new window.FileReader()
        reader2.readAsArrayBuffer(file2)
        reader2.onloadend = () => {
            this.setState({ buffer2: Buffer(reader2.result) })
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


        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };

    RegisterFarmer = async () => {
        this.addDoc();
        // alert('After add image')
        await new Promise(resolve => setTimeout(resolve, 10000));
        if (this.state.name == '' || this.state.age == '' || this.state.aadharNumber == '' || this.state.panNumber == '') {
            alert("All the fields are compulsory!");
        } else if (!Number(this.state.aadharNumber) || this.state.aadharNumber.length != 12) {
            alert("Aadhar Number should be 12 digits long!");
        } else if (this.state.panNumber.length != 10) {
            alert("Pan Number should be a 10 digit unique number!");
        } else if (!Number(this.state.age) || this.state.age < 21) {
            alert("Your age must be a number");
        } else {
            await this.state.FarmInstance.methods.addFarmer(
                this.state.name,
                this.state.age,
                this.state.city,
                this.state.aadharNumber,
                this.state.panNumber,
                this.state.land_document)
                .send({
                    from: this.state.account,
                    gas: 2100000
                }).then(response => {
                    this.props.history.push("/admin/Dashboard");
                });

            //Reload
            window.location.reload(false);
        }
    }

    updateName = event => (
        this.setState({ name: event.target.value })
    )
    updateAge = event => (
        this.setState({ age: event.target.value })
    )
    updateCity = event => (
        this.setState({ city: event.target.value })
    )
    updateAadhar = event => (
        this.setState({ aadharNumber: event.target.value })
    )
    updatePan = event => (
        this.setState({ panNumber: event.target.value })
    )

    

    render() {
        if (!this.state.web3) {
            return (
                <div>
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
                        <div className="site-title wood-text">AGRICON </div>
                    </div>
                </div>
                <div className="auth-wrapper">
                    <div className="auth-inner">
                        <div className="App">

                            <div>
                                <div>
                                    <h1 style={{ color: "black" }}>
                                        Farmer Registration
                                    </h1>
                                </div>
                            </div>



                            <div className="form">
                                <FormGroup>
                                    <div className="form-label">
                                        Enter Name --
                                    </div>
                                    <div className="form-input">
                                        <FormControl
                                            input='text'
                                            value={this.state.name}
                                            onChange={this.updateName}
                                        />
                                    </div>
                                </FormGroup>

                                <FormGroup>
                                    <div className="form-label">
                                        Enter Age --
                                    </div>
                                    <div className="form-input">
                                        <FormControl
                                            input='text'
                                            value={this.state.age}
                                            onChange={this.updateAge}
                                        />
                                    </div>
                                </FormGroup>

                                <div className="form">
                                    <FormGroup>
                                        <div className="form-label">
                                            Enter city --
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
                                            Enter Aadhar No --
                                        </div>
                                        <div className="form-input">
                                            <FormControl
                                                input='text'
                                                value={this.state.aadharNumber}
                                                onChange={this.updateAadhar}
                                            />
                                        </div>
                                    </FormGroup>

                                    <FormGroup>
                                        <div className="form-label">
                                            Enter Pan no --
                                        </div>
                                        <div className="form-input">
                                            <FormControl
                                                input='text'
                                                value={this.state.panNumber}
                                                onChange={this.updatePan}
                                            />
                                        </div>
                                    </FormGroup>


                                    <FormGroup>
                                        <label>Add your Land Document (PDF Format)</label>
                                        <FormFile
                                            id="File2"
                                            onChange={this.captureDoc}
                                        />
                                    </FormGroup>


                                    <Button onClick={this.RegisterFarmer} className="button-vote">
                                        Register as Farmer
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default RegisterFarmer;