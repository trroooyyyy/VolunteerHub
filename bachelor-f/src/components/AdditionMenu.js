import React from 'react';

const AdditionMenu = () => {
    const handleRedirectEvents = () => {
        window.location.href = `http://localhost:3000/all-events`;
    };
    const handleRedirectAssociations = () => {
        window.location.href = `http://localhost:3000/associations`;
    };
    const handleRedirectUsers = () => {
        window.location.href = `http://localhost:3000/users`;
    };
    const handleScrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    return (
        <div>
            <div className="arrowBar" onClick={handleScrollToTop}> <img className="arrow" src="/images/arrow.png" alt="arrow" /></div>
            <button className="buttonEventsText" onClick={handleRedirectEvents}><span className="eventsText">Заходи</span></button>
            <button className="buttonAssociationsText" onClick={handleRedirectAssociations}><span className="associationsText">Спілки</span></button>
            <button className="buttonUsersText" onClick={handleRedirectUsers}><span className="usersText">Користувачі</span></button>

        </div>
    );
};

export default AdditionMenu;
