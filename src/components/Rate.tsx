import React from "react";

import * as styles from "../styles/rate.module.scss";

function Rate(props) {
    return (
        <div className={`${styles.card} ${styles["card-"+props.cardNum]} ` + (props.selected ? styles["selected-plan"] : "")}>
            <div className={styles.header}>
                <div className={styles.title}>
                    <span>{props.data.title}</span>
                </div>
                <div className={styles.description}>
                    <span>{props.data.description}</span>
                </div>
            </div>
            {props.selected ?
                <div className={styles.selected}>
                    <span>Текущий тариф</span>
                </div>
                :""}
            <div className={styles["price-block"]}>
                <span className={styles["new-price"]}><strong>{props.data.newPrice}</strong></span>
                <span className={styles["old-price"]}>{props.data.oldPrice}</span>
                <span>{props.data.priceDescription}</span>
            </div>
            <p>В тариф входит:</p>
            <div className={styles["list-block"]}>
                <ul>
                    {props.data.points.map((element, index) =>
                        <li key={index}>{element}</li>
                    )}
                </ul>
            </div>
            {props.selected ?
                <button>Перейти в личный кабинет</button>:
                <button>Подробнее</button>}
        </div>
    )
}

export default Rate;