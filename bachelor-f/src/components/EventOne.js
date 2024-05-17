import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Navigate, useParams} from "react-router-dom";

const EventOne = () => {
    const token = localStorage.getItem('token');
    const { eventId } = useParams();
    const [event, setEvent] = useState({});
    const [association, setAssociation] = useState({});
    const [isEventStarted, setIsEventStarted] = useState(false);
    const [user, setUser] = useState({});


    useEffect(() => {
        const getEvent = async () => {
            try {
                let eventsResponse;
                let associationResponse;
                let userResponse;
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
                setAssociation(associationResponse.data);
                setEvent(eventsResponse.data);
                setUser(userResponse.data);
                const eventStartTime = new Date(eventsResponse.data.dateStart).getTime();
                const currentTime = new Date().getTime();
                setIsEventStarted(currentTime >= eventStartTime);
            } catch (error) {
                console.error('Помилка під час отримання даних:', error);
            }
        };

        if (token) {
            getEvent();
        }
    }, [token, eventId]);




    if (isEventStarted) {
        return <Navigate to={`/review/event/${eventId}`} />;
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
            <button className="buttonEventOneFirst"><span className="textOnEventOneFirst">Долучитись</span></button>
            <button className="buttonEventOneSecond"><span className="textOnEventOneSecond">Приєднатись</span></button>

        </div>
    );
};

export default EventOne;