import React from 'react';
import LoveIcon from '../../Img/love-icon.png'
import './Unauthorize.css';
const Unauthorize = () => {
    return(
        <div className="scene-container">
            <h3 className="page-name">Wellcome to DateLand ! <span role="img" aria-label="hidden">❣️</span></h3>
            <img src={LoveIcon} alt="App-icon" className="app-love-icon"/>
        </div>
    )
}

export default Unauthorize;