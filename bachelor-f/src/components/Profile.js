import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';

const Profile = () => {
    const token = localStorage.getItem('token');
    const [user, setUser] = useState(null);
    const [viewer, setViewer] = useState(null);
    const a = "—";
    const { userId } = useParams();
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const getUser = async () => {
            try {
                let response;
                if (userId) {
                    response = await axios.get(`http://localhost:8080/api/user/${userId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                } else {
                    response = await axios.get('http://localhost:8080/api/user/t', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                }
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        const getViewer = async () => {
            try {
                let response;
                response = await axios.get('http://localhost:8080/api/user/t', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setViewer(response.data);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };



        if (token) {
            getUser();
            getViewer()
        }
    }, [token, userId]);
    const handleConfirmation = (event) => {
        event.preventDefault();
        setShowModal(true);

    };

    const handleDeleteUser = async () => {
        setShowModal(false)
        try {
            const response = await axios.delete(`http://localhost:8080/api/user/${user.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('User deleted:', response.data);
            console.log(viewer.login)
            console.log(user.login)
            navigate('/users')
            if(viewer.login === user.login){
                localStorage.removeItem('token');
                setUser(null);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };
    const handleEditUser = async () => {

    }


    return (
        <div>
            {user ? (
                <div>
                    <div className="profileBox"></div>
                    <img className="avatarDefault" src="/images/avatar_empty@2x.png" alt="" />
                    <div className="profileLogin">{user.login}</div>
                    <div className="profileFirstName">Ім'я: {user.firstName ? user.firstName : a}</div>
                    <div className="profileLastName">Прізвище: {user.lastName ? user.lastName : a}</div>
                    <div className="profileEmail">Email: {user.email}</div>
                    <div className="profileAge">Вік: {user.age}</div>
                    <div className="profileCountry">Країна: {user.country}</div>
                    <div className="profileTelephone">Телефон: {user.telephone ? user.telephone : a}</div>
                    <div className="profileDesc">Опис:</div>
                    <div className="profileDescBox"></div>
                    <div className="profileDescText">{user.description}</div>
                    <div><img className="logoInst" src="/images/Instagram_icon.png.webp" alt="Instagram" /></div>
                    <div><img className="logoFaceBook" src="/images/Facebook_Logo_2023.png" alt="Instagram" /></div>
                    <div><img className="logoTg" src="/images/Telegram_alternative_logo.svg.png" alt="Telegram" /></div>
                    {viewer && viewer.role === "ROLE_ADMIN" && (
                        <div><img onClick={handleConfirmation} className="trash" src="/images/3687412.png" alt="Delete" />
                        </div>
                    )}
                    {showModal && (
                        <div className="modal">
                            <div className="modal-content">
                                <p className="confirmation">Ви впевнені, що хочете видалити цей аккаунт?</p>
                                <button onClick={handleDeleteUser}>Так</button>
                                <button onClick={() => setShowModal(false)}>Ні</button>
                            </div>
                        </div>
                    )}

                    {viewer && (
                        <div>
                            <img
                                onClick={handleEditUser}
                                className={viewer.role === "ROLE_USER" && viewer.login===user.login ? 'userEdit' : viewer.role==="ROLE_ADMIN" ? 'edit' : 'noedit'}
                                src="/images/8862294.png"
                                alt="Edit"
                            />
                        </div>
                    )}
                    <div className="dateOfReg">Дата реєстрації:</div>
                    <div className="dateOfRegValue">{user.createdAt.slice(0,10)}</div>
                </div>
            ) : (
                <p className="loading">Loading...</p>
            )}
        </div>
    );
};

export default Profile;
