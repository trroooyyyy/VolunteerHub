import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
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

    useEffect(() => {
        const getUser = async () => {
            try {
                if (userId) {
                    const response = await axios.get(`http://localhost:8080/api/user/${userId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    console.log("Fetching super");
                    setId(response.data.id);
                    setLogin(response.data.login);
                    setPassword(response.data.password);
                    setEmail(response.data.email);
                    setFirstName(response.data.firstName);
                    setLastName(response.data.lastName);
                    setCountry(response.data.country);
                    setDescription(response.data.description);
                    setAge(response.data.age);
                    setTelephone(response.data.telephone);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        getUser();
    }, [token, userId]);



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
            telephone: telephone
        };
        try {
            await axios.put(`http://localhost:8080/api/user/${userId}`, userData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Editing super");
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'login':
                setLogin(value);
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
            default:
                break;
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="login">Login:</label>
                    <input
                        type="text"
                        id="login"
                        name="login"
                        value={login}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="password">password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Save</button>
            </form>
        </div>
    );
};

export default EditUser;
