import React, {useEffect, useState} from 'react';

const Footer = () => {
    const [isActiveProfile, setIsActiveProfile] = useState(false);
    const [isActiveUsers, setIsActiveUsers] = useState(false);
    const [isActiveEvent, setIsActiveEvent] = useState(false);
    const [isActiveAssociations, setIsActiveAssociations] = useState(false);
    const [isActiveAssUsers, setIsActiveAssUsers] = useState(false);
    const [isActiveEvents, setIsActiveEvents] = useState(false);
    const [isActiveReview, setIsActiveReview] = useState(false);
    const [isActiveAboutService, setIsActiveAboutService] = useState(false);

    useEffect(() => {
        const isProfilePath = window.location.pathname.startsWith('/profile');
        setIsActiveProfile(isProfilePath);
    }, []);
    useEffect(() => {
        const isProfilePath = window.location.pathname.startsWith('/users');
        setIsActiveUsers(isProfilePath);
    }, []);

    useEffect(() => {
        const isProfilePath = window.location.pathname.startsWith('/event');
        setIsActiveEvent(isProfilePath);
    }, []);
    useEffect(() => {
        const isProfilePath = window.location.pathname.startsWith('/all-events');
        setIsActiveEvents(isProfilePath);
    }, []);
    useEffect(() => {
        const isProfilePath = window.location.pathname.startsWith('/associations');
        setIsActiveAssociations(isProfilePath);
    }, []);
    useEffect(() => {
        const isProfilePath = window.location.pathname.startsWith('/association');
        setIsActiveAssUsers(isProfilePath);
    }, []);
    useEffect(() => {
        const isProfilePath = window.location.pathname.startsWith('/review');
        setIsActiveReview(isProfilePath);
    }, []);
    useEffect(() => {
        const isProfilePath = window.location.pathname.startsWith('/about-service');
        setIsActiveAboutService(isProfilePath);
    }, []);

    return (
        <div>
            <div className={isActiveProfile ? 'footerProfile' : isActiveUsers ? 'footerUsers' : isActiveEvent ? 'footerEvent' : isActiveAssociations ? 'footerAssociations' : isActiveAssUsers ? 'footerAssUsers' : isActiveEvents ? 'footerEvents' : isActiveReview ? 'footerReview' : 'footer'}>
                <div className={'footerLogoSquare'}>
                    <div className={'footerLogoSquareText'}>V&amp;<span style={{ color: '#FFDAB9' }}>H</span></div>

                </div>
                <div className={'footerLogoText'}>VolunteerHub</div>
                <div className={'footerInfo'}>2024 © Всі права захищені</div>
                <div className={'footerMail'}>volunteerhub@gmail.com</div>
            </div>

        </div>
    );
};

export default Footer;