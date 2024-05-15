import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useParams} from "react-router-dom";

const Users = () => {
    const [users, setUsers] = useState([]);
    const token = localStorage.getItem('token');
    const a = "—";
    const { associationId } = useParams();
    const [association, setAssociation] = useState({});
    const [viewer, setViewer] = useState({});
    const [showModalIfLeave, setShowModalIfLeave] = useState(false);
    const [idToDeleteFromAssociation, setIdToDeleteFromAssociation] = useState(0);

    useEffect(() => {
        const getUsers = async () => {
            try {
                let response;
                let responseAssociation;
                let userResponse;
                if (associationId) {
                    response = await axios.get(`http://localhost:8080/api/association/${associationId}/users`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    responseAssociation = await axios.get(`http://localhost:8080/api/association/${associationId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    setAssociation(responseAssociation.data);
                } else {
                    response = await axios.get('http://localhost:8080/api/user/', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                }
                userResponse = await axios.get('http://localhost:8080/api/user/t', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setViewer(userResponse.data);
                setUsers(response.data);
            } catch (error) {
                console.error('Помилка під час отримання користувача:', error);
            }
        };

        if (token) {
            getUsers();
        }
    }, [token, associationId]);


    const handleRedirect = userId => {
        window.location.href = `http://localhost:3000/profile/${userId}`;
    };

    const closeModalIfLeave = () => {
        setShowModalIfLeave(false);
    };
    const openModalIfLeave = (id) => {
        setIdToDeleteFromAssociation(id);
        setShowModalIfLeave(true);
    };

    const handleDelete = async (associationId, idToDeleteFromAssociation) => {
        try {
            await axios.delete(`http://localhost:8080/api/association/${associationId}/user/${idToDeleteFromAssociation}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            window.location.reload();
        } catch (error) {
            console.error('Помилка під час видалення користувача з асоціації:', error);
            console.log(associationId)
        }
    };

    return (
        <div className="mainTableDiv">
            {users.map(user => (
                <div key={user.id} className="relativeDiv">
                    <p className="emailUsers">Email:<br />{user.email}</p>
                    <p className="phoneUsers123">Телефон:<br />{user.telephone ? user.telephone : a}</p>
                    <img className="imageUsers" src="/images/avatar_empty@2x.png" alt="" />
                    {associationId && association.owner.id===user.id &&(
                        <a><img className="imageUsersIfNotOwner" src="/images/crown.png" alt="" /></a>
                    )
                    }
                    {(associationId && (
                        (association.owner.id !== user.id && viewer.role === "ROLE_ADMIN") ||
                        (association.owner.id !== user.id && viewer.login === association.owner.login)
                    )) &&(
                        <a><img onClick={() => openModalIfLeave(user.id)} className="imageUsersIfNotOwner" src="/images/3687412.png" alt="" /></a>
                    )
                    }
                    <p onClick={() => handleRedirect(user.id)} className="loginUsers">{user.login}</p>
                    <a href={user.instagram}><img className="instagramUsers" src="/images/Instagram_icon.png.webp" alt="Instagram" /></a>
                    <a href={user.facebook}><img className="facebookUsers" src="/images/Facebook_Logo_2023.png" alt="Instagram" /></a>
                    <a href={user.telegram}><img className="telegramUsers" src="/images/Telegram_alternative_logo.svg.png" alt="Telegram" /></a>
                </div>
            ))}
            {showModalIfLeave && (
                <div className="modal">
                    <div className="modal-content">
                        <p className="confirmation">Видалити цього користувача зі спілки?</p>
                        <button onClick={() => handleDelete(associationId, idToDeleteFromAssociation)}>Так</button>
                        <button onClick={closeModalIfLeave}>Ні</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
