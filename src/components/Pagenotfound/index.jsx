import styles from "./index.module.css";
import svg from "../AddAssets/assets/pgn1.svg";

function Pagenotfound() {
  return (
    <div className={styles.pgn_container}>
      <img src={svg} alt="page not found" className={styles.pgn_svg} />
      <div className={styles.pgn_box}>
        <h1 className={styles.pgn_title}>404</h1>
        <h2 className={styles.pgn_subtitle}>UH OH! You're lost.</h2>
        <p className={styles.pgn_text}>
          The page you are looking for does not exist. How you got here is a
          mystery. But you can click the button below to go back to the
          homepage.
        </p>
        <button className={styles.pgn_button}>Home</button>
      </div>
    </div>
  );
}
export default Pagenotfound;
