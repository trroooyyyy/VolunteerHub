import React, { useState, useEffect } from 'react';
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";

const EditUser = () => {
    const token = localStorage.getItem('token');
    const { userId } = useParams();
    const [id, setId] = useState(0);
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [country, setCountry] = useState("");
    const [description, setDescription] = useState("");
    const [age, setAge] = useState(0);
    const [telephone, setTelephone] = useState("");
    const [instagram, setInstagram] = useState("");
    const [telegram, setTelegram] = useState("");
    const [facebook, setFacebook] = useState("");
    const [param, setParam] = useState(false);
    const navigate = useNavigate();
    const [loginChanged, setLoginChanged] = useState(false);
    const [loginViewer, setLoginViewer] = useState("");

    useEffect(() => {
        const getUser = async () => {
            try {
                const responseCheck = await axios.get('http://localhost:8080/api/user/t', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if(responseCheck.data.id!==userId && responseCheck.data.role!=="ROLE_ADMIN"){
                    navigate(`/edit/${responseCheck.data.id}`, { replace: true });
                }
                if(responseCheck.data.role==="ROLE_ADMIN"){
                    setLoginViewer(responseCheck.data.login);
                }
                if (userId) {
                    const response = await axios.get(`http://localhost:8080/api/user/${userId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    if(responseCheck.data.login===response.data.login){
                        setParam(true);
                        setPassword("");
                    }
                    else{
                        setPassword(response.data.password);
                    }
                    setId(response.data.id);
                    setLogin(response.data.login);
                    setEmail(response.data.email);
                    setFirstName(response.data.firstName);
                    setLastName(response.data.lastName);
                    setCountry(response.data.country);
                    setDescription(response.data.description);
                    setAge(response.data.age);
                    setTelephone(response.data.telephone);
                    setTelegram(response.data.telegram);
                    setInstagram(response.data.instagram);
                    setFacebook(response.data.facebook);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        getUser();
    }, [token, userId, navigate, param, loginViewer]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = {
            id: id,
            login: login,
            password: password,
            email: email,
            firstName: firstName,
            lastName: lastName,
            country: country,
            description: description,
            age: age,
            telephone: telephone,
            telegram: telegram,
            instagram: instagram,
            facebook: facebook
        };
        try {
            await axios.put(`http://localhost:8080/api/user/${userId}`, userData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(loginChanged)
            console.log("Editing super");
            if (loginChanged) {
                localStorage.removeItem('token');
                navigate('/');
            } else {
                navigate(`/profile/${id}`);
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'login':
                setLogin(value);
                if (!loginChanged && param===true) {
                    alert("Якщо ви зміните свій логін, буде необхідно перезайти в систему.");
                    setLoginChanged(true);
                }
                break;
            case 'password':
                setPassword(value);
                break;
            case 'email':
                setEmail(value);
                break;
            case 'firstName':
                setFirstName(value);
                break;
            case 'lastName':
                setLastName(value);
                break;
            case 'country':
                setCountry(value);
                break;
            case 'description':
                setDescription(value);
                break;
            case 'age':
                setAge(value);
                break;
            case 'telephone':
                setTelephone(value);
                break;
            case 'telegram':
                setTelegram(value);
                break;
            case 'instagram':
                setInstagram(value);
                break;
            case 'facebook':
                setFacebook(value);
                break;
            default:
                break;
        }
    };

    return (
        <div>
            <div className="rectangle1" style={{ width: '100%', height: '100%' }}></div>
            <div className="formEdit"></div>
            <div className="loginLogoEdit"></div>
            <div className="loginTextEdit">V&amp;<span style={{ color: '#FFDAB9' }}>H</span></div>
            <div className="loginTextLogoEdit">VolunteerHub</div>
            <div className="userLoginEdit">Логін:</div>
            <div className="userFirstNameEdit">Ім'я:</div>
            <div className="userPasswordEdit">Пароль:</div>
            <div className="userLastNameEdit">Прізвище:</div>
            <div className="userEmailEdit">Email:</div>
            <div className="userCountryEdit">Країна:</div>
            <div className="userAgeEdit">Вік:</div>
            <div className="userTelephoneEdit">Телефон:</div>
            <div className="userDescEdit">Опис:</div>
            <div className="userIdEdit">Редагування: ID{id}</div>
            <div><img className="logoInstEdit" src="/images/Instagram_icon.png.webp" alt="Instagram" /></div>
            <div><img className="logoFaceBookEdit" src="/images/Facebook_Logo_2023.png" alt="Facebook" /></div>
            <div><img className="logoTgEdit" src="/images/Telegram_alternative_logo.svg.png" alt="Telegram" /></div>

            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        id="login"
                        name="login"
                        value={login}
                        onChange={handleChange}
                        required
                        maxLength={27}
                        className="editLoginBox"
                    />
                </div>
                <div>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={firstName}
                        onChange={handleChange}
                        maxLength={27}
                        className="editFirstNameBox"
                    />
                </div>
                <div>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        onChange={handleChange}
                        maxLength={27}
                        required
                        value={password}
                        className="editPasswordBox"
                        disabled={!param}
                    />
                </div>
                <div>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={lastName}
                        onChange={handleChange}
                        maxLength={27}
                        className="editLastNameBox"
                    />
                </div>
                <div>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                        maxLength={27}
                        className="editEmailBox"
                        required
                    />
                </div>
                <div>
                    <input
                        type="text"
                        id="country"
                        name="country"
                        value={country}
                        onChange={handleChange}
                        maxLength={27}
                        className="editCountryBox"
                        required
                    />
                </div>
                <div>
                    <input
                        type="number"
                        id="age"
                        name="age"
                        value={age}
                        onChange={handleChange}
                        maxLength={27}
                        className="editAgeBox"
                        required
                        min={0}
                        max={100}
                    />
                </div>
                <div>
                    <input
                        type="tel"
                        id="telephone"
                        name="telephone"
                        value={telephone}
                        onChange={handleChange}
                        maxLength={14}
                        className="editTelephoneBox"
                    />
                </div>
                <div>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        value={description}
                        onChange={handleChange}
                        maxLength={183}
                        className="editDescriptionBox"
                    />
                </div>
                <div>
                    <input
                        type="url"
                        id="instagram"
                        name="instagram"
                        value={instagram}
                        onChange={handleChange}
                        className="editInstagramBox"
                    />
                </div>
                <div>
                    <input
                        type="url"
                        id="telegram"
                        name="telegram"
                        value={telegram}
                        onChange={handleChange}
                        className="editTelegramBox"
                    />
                </div>
                <div>
                    <input
                        type="url"
                        id="facebook"
                        name="facebook"
                        value={facebook}
                        onChange={handleChange}
                        className="editFacebookBox"
                    />
                </div>
                <button type="submit" className="buttonEdit"><span className="textOnButtonLogin">Зберегти</span></button>
            </form>
        </div>
    );
};

export default EditUser;
