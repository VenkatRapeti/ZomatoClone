import React from 'react';
import { withRouter } from 'react-router-dom';


class QuickSearchItem extends React.Component {
    handleNavigate = (mealtypeId) => {
        const locationId = sessionStorage.getItem('locationId');
        if (locationId) {
            this.props.history.push(`/filter?mealtype=${mealtypeId}&location=${locationId}`);
        } else {
            this.props.history.push(`/filter?mealtype=${mealtypeId}`);
        }

    }
    render() {
        const { quickSearchItemData } = this.props;
        return (
            <div className="col-lg-4 col-md-6 col-sm-12" onClick={() => this.handleNavigate(quickSearchItemData.meal_type)}>
                <div className="block">
                    <div className="image1">
                        <img className="length" src={`./${quickSearchItemData.image}`} />
                    </div>
                    <div className="matter">
                        <div className="blockheading">{quickSearchItemData.name}</div>
                        <div className="blocksubheading">{quickSearchItemData.content}</div>
                    </div>
                </div>
            </div>
        )
    }
}


export default withRouter(QuickSearchItem);