import React from 'react';
import "../styles/header.css";
import Modal from 'react-modal';
import GoogleLogin from 'react-google-login';
import { Close } from '@material-ui/icons';
import axios from 'axios';


const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        border: '1px solid brown'
    },
};



class header extends React.Component {
    constructor() {
        super();
        this.state = {
            loginModalIsOpen: false,
            registerModalIsOpen: false,
            userFirst: undefined,
            userNumber: undefined,
            userEmail: undefined,
            userPassword: undefined,
            userLoginEmail: undefined,
            userLoginPassword: undefined,
            clientName: undefined,
            isLogin: false,
            user: {},
            userLogin: {}
        }
    }


    handleModal = (state, value) => {
        this.setState({ [state]: value })
    }

    responseGoogle = (response) => {
        this.setState({ isLogin: true, user: response, clientName: response.profileObj.name, loginModalIsOpen: false })
    }

    handleFormData = (event, state) => {
        this.setState({ [state]: event.target.value });
    }

    handleLogout = () => {
        this.setState({ isLogin: false, user: {} })
    }

    handleRegister = () => {
        const { userFirst, userNumber, userEmail, userPassword } = this.state;
        const userData = {
            email: userEmail,
            password: userPassword,
            name: userFirst,
            number: userNumber
        }
        axios({
            url: 'https://cryptic-lowlands-56929.herokuapp.com/api/register',
            method: 'POST',
            headers: { 'content-Type': "application/json" },
            data: userData
        })
            .then(res => {
                this.setState({ user: res.data.user, clientName: res.data.user.name, isLogin: true, registerModalIsOpen: false })
                console.log(res.data.user)
                window.alert("Your Account Successfully Created")
            })
            .catch(err => {
                console.log(err)
                window.alert("This email is already used please try to login or change email")
            })
    }

    handleLogin = () => {
        const { userLoginEmail, userLoginPassword } = this.state;
        const loginData = {
            email: userLoginEmail,
            password: userLoginPassword
        }
        axios({
            url: 'https://cryptic-lowlands-56929.herokuapp.com/api/login',
            method: 'POST',
            headers: { 'content-Type': "application/json" },
            data: loginData
        })
            .then(res => {
                this.setState({ isLogin: res.data.isAuthenticated, clientName: res.data.user.name, user: res.data.user, loginModalIsOpen: false })
                window.alert("Login Successfully Completed")
            })
            .catch(err => {
                console.log(err)
            })

    }

    render() {
        const { loginModalIsOpen, registerModalIsOpen, isLogin, user, userLogin, clientName } = this.state;
        return (
            <div>
                <div className="mainHeader">
                    <div className="logoedit"><b>e!</b></div>
                    {isLogin ?
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <div className="header-login">{`Hi ${clientName}`}</div>
                            <div className="header-create" onClick={this.handleLogout}>Logout</div>
                        </div>
                        :
                        <div>
                            <button className="header-login" onClick={() => this.handleModal('loginModalIsOpen', true)}>Login</button>
                            <button className="header-create" onClick={() => this.handleModal('registerModalIsOpen', true)}>Create an account</button>
                        </div>
                    }

                </div>
                <Modal
                    isOpen={loginModalIsOpen}
                    style={customStyles}
                >
                    <Close style={{ float: "right", cursor: "pointer" }} onClick={() => this.handleModal('loginModalIsOpen', false)} />
                    <div style={{ padding: "20px" }}>
                        <div>
                            <div className="rlheading">Login with email</div>
                            <div>
                                <input style={{ margin: "10px 0px" }} className="form-control" type="email"
                                    placeholder="Enter your email" onChange={(e) => this.setState({ userLoginEmail: e.target.value })} />
                                <input style={{ margin: "10px 0px" }} className="form-control" type="password"
                                    placeholder="Enter your password" onChange={(e) => this.setState({ userLoginPassword: e.target.value })} />
                                <button class="widthMan btn btn-success"
                                    style={{ margin: '10px 0px' }}
                                    onClick={this.handleLogin}>Login</button>
                            </div>
                        </div>
                        <div style={{ textAlign: "center", margin: "10px", color: "gray", fontWeight: "bold" }}>OR</div>
                        <div className='width-adjustment'>
                            <GoogleLogin
                                clientId="20594545814-6l1qccmuigvkp1ct8s0t5d58if3s9ju7.apps.googleusercontent.com"
                                buttonText=" continue with google"
                                onSuccess={this.responseGoogle}
                                onFailure={this.responseGoogle}
                                cookiePolicy={'single_host_origin'}
                            />
                        </div>
                    </div>
                </Modal>

                <Modal
                    isOpen={registerModalIsOpen}
                    style={customStyles}
                >
                    <Close style={{ float: "right", cursor: "pointer" }} onClick={() => this.handleModal('registerModalIsOpen', false)} />
                    <div style={{ padding: "20px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                            <div className="rlheading">Create Your Account</div>
                        </div>
                        <div>
                            <label style={{ fontSize: "15px", fontWeight: "500" }}>Name : </label>
                            <input className="form-control" style={{ width: "300px" }}
                                type="text" placeholder="Enter your name" onChange={(event) => this.handleFormData(event, "userFirst")} />
                        </div>
                        <div>
                            <label style={{ fontSize: "15px", fontWeight: "500" }}>Contact Number : </label>
                            <input className="form-control" type="tel"
                                placeholder="Enter your number" onChange={(event) => this.handleFormData(event, "userNumber")} />
                        </div>
                        <div>
                            <label style={{ fontSize: "15px", fontWeight: "500" }}>Email : </label>
                            <input className="form-control" type="email"
                                placeholder="Enter your email address" onChange={(event) => this.handleFormData(event, "userEmail")} />
                        </div>
                        <div>
                            <label style={{ fontSize: "15px", fontWeight: "500" }}>Password : </label>
                            <input className="form-control" type="password"
                                placeholder="Enter your password" onChange={(event) => this.handleFormData(event, "userPassword")} />
                        </div>
                        <div className='width-adjustment'>
                            <button class="btn btn-success"
                                style={{ float: 'right', marginTop: '20px' }} onClick={this.handleRegister}>Register</button>
                        </div >

                    </div>

                </Modal>


            </div>
        )
    }
}

export default header
