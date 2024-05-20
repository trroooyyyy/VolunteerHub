import React, {useEffect, useState} from 'react';
import axios from "axios";
import { Navigate, useParams, useNavigate } from "react-router-dom";

const EventOne = () => {
    const token = localStorage.getItem('token');
    const { eventId } = useParams();
    const [event, setEvent] = useState({});
    const [association, setAssociation] = useState({});
    const [isEventStarted, setIsEventStarted] = useState(false);
    const [user, setUser] = useState({});
    const [viewer, setViewer] = useState({});
    const [isViewerMemberEvent, setIsViewerMemberEvent] = useState(false);
    const [isViewerMemberAssociation, setIsViewerMemberAssociation] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);

    const [showZapovnPolya, setShowZapovnPolya] = useState(false);

    const [idEdit, setIdEdit] = useState(0);
    const [nameEdit, setNameEdit] = useState('');
    const [descriptionEdit, setDescriptionEdit] = useState('');
    const [placeEdit, setPlaceEdit] = useState('');
    const [dataStartEdit, setDataStartEdit] = useState('');
    const [dataEndEdit, setDataEndEdit] = useState('');
    const [associationForEdit, setAssociationForEdit] = useState({});
    const [usersForEdit, setUsersForEdit] = useState([{}]);
    const [numUsers, setNumUsers] = useState(0);

    const navigate = useNavigate();

    const [showModalDelete, setShowModalDelete] = useState(false);
    const [idDeleted, setIdDeleted] = useState(0);





    useEffect(() => {
        const getEvent = async () => {
            try {
                let eventsResponse;
                let associationResponse;
                let userResponse;
                let tokenResponse;
                tokenResponse = await axios.get('http://localhost:8080/api/user/t', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                eventsResponse = await axios.get(`http://localhost:8080/api/event/${eventId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                associationResponse = await axios.get(`http://localhost:8080/api/association/${eventsResponse.data.association.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                userResponse = await axios.get(`http://localhost:8080/api/user/${associationResponse.data.owner.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setViewer(tokenResponse.data);
                setAssociation(associationResponse.data);
                setEvent(eventsResponse.data);
                setUser(userResponse.data);
                const eventStartTime = new Date(eventsResponse.data.dateStart).getTime();
                const currentTime = new Date().getTime();
                setIsEventStarted(currentTime >= eventStartTime);
                const isViewerMemberEvent = eventsResponse.data.users.some(member => member.id === tokenResponse.data.id);
                const isViewerMemberAssociation = associationResponse.data.users.some(members => members.id ===tokenResponse.data.id);
                setIsViewerMemberEvent(isViewerMemberEvent);
                setIsViewerMemberAssociation(isViewerMemberAssociation);
                setNumUsers(eventsResponse.data.users.length);
            } catch (error) {
                console.error('Помилка під час отримання даних:', error);
            }
        };

        if (token) {
            getEvent();
        }
    }, [token, eventId, viewer]);



    const openZapovnPolya = () => {
        setShowZapovnPolya(true);
    };

    const closeZapovnPolya = () => {
        setShowZapovnPolya(false);
    };

    const closeModalEdit = () => {
        setShowModalEdit(false);
    };


    const openModalDelete = (idDeleted) => {
        setShowModalDelete(true);
        setIdDeleted(idDeleted)
    };

    const closeModalDelete = () => {
        setShowModalDelete(false);
    };

    function handleDelete(eventId) {
        const deleteEvent = async () => {
            try {
                const response = await axios.delete(`http://localhost:8080/api/event/${eventId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log(response);
                closeModalDelete();
                navigate("/all-events");
                window.location.reload();
            } catch (error) {
                console.error('Помилка при видаленні івенту:', error);
            }
        };

        deleteEvent();
    }



    function handleJoin(associationId) {
        const joinAssociation = async () => {
            try {
                const response = await axios.post(`http://localhost:8080/api/association/${associationId}/join`, {id: viewer.id, login: viewer.login, role: viewer.role}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log(response)

            } catch (error) {
                console.error('Помилка при приєднанні до спілки:', error);
            }
        };

        joinAssociation();
    }

    const openModalEdit = (event) => {
        setIdEdit(event.id);
        setNameEdit(event.name);
        setPlaceEdit(event.place);
        setDescriptionEdit(event.description);
        setDataStartEdit(event.dateStart.slice(0,10));
        setDataEndEdit(event.dateEnd.slice(0,10));
        setAssociationForEdit({id: event.association.id,
        name: event.association.name});
        setUsersForEdit(event.users.map(user => ({
            id: user.id,
            login: user.login,
            role: user.role
        })));
        setShowModalEdit(true);
    };

    if (isEventStarted) {
        return <Navigate to={`/review/event/${eventId}`} />;
    }

    const handleEdit = async (e) => {
        if (!nameEdit || !placeEdit || !descriptionEdit || !dataStartEdit || !dataEndEdit) {
            openZapovnPolya();
            return;
        }
        e.preventDefault();
        const eventData = {
            id: idEdit,
            name: nameEdit,
            place: placeEdit,
            dateStart: dataStartEdit,
            dateEnd: dataEndEdit,
            description: descriptionEdit,
            association: associationForEdit,
            users: usersForEdit
        };
        try {
            await axios.put(`http://localhost:8080/api/event/${idEdit}`, eventData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Editing super");
            closeModalEdit();
        } catch (error) {
            console.error('Error updating associations:', error);
        }
    };

    function handleJoinEvent(eventId) {
        const joinEvent = async () => {
            try {
                const response = await axios.post(`http://localhost:8080/api/event/${eventId}/join`, {id: viewer.id, login: viewer.login, role: viewer.role}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log(response)

            } catch (error) {
                console.error('Помилка при приєднанні до івенту:', error);
            }
        };

        joinEvent();
    }



    function handleExitEvent(eventId) {
        if (numUsers===1){
            alert("Ви останній користувач цього заходу. Він буде видалений")
            navigate("/all-events")
            window.location.reload();
        }


        const exitEvent = async () => {
            try {
                const response = await axios.post(`http://localhost:8080/api/event/${eventId}/exit`, {id: viewer.id, login: viewer.login, role: viewer.role}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log(response)

            } catch (error) {
                console.error('Помилка при виході з івенту:', error);
            }
        };

        exitEvent();
    }

    return (
        <div>
            <div className="eventOneMainDiv"></div>
            <div className="eventOneMainText">{event.name}</div>
            <div className="eventOneMainDate">Відбудеться {new Date(event.dateStart).toLocaleDateString('uk-UA')} - {new Date(event.dateEnd).toLocaleDateString('uk-UA')}</div>
            <div className="eventOneMainDateCreate">Опубліковано {new Date(event.createdAt).toLocaleDateString('uk-UA')}</div>
            <div className="lineEventsOne"></div>
            <div className="Organisators">Організатори</div>
            <div className="descriptionEventOne">{event.description}</div>
            <div className="lineEventsTwo"></div>
            <div className="placeOfEventOne">Місце проведення:</div>
            <div className="placeOfEventOneText">{event.place}</div>
            <div className="OrgBox"></div>
            <div className="SpilkName">{association.name}</div>
            <div className="SpilkPlace">{association.place}</div>
            <div className="KorTele">{user.telephone}</div>
            <div className="KorName">{user.lastName} {user.firstName}</div>
            {(user.id===viewer.id || viewer.role==="ROLE_ADMIN") && (
                <img onClick={() => openModalEdit(event)} className="editEventOne" src="/images/8862294.png" alt="Edit" />
            )}
            {(user.id===viewer.id || viewer.role==="ROLE_ADMIN") && (
                <img onClick={() => openModalDelete(event.id)} className="trashEventOne" src="/images/3687412.png" alt="Trash" />
            )}


            <button onClick={isViewerMemberEvent ? () => handleExitEvent(event.id) : () => handleJoinEvent(event.id)} className="buttonEventOneFirst"><span className="textOnEventOneFirst">{isViewerMemberEvent ? "Не долучатись" : "Долучитись"}</span></button>
            {!isViewerMemberAssociation && <button onClick={() => handleJoin(association.id)} className="buttonEventOneSecond"><span className="textOnEventOneSecond">Приєднатись</span></button>}

            {showZapovnPolya && (
                <div className="modal">
                    <div className="modal-content">
                        <p className="confirmation">Ви повинні заповнити усі поля.</p>
                        <button onClick={closeZapovnPolya}>Ок</button>
                    </div>
                </div>
            )}

            {showModalDelete && (
                <div className="modal">
                    <div className="modal-content">
                        <p className="confirmation">Ви впевнені, що хочете видалити цей івент?</p>
                        <button onClick={() => handleDelete(idDeleted)}>Так</button>
                        <button onClick={closeModalDelete}>Ні</button>
                    </div>
                </div>
            )}

            {showModalEdit && (
                <div className="modalEvent">
                    <div className="modal-contentEvent1">
                        <p className="confirmationEvent">Редагування заходу</p>
                        <p className="nameEvent">Назва:</p>
                        <div>
                            <input
                                type="text"
                                id="name"
                                value={nameEdit}
                                onChange={(e) => setNameEdit(e.target.value)}
                                className="nameEventInput"
                                maxLength="69"
                            />
                        </div>
                        <p className="placeEvent">Місце:</p>
                        <div>
                            <input
                                type="text"
                                id="place"
                                value={placeEdit}
                                onChange={(e) => setPlaceEdit(e.target.value)}
                                className="placeEventInput"
                                maxLength="21"
                            />
                        </div>
                        <p className="descEvent">Опис:</p>
                        <div>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                value={descriptionEdit}
                                onChange={(e) => setDescriptionEdit(e.target.value)}
                                maxLength={500}
                                className="descriptionEventInput"
                            />
                        </div>
                        <p className="dateOfStartEvent">Дата початку:</p>
                        <div>
                            <input
                                type="date"
                                id="dateStart"
                                name="dateStart"
                                value={dataStartEdit}
                                onChange={(e) => {
                                    setDataStartEdit(e.target.value);
                                    if (e.target.value > dataEndEdit) {
                                        setDataEndEdit(e.target.value);
                                    }
                                }}
                                className="dateOfStartEventInput"
                            />
                        </div>
                        <p className="dateOfEndEvent">Дата кінця:</p>
                        <div>
                            <input
                                type="date"
                                id="dateEnd"
                                name="dateEnd"
                                value={dataEndEdit}
                                onChange={(e) => {
                                    if (e.target.value >= dataStartEdit) {
                                        setDataEndEdit(e.target.value);
                                    } else {
                                        setDataEndEdit(dataStartEdit);
                                    }
                                }}
                                className="dateOfEndEventInput"
                            />
                        </div>
                        <button className="buttonEventYes1" onClick={handleEdit}>Save</button>
                        <button className="buttonEventNo1" onClick={closeModalEdit}>Exit</button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default EventOne;