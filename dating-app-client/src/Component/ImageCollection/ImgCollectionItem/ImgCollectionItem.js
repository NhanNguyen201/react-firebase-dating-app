import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import './ImgCollectionItem.css';
import MyBtn from '../../../Util/MyBtn';
import { connect } from 'react-redux';
import { deleteImageInCollection } from '../../../Redux/actions/userActions';
class ImgCollectionItem extends Component {
    handleDelete = () => {
        const imgSrcToDelete = this.props.src;
        this.props.deleteImageInCollection(imgSrcToDelete)
        // console.log(imgSrcToDelete);
    }
    render(){
        return (
            <div className="img-item">
                <img src={this.props.src} alt="img-collection" className="collection-img"/>
                <MyBtn tip="Delete this image" onClick={this.handleDelete} btnClassName="delete-icon">
                    <DeleteOutlineIcon/>
                </MyBtn>
            </div>
        )

    }
}

ImgCollectionItem.propTypes = {
    deleteImageInCollection: PropTypes.func.isRequired,
    src: PropTypes.string.isRequired
}

export default connect(null, {deleteImageInCollection})(ImgCollectionItem);