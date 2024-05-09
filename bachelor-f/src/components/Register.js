import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [country, setCountry] = useState('');
    const [age, setAge] = useState('');
    const [telephone, setTelephone] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/api/auth/register', {
                login,
                password,
                email,
                age,
                firstName,
                lastName,
                country,
                telephone
            });
            localStorage.setItem('token', response.data.token)
            console.log('Registration successful:', response.data);
            navigate('/');
        } catch (error) {
            console.error('Registration failed:', error.response.data);
        }
    };



    return (
        <div>
            <div className="star1">*</div>
            <div className="star2">*</div>
            <div className="star3">*</div>
            <div className="star4">*</div>
            <div className="star5">*</div>
            <a href={"/login"} title="LogIn Page"><img className="backRe" src="/images/back.png" alt="" /></a>
            <div className="rectangle1" style={{ width: '100%', height: '100%' }}></div>
            <div className="formRe"></div>
            <div className="loginLogoRe"></div>
            <div className="loginTextRe">V&amp;<span style={{ color: '#FFDAB9' }}>H</span></div>
            <div className="loginTextLogoRe">VolunteerHub</div>
            <div className="formLoginRe">Логін:</div>
            <div className="formPasswordRe">Пароль:</div>
            <div className="formEmailRe">Email:</div>
            <div className="formAgeRe">Вік:</div>
            <div className="formFirstNameRe">Ім'я:</div>
            <div className="formLastNameRe">Прізвище:</div>
            <div className="formCountryRe">Країна:</div>
            <div className="formTelephoneRe">Телефон:</div>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        id="login"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        className="input1Re"
                        required
                        maxLength="27"
                    />
                </div>
                <div>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input2Re"
                        required
                        maxLength="27"
                    />
                </div>
                <div>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input3Re"
                        required
                        maxLength="24"
                    />
                </div>
                <div>
                    <input
                        type="number"
                        id="age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="input7Re"
                        maxLength="27"
                        required
                        min={0}
                        max={100}
                    />
                </div>
                <div>
                    <input
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="input4Re"
                        maxLength="27"
                    />
                </div>
                <div>
                    <input
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="input5Re"
                        maxLength="27"
                    />
                </div>
                <div>
                    <input
                        type="text"
                        id="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="input6Re"
                        maxLength="27"
                        required
                    />
                </div>
                <div>
                    <input
                        type="tel"
                        id="telephone"
                        value={telephone}
                        onChange={(e) => setTelephone(e.target.value)}
                        className="input8Re"
                        maxLength="14"
                    />
                </div>
                <button type="submit" className="buttonloginRe"><span className="textOnButtonLogin">Реєстрація</span></button>
            </form>
        </div>
    );
};

export default Register;