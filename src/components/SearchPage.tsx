import React from "react";
import axios from "axios";
import {connect} from "react-redux";
import {RootState} from "../store/store";

import * as styles from "../styles/searchpage.module.scss";

import Checkbox from "./CheckboxInput";
import {setSubmited, updateSearchArgs} from "../store/appSlice";

function SearchPage(props) {
    const checkboxesTemplate = [
        {disabled: false,   name: "maxFullness",            text: "Признак максимальной полноты"},
        {disabled: false,   name: "mention",                text: "Упоминания в бизнес-контексте"},
        {disabled: false,   name: "onlyMainRole",           text: "Главная роль в публикации"},
        {disabled: true,    name: "onlyWithRiskFactors",    text: "Публикации только с риск-факторами"},
        {disabled: true,    name: "includeTechNews",        text: "Включать технические новости рынков"},
        {disabled: false,   name: "excludeAnnouncements",   text: "Включать анонсы и календари"},
        {disabled: true,    name: "excludeDigests",         text: "Включать сводки новостей"},
    ]

    const [checkboxState, setCheckboxState] = React.useState(
        [true, true, true, false, false, true, false]
    )

    React.useEffect(() => {
        checkboxesTemplate.map(item => {
            props.updateSearchArgs({
                name: item.name,
                value: !item.disabled
            })
        })
    }, []);

    const checkboxEventHandler = event => {
        const index = event.target.value - 1;
        const result = checkboxState.slice();
        result[index] = !result[index];
        event.target.toggleAttribute("checked")
        setCheckboxState(result);
    }

    const submitBtn = React.useRef(null);
    const date_from = React.useRef(null);
    const date_to = React.useRef(null);
    const [validationFields, updateValidationFieldsState] = React.useState({
        inn: false,
        documents_count: false,
        date: false,
    })
    const validateHandler = event => {
        const updatedValueState = props.updateSearchArgs({
            name: event.target.name,
            value: event.target.value.replace(/ /g, "")
        }).payload
        if (updatedValueState.name == "inn") {
            try {
                const inn = updatedValueState.value;
                if (!/^[0-9]+$/.test(inn)) throw ""; // check for non numbers
                if (inn.length != 10) return; // check for length

                const numCoefficient = [2, 4, 10, 3, 5, 9, 4, 6, 8];
                let sumResult = 0;
                inn.split("").map((value, index) => {
                    if (index != 9) sumResult += value * numCoefficient[index];
                })
                sumResult %= 11;
                if (inn[9] != sumResult) throw "";

                updateValidationFieldsState({
                    ...validationFields,
                    [updatedValueState.name]: true
                })
                event.target.style.borderColor = "gray";
                event.target.parentNode.children[2].style.visibility = "hidden";
            } catch (e) {
                updateValidationFieldsState({
                    ...validationFields,
                    [updatedValueState.name]: false
                })
                event.target.style.borderColor = "red";
                event.target.parentNode.children[2].style.visibility = "visible";
            }
        } else if (updatedValueState.name == "documents_count") {
            try {
                const docs_count = updatedValueState.value;
                if (!/^[0-9]+$/.test(docs_count)) throw ""; // check for non numbers
                if (docs_count < 1 || docs_count > 1000) throw "";

                updateValidationFieldsState({
                    ...validationFields,
                    [updatedValueState.name]: true
                })
                event.target.style.borderColor = "gray";
                event.target.parentNode.children[2].style.visibility = "hidden";
            } catch (e) {
                updateValidationFieldsState({
                    ...validationFields,
                    [updatedValueState.name]: false
                })
                event.target.style.borderColor = "red";
                event.target.parentNode.children[2].style.visibility = "visible";
            }
        } else if (updatedValueState.name.startsWith("date-")) {
            const currentDate = new Date().toISOString();
            try {
                date_from.current.style.borderColor = "gray";
                date_to.current.style.borderColor = "gray";
                event.target.parentNode.parentNode.parentNode.lastChild.style.visibility = "hidden";

                if (!date_from.current.value.length) return;
                const dateFromDate = new Date(date_from.current.value).toISOString();
                if (dateFromDate > currentDate) throw "from";

                if (!date_to.current.value.length) return;
                const dateToDate = new Date(date_to.current.value).toISOString();
                if (dateToDate > currentDate) throw "to";

                if (dateFromDate > dateToDate) throw "both";

                updateValidationFieldsState({
                    ...validationFields,
                    date: true
                })
            } catch (e) {
                updateValidationFieldsState({
                    ...validationFields,
                    date: false
                })
                if (e == "from")        date_from.current.style.borderColor = "red";

                else if (e == "to")     date_to.current.style.borderColor = "red";

                else if (e == "both") { date_from.current.style.borderColor = "red";
                                        date_to.current.style.borderColor = "red"; }
                event.target.parentNode.parentNode.parentNode.lastChild.style.visibility = "visible";
            }
        }
        console.log(validationFields)
    }

    const submitEventHandler = (event) => {
        event.preventDefault();
        props.setSubmited();
    }

    return (
        <main className={styles.main}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <p className={styles.title}>Найдите необходимые</p>
                    <p className={styles.title}>данные в пару кликов</p>
                    <p className={styles.description}>Задайте параметры поиска.</p>
                    <p className={styles.description}>Чем больше вы заполните, тем точнее поиск</p>
                </div>
                {props.windowWidth < 1000 ?
                    <div className={styles["mobile-file"]}>
                        <img alt={"folders-photo"} src={require("../img/Document.svg")} />
                    </div> :""}
                <form onSubmit={submitEventHandler}>
                    <div className={styles["input-field"]}>
                        <p className={styles["input-header"]}>Инн компании<sup>*</sup></p>
                        <input
                            type={"text"}
                            placeholder={"10 цифр"}
                            name={"inn"}
                            required={true}
                            onChange={validateHandler}
                        />
                        <p className={styles["error-field"]}>Введите корректные данные</p>
                    </div>

                    <div className={styles["input-field"]}>
                        <p className={styles["input-header"]}>Тональность</p>
                        <select name={"tonality"}>
                            <option value={"any"}>Любая</option>
                            <option value={"positive"}>Позитивная</option>
                            <option value={"negative"}>Негативная</option>
                        </select>
                    </div>

                    <div className={styles["input-field"]}>
                        <p className={styles["input-header"]}>Количество документов в выдаче<sup>*</sup></p>
                        <input
                            type={"text"}
                            placeholder={"От 1 до 1000"}
                            name={"documents_count"}
                            required={true}
                            onChange={validateHandler}
                        />
                        <p className={styles["error-field"]}>Обязательное поле</p>
                    </div>

                    <div className={`${styles["input-field"]} ${styles["date-field"]}`}>
                        <p className={styles["input-header"]}>Диапазон поиска<sup>*</sup></p>
                        <div className={styles["date-input-container"]}>
                            <div className={styles["pseudo-container"]}>
                                <input
                                    type={"text"}
                                    placeholder={"Дата начала"}
                                    name={"date-from"}
                                    onFocus={(e) => {
                                        e.target.type = "date";
                                        e.target.showPicker();
                                    }}
                                    onBlur={(e) => e.target.type = "text"}
                                    required={true}
                                    ref={date_from}
                                    onChange={validateHandler}
                                />
                            </div>
                            <div className={styles["pseudo-container"]}>
                                <input
                                    type={"text"}
                                    placeholder={"Дата конца"}
                                    name={"date-to"}
                                    onFocus={(e) => {
                                        e.target.type = "date";
                                        e.target.showPicker();
                                    }}
                                    onBlur={(e) => e.target.type = "text"}
                                    required={true}
                                    ref={date_to}
                                    onChange={validateHandler}
                                />
                            </div>
                        </div>
                        <p className={styles["error-field"]}>Введите корректные данные</p>
                    </div>

                    <div className={`${styles["input-field"]} ${styles["checkbox-field"]}`}>
                        {checkboxesTemplate.map((checkbox, index) =>
                            <Checkbox
                                key={index}
                                stateValue={checkboxState}
                                stateChangeFunc={checkboxEventHandler}
                                name={checkbox.name}
                                index={index + 1}
                                disabled={checkbox.disabled}
                                text={checkbox.text}
                            />
                        )}
                    </div>
                    <div className={styles["submit-field"]}>
                        <button
                            disabled={JSON.stringify(validationFields).includes("false")}
                            ref={submitBtn}
                        >
                            Поиск
                        </button>
                        <p>* обязательные к заполнению поля</p>
                    </div>
                </form>
            </div>
            <div className={styles["images-placeholder"]}>
                {props.windowWidth > 1000 ?
                <div className={styles["filesImg-container"]}>
                    <img alt={"document-photo"} src={require("../img/Document.svg")} />
                    <img alt={"folders-photo"} src={require("../img/Folders.svg")} />
                </div>:""}
                <div className={styles["search-img"]}>
                    <img alt={"search-photo"} src={require("../img/search.svg")} />
                </div>
            </div>
        </main>
    )
}

export default connect(
    (state: RootState) => ({
        searchFields: state.app.searchFields,
        windowWidth: state.app.windowWidth
    }),
    {updateSearchArgs, setSubmited}
)(SearchPage)