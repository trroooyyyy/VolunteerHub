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

    const [showModalDeleteReview, setShowModalDeleteReview] = useState(false)
    const [idDeletedReview, setIdDeletedReview] = useState(0);

    const [showModalEdit, setShowModalEdit] = useState(false);

    const [idEdit, setIdEdit] = useState(0);
    const [contentEdit, setContentEdit] = useState('');
    const [ratingEdit, setRatingEdit] = useState(0);
    const [userForEdit, setUserForEdit] = useState({});
    const [eventForEdit, setEventForEdit] = useState({});


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


    const openModalEdit = (review) => {
        setIdEdit(review.id);
        setContentEdit(review.content);
        setRatingEdit(review.rating);
        setUserForEdit({id: review.user.id,
        login: review.user.login,
        role: review.user.role});
        setEventForEdit({
            id: review.event.id
        })
        setShowModalEdit(true);
    };

    const closeModalEdit = () => {
        setShowModalEdit(false);
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

    const openModalDeleteReview = (idDeletedReview) => {
        setShowModalDeleteReview(true);
        setIdDeletedReview(idDeletedReview)
    };

    const closeModalDeleteReview = () => {
        setShowModalDeleteReview(false);
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

    function handleDeleteReview(reviewId) {
        const deleteReview = async () => {
            try {
                const response = await axios.delete(`http://localhost:8080/api/review/${reviewId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log(response);
                if (reviews.length === 1 && currentPage > 0) {
                    setCurrentPage(currentPage - 1);
                }
                closeModalDeleteReview()
            } catch (error) {
                console.error('Помилка при видаленні коментаря:', error);
            }
        };

        deleteReview();
    }


    const handleEditReview = async (e) => {
        if (!contentEdit || !ratingEdit) {
            openZapovnPolya();
            return;
        }

        e.preventDefault();
        const reviewData = {
            id: idEdit,
            content: contentEdit,
            rating: ratingEdit,
            user: userForEdit,
            event: eventForEdit
        };
        try {
            await axios.put(`http://localhost:8080/api/review/${idEdit}`, reviewData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Editing super");
            closeModalEdit();
        } catch (error) {
            console.error('Error updating reviews:', error);
        }
    };

    const renderAvatar = (user) => {
        if (user.avatarUrl) {
            const base64Image = `data:image/jpeg;base64,${user.avatarUrl}`;
            return <img className="avatarDefaultComment" src={base64Image} alt="Avatar" />;
        } else {
            return <img className="avatarDefaultComment" src="/images/avatar_empty@2x.png" alt="Avatar" />;
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
                            {renderAvatar(user)}
                            <div className="eventOneMainDateCreateComment">Опубліковано: {new Date(event.createdAt).toLocaleDateString('uk-UA')}</div>
                            <div className="profileDescBoxComment">
                                <div className="contentComment1">{review.content}</div>
                                {}
                                <img
                                    className="ratingPic"
                                    src={imageUrl}
                                    alt="rating"
                                />
                            </div>
                            {(viewer.role==="ROLE_ADMIN" || viewer.id===review.user.id) && (
                                <div>
                                <img onClick={() => openModalEdit(review)} className="editComment" src="/images/free-icon-edit-tools-9781874.png" alt="" />
                                <img onClick={() => openModalDeleteReview(review.id)} className="deleteComment" src="/images/free-icon-delete-7104075.png" alt="" />
                                </div>
                            )}
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

            {showModalDeleteReview && (
            <div className="modal">
                <div className="modal-content">
                    <p className="confirmation">Ви впевнені, що хочете видалити цей коментар?</p>
                    <button onClick={() => handleDeleteReview(idDeletedReview)}>Так</button>
                    <button onClick={closeModalDeleteReview}>Ні</button>
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

            {showModalEdit && (
                <div className="modalEvent">
                    <div className="modal-contentComment">
                        <p className="confirmationEvent">Редагування</p>
                        <p className="descComment">Опис:</p>
                        <div>
                            <input
                                type="text"
                                id="content"
                                name="content"
                                value={contentEdit}
                                onChange={(e) => setContentEdit(e.target.value)}
                                maxLength={194}
                                className="descriptionCommentInput"
                            />
                        </div>
                        <p className="descRatio">Рейтинг:</p>
                        <div>
                            <input
                                type="number"
                                id="rating"
                                value={ratingEdit}
                                onChange={(e) => setRatingEdit(e.target.value)}
                                className="input7Comment"
                                min={0}
                                max={10}
                            />
                        </div>

                        <button className="buttonEventYesComment" onClick={handleEditReview}>Save</button>
                        <button className="buttonEventNoComment" onClick={closeModalEdit}>Exit</button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Review;