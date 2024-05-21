import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';

const Header = () => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isArrowRotated, setIsArrowRotated] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isActiveProfile, setIsActiveProfile] = useState(false);
    const [isActiveUsers, setIsActiveUsers] = useState(false);
    const [isActiveAssociations, setIsActiveAssociations] = useState(false);
    const [isActiveEvents, setIsActiveEvents] = useState(false);
    const [isActiveEventOne, setIsActiveEventOne] = useState(false);
    const [isActiveAssUsers, setIsActiveAssUsers] = useState(false);
    const [isActiveReview, setIsActiveReview] = useState(false);

    useEffect(() => {
        const isProfilePath = window.location.pathname.startsWith('/profile');
        setIsActiveProfile(isProfilePath);
    }, []);
    useEffect(() => {
        const isProfilePath = window.location.pathname.startsWith('/users');
        setIsActiveUsers(isProfilePath);
    }, []);
    useEffect(() => {
        const isProfilePath = window.location.pathname.startsWith('/associations');
        setIsActiveAssociations(isProfilePath);
    }, []);
    useEffect(() => {
        const isProfilePath = window.location.pathname.startsWith(`/event`);
        setIsActiveEventOne(isProfilePath);
    }, []);

    useEffect(() => {
        const isProfilePath = window.location.pathname.startsWith('/all-events');
        setIsActiveEvents(isProfilePath);
    }, []);

    useEffect(() => {
        const isProfilePath = window.location.pathname.startsWith('/association');
        setIsActiveAssUsers(isProfilePath);
    }, []);
    useEffect(() => {
        const isProfilePath = window.location.pathname.startsWith('/review');
        setIsActiveReview(isProfilePath);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        setIsArrowRotated(!isArrowRotated);
    };


    const handleLogout = (event) => {
        event.preventDefault();
        setShowModal(true);
        setIsMenuOpen(false);
        setIsArrowRotated(!isArrowRotated);
    };
    const confirmLogout = () => {
        setShowModal(false)
        axios.get('http://localhost:8080/api/auth/logout', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                localStorage.clear();
                navigate('/');
                setIsActiveUsers(false)
                setIsActiveProfile(false)
                setIsActiveAssociations(false)
                setIsActiveEvents(false)
                setIsActiveEventOne(false)
                setIsActiveAssUsers(false)
                setIsActiveReview(false)
                console.log('Logout successful');
            })
            .catch(error => {
                console.error('Logout error:', error);
            });
    };
    return (
        <div>

            <div className = {isActiveProfile ? 'rectangle1Profile' : isActiveUsers ?  'rectangle1Users' : isActiveEventOne ? 'rectangle1EventOne' : isActiveAssociations ? 'rectangle1Association' : isActiveAssUsers ? 'rectangle1AssUsers' : isActiveEvents ? 'rectangle1Events' : isActiveReview ? 'rectangle1Review' : 'rectangle1'}></div>
            <div className="rectangle3"></div>
            <div className="logoText">V&amp;<span style={{ color: '#FFDAB9' }}>H</span></div>
            <div className="line3"></div>
            <div className="line2"></div>
            <div className={isActiveProfile ? 'line1Profile' : isActiveUsers ? 'line1Users' : isActiveAssociations || isActiveAssUsers ? 'line1Associations' : isActiveEvents || isActiveEventOne || isActiveReview ? 'line1Events' : 'line1'}></div>
            <div className="logoName">VolunteerHub</div>
            <div className={isActiveProfile ? 'mainProfileP' : isActiveUsers ? 'mainProfileP' : isActiveAssociations || isActiveAssUsers ? 'mainProfileP' : isActiveEvents || isActiveEventOne || isActiveReview ? 'mainProfileP' : 'mainP'}><a href="/">Головна</a></div>
            <div className={isActiveEvents || isActiveEventOne || isActiveReview ? 'eventsP' : 'events'}><a href="/all-events">Заходи</a></div>
            <div className={isActiveAssociations || isActiveAssUsers ? 'associationsP' : 'associations'}><a href="/associations">Спілки</a></div>
            <div className="about">Про сервіс</div>
            <div className={isActiveUsers ? 'usersP' : 'users'}><a href="/users">Користувачі</a></div>
            {token ? (
                <div className={`triangle ${isArrowRotated ? 'rotated' : ''}`} onClick={toggleMenu}></div>
            ) : (
                <a href="/login" className="login-link" title="LogIn Page">
                    <img className="logIn" src="/images/5509636.png" alt="" />
                </a>
            )}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <p className="confirmation">Ви впевнені, що хочете вийти?</p>
                        <button onClick={confirmLogout}>Так</button>
                        <button onClick={() => setShowModal(false)}>Ні</button>
                    </div>
                </div>
            )}
            {isMenuOpen && token && (
                <div className="dropdown-menu">
                    <ul>
                        <li><a title="Profile" href="/profile">Профіль</a></li>
                        <li><a onClick={handleLogout} title="LogOut" href="/">Вийти</a></li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Header;
