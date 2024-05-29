import React from "react";
import Carousel from "react-grid-carousel";

import * as styles from "../styles/mainpage.module.scss";

import Rates from "./Rates";
import Rate from "./Rate";
import {RootState} from "../store/store";
import {connect} from "react-redux";

function MainPage(props) {
    return (
        <main className={styles.main}>
            <div className={styles['short-info']}>
                <div className={styles['text-container']}>
                    <p className={styles.title}>
                        СЕРВИС ПО ПОИСКУ<br />
                        ПУБЛИКАЦИЙ <br />
                        О КОМПАНИИ <br />
                        ПО ЕГО ИНН
                    </p>
                    <p className={styles.description}>
                        Комплексный анализ публикаций, получение данных <br />
                        в формате PDF на электронную почту
                    </p>
                    <button onClick={() => window.location.replace("/search")}>Запросить данные</button>
                </div>
            </div>

            <div className={styles["why-to-use-block"]}>
                <div className={styles.title}>
                    <span>ПОЧЕМУ ИМЕННО МЫ</span>
                </div>
                <Carousel
                    cols={props.windowWidth < 1000 ? 1 : 3}
                    // cols={3}
                    rows={1}
                    gap={10}
                    loop
                >
                    <Carousel.Item>
                        <div className={styles["carousel-item"]}>
                            <img alt={"ico"} src={require("../img/carousel-ico1.png")} />
                            <p>
                                Высокая и оперативная скорость обработки заявки
                            </p>
                        </div>
                    </Carousel.Item>
                    <Carousel.Item>
                        <div className={styles["carousel-item"]}>
                            <img alt={"ico"} src={require("../img/carousel-ico2.png")} />
                            <p>
                                Огромная комплексная база данных, обеспечивающая объективный ответ на запрос
                            </p>
                        </div>
                    </Carousel.Item>
                    <Carousel.Item>
                        <div className={styles["carousel-item"]}>
                            <img alt={"ico"} src={require("../img/carousel-ico3.png")} />
                            <p>
                                Защита конфеденциальных сведений, не подлежащих разглашению по федеральному законадательству
                            </p>
                        </div>
                    </Carousel.Item>
                </Carousel>
                <div className={styles["img-placeholder"]}>
                </div>
            </div>
            <div className={styles.rates}>
                <div className={styles.title}>
                    <span>НАШИ ТАРИФЫ</span>
                </div>
                <Rates>
                    <Rate selected data={{
                        title: "Beginner",
                        description: "Для небольшого исследования",
                        newPrice: "799 ₽",
                        oldPrice: "1 200 ₽",
                        priceDescription: "или 150 ₽/мес. при рассрочке на 24 мес.",
                        points: [
                            "Безлимитная история запросов",
                            "Безопасная сделка",
                            "Поддержка 24/7"
                        ],
                    }} />
                    <Rate data={{
                        title: "Pro",
                        description: "Для HR и фрилансеров",
                        newPrice: "1 299 ₽",
                        oldPrice: "2 600 ₽",
                        priceDescription: "или 279 ₽/мес. при рассрочке на 24 мес.",
                        points: [
                            "Все пункты тарифа Beginner",
                            "Экспорт истории",
                            "Рекомендации по приоритетам"
                        ],
                    }} />
                    <Rate data={{
                        title: "Business",
                        description: "Для корпоративных клиентов",
                        newPrice: "2 379 ₽",
                        oldPrice: "3 700 ₽",
                        priceDescription: "",
                        points: [
                            "Все пункты тарифа Business",
                            "Безлимитное количество запросов",
                            "Приоритетная поддержка"
                        ],
                    }} />
                </Rates>
            </div>
        </main>
    )
}

export default connect(
    (state: RootState) => ({
        windowWidth: state.app.windowWidth
    })
)(MainPage);