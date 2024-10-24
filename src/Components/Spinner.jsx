

import React from "react";
import {Circles} from 'react-loader-spinner';
import '../css/spinner.css'

function Spinner( {message}){

    return(
        <div className="loaderContainer">

        <Circles 
        
        color="#00BFFF"
        height={80}
        width={200}
        className="loader"/>

        <p className="spinnerText"> {message}</p>
        </div>
    )
}

export default Spinner;
