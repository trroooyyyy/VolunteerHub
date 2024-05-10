import React, {useEffect, useState} from 'react';
import axios from "axios";

const Associations = () => {
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [place, setPlace] = useState('');
    const [description, setDescription] = useState('');
    const token = localStorage.getItem('token');
    const [user, setUser] = useState({});


    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/user/t', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        getUser();
    }, [token]);

    const openModal = () => {
        setName('');
        setPlace('');
        setDescription('');
        setShowModal(true);
    };


    const closeModal = () => {
        setShowModal(false);
    };

    const createAssociation= async (e) => {
        e.preventDefault();
        const association = {
            name: name,
            place: place,
            description: description,
            owner: {
                id: user.id,
                login: user.login,
                role: user.role
            }
        };
        try {
            await axios.post(`http://localhost:8080/api/association/`, association,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            closeModal();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };



    return (
        <div>
            <button className="buttonCreateAssociation" onClick={openModal}><span className="textOnCreateAssociation">Створити спілку</span></button>


            {showModal && (
                <div className="modalAssociation">
                    <div className="modal-contentAssociation">
                        <p className="confirmationAssociation">Створення спілки</p>
                        <p className="nameAssociation">Назва:</p>
                        <div>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="nameAssociationInput"
                                required
                                maxLength="50"
                            />
                        </div>
                        <p className="placeAssociation">Місце:</p>
                        <div>
                            <input
                                type="text"
                                id="place"
                                value={place}
                                onChange={(e) => setPlace(e.target.value)}
                                className="placeAssociationInput"
                                required
                                maxLength="27"
                            />
                        </div>
                        <p className="descAssociation">Опис:</p>
                        <div>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                maxLength={183}
                                className="descriptionAssociationInput"
                                required
                            />
                        </div>
                        <button className="buttonAssociationYes" onClick={createAssociation}>Save</button>
                        <button className="buttonAssociationNo" onClick={closeModal}>Exit</button>
                    </div>

                </div>
            )}

        </div>
    );
};

export default Associations;