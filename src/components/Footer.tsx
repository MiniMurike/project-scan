import React from "react";

import * as styles from "../styles/footer.module.scss";

function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.logo}>
                <img alt={"logo"} src={require("../img/logo-white.png")} />
            </div>
            <div className={styles.info}>
                <div className={styles.address}>
                    <span>
                        г. Москва, Цветной б-р, 40
                    </span>
                    <span>
                        +7 495 771 21 11
                    </span>
                    <span>
                        info@skan.ru
                    </span>
                </div>
                <div className={styles.copyright}>Copyright. 2022</div>
            </div>
        </footer>
    )
}

export default Footer
