import React, { useState } from "react";
import styles from "./index.module.css";
import NameAvatar from "../NameAvatar";
import Utils from "@/lib/utils";

const UserAvatar = ({ userDetails }) => {
    const [showImage, setShowImage] = useState(false);
    const toggleClickImage = (event) => {
        event.stopPropagation();
        setShowImage(!showImage);
    };
    return (
        <div className={styles.container}>
            {userDetails?.image ? <img onClick={toggleClickImage} src={userDetails.image} /> : <NameAvatar name={userDetails?.name || ""} />}
            <div>
                {userDetails?.name && <h3>{Utils.capitalizeEachWord(userDetails?.name) || ""}</h3>}
                {userDetails?.email && <p>{Utils.capitalizeEachWord(userDetails?.email) || ""}</p>}
            </div>
            {showImage && (
                <div onClick={toggleClickImage} className={styles.image_pop_up}>
                    <div>
                        <button onClick={toggleClickImage}>x</button>
                        <img onClick={(event) => event.stopPropagation()} src={`${process.env.REACT_APP_API_BASE_URL}/getprofileimage/${userDetails._id}`} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserAvatar;
