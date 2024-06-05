import React from 'react';
//import { useState } from 'react';

const Offer = () => {

    const handleRedirectEvents = () => {
        window.location.href = `http://localhost:3000/all-events`;
    };

    return (
        <div>
            <div className="offer">Твій новий шлях до зміни світу!</div>
            <div className="descriptor">Онлайн платформа для волонтерів</div>
            <button className="button" onClick={handleRedirectEvents}><span className="textOnButton">Перейти до заходів</span></button>
            <img className="offerPic" src="/images/Volunteer-Pic.png" alt="" />
        </div>
    );
};


export default Offer;