import React, {useEffect, useState} from 'react';
import axios from "axios";


const Events = () => {
    const token = localStorage.getItem('token');
    const [viewer, setViewer] = useState({});
    const [associations, setAssociations] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showZapovnPolya, setShowZapovnPolya] = useState(false);
    const [name, setName] = useState('');
    const [place, setPlace] = useState('');
    const [description, setDescription] = useState('');
    const [dateStart, setDateStart] = useState('');
    const [dateEnd, setDateEnd] = useState('');
    const [associationForEvent, setAssociationForEvent] = useState(0);
    const [events, setEvents] = useState([]);
    const [hoveredEvent, setHoveredEvent] = useState(null);


    useEffect(() => {
        const getAssociations = async () => {
            try {
                let userResponse;
                userResponse = await axios.get('http://localhost:8080/api/user/t', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                let associationResponse;
                associationResponse = await  axios.get(`http://localhost:8080/api/association/owner/${userResponse.data.id}`,{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                let eventsResponse
                eventsResponse = await axios.get('http://localhost:8080/api/event/', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setEvents(eventsResponse.data);
                console.log(eventsResponse.data)
                setViewer(userResponse.data);
                setAssociations(associationResponse.data);
            } catch (error) {
                console.error('Помилка під час отримання даних:', error);
            }
        };

        if (token) {
            getAssociations();
        }
    }, [token]);

    const openZapovnPolya = () => {
        setShowZapovnPolya(true);
    };

    const closeZapovnPolya = () => {
        setShowZapovnPolya(false);
    };
    const openModal = () => {
        setName('')
        setDescription('')
        setPlace('')
        setDateStart('')
        setDateEnd('')
        setAssociationForEvent(0)
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const createEventProject= async (e) => {
        if (!name || !place || !description || !dateStart || !associationForEvent || !dateEnd) {
            openZapovnPolya();
            return;
        }
        e.preventDefault();
        const event = {
            name: name,
            place: place,
            description: description,
            association: {
                id: associationForEvent
            },
            dateStart: dateStart,
            dateEnd: dateEnd
        };
        try {
            await axios.post(`http://localhost:8080/api/event/`, event,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            closeModal();
            window.location.reload();
        } catch (error) {
            console.error('Error adding event:', error);
        }
    };

    const handleRedirect = eventId => {
        window.location.href = `http://localhost:3000/events/${eventId}`;
    };
    const handleRedirectReview = eventId => {
        window.location.href = `http://localhost:3000/review/event/${eventId}`;
    };

    const isEventActive = event => {
        const eventStartDate = new Date(event.dateStart);
        const currentDate = new Date();
        return currentDate < eventStartDate;
    };

    return (
        <div>
            <button className="buttonCreateAssociation" onClick={openModal}><span className="textOnCreateAssociation">Створити захід</span></button>
            <div className="mainTableEvents">
                {events.map(event => (
                    <div key={event.id} onMouseEnter={() => setHoveredEvent(event.id)} onMouseLeave={() => setHoveredEvent(null)} className={isEventActive(event) ? 'relativeDivEvents' : 'relativeDivEventsInActive'} onClick={isEventActive(event) ? () => handleRedirect(event.id) : () => handleRedirectReview(event.id)}>
                        <div>
                        <img className="positionLocateEvents" src="/images/free-icon-location-pin-1201643.png" alt="Position" />
                        <p className="positionEventsLocate">{event.place}</p>
                        <p className="eventsName">{event.name}</p>
                        <img className="dateEvents" src="/images/free-icon-time-and-date-26-9005122.png" alt="Date" />
                        <p className="dateEventsText">{event.dateStart.slice(0,10)}</p>
                        <p className="associationNameEvent">{event.association.name}</p>
                        <img className="zaglushka" src="/images/Volunteer-with-us-banner.png" alt="Banner" />
                        </div>
                        {hoveredEvent === event.id && !isEventActive(event) && (
                            <>
                                <p className="inActiveEventText">Натисніть, щоб залишити відгук</p>
                                <img className="inActiveEventTextImage" src="/images/free-icon-customer-review-8824001.png" alt="Msg"/>
                            </>
                        )}

                    </div>
                ))}
            </div>
            {showZapovnPolya && (
                <div className="modal">
                    <div className="modal-content">
                        <p className="confirmation">Ви повинні заповнити усі поля.</p>
                        <button onClick={closeZapovnPolya}>Ок</button>
                    </div>
                </div>
            )}


            {showModal && (
                <div className="modalEvent">
                    <div className="modal-contentEvent">
                        <p className="confirmationEvent">Створення заходу</p>
                        <p className="nameEvent">Назва:</p>
                        <div>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="nameEventInput"
                                maxLength="76"
                            />
                        </div>
                        <p className="placeEvent">Місце:</p>
                        <div>
                            <input
                                type="text"
                                id="place"
                                value={place}
                                onChange={(e) => setPlace(e.target.value)}
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
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
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
                                value={dateStart}
                                onChange={(e) => {
                                    setDateStart(e.target.value);
                                    if (e.target.value > dateEnd) {
                                        setDateEnd(e.target.value);
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
                                value={dateEnd}
                                onChange={(e) => {
                                    if (e.target.value >= dateStart) {
                                        setDateEnd(e.target.value);
                                    } else {
                                        setDateEnd(dateStart);
                                    }
                                }}
                                className="dateOfEndEventInput"
                            />
                        </div>
                        <p className="associationEvent">Спілка:</p>
                        <div>
                            <select className="associationEventInput" value={associationForEvent} onChange={(e) => setAssociationForEvent(parseInt(e.target.value, 10))}>
                                <option value="">Ваші спілки:</option>
                                {associations.map((association) => (
                                    <option key={association.id} value={association.id}>{association.id} - {association.name}</option>
                                ))}
                            </select>

                        </div>
                        <button className="buttonEventYes" onClick={createEventProject}>Save</button>
                        <button className="buttonEventNo" onClick={closeModal}>Exit</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Events;