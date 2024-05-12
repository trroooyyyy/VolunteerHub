import React, {useEffect, useState} from 'react';
import axios from "axios";

const Associations = () => {
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [place, setPlace] = useState('');
    const [description, setDescription] = useState('');
    const token = localStorage.getItem('token');
    const [user, setUser] = useState({});
    const [associations, setAssociations] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const associationResponse = await axios.get('http://localhost:8080/api/association/', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setAssociations(associationResponse.data);
                console.log("Getting");
                const userResponse = await axios.get('http://localhost:8080/api/user/t', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUser(userResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (token) {
            fetchData();
        }
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


    function handleDelete() {

    }

    function handleEdit() {

    }

    return (
        <div>
            <button className="buttonCreateAssociation" onClick={openModal}><span className="textOnCreateAssociation">Створити спілку</span></button>
            <div className="mainTableAssociations">
            {associations.map(association => (
                <div key={association.id} className="relativeDivAssociations">
                    <p className="associationName">{association.name}</p>
                    {(user.role === "ROLE_ADMIN" || user.id === association.owner.id) && (
                        <div>
                            <img onClick={handleDelete} className="trashAssociation" src="/images/3687412.png" alt="Delete" />
                            <img onClick={handleEdit} className="editAssociation" src="/images/8862294.png" alt="Edit"/>
                        </div>
                    )}
                </div>
            ))}
            </div>
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