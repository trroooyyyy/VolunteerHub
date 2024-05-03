import React, { useState } from 'react';
import axios from 'axios';
//import { createBrowserHistory } from 'history';
import { useNavigate } from 'react-router';

//import 'bootstrap/dist/css/bootstrap.min.css';

const LogIn = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    //const history = createBrowserHistory();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/api/auth/authenticate', {
                login,
                password
            });
            localStorage.setItem('token', response.data.token)
            navigate('/')
            console.log('Authentication successful:', response.data);


        } catch (error) {
            console.error('Authentication failed:', error.response.data);
        }
    };

    return (
        <div>
            <a href={"/"} title="Main Page"><img className="back" src="/images/back.png" alt="" /></a>
            <div className="rectangle1" style={{ width: '100%', height: '100%' }}></div>
            <div className="form"></div>
            <div className="formLogin">Логін:</div>
            <div className="formPassword">Пароль:</div>
            <div className="loginLogo"></div>
            <div className="loginText">V&amp;<span style={{ color: '#FFDAB9' }}>H</span></div>
            <div className="loginTextLogo">VolunteerHub</div>
            <div ><a className="register" href={"/register"} title="Registration">Зареєструватися</a></div>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        id="login"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        className="input1"
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
                        className="input2"
                        required
                        maxLength="27"
                    />
                </div>
                <button type="submit" className="buttonlogin"><span className="textOnButtonLogin">Увійти</span></button>
            </form>
        </div>
    );
};

export default LogIn;
