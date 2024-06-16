import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useParams} from "react-router-dom";


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
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const { associationId } = useParams();
    const [markedEvents, setMarkedEvents] = useState([]);
    const [searchParams, setSearchParams] = useState({
        name: '',
        place: ''
    });

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
                console.log(associationId)
                if(associationId){
                    eventsResponse = await axios.get(`http://localhost:8080/api/event/events/association/${associationId}?page=${currentPage}`, {
                        params: {
                            ...searchParams
                        },
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                }
                else{
                    eventsResponse = await axios.get(`http://localhost:8080/api/event/?page=${currentPage}`, {
                        params: {
                            ...searchParams
                        },
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                }
                let markedEventsResponse;
                markedEventsResponse = await axios.get(`http://localhost:8080/api/review/events/${userResponse.data.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setTotalPages(eventsResponse.data.totalPages);
                setEvents(eventsResponse.data.content);
                setViewer(userResponse.data);
                setAssociations(associationResponse.data);
                setMarkedEvents(markedEventsResponse.data);
            } catch (error) {
                console.error('Помилка під час отримання даних:', error);
            }
        };

        useEffect(() => {
            if (token) {
                getAssociations();
            }
    }, [token, currentPage, searchParams]);

    const openZapovnPolya = () => {
        setShowZapovnPolya(true);
    };

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage(currentPage - 1);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams({
            ...searchParams,
            [name]: value
        });
    };

    useEffect(() => {
        const scrollToTop = () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        };

        scrollToTop();
    }, [currentPage]);

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
        const currentDate = new Date();
        const eventStartDate = new Date(dateStart);
        if (eventStartDate < currentDate) {
            alert("Дата початку події не може бути раніше поточної дати.");
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
            closeModal()
            getAssociations();
        } catch (error) {
            console.error('Error adding event:', error);
        }
    };

    const handleRedirect = eventId => {
        window.location.href = `http://localhost:3000/event/${eventId}`;
    };
    const handleRedirectReview = eventId => {
        window.location.href = `http://localhost:3000/review/event/${eventId}`;
    };

    const isEventActive = event => {
        const eventStartDate = new Date(event.dateStart);
        const currentDate = new Date();
        return currentDate < eventStartDate;
    };


    const renderAvatar = (event) => {
        if (event.avatarUrl) {
            const base64Image = `data:image/jpeg;base64,${event.avatarUrl}`;
            return <img className="zaglushka" src={base64Image} alt="Avatar" />;
        } else {
            return <img className="zaglushka" src="/images/Volunteer-with-us-banner.png" alt="Avatar" />;
        }
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
                            {!isEventActive(event) && <img className="flag" src="/images/free-icon-warning-12434856.png" alt="Flag" />}
                            {event.reviewCount >= 1 && (
                                <>
                                    {!isEventActive(event) && <img className="CommentCount" src="/images/free-icon-comment-4991361.png" alt="Comment" />}
                                    {!isEventActive(event) && <p className="commentCountText">{event.reviewCount}</p>}
                                </>
                            )}

                            {event.users.some(user => user.id === viewer.id) && <img className="Participate" src="/images/free-icon-check-mark-5290058.png" alt="Prstp"/>}
                        <img className="dateEvents" src="/images/free-icon-time-and-date-26-9005122.png" alt="Date" />
                        <p className="dateEventsText">{new Date(event.dateStart).toLocaleDateString('uk-UA')}</p>
                        <p className="associationNameEvent">{event.association.name}</p>
                            {renderAvatar(event)}
                        </div>
                        {hoveredEvent === event.id && !isEventActive(event) && (
                            <>
                                {event.users.some(user => user.id === viewer.id) ? (
                                    <p className="inActiveEventText">{markedEvents.some(markEvent => markEvent === event.id) ? "Ви вже залишили відгук" : "Натисніть, щоб залишити відгук"}</p>
                                ) : (
                                    <p className="inActiveEventText">Переглянути відгуки</p>
                                )}
                                <img className="inActiveEventTextImage" src="/images/free-icon-customer-review-8824001.png" alt="Msg"/>
                            </>
                        )}


                    </div>
                ))}
                {events.length>0 && (
                    <div className="container1">
                    {currentPage !== 0 && (
                        <img onClick={handlePrevPage} className="Butonsss12" alt="left" src="/images/free-icon-arrow-right-5889819.png"/>
                    )}
                    <span className="Pagesss1">{currentPage + 1} з {totalPages}</span>
                    {currentPage !== totalPages - 1 && (
                        <img onClick={handleNextPage} className="Butonsss22" alt="right" src="/images/free-icon-arrow-right-5889819.png"/>
                    )}
                </div>)}
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
                                maxLength="69"
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
            <form>
                <input
                    className="formForSearch1Ass"
                    type="text"
                    name="name"
                    value={searchParams.name}
                    onChange={handleInputChange}
                    placeholder="Назва..."
                    maxLength="50"
                />
                <input
                    className="formForSearch3Ass"
                    type="text"
                    name="place"
                    value={searchParams.place}
                    onChange={handleInputChange}
                    placeholder="Місце..."
                    maxLength="50"
                />
            </form>

        </div>
    );
};

export default Events;