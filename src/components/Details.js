import React from 'react';
import queryString from 'query-string';
import axios from 'axios';
import '../styles/Details.css';
import Modal from 'react-modal';
import { Add, Close, Remove } from '@material-ui/icons';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';



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



class Details extends React.Component {
    constructor() {
        super();
        this.state = {
            restaurant: {},
            tabIndex: 0,
            gallaryModal: false,
            PlaceOrderModal: false,
            restId: undefined,
            menuitems: [],
            subTotal: 0,
            formModalIsOpen: false,
            userFullName: undefined,
            userEmail: undefined,
            userAddress: undefined,
            userContact: undefined
        }
    }
    componentDidMount() {
        const qs = queryString.parse(this.props.location.search);
        const { Restaurant } = qs;
        axios({
            url: `https://cryptic-lowlands-56929.herokuapp.com/api/restaurant/${Restaurant}`,
            method: 'GET',
            headers: { 'content-Type': "application/json" }
        })
            .then(
                res => {
                    this.setState({ restaurant: res.data.restaurants, restId: Restaurant })
                }
            )
            .catch(err => console.log(err))
    }

    handleModal = (itemModal, value) => {
        const { restId } = this.state;
        if (itemModal == "PlaceOrderModal" && value == true) {
            axios({
                url: `https://cryptic-lowlands-56929.herokuapp.com/api/menuitems/${restId}`,
                method: 'GET',
                headers: { 'content-Type': "application/json" }
            })
                .then(
                    res => {
                        this.setState({ menuitems: res.data.restaurants, subTotal: 0 })
                    }
                )
                .catch(err => console.log(err))
        }
        this.setState({ [itemModal]: value })
    }


    handleAddItems = (index, operatorType) => {
        let total = 0;
        const { menuitems, subTotal } = this.state;
        var items = [...menuitems];
        var item = items[index];
        if (operatorType === 'add') {
            item.qty += 1;
        } else {
            item.qty -= 1;
        }
        items[index] = item;
        items.map((indItem) => {
            total += indItem.price * indItem.qty;
        })
        this.setState({ menuitems: items, subTotal: total })
    }

    handleFormChange = (event, state) => {
        this.setState({ [state]: event.target.value })
    }

    isDate(val) {
        // Cross realm comptatible
        return Object.prototype.toString.call(val) === '[object Date]'
    }

    isObj = (val) => {
        return typeof val === 'object'
    }


    stringifyValue = (val) => {
        if (this.isObj(val) && !this.isDate(val)) {
            return JSON.stringify(val)
        } else {
            return val
        }
    }

    buildForm = ({ action, params }) => {
        const form = document.createElement('form')
        form.setAttribute('method', 'post')
        form.setAttribute('action', action)

        Object.keys(params).forEach(key => {
            const input = document.createElement('input')
            input.setAttribute('type', 'hidden')
            input.setAttribute('name', key)
            input.setAttribute('value', this.stringifyValue(params[key]))
            form.appendChild(input)
        })
        return form
    }

    post = (details) => {
        const form = this.buildForm(details)
        document.body.appendChild(form)
        form.submit()
        form.remove()
    }

    getData = (data) => {
        return fetch(`https://cryptic-lowlands-56929.herokuapp.com/api/payment`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(response => response.json()).catch(err => console.log(err))
    }

    handlePayment = () => {
        const { userEmail, subTotal, userAddress, userContact } = this.state;
        if (!userEmail || !userAddress || !userContact) {
            alert('Please fill this field and then Proceed...');
        }
        else {
            const paymentObj = {
                amount: subTotal,
                email: userEmail
            };

            this.getData(paymentObj).then(response => {
                var information = {
                    action: "https://securegw-stage.paytm.in/order/process",
                    params: response
                }
                this.post(information)
            })
        }
    }


    render() {
        const { restaurant, tabIndex, gallaryModal, PlaceOrderModal, menuitems, subTotal, formModalIsOpen } = this.state;
        return (
            <div>
                <div id="top">
                    <img id="detail-img" src={restaurant.image} />
                    <div id="ButtonContainer">
                        <button id="btn-1" onClick={() => this.handleModal('gallaryModal', true)}>Click to see image gallery</button>
                    </div>
                </div>
                <div style={{ padding: "15px" }}>
                    <div id="heading">
                        <h1 style={{ color: "#2E4C6D" }}>{restaurant.name}</h1>
                        <button id="btn-2" onClick={() => this.handleModal('PlaceOrderModal', true)}>Place Online Order</button>
                    </div>
                    <div className="tabs">
                        <div className="tabList">
                            <div className={`tabHead ${tabIndex === 0 ? 'active' : null}`} style={{ cursor: "pointer" }} onClick={() => this.setState({ tabIndex: 0 })}>
                                Overview
                            </div>
                            <div className={`tabHead ${tabIndex === 1 ? 'active' : null}`} style={{ cursor: "pointer" }} onClick={() => this.setState({ tabIndex: 1 })}>
                                Contact
                            </div>
                        </div>

                        <div className="tab-content" hidden={tabIndex !== 0}>
                            <div style={{ marginTop: "20px" }}>
                                <div className="about">About this place</div>
                                <div className="head">Cuisine</div>
                                <div className="value">{restaurant && restaurant.cuisine && restaurant.cuisine.map(cuisine => `${cuisine.name}, `)}</div>
                                <div className="head">Average Cost</div>
                                <div className="value">&#8377; {restaurant.min_price} for two people(approx)</div>
                            </div>
                        </div>
                        <div className="tab-content" hidden={tabIndex !== 1}>
                            <div style={{ marginTop: "20px" }}>
                                <div className="head">Phone Number</div>
                                <div className="value">{restaurant.contact_number}</div>
                                <div className="head">{restaurant.name}</div>
                                <div className="value">{`${restaurant.locality}, ${restaurant.city}`}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal
                    isOpen={gallaryModal}
                    style={customStyles}
                >
                    <div>
                        <Close style={{ float: "right", marginBottom: "10px", cursor: "pointer" }}
                            onClick={() => this.handleModal('gallaryModal', false)} />

                        <Carousel showThumbs={false}>
                            {restaurant && restaurant.thumb && restaurant.thumb.map((item) => {
                                return <div>
                                    <img src={`../${item}`} height="500px" />
                                </div>
                            })}

                        </Carousel>

                    </div>
                </Modal>


                <Modal
                    isOpen={PlaceOrderModal}
                    style={customStyles}
                >
                    <div style={{height:"500px"}}>
                        <Close style={{ float: "right", cursor: "pointer" }} 
                        onClick={() => this.handleModal('PlaceOrderModal', false)} />
                        <h3>{restaurant.name}</h3>
                        <h3 className="item-total">SubTotal : {subTotal}</h3>
                        <button className="btn btn-danger order-button"
                            onClick={() => {
                                this.handleModal('PlaceOrderModal', false);
                                this.handleModal(subTotal > 0 && 'formModalIsOpen', true);
                            }}> Pay Now</button>
                        {menuitems && menuitems.map((item, index) => {
                            return <div className="menuStructure" style={{ borderBottom: '1px solid #dbd8d8' }}>
                                <div className="leftMenu">
                                    <h5>{item.name}</h5>
                                    <h5>&#8377;{item.price}</h5>
                                    <p>{item.description}</p>
                                </div>
                                <div className="rightMenu">
                                    <div className="image-menu">
                                        <img src={`./${item.image}`} style={{
                                            height: '100%',
                                            width: '100%',
                                            borderRadius: '10px',
                                            objectFit: "cover"
                                        }} />
                                    </div>
                                    {item.qty === 0 ? <button className="addBtn" onClick={() => this.handleAddItems(index, 'add')}>Add</button>
                                        : <div className='qtyMan'>
                                            <div style={{ color: 'white', fontWeight: "700" }} onClick={() => this.handleAddItems(index, 'subtrack')}>
                                                <Remove />
                                            </div>
                                            <div style={{ color: 'white', fontWeight: "700", margin: "0px 10px" }}>{item.qty}</div>
                                            <div style={{ color: 'white', fontWeight: "700" }} onClick={() => this.handleAddItems(index, 'add')}>
                                                <Add />
                                            </div>
                                        </div>}

                                </div>
                            </div>

                        })}


                    </div >
                </Modal >
                <Modal
                    isOpen={formModalIsOpen}
                    style={customStyles}
                >
                    <div>
                        <Close style={{ float: "right", cursor: "pointer" }} onClick={() => this.handleModal('formModalIsOpen', false)} />
                        <h2>{restaurant.name}</h2>
                        <div>
                            <label style={{ fontSize: "15px", fontWeight: "500" }}>Name : </label>
                            <input class="form-control" style={{ width: '350px' }}
                                type="text" placeholder="Enter your Name" onChange={(event) => this.handleFormChange(event, 'userFullName')} />
                        </div>
                        <div>
                            <label style={{ fontSize: "15px", fontWeight: "500" }}>Email : </label>
                            <input class="form-control" style={{ width: '350px' }}
                                type="text" placeholder="Enter your Email" onChange={(event) => this.handleFormChange(event, 'userEmail')} />
                        </div>
                        <div>
                            <label style={{ fontSize: "15px", fontWeight: "500" }}>Address: </label>
                            <input class="form-control" style={{ width: '350px' }}
                                type="text" placeholder="Enter your Address" onChange={(event) => this.handleFormChange(event, 'userAddress')} />
                        </div>
                        <div>
                            <label style={{ fontSize: "15px", fontWeight: "500" }}>Contact Number : </label>
                            <input class="form-control" style={{ width: '350px' }}
                                type="tel" placeholder="Enter your Contact Details" onChange={(event) => this.handleFormChange(event, 'userContact')} />
                        </div>
                        <button class="btn btn-success"
                            style={{ float: 'right', marginTop: '20px' }} onClick={this.handlePayment}>Proceed</button>
                    </div >
                </Modal >
            </div>
        )
    }
}


export default Details;