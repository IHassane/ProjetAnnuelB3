import React from 'react';
import '../style/PatientSpace.css'
import PatientInfo from "./PatientInfo";
import PatientHistory from "./PatientHistory";

const PatientSpace = (props) => {
    return (
        <div className="PatientSpace">
            <p>PatientSpace NIR : {props.nir}</p>
            <PatientInfo nir={props.nir} type="display"/>
            <br/>
            <PatientHistory nir={props.nir}/>
        </div>
    );
};

export default PatientSpace;