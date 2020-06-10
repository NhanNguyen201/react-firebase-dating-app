import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import './LoadingUser.css';
const LoadingUser = () => {
    return(
        <div className="loading-card">    
            <CircularProgress size={50}/>
            <p>Loading...</p>
        </div>
    )
}

export default LoadingUser;