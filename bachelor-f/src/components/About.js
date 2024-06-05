import React from 'react';

const About = () => {
    return (
        <div>
            <div className="aboutP"></div>
            <div className="aboutT">Про VolunteerHub</div>
            <div className="aboutUs"><span style={{ fontSize: '19px', fontFamily: 'Montserrat B,sans-serif', fontWeight: '900' }}>Ласкаво просимо до VolunteerHub!</span><br/><br/>

                Ми - це онлайн платформа для волонтерів, де ви можете знайти вдосконалення для своєї волонтерської діяльності, обмінюватися досвідом та ідеями, а також знаходити нові можливості для волонтерства.<br/><br/>

                У VolunteerHub ми створюємо сприятливе середовище для спілкування та взаємодії між волонтерами різного досвіду та інтересів. Тут ви можете обговорювати теми, які вам цікаві, ділитися власними успіхами та викликами, а також знаходити поради та підтримку від інших членів спільноти.<br/><br/>

                Наша платформа відкрита для всіх, хто цікавиться волонтерством і хоче зробити світ кращим місцем. Незалежно від того, чи ви новачок у волонтерстві, чи вже маєте багаторічний досвід, у нас є місце для вас!<br/><br/>

                Приєднуйтесь до VolunteerHub, долучайтеся до обговорень, знаходьте інспірацію та спільників по ідеях, і разом ми зможемо досягти більшого і покращити світ навколо нас!<br/><br/>

                <a href={"/about-service"}><span style={{ color: "#FF0000", fontWeight: '900'}}>Читати більше →</span></a></div>
            <img className="aboutP2" src="/images/5-Organizations-Offering-Excellent-Volunteer-Opportunities-for-College-Students.jpg" alt="" />
        </div>
    );
};

export default About;