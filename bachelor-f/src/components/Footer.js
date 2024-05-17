import React, {useEffect, useState} from 'react';

const Footer = () => {
    const [isActiveProfile, setIsActiveProfile] = useState(false);
    const [isActiveUsers, setIsActiveUsers] = useState(false);
    const [isActiveEvent, setIsActiveEvent] = useState(false);

    useEffect(() => {
        const isProfilePath = window.location.pathname.startsWith('/profile');
        setIsActiveProfile(isProfilePath);
    }, []);
    useEffect(() => {
        const isProfilePath = window.location.pathname.startsWith('/users');
        setIsActiveUsers(isProfilePath);
    }, []);

    useEffect(() => {
        const isProfilePath = window.location.pathname.startsWith('/event/');
        setIsActiveEvent(isProfilePath);
    }, []);

    return (
        <div>
            <div className={isActiveProfile ? 'footerProfile' : isActiveUsers ? 'footerUsers' : isActiveEvent ? 'footerEvent' : 'footer'}>
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