import React from 'react';
import '../styles/Filter.css';
import queryString from 'query-string';
import axios from 'axios';


class Filter extends React.Component {
    constructor() {
        super();
        this.state = {
            restaurants: [],
            locationsData: [],
            mealtype: undefined,
            location: undefined,
            cuisine: undefined,
            lcost: undefined,
            hcost: undefined,
            page: 1,
            sort: 1,
            cuisine_array: [],
            lastPage: "",
            pageNumbers: []
        }
    }
    componentDidMount() {
        const qs = queryString.parse(this.props.location.search);
        const { mealtype, location } = qs;
        const filterObj = {
            mealtype: parseInt(mealtype),
            location: parseInt(location)
        };


        axios({
            url: 'https://cryptic-lowlands-56929.herokuapp.com/api/filter',
            method: 'POST',
            headers: { 'content-Type': "application/json" },
            data: filterObj
        })
            .then(
                res => {
                    this.setState({
                        restaurants: res.data.restaurants, mealtype: parseInt(mealtype),
                        location: parseInt(location),
                        lastPage: Math.ceil(res.data.forPagination.length / 2)
                    })
                }
            )
            .catch(err => console.log(err))


        axios({
            url: 'https://cryptic-lowlands-56929.herokuapp.com/api/locations',
            method: 'GET',
            headers: { 'content-Type': "application/json" }
        }).then(res => {
            this.setState({
                locationsData: res.data.locations
            })
        })
            .catch(err => console.log(err))
    }

    handleSortChange = (sort) => {
        const { mealtype, location, lcost, hcost, cuisine, page } = this.state;
        const filterObj = {
            mealtype,
            location,
            lcost,
            hcost,
            cuisine,
            page,
            sort
        };

        axios({
            url: 'https://cryptic-lowlands-56929.herokuapp.com/api/filter',
            method: 'POST',
            headers: { 'content-Type': "application/json" },
            data: filterObj
        })
            .then(
                res => {
                    this.setState({
                        restaurants: res.data.restaurants, sort,
                        lastPage: Math.ceil(res.data.forPagination.length / 2)
                    })
                }
            )
            .catch(err => console.log(err))
    }

    handleCostChange = (lcost, hcost) => {
        const { mealtype, location, sort, cuisine, page } = this.state;
        const filterObj = {
            mealtype,
            location,
            lcost: lcost && lcost,
            hcost: hcost && hcost,
            cuisine,
            page,
            sort
        };

        axios({
            url: 'https://cryptic-lowlands-56929.herokuapp.com/api/filter',
            method: 'POST',
            headers: { 'content-Type': "application/json" },
            data: filterObj
        })
            .then(
                res => {
                    this.setState({
                        restaurants: res.data.restaurants, lcost, hcost,
                        lastPage: Math.ceil(res.data.forPagination.length / 2)
                    })
                }
            )
            .catch(err => console.log(err))
    }

    handleChangeLocId = (event) => {
        const LocId = event.target.value;
        const { mealtype, lcost, hcost, sort, cuisine, page } = this.state;
        const filterObj = {
            mealtype,
            location: LocId,
            lcost,
            hcost,
            cuisine,
            page,
            sort
        };

        axios({
            url: 'https://cryptic-lowlands-56929.herokuapp.com/api/filter',
            method: 'POST',
            headers: { 'content-Type': "application/json" },
            data: filterObj
        })
            .then(
                res => {
                    this.setState({
                        restaurants: res.data.restaurants, location: LocId,
                        lastPage: Math.ceil(res.data.forPagination.length / 2)
                    })
                }
            )
            .catch(err => console.log(err))
    }


    pageHandler = (page) => {
        const { mealtype, lcost, hcost, sort, cuisine, location } = this.state;
        const filterObj = {
            mealtype,
            location,
            lcost,
            hcost,
            cuisine,
            page,
            sort
        };

        axios({
            url: 'https://cryptic-lowlands-56929.herokuapp.com/api/filter',
            method: 'POST',
            headers: { 'content-Type': "application/json" },
            data: filterObj
        })
            .then(
                res => {
                    this.setState({ restaurants: res.data.restaurants, page })
                }
            )
            .catch(err => console.log(err))
    }

    handleArrow = (operatorType) => {
        const { page } = this.state;
        let pageMan = undefined;
        if (operatorType === 'add') {
            pageMan = page + 1;
        } else {
            pageMan = page - 1;
        }
        const { mealtype, lcost, hcost, sort, cuisine, location } = this.state;
        const filterObj = {
            mealtype,
            location,
            lcost,
            hcost,
            cuisine,
            page: pageMan,
            sort
        };

        axios({
            url: 'https://cryptic-lowlands-56929.herokuapp.com/api/filter',
            method: 'POST',
            headers: { 'content-Type': "application/json" },
            data: filterObj
        })
            .then(
                res => {
                    this.setState({ restaurants: res.data.restaurants, page: pageMan })
                }
            )
            .catch(err => console.log(err))

    }

    handleCuisine = (cuisine_id) => {
        const { mealtype, lcost, hcost, cuisine_array, sort, location, page } = this.state;


        if (cuisine_array.indexOf(cuisine_id) === -1) {
            cuisine_array.push(cuisine_id)
        } else {
            var index = cuisine_array.indexOf(cuisine_id);
            cuisine_array.splice(index, 1)
        }

        const filterObj = {
            mealtype,
            location,
            lcost,
            hcost,
            cuisine: cuisine_array.length > 0 ? cuisine_array : undefined,
            page,
            sort
        };

        axios({
            url: 'https://cryptic-lowlands-56929.herokuapp.com/api/filter',
            method: 'POST',
            headers: { 'content-Type': "application/json" },
            data: filterObj
        })
            .then(
                res => {
                    this.setState({
                        restaurants: res.data.restaurants, cuisine: cuisine_array,
                        lastPage: Math.ceil(res.data.forPagination.length / 2)
                    })
                }
            )
            .catch(err => console.log(err))
    }

    handleRestDetails = (RestId) => {
        this.props.history.push(`/details?Restaurant=${RestId}`)
    }



    render() {
        const { restaurants, page, locationsData, lastPage, pageNumbers } = this.state;
        for (let i = 1; i <= lastPage; i++) {
            if (pageNumbers.indexOf(i) === -1 && pageNumbers[i] !== '' && pageNumbers.length !== lastPage) {
                pageNumbers.push(i);
            }
            else if (pageNumbers.length > lastPage) {
                pageNumbers.splice(lastPage, pageNumbers.length - this.state.lastPage)
            }
        }

        return (
            <div>

                <div className="container">
                    <div className="filterHeading">Breakfast Places in Mumbai</div>
                    <div className="row">
                        <div className="col-lg-3 col-md-4 col-sm-12">
                            <div className="inner">
                                <div>
                                    <span className="sub1">Filters</span>
                                    <span className="fa fa-chevron-down angle" data-bs-toggle="collapse"
                                        data-bs-target="#filter"></span>
                                </div>
                                <div className="show" id="filter">
                                    <div className="sub2">Select Location</div>
                                    <select name="location" id="location" onChange={this.handleChangeLocId}>
                                        <option className="inlane">Select Location</option>
                                        {locationsData && locationsData.map((item) => {
                                            return <option className="inlane" value={item.location_id}>{`${item.name}, ${item.city}`}</option>
                                        })}
                                    </select>

                                    <div className="sub2">Cuisine</div>

                                    <input type="checkbox" className="check" onChange={() => this.handleCuisine(1)} />
                                    <label className="chec">North Indian</label>


                                    <div>
                                        <input type="checkbox" className="check" onChange={() => this.handleCuisine(2)} />
                                        <label className="chec">South Indian</label>
                                    </div>

                                    <div>
                                        <input type="checkbox" className="check" onChange={() => this.handleCuisine(3)} />
                                        <label className="chec">Chinese</label>
                                    </div>
                                    <div>
                                        <input type="checkbox" className="check" onChange={() => this.handleCuisine(4)} />
                                        <label className="chec">Fast food</label>
                                    </div>
                                    <div style={{ marginBottom: "12px" }}>
                                        <input type="checkbox" className="check" onChange={() => this.handleCuisine(5)} />
                                        <label className="chec">Street Food</label>
                                    </div>
                                    <div className="sub2">Cost For Two</div>
                                    <div>
                                        <input type="radio" name="custom" className="check" onChange={() => this.handleCostChange(1, 500)} />
                                        <label className="chec">Less than &#8377;500</label>
                                    </div>
                                    <div>
                                        <input type="radio" name="custom" className="check" onChange={() => this.handleCostChange(500, 1000)} />
                                        <label className="chec">&#8377;500 to &#8377;1000</label>
                                    </div>
                                    <div>
                                        <input type="radio" name="custom" className="check" onChange={() => this.handleCostChange(1000, 1500)} />
                                        <label className="chec">&#8377;1000 to &#8377;1500</label>
                                    </div>
                                    <div>
                                        <input type="radio" name="custom" className="check" onChange={() => this.handleCostChange(1500, 2000)} />
                                        <label className="chec">&#8377;1500 to &#8377;2000</label>
                                    </div>
                                    <div style={{ marginBottom: "12px" }}>
                                        <input type="radio" name="custom" className="check" onChange={() => this.handleCostChange(2000, 100000)} />
                                        <label className="chec">2000+</label>
                                    </div>
                                    <div className="sub2">Sort</div>
                                    <div>
                                        <input type="radio" name="cust" className="check" onChange={() => this.handleSortChange(1)} />
                                        <label className="chec">Price low to high</label>
                                    </div>
                                    <div style={{ paddingBottom: "20px" }}>
                                        <input type="radio" name="cust" className="check" onChange={() => this.handleSortChange(-1)} />
                                        <label className="chec">Price high to low</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-9 col-md-8 col-sm-12 products">
                            {restaurants.length > 0 ? restaurants.map((item) => {
                                return <div className="block-1" onClick={() => this.handleRestDetails(item._id)}>
                                <div style={{display :"flex",justifyContent:"space-between"}}>
                                    <div className="img2">
                                        <img className="img1" src={`./${item.image}`} />
                                    </div>
                                    <div className="mainhead">
                                        <div className="bighead">{item.name}</div>
                                        <div className="fort">{item.locality}</div>
                                        <div className="addre">{item.city}</div>
                                    </div>
                                    </div>
                                    <hr />
                                    <div className="cuisines">
                                        <div>CUISINES</div>
                                        <div>COST FOR TWO</div>
                                    </div>
                                    <div className="bakery">

                                        {item.cuisine.map((Cuitem) => {
                                            return <span>{`${Cuitem.name}, `}</span>
                                        })}
                                        <div>{item.min_price}</div>
                                    </div>
                                </div>
                            }) : <div id="nodata">No Results Found</div>}



                            {lastPage > 1 ?

                                <div className="leftadj">
                                    <div className={`last ${page === 1 ? 'disable' : ""}`} onClick={() => this.handleArrow('subtract')}>&#60;</div>

                                    {pageNumbers.map((item) => <div className={`last ${page === item ? 'activeNm' : null}`} onClick={() => this.pageHandler(item)}>{item}</div>)}


                                    <div className={`last ${page === lastPage ? 'disable' : ""}`} onClick={() => this.handleArrow('add')}>&#62;</div>
                                </div>

                                : null}


                        </div>

                    </div>
                </div>
            </div>
        )
    }

}





export default Filter;
