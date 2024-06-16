import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useParams} from "react-router-dom";

const Users = () => {
    const [users, setUsers] = useState([]);
    const token = localStorage.getItem('token');
    const a = "—";
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const { associationId } = useParams();
    const [association, setAssociation] = useState({});
    const [viewer, setViewer] = useState({});
    const [showModalIfLeave, setShowModalIfLeave] = useState(false);
    const [idToDeleteFromAssociation, setIdToDeleteFromAssociation] = useState(0);
    const [searchParams, setSearchParams] = useState({
        login: '',
        email: '',
        telephone: ''
    });

    const getUsers = async () => {
        try {
            let response;
            let responseAssociation;
            let userResponse;
            if (associationId) {
                response = await axios.get(`http://localhost:8080/api/association/${associationId}/users?page=${currentPage}`, {
                    params: {
                        ...searchParams
                    },
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
                response = await axios.get(`http://localhost:8080/api/user/?page=${currentPage}`, {
                    params: {
                        ...searchParams
                    },
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
            setUsers(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Помилка під час отримання користувача:', error);
        }
    };


    useEffect(() => {
        if (token) {
            getUsers();
        }
    }, [token, associationId, currentPage, searchParams]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams({
            ...searchParams,
            [name]: value
        });
    };



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

            if (users.length === 1 && currentPage > 0) {
                setCurrentPage(currentPage - 1);
            } else {
                getUsers();
            }
            closeModalIfLeave();
        } catch (error) {
            console.error('Помилка під час видалення користувача з асоціації:', error);
            console.log(associationId)
        }
    };

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage(currentPage - 1);
    };

    const renderAvatar = (user) => {
        if (user.avatarUrl) {
            const base64Image = `data:image/jpeg;base64,${user.avatarUrl}`;
            return <img className="imageUsers" src={base64Image} alt="Avatar" />;
        } else {
            return <img className="imageUsers" src="/images/avatar_empty@2x.png" alt="Avatar" />;
        }
    };


    return (
        <div>
        <div className="mainTableDiv">
            {users.map(user => (
                <div key={user.id} className="relativeDiv">
                    <p className="emailUsers">Email:<br />{user.email}</p>
                    <p className="phoneUsers123">Телефон:<br />{user.telephone ? user.telephone : a}</p>
                    {renderAvatar(user)}
                    {associationId && association.owner.id===user.id &&(
                        <img className="imageUsersIfNotOwner" src="/images/crown.png" alt="123" />
                    )
                    }
                    {(associationId && (
                        (association.owner.id !== user.id && viewer.role === "ROLE_ADMIN") ||
                        (association.owner.id !== user.id && viewer.login === association.owner.login)
                    )) &&(
                        <img onClick={() => openModalIfLeave(user.id)} className="imageUsersIfNotOwner" src="/images/3687412.png" alt="" />
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

            {users.length > 0 && (
                <div className="container">
                {currentPage !== 0 && (
                    <img onClick={handlePrevPage} className="Butonsss1" alt="left" src="/images/free-icon-arrow-right-5889819.png"/>
                )}
                <span className="Pagesss">{currentPage + 1} з {totalPages}</span>
                {currentPage !== totalPages - 1 && (
                    <img onClick={handleNextPage} className="Butonsss2" alt="right" src="/images/free-icon-arrow-right-5889819.png"/>
                )}
                </div>
                )}
            <form>
                <input
                    className="formForSearch1"
                    type="text"
                    name="login"
                    value={searchParams.login}
                    onChange={handleInputChange}
                    placeholder="Логін..."
                    maxLength="50"
                />
                <input
                    className="formForSearch2"
                    type="email"
                    name="email"
                    value={searchParams.email}
                    onChange={handleInputChange}
                    placeholder="Email..."
                    maxLength="50"
                />
                <input
                    className="formForSearch3"
                    type="tel"
                    name="telephone"
                    value={searchParams.telephone}
                    onChange={handleInputChange}
                    placeholder="Телефон..."
                    maxLength="50"
                />
            </form>
        </div>
    );
};

export default Users;
