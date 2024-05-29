import React from "react";

import * as styles from "../styles/header.module.scss";
import {Link, useLocation} from "react-router-dom";
import {connect} from "react-redux";

import {updateProfile, setUsesCompany} from "../store/userSlice";
import {RootState} from "../store/store";
import axios from "axios";

function Header(props) {
    const [isMenuOpened, toggleMenu] = React.useState(false);
    const location = useLocation()

    React.useEffect(() => {
        toggleMenu(false);
    }, [location])

    const logoutHandler = () => {
        props.updateProfile(null);
        localStorage.removeItem("token");
        localStorage.removeItem("expire");
        localStorage.removeItem("username");
        localStorage.removeItem("avatar");
        window.location.replace("/");
    }

    if (props.user.token.value.length && !props.user.companyLimit) {
        const apiLink = "https://gateway.scan-interfax.ru/api/v1/account/info"
        axios.get(apiLink, {
            headers: {
                "Authorization": `Bearer ${props.user.token.value}`
            }
        })
        .then(response => {
            props.setUsesCompany({
                usedCompanyCount: response.data.eventFiltersInfo.usedCompanyCount,
                companyLimit: response.data.eventFiltersInfo.companyLimit
            })
        }).catch(response => {
            console.log(response);
        })
    }

    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                {!isMenuOpened ?
                <img alt={"logo"} src={require("../img/logo-colored.png")}/>:
                <img alt={"logo"} src={require("../img/logo-white.png")}/>}
            </div>
            {props.user.token.value.length ?
                <div className={styles["uses-block"]}>
                    {!props.user.companyLimit ?
                        <img alt={"Loading ico"} src={require("../img/loader-ico.png")} />:
                        <>
                            <div className={styles["title-container"]}>
                                <p>Использовано компаний</p>
                                <p>Лимит по компаниям</p>
                            </div>
                            <div className={styles["counts-container"]}>
                                <p>{props.user.usedCompanyCount}</p>
                                <p>{props.user.companyLimit}</p>
                            </div>
                        </>
                    }
                </div>
                :""}
            {props.windowWidth > 1000 ?
                <>
                    <nav className={styles.navigation}>
                        <Link to={"/"}>Главная</Link>
                        <Link to={"/"}>Тарифы</Link>
                        <Link to={"/"}>FAQ</Link>
                    </nav>
                    <div className={styles["user-field"]}>
                        {props.user.token.value.length ?
                            <>
                                <div className={styles["info-block"]}>
                                    <p>{props.user.username}</p>
                                    <button onClick={logoutHandler}>Выйти</button>
                                </div>
                                <div className={styles["avatar-placeholder"]}>
                                    <img alt={"avatar"} src={require("../img/avatar-placeholder.png")}/>
                                </div>
                            </> :
                            <>
                                <Link to={"/login"} className={styles["btn-signup"]}>Зарегистрироваться</Link>
                                <Link to={"/login"} className={styles["btn-login"]}>Войти</Link>
                            </>
                        }
                    </div>
                </>:
                <>
                    <div className={`${styles["btn-menu"]} ${isMenuOpened ? styles["opened"] : ""}`}
                         onClick={() => toggleMenu(!isMenuOpened)}>
                        <div className={`${styles["btn-part"]} ${styles["top-part"]}`}></div>
                        <div className={`${styles["btn-part"]} ${styles["mid-part"]}`}></div>
                        <div className={`${styles["btn-part"]} ${styles["bot-part"]}`}></div>
                    </div>
                    <menu>
                        <div className={styles["menu-container"]}>
                            <div className={styles["menu-content"]}>
                                <nav className={styles.navigation}>
                                    <Link to={"/"}>Главная</Link>
                                    <Link to={"/"}>Тарифы</Link>
                                    <Link to={"/"}>FAQ</Link>
                                </nav>
                                <div className={styles["auth-btns"]}>
                                    <Link to={"/login"} className={styles["btn-signup"]}>Зарегистрироваться</Link>
                                    <Link to={"/login"} className={styles["btn-login"]}>Войти</Link>
                                </div>
                            </div>
                        </div>
                    </menu>
                </>}
        </header>
    )
}

export default connect(
    (state: RootState) => ({
        user: state.user,
        windowWidth: state.app.windowWidth,
    }),
    {updateProfile, setUsesCompany}
)(Header);