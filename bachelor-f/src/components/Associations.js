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
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [idDeleted, setIdDeleted] = useState(0);

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


    const isMember = (association) => {
        return association.users.some(member => member.id === user.id);
    };

    const openModalDelete = (idDeleted) => {
        setShowModalDelete(true);
        setIdDeleted(idDeleted)
    };

    const closeModalDelete = () => {
        setShowModalDelete(false);
    };

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
            window.location.reload();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };


    function handleDelete(associationId) {
        const deleteAssociation = async () => {
            try {
                const response = await axios.delete(`http://localhost:8080/api/association/${associationId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log(response);
                window.location.reload();
            } catch (error) {
                console.error('Помилка при видаленні спілки:', error);
            }
        };

        deleteAssociation();
    }


    function handleEdit() {

    }

    function handleJoin(associationId) {

        const joinAssociation = async () => {
            try {
                const response = await axios.post(`http://localhost:8080/api/association/${associationId}/join`, {id: user.id, login: user.login, role: user.role}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log(response)
                window.location.reload();

            } catch (error) {
                console.error('Помилка при приєднанні до спілки:', error);
            }
        };

        joinAssociation();
    }


    function handleExit(associationId) {

        const exitAssociation = async () => {
            try {
                const response = await axios.post(`http://localhost:8080/api/association/${associationId}/exit`, {id: user.id, login: user.login, role: user.role}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log(response)
                window.location.reload();

            } catch (error) {
                console.error('Помилка при виході зі спілки:', error);
            }
        };

        exitAssociation();
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
                            <img onClick={() => openModalDelete(association.id)} className="trashAssociation" src="/images/3687412.png" alt="Delete" />
                            <img onClick={handleEdit} className="editAssociation" src="/images/8862294.png" alt="Edit"/>
                        </div>
                    )}
                    <p className="creatorAssociation"><u style={{ fontWeight: 600 }}>Засновник:</u><br/><a href={`/profile/${association.owner.id}`}>{association.owner.login}</a></p>
                    <p className="descriptionAssociation"><u style={{ fontWeight: 600 }}>Опис:</u><br/>{association.description}</p>
                    <p className="userAssociation"><u style={{ fontWeight: 600 }}>Користувачі</u></p>
                    <p className="eventAssociation"><u style={{ fontWeight: 600 }}>Заходи</u></p>
                    {isMember(association) ? (
                        <img onClick={() => handleExit(association.id)} className="exitAssociation" src="/images/free-icon-remove-1828843.png" alt="Вийти" />
                    ) : (
                        <img onClick={() => handleJoin(association.id)} className="joinAssociation" src="/images/free-icon-check-mark-4225683.png" alt="Приєднатися" />
                    )}
                    <img className="positionLocate" src="/images/free-icon-location-pin-1201684.png" alt="Position" />
                    <p className="positionAssociationLocate">{association.place}</p>
                </div>

            ))}
            </div>
            {showModalDelete && (
                <div className="modal">
                    <div className="modal-content">
                        <p className="confirmation">Ви впевнені, що хочете видалити цю спілку?</p>
                        <button onClick={() => handleDelete(idDeleted)}>Так</button>
                        <button onClick={closeModalDelete}>Ні</button>
                    </div>
                </div>
            )}
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
                                maxLength="21"
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
                                maxLength={133}
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