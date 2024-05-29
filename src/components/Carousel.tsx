import React from "react";
import {RootState} from "../store/store";
import {connect} from "react-redux";

import * as styles from "../styles/carousel.module.scss";

function Carousel({children, ...props}) {
    const [carouselItems, setCarouselItems] = React.useState([])
    const [itemIndex, changeIndex] = React.useState(0)

    React.useEffect(() => {
        if (!carouselItems.length) setCarouselItems(children);
    }, [])

    const scrollEventHandler = (event) => {
        const dataBlock = document.getElementsByClassName(styles.data)[0] as HTMLDivElement;
        const direction = event.target.attributes["data-direction"].value;
        if (props.windowWidth < 1000) {
            if (direction == "left") {
                if (itemIndex - 1 < 0) return;
                changeIndex(itemIndex - 1);
            } else if (direction == "right") {
                if (itemIndex + 1 >= carouselItems.length) return;
                changeIndex(itemIndex + 1)
            }
        } else {
            const intervalId = setInterval(() => {
                if (direction == "left") {
                    dataBlock.scrollLeft -= 15
                } else if (direction == "right") {
                    dataBlock.scrollLeft += 15
                }
            }, 10)
            setTimeout(() => clearInterval(intervalId), 100);
        }
    }
    return (
        <div className={styles.carousel}>
            <div className={`${styles["btn-container"]} ${styles["scroll-left"]}`}>
                <div className={styles.btn} onClick={scrollEventHandler} data-direction={"left"}></div>
            </div>
            <div className={styles.content}>
                <div className={styles.header}>
                    <p>Период</p>
                    <p>Всего</p>
                    <p>Риски</p>
                </div>
                <div className={styles.data}>
                    {props.windowWidth < 1000 ?
                        carouselItems[itemIndex]:
                        children
                    }
                </div>
            </div>
            <div className={`${styles["btn-container"]} ${styles["scroll-right"]}`}>
                <div className={styles.btn} onClick={scrollEventHandler} data-direction={"right"}></div>
            </div>
        </div>
    )
}

Carousel.Item = function Item({data, divider}) {
    return (
        <>
            <div className={styles["data-item"]}>
                <p>{new Date(data.date).toLocaleString().split(",")[0]}</p>
                <p>{data.totalDocuments}</p>
                <p>{data.riskFactors}</p>
            </div>
            {divider ?
                <div className={styles.divider}>&nbsp;</div>:""
            }
        </>
    )
}

export default connect(
    (state: RootState) => ({
        app: state.app,
        windowWidth: state.app.windowWidth,
    })
)(Carousel);