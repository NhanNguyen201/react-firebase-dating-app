import React, {useState} from 'react';
import MyBtn from '../../Util/MyBtn';
import Dialog from '@material-ui/core/Dialog';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import InfoContent from '../InfoContent/InfoContent';
import PropTypes from 'prop-types';

const InfoCard = ({userName}) => {
    const [openDialog, setOpenDialog]= useState(false);
    const handleOpenCard = () => {
        setOpenDialog(true);
    };
    
    const handleCloseCard = () => {
        setOpenDialog(false);
    };
    return (
        <>
            <MyBtn tip="More information" onClick={handleOpenCard}>
                <UnfoldMoreIcon/>
            </MyBtn>
            <Dialog
                open={openDialog}
                onClose={handleCloseCard}
            >
                <InfoContent userName={userName} />            
            </Dialog>
        </>
    )
}
InfoCard.propTypes = {
    userName: PropTypes.string.isRequired
}
export default InfoCard;