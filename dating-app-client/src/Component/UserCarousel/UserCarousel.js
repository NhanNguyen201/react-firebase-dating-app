
import React from 'react';
import Swiper from 'react-id-swiper';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './UserCarousel.css';
const UserCarousel = ({userData : {imageUrl, imageCollection}}) => {
    const params = {
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            // dynamicBullets: true
          }
    }
    const carousel = imageCollection && imageCollection.length > 0 ? (
        <Swiper {...params} className="slide-container">
            <img src={imageUrl} alt="collection" className="swiper-slide"/>
            { imageCollection.map((item, index) => <img src={item} alt="collection" className="swiper-slide" key={index}/>)}
        </Swiper>

    ) : (
        <img src={imageUrl} alt="collection" className="swiper-slide"/>
    )
    return carousel 
};
const mapStateToProps = state => ({
    userData: state.data.peopleItem
})
UserCarousel.propTypes = {
    imageUrl: PropTypes.string,
    imageCollection: PropTypes.array
}
export default connect(mapStateToProps, null)(UserCarousel);
    