import React from "react";
import "./Contact.css";
import CornerTexts from "../CornerTexts/CornerTexts";

const Contact = () => {

    return (
        <>
            <div className="container-contact">
                <div className="contact-details">
                    <div className="contact-gradient" />
                    <div className="contact-desc">
                        <div className="desc-one">
                            <p className="desc-title">DESCRIPTION</p>
                            <p>Artwork projection for the Denver Theatre District displayed on the Daniels & Ficher Tower, a historic landmark in Denver, Colorado.</p>
                        </div>
                        <div className="desc-two">
                            <p className="desc-title">DESCRIPTION</p>
                            <p>Artwork projection for the Denver Theatre District displayed on the Daniels & Ficher Tower, a historic landmark in Denver, Colorado.</p>
                        </div>
                    </div>
                </div>
            </div>
            <CornerTexts />
        </>
    )
}

export default Contact