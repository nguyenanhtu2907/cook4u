import React from 'react';

function Step({ step, index }) {
    return (
        <div>
            <li className="post-page--paper--steps__list__item">
                <div className="post-page--paper--steps__list__item__number">
                    <span>{index}</span>
                </div>
                <div className="post-page--paper--steps__list__item__content">
                    <div className="post-page--paper--steps__list__item__content__text">
                        {step.text}
                    </div>
                    <div className="post-page--paper--steps__list__item__content__images">
                        {step.images.map((image, index)=>(
                            <div key={index} className="post-page--paper--steps__list__item__content__images__image">
                                <img src={image.imageUrl} key={index} alt="" />
                            </div>
                        ))}
                    </div>

                </div>
            </li>
        </div>
    );
}

export default Step;