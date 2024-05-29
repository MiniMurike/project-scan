import React from "react";
import {RootState} from "../store/store";
import {connect} from "react-redux";

import * as styles from "../styles/document.module.scss";

function Document(props) {
    return (
        <div className={styles.item}>
            <div className={styles.source}>
                <p className={styles.date}>{new Date(props.data.issueDate).toLocaleString().split(",")[0]}</p>
                <p className={styles.link}><a href={props.data.url}>{props.data.source.name}</a></p>
            </div>
            <div className={styles.title}><strong>{props.data.title.text}</strong></div>
            {props.data.attributes.isTechNews ?
                <div className={styles.category}>Технические новости</div> :""}
            {props.data.attributes.isAnnouncement ?
                <div className={styles.category}>Анонсы</div> :""}
            {props.data.attributes.isDigest ?
                <div className={styles.category}>Дайджест</div> :""}

            {/*А текст вообще есть?!?!?!*/}
            <div>{props.data.content.text}</div>

            <div className={styles.footer}>
                <button onClick={() => window.location.replace(props.data.url)}>Читать в источнике</button>
                <p>{props.data.attributes.wordCount} слова</p>
            </div>
        </div>
    )
}

export default connect(
    (state: RootState) => ({
        app: state.app
    })
)(Document)