import React, {useEffect, useState} from 'react';

const Footer = () => {
    const [isActiveProfile, setIsActiveProfile] = useState(false);

    useEffect(() => {
        const isProfilePath = window.location.pathname.startsWith('/profile');
        setIsActiveProfile(isProfilePath);
    }, []);

    return (
        <div>
            <div className={isActiveProfile ? 'footerProfile' : 'footer'}></div>
            <div className={isActiveProfile ? 'footerLogoSquareProfile' : 'footerLogoSquare'}></div>
            <div className={isActiveProfile ? 'footerLogoSquareTextProfile' : 'footerLogoSquareText'}>V&amp;<span style={{ color: '#FFDAB9' }}>H</span></div>
            <div className={isActiveProfile ? 'footerLogoTextProfile' : 'footerLogoText'}>VolunteerHub</div>
            <div className={isActiveProfile ? 'footerInfoProfile' : 'footerInfo'}>2024 © Всі права захищені</div>
            <div className={isActiveProfile ? 'footerMailProfile' : 'footerMail'}>volunteerhub@gmail.com</div>
        </div>
    );
};

export default Footer;