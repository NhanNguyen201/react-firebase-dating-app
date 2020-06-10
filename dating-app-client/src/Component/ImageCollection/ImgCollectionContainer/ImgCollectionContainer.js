import React from 'react';
import PropTypes from 'prop-types'
import ImgCollectionItem from '../ImgCollectionItem/ImgCollectionItem';
import Typography from '@material-ui/core/Typography';
import './ImgCollectionContainer.css'
const ImgCollectionContainer = ({ collection }) => {
    var container;
    if (collection && collection.length > 0) {
            container = collection.map((item, index) => <ImgCollectionItem src={item} key={index}/>)
        } else {
            container = <Typography variant="body1">You have no image in your collection</Typography>
        }
    
    return (
        <div className="collection-image-container">
            { container }
        </div>
    )
}
ImgCollectionContainer.propTypes = {
    collection: PropTypes.array.isRequired,
}
export default ImgCollectionContainer;