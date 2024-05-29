import React, {cloneElement, Children} from "react";

import * as styles from "../styles/rates.module.scss";

function Rates({children}) {
    return (
        <div className={styles.plans}>
            {Children.map(children, (child, index) =>
                cloneElement(child, {
                    cardNum: index + 1
                })
            )}
        </div>
    )
}

export default Rates;