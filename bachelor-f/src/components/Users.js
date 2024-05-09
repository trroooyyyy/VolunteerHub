import React, {useEffect, useState} from 'react';
import axios from 'axios';

const Users = () => {
    const [users, setUsers] = useState([]);
    const token = localStorage.getItem('token');
    const a = "—";

    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/user/', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        if (token) {
            getUsers();
        }
    }, [token]);

    const handleRedirect = userId => {
        window.location.href = `http://localhost:3000/profile/${userId}`;
    };


    return (
        <div className="mainTableDiv">
            {users.map(user => (
                <div key={user.id} onClick={() => handleRedirect(user.id)} className="relativeDiv">
                    <p className="emailUsers">Email:<br />{user.email}</p>
                    <p className="phoneUsers123">Телефон:<br />{user.telephone ? user.telephone : a}</p>
                    <img className="imageUsers" src="/images/avatar_empty@2x.png" alt="" />
                    <p className="loginUsers">{user.login}</p>
                    <a href={user.instagram}><img className="instagramUsers" src="/images/Instagram_icon.png.webp" alt="Instagram" /></a>
                    <a href={user.facebook}><img className="facebookUsers" src="/images/Facebook_Logo_2023.png" alt="Instagram" /></a>
                    <a href={user.telegram}><img className="telegramUsers" src="/images/Telegram_alternative_logo.svg.png" alt="Telegram" /></a>
                </div>
            ))}
        </div>
    );
};

export default Users;
