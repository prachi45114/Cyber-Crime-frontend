import React from "react";
import styles from "./index.module.css";

const CircularProgressBar = ({ progress, color }) => {
    const radius = 20;
    const strokeWidth = 3.2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;
  
    return (
      <div className={styles.progress_circle_container}>
         {/* {` sdfs ${styles.progress_circle_foreground}_${color}`} */}
        <svg
          className={styles.progress_circle}
          width="43.2"
          height="43.2"
          viewBox="0 0 43.2 43.2"
          style={{ transform: 'rotate(-90deg)' }}
        >
         
          <circle
            className={styles.progress_circle_background}
            cx="50%"
            cy="50%"
            r={radius}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            className={`${styles[`progress_circle_foreground_${color}`]}`}
            cx="50%"
            cy="50%"
            r={radius}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <div className={styles.progress_text}>{progress}%</div>
      </div>
    );
  };
  
  export default CircularProgressBar;
  