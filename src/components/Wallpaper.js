import React from 'react';
import '../styles/Home.css';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

class Wallpaper extends React.Component {
    constructor() {
        super();
        this.state = {
            RestaurantsByLocId: [],
            suggestions: [],
            inputText: undefined
        }
    }

    handleLocations = (event) => {
        const locationId = event.target.value;
        sessionStorage.setItem('locationId', locationId);

        axios({
            url: `https://cryptic-lowlands-56929.herokuapp.com/api/restaurants/${locationId}`,
            method: 'GET',
            headers: { 'content-Type': "application/json" }
        })
            .then(
                res => {
                    this.setState({ RestaurantsByLocId: res.data.restaurants })
                }
            )
            .catch(err => console.log(err))

    }

    handleRestDetails = (RestObj) => {
        this.props.history.push(`/details?Restaurant=${RestObj._id}`)
    }

    handleInputChange = (event) => {
        const { RestaurantsByLocId } = this.state;
        let inputText = event.target.value;
        let suggestions = [];
        suggestions = RestaurantsByLocId.filter(item =>
            item.name.toLowerCase().includes(inputText.toLowerCase()));
        this.setState({ suggestions, inputText })
    }

    handleSuggestions = () => {
        const { suggestions, inputText, RestaurantsByLocId } = this.state;
        if (suggestions.length === 0 && inputText === undefined) {
            return null;
        }
        if (suggestions.length > 0 && inputText === '') {
            return null;
        }
        if (RestaurantsByLocId.length > 0 && suggestions.length === 0 && inputText) {
            return <ul  style={{margin : "5px 0px"}}>
                <li className="listMani">No Search Results Found</li>
            </ul>
        }
        if (RestaurantsByLocId.length === 0 && inputText) {
            return <ul style={{margin : "5px 0px"}}>
               <li className="listMani">Please Select Your Location</li>
            </ul>
        }
        return (
            <ul>
                {
                    suggestions.map((item, index) =>
                        (<li className="listMani" key={index} onClick={() => this.handleRestDetails(item)}>{`${item.name}  -  ${item.locality},${item.city}`}</li>))
                }
            </ul>
        )
    }

    render() {
        const { locations } = this.props.Data;
        return (
            <div>
                <img src="Assets/homepageimg.png" alt='homeimage' id="homeimg" height="400px" width="100%" />

                <div className="position">
                    <div className="logo"><b>e!</b></div>
                    <div className="heading">Find the best Restaurants, cafes, bars</div>
                    <div className="wholediv">
                        <select name="city" className="city" onChange={this.handleLocations}>
                            <option>Select</option>
                            {locations.map((item) => {
                                return <option value={item.location_id}>{`${item.name}, ${item.city}`}</option>
                            })}
                        </select>

                        <div id="query">
                            <div className="changeFlex">
                                <span className="fas fa-search searchIcon"></span>
                                <input type="text" className="search" placeholder="Search for restaurants"
                                    onChange={this.handleInputChange} />
                            </div>
                            {this.handleSuggestions()}
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}


export default withRouter(Wallpaper);