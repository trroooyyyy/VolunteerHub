import React from 'react';

const AdditionMenu = () => {
    return (
        <div>
            <div className="eventsBar"></div>
            <div className="associationsBar"></div>
            <div className="usersBar"></div>
            <div className="arrowBar"> <img className="arrow" src="/images/arrow.png" alt="arrow" /></div>
            <div className="eventsText">Заходи</div>
            <div className="associationsText">Спілки</div>
            <div className="usersText">Користувачі</div>

        </div>
    );
};

export default AdditionMenu;