import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";

const Review = () => {
    const token = localStorage.getItem('token');
    const { eventId } = useParams();
    const [event, setEvent] = useState({});
    const [association, setAssociation] = useState({});
    const [user, setUser] = useState({});
    const [viewer, setViewer] = useState({});
    const [isViewerMemberAssociation, setIsViewerMemberAssociation] = useState(false);
    const [reviewExists, setReviewExists] = useState(false);
    const [isViewerMemberEvent, setIsViewerMemberEvent] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [content, setContent] = useState('');
    const [rating, setRating] = useState(0);

    const [showZapovnPolya, setShowZapovnPolya] = useState(false);

    const [reviews, setReviews] = useState([])

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [showModalDelete, setShowModalDelete] = useState(false);
    const [idDeleted, setIdDeleted] = useState(0);
    const navigate = useNavigate();

    let imageUrl;

    useEffect(() => {
        const getEvent = async () => {
            try {
                let eventsResponse;
                let associationResponse;
                let userResponse;
                let tokenResponse;
                let reviewsResponse;
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
                reviewsResponse = await axios.get(`http://localhost:8080/api/review/${eventId}/reviews?page=${currentPage}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setTotalPages(reviewsResponse.data.totalPages)
                setViewer(tokenResponse.data);
                setAssociation(associationResponse.data);
                setEvent(eventsResponse.data);
                setUser(userResponse.data);
                setReviews(reviewsResponse.data.content);
                const isViewerMemberEvent = eventsResponse.data.users.some(member => member.id === tokenResponse.data.id);
                const isViewerMemberAssociation = associationResponse.data.users.some(members => members.id ===tokenResponse.data.id);
                setIsViewerMemberAssociation(isViewerMemberAssociation);
                setIsViewerMemberEvent(isViewerMemberEvent);
                const reviewExistsResponse = await axios.get(`http://localhost:8080/api/review/exists/${eventId}/${tokenResponse.data.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setReviewExists(reviewExistsResponse.data);
            } catch (error) {
                console.error('Помилка під час отримання даних:', error);
            }
        };

        if (token) {
            getEvent();
        }
    }, [token, eventId, viewer,reviewExists, currentPage]);


    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage(currentPage - 1);
    };
    const openModal = () => {
        setContent('');
        setRating(0);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };


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

    const openZapovnPolya = () => {
        setShowZapovnPolya(true);
    };

    const closeZapovnPolya = () => {
        setShowZapovnPolya(false);
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

    useEffect(() => {
        const scrollToTop = () => {
            window.scrollTo({
                top: 996,
                behavior: "smooth"
            });
        };

        scrollToTop();
    }, [currentPage]);
    const createCommentProject = async (e) => {
        if (!content || !rating) {
            openZapovnPolya();
            return;
        }
        if(rating<0 || rating>10){
            alert("Значення рейтингу повинне бути від 0 до 10.");
            return;
        }
        e.preventDefault();
        const comment = {
            content: content,
            rating: rating,
            event: {
                id: eventId
            },
            user: {
                id: viewer.id,
                login: viewer.login,
                role: viewer.role
            }

        };
        try {
            await axios.post(`http://localhost:8080/api/review/`, comment,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            closeModal()
        } catch (error) {
            console.error('Error adding event:', error);
        }
    };

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
            <div className="KorName"><a className="ownerideffect" href={`/profile/${user.id}`}>{user.lastName} {user.firstName}</a></div>



            {!isViewerMemberAssociation && <button onClick={() => handleJoin(association.id)} className="buttonEventOneSecond"><span className="textOnEventOneSecond">Приєднатись</span></button>}


            {!reviewExists && isViewerMemberEvent && <button onClick={openModal} className="buttonComment"><span className="textOnEventOneFirst">Comment</span></button>}
            {(user.id===viewer.id || viewer.role==="ROLE_ADMIN") && (
                <img onClick={() => openModalDelete(event.id)} className="trashEventOne" src="/images/3687412.png" alt="Trash" />
            )}
            <div className="mainTableComments">
                {reviews.map(review => {

                    if (review.rating === 10) {
                        imageUrl = '/images/icone-noire-violet.png';
                    } else if (review.rating >= 7 && review.rating <= 9) {
                        imageUrl = '/images/icone-noire-vert.png';
                    } else if (review.rating >= 4 && review.rating <= 6) {
                        imageUrl = '/images/icone-noire-jaune.png';
                    } else {
                        imageUrl = '/images/icone-noire-orange.png';
                    }

                    return (
                        <div key={review.id} className={'relativeDivComments'}>
                            <div className="loginComment"><a className="ownerideffect" href={`/profile/${review.user.id}`}>{review.user.login}</a></div>
                            <img className="avatarDefaultComment" src="/images/avatar_empty@2x.png" alt="" />
                            <div className="eventOneMainDateCreateComment">Опубліковано: {new Date(event.createdAt).toLocaleDateString('uk-UA')}</div>
                            <div className="profileDescBoxComment">
                                <div className="contentComment1">{review.content}</div>
                                {/* Используем imageUrl здесь */}
                                <img
                                    className="ratingPic"
                                    src={imageUrl}
                                    alt="rating"
                                />
                            </div>
                        </div>
                    );
                })}


                {reviews.length>0 &&(
                    <div className="container1">
                        {currentPage !== 0 && (
                            <img onClick={handlePrevPage} className="Butonsss12" alt="left" src="/images/free-icon-arrow-right-5889819.png"/>
                        )}
                        <span className="Pagesss1">{currentPage + 1} з {totalPages}</span>
                        {currentPage !== totalPages - 1 && (
                            <img onClick={handleNextPage} className="Butonsss22" alt="right" src="/images/free-icon-arrow-right-5889819.png"/>
                        )}
                    </div>)}
                {reviews.length===0 && (
                    <div className="nocommm">No comments yet</div>
                )}
            </div>

            {showModalDelete && (
                <div className="modal">
                    <div className="modal-content">
                        <p className="confirmation">Ви впевнені, що хочете видалити цей івент?</p>
                        <button onClick={() => handleDelete(idDeleted)}>Так</button>
                        <button onClick={closeModalDelete}>Ні</button>
                    </div>
                </div>
            )}

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
                    <div className="modal-contentComment">
                        <p className="confirmationEvent">Коментування</p>
                        <p className="descComment">Опис:</p>
                        <div>
                            <input
                                type="text"
                                id="content"
                                name="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                maxLength={194}
                                className="descriptionCommentInput"
                            />
                        </div>
                        <p className="descRatio">Рейтинг:</p>
                        <div>
                            <input
                                type="number"
                                id="rating"
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                                className="input7Comment"
                                min={0}
                                max={10}
                            />
                        </div>

                        <button className="buttonEventYesComment" onClick={createCommentProject}>Save</button>
                        <button className="buttonEventNoComment" onClick={closeModal}>Exit</button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Review;