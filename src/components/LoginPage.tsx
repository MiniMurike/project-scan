import React from "react";
import axios from "axios";

import * as styles from "../styles/loginpage.module.scss";
import {connect} from "react-redux";

import {RootState} from "../store/store"
import {updateProfile} from "../store/userSlice";

function LoginOption(props) {
    const [loginData, updateData] = React.useState({
        login: "",
        password: "",
    })
    const loginRegexp = /(^((\+7)|8)\s?((\(\d{3}\))|(\d{3}))\s?\d{3}([\s\-]?\d{2}){2}$)|(^[A-Za-z_\-\d]{4,}$)/
    const loginErrorField = React.useRef(null);
    const passwordErrorField = React.useRef(null);
    const btn_submit = React.useRef(null);

    const inputUpdateHandler = event => {
        const {name, value} = event.target;
        if (name == "login") {
            updateData({
                ...loginData,
                login: value,
            })
        } else if (name == "password") {
            updateData({
                ...loginData,
                password: value,
            })
        }
    }

    React.useEffect(() => {
        if (loginData.login) {
            if (!loginRegexp.test(loginData.login)) {
                loginErrorField.current.children[2].style.visibility = 'visible';
                loginErrorField.current.children[1].style.borderColor = 'red';
            } else {
                loginErrorField.current.children[2].style.visibility = 'hidden';
                loginErrorField.current.children[1].style.borderColor = 'gray';
            }
            passwordErrorField.current.children[2].style.visibility = 'hidden';
            passwordErrorField.current.children[1].style.borderColor = 'gray';
        }

        btn_submit.current.disabled = !(loginRegexp.test(loginData.login) &&
            loginData.password.length >= 5)
    }, [loginData]);

    React.useEffect(() => {
        btn_submit.current.disabled = true;
    }, []);

    const updateUserData = (data) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('expire', data.expire);
        // some api request to get username and avatar but instead use login and avatar placeholder
        localStorage.setItem('username', data.username);
        localStorage.setItem('avatar', "../img/avatar-placeholder.png");
        console.log(props)
        props.updateProfile({
            token: {
                value: data.token,
                expire: data.expire
            },
            username: data.username,
            avatar: "../img/avatar-placeholder.png"
        })
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const apiLink = "https://gateway.scan-interfax.ru/api/v1/account/login"
        axios.post(apiLink, {
            "login": loginData.login,
            "password": loginData.password,
        }).then(response => {
            if (response.status == 200) {
                updateUserData({
                    token: response.data.accessToken,
                    expire: response.data.expire,
                    username: loginData.login
                })
                window.location.replace("/search");
            }
        }).catch(response => {
            passwordErrorField.current.children[2].style.visibility = 'visible';
            passwordErrorField.current.children[1].style.borderColor = 'red';
            btn_submit.current.disabled = true;

            console.log("Error: " + response);
            console.log(response);
        })
    }

    return (
        <form onSubmit={handleSubmit} method={"post"}>
            <div className={styles["data-field"]} ref={loginErrorField}>
                <p>Логин или номер телефона:</p>
                <input
                    type={"text"}
                    name={"login"}
                    placeholder={"+7 912 653 21 42"}
                    onChange={inputUpdateHandler}
                />
                <p className={styles["error-msg-handler"]}>Введите корректные данные</p>
            </div>
            <div className={styles["data-field"]} ref={passwordErrorField}>
                <p>Пароль:</p>
                <input
                    type={"password"}
                    name={"password"}
                    placeholder={"*****"}
                    onChange={inputUpdateHandler}
                />
                <p className={styles["error-msg-handler"]}>Неправильный пароль</p>
            </div>
            <button type={"submit"} disabled={true} ref={btn_submit}>Войти</button>
            <div className={styles["recover-pass"]}>
                <span><a href={"#"}>Восстановить пароль</a></span>
            </div>
            <div className={styles["alt-login-container"]}>
                <p>Войти через:</p>
                <div className={styles["alt-login"]}>
                    <button className={styles["btn-google"]}></button>
                    <button className={styles["btn-yandex"]}></button>
                    <button className={styles["btn-facebook"]}></button>
                </div>
            </div>
        </form>
    )
}


function SignupOption() {
    return (
        <form>
            <div className={styles["data-field"]}>
                <p>Логин:</p>
                <input type={"text"} />
            </div>
            <div className={styles["data-field"]}>
                <p>Почта:</p>
                <input
                    type={"email"}
                    pattern={"^\w+@.*\.\w{2,}$"}
                />
            </div>
            <div className={styles["data-field"]}>
                <p>Телефон:</p>
                <input
                    type={"tel"}
                    pattern={"^((\\+7)|(8))\\s?((\\(\\d{3}\\))|(\\d{3}))\\s?\\d{3}([\\s\\-]?\\d{2}){2}$"}
                />
            </div>
            <div className={styles["data-field"]}>
                <p>Пароль:</p>
                <input type={"password"} />
            </div>
            <button type={"submit"} disabled={true}>Войти</button>
        </form>
    )
}

function LoginPage() {
    const [optionType, setOption] = React.useState("login");
    return (
        <main className={styles.main}>
            <div className={styles.title}>
                <span>ДЛЯ ОФОРМЛЕНИЯ ПОДПИСКИ</span>
                <span>НА ТАРИФ, НЕОБХОДИМО</span>
                <span>АВТОРИЗОВАТЬСЯ.</span>
            </div>
            <div className={styles["login-block"]}>
                <div className={styles["switch-type-block"]}>
                    <label>
                        <div className={styles["btn-container"]}>
                            <input
                                type={"radio"}
                                name={"type"}
                                id={"radio-login"}
                                onChange={() => setOption("login")}
                                checked={optionType == "login"}
                            />
                            <span>Войти</span>
                        </div>
                    </label>
                    <label>
                        <div className={styles["btn-container"]}>
                            <input
                                type={"radio"}
                                name={"type"}
                                id={"radio-signup"}
                                onChange={() => setOption("signup")}
                                checked={optionType == "signup"}
                            />
                            <span>Зарегистрироваться</span>
                        </div>
                    </label>
                </div>
                <div className={styles.content}>
                    {optionType == "login" ? <LoginOptionContainer /> : <SignupOption />}
                </div>
            </div>
            <div className={styles["img-placeholder"]}>
                <img alt={"loginpage-photo"} src={require("../img/login-img.svg")} />
            </div>
        </main>
    )
}

const LoginOptionContainer = connect(
    (state: RootState) => ({
        user: state.user
    }),
    {updateProfile}
)(LoginOption)

// export default connect(
//     (state: RootState) => ({
//         user: state.user
//     }),
//     {updateProfile}
// )(LoginPage);

export default LoginPage