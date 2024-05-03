import React from 'react';
//import { useState } from 'react';

const Offer = () => {

    /*const [counter, setCount] = useState(0);
    const alert = () => {
        setCount(counter+1)
    }*/
    return (
        <div>
            <div className="offer">Твій новий шлях до зміни світу!</div>
            <div className="descriptor">Онлайн платформа для волонтерів</div>
            <div className="button"></div>
            <div className="textOnButton">Перейти до заходів</div>
            <img className="offerPic" src="/images/Volunteer-Pic.png" alt="" />
        </div>
    );
};


export default Offer;