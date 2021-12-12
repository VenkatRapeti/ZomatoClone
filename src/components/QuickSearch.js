import React from 'react';
import '../styles/Home.css';
import QuickSearchItem from './QuickSearchItem';

class QuickSearch extends React.Component {
    render() {
        const { mealtypeData } = this.props;
        return (
            <div>
                <div className="container mb-4">
                    <div className="quick">Quick Searches</div>
                    <div className="mealtype">Discover Restaurants by meal type </div>

                    <hr id='adjustMargin' />

                    <div className="row gy-4">
                        {mealtypeData.map((item) => {
                            return <QuickSearchItem key={item.meal_type} quickSearchItemData={item}/>
                        })}
                    </div>
                </div >
            </div>
        )
    }
}

export default QuickSearch;