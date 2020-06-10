import React from 'react';
import MyBtn from '../../Util/MyBtn';
import Skeleton from '@material-ui/lab/Skeleton';
import './UserSkeleton.css'
const UserSketleton = () => {
    return(
        <div className="skeleton-card-container">
            <div className="skeleton-card-top">
                <Skeleton variant="rect" className="skeleton-avatar-img" height={540} width={400}/>
            </div>
            <div className="skeleton-card-bottom">
                <div className="skeleton-icon-container">
                    <MyBtn tip="like" btnClassName="icon">
                        <Skeleton variant="circle" width={40} height={40} />
                    </MyBtn>
                    <MyBtn tip="Information" btnClassName="icon">
                        <Skeleton variant="circle" width={40} height={40} />
                    </MyBtn>
                    <MyBtn tip="Skip over" btnClassName="icon">
                        <Skeleton variant="circle" width={40} height={40} />
                    </MyBtn>
                </div>
            </div>
        </div>
    )
}

export default UserSketleton;