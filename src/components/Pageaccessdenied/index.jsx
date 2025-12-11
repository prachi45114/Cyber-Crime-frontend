import styles from "./index.module.css";
import svg from "../AddAssets/assets/pgn4.svg";

function Pageaccessdenied() {
    return (
        <div className={styles.page_wrapper}>
            <div className={styles.pgn_container}>
                <img src={svg} alt="page not found" className={styles.pgn_svg} />
                <div className={styles.pgn_box}>
                    <h1 className={styles.pgn_title}>403</h1>
                    <h2 className={styles.pgn_subtitle}>STOP HERE! YOU ARE FORBIDDEN</h2>
                    <p className={styles.pgn_text}>
                        Access to this page is restricted.Please check with the site admin if you think this is a mistake. But you can click the button below to go back to the homepage.
                    </p>
                    <button className={styles.pgn_button} onClick={() => (window.location.href = "/")}>
                        HOME
                    </button>
                </div>
            </div>
        </div>
    );
}
export default Pageaccessdenied;
