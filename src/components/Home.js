import React from 'react';
import '../styles/Home.css'
import Wallpaper from './Wallpaper'
import QuickSearch from './QuickSearch'
import axios from 'axios';


class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            locations: [],
            mealtypes: []

        }
    }



    componentDidMount() {
        axios({
            url: 'https://cryptic-lowlands-56929.herokuapp.com/api/locations',
            method: 'GET',
            headers: { 'content-Type': "application/json" }
        })
            .then(
                res => {
                    this.setState({ locations: res.data.locations })
                }
            )
            .catch(err => console.log(err))

        axios({
            url: 'https://cryptic-lowlands-56929.herokuapp.com/api/mealtypes',
            method: 'GET',
            headers: { 'content-Type': "application/json" }
        })
            .then(
                res => {
                    this.setState({ mealtypes: res.data.Mealtypes })
                }
            )
            .catch(err => console.log(err))
    }

    render() {
        sessionStorage.clear();
        const { locations, mealtypes } = this.state;
        return (
            <div>
                <Wallpaper Data={{
                    locations: locations
                }} />
                <QuickSearch mealtypeData={mealtypes} />
            </div>
        )
    }
};


export default Home;