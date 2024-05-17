import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useParams} from "react-router-dom";

const EventOne = () => {
    const token = localStorage.getItem('token');
    const { eventId } = useParams();
    const [event, setEvent] = useState({});

    useEffect(() => {
        const getEvent = async () => {
            try {
                let eventsResponse;

                eventsResponse = await axios.get(`http://localhost:8080/api/event/${eventId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setEvent(eventsResponse.data);
            } catch (error) {
                console.error('Помилка під час отримання даних:', error);
            }
        };

        if (token) {
            getEvent();
        }
    }, [token]);


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

        </div>
    );
};

export default EventOne;