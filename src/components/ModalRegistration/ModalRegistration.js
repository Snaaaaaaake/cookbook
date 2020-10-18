import { useState, useContext, useEffect } from 'react';
import { connect } from 'react-redux';
import FirebaseContext from '../context/FirebaseContext';
import styles from './ModalRegistration.module.css';
import initialFormState from '../../constants/initialRegistrationFormState';

const ModalRegistration = (props) => {
    const firebaseService = useContext(FirebaseContext);
    const [ formState, setFormState ] = useState({...initialFormState});
    const { userState: { user, favorites } } = props;
    const {
        isOpened,
        currentForm,
        nameSignUp,
        emailSignUp,
        passwordSignUp,
        passwordRepeatSignUp,
        emailSignIn,
        passwordSignIn,
        isLoading,
        error,
    } = formState;

    useEffect(() => {
        if (user) {
            setFormState({...initialFormState, currentForm: 'profile' })
        } else {
            setFormState({...initialFormState })
        }
    }, [user])

    const fetchRequest = () => setFormState({...formState, isLoading: true});
    const fetchFailure = (error) => setFormState({...formState,  isLoading: false, error: error.message});
    
    // Обработчики сервиса
    const onSubmitSignUpHandler = (event) => {
        event.preventDefault();
        if (event.currentTarget.checkValidity()) {
            if (passwordSignUp !== passwordRepeatSignUp) {
                setFormState({...formState, error: "Пароли не совпадают!"});
            } else {
                fetchRequest();
                firebaseService.signUp(emailSignUp, passwordSignUp, nameSignUp)
                    .then(() => alert('Пользователь зарегистрирован, вход выполнен.'))    
                    .catch(fetchFailure)
            }
        } else {
            setFormState({...formState, error: "Проверьте правильность заполнения формы!"})
        }
    }
    const onSubmitSignInHandler = (event) => {
        event.preventDefault();
        if (event.currentTarget.checkValidity()) {
            fetchRequest()
            firebaseService.signIn(emailSignIn, passwordSignIn)
                .then(() => alert('Вход выполнен успешно.'))
                .catch(fetchFailure)
        } else {
            setFormState({...formState, error: "Проверьте правильность заполнения формы!"})
        }
    }
    const onSignOutHandler = () => {
        fetchRequest()
        firebaseService.signOut()
            .then(() => alert('Вы вышли из своего профиля'))
            .catch(fetchFailure)
    }

    // Обработчики формы
    const modalToggleHandler = () => {
        setFormState({
            ...initialFormState,
            isOpened: !isOpened,
            currentForm,
        });
    };
    const onChangeFormHandler = (event) => {
        setFormState({
            ...formState,
            [event.target.id]: event.target.value,
        })
    }
    const onChangeRadioHandler = (event) => {
        setFormState({
            ...initialFormState,
            isOpened: true,
            currentForm: event.target.value,
        })
    }

    // Компоненты форм
    const UserCard = () => <>
        <p className="card-text">Имя: { user.providerData[0].displayName }</p>
        <p className="card-text">Почта: { user.email }</p>
        <p className="card-text">Рецептов в избранном: { favorites.length }</p>
        <button type="button" disabled={isLoading} onClick={onSignOutHandler} className="btn btn-outline-primary" data-dismiss="modal">Выйти</button>
    </>;

    const changeFormForm =  <form>
        <fieldset disabled={isLoading}>
            <div className="custom-control custom-radio">
                <input onChange={onChangeRadioHandler} value='signInForm' type="radio" id="signInForm" checked={currentForm === 'signInForm'} className="custom-control-input" />
                <label className="custom-control-label" htmlFor="signInForm">Войти</label>
            </div>
            <div className="custom-control custom-radio">
                <input onChange={onChangeRadioHandler} value='signUpForm' type="radio" id="signUpForm" checked={currentForm === 'signUpForm'} name="customRadio" className="custom-control-input" />
                <label className="custom-control-label" htmlFor="signUpForm">Зарегистрироваться</label>
            </div>
        </fieldset>
    </form>;

    const signUpForm = <form onSubmit={onSubmitSignUpHandler} className="mt-3">
        <fieldset disabled={isLoading}>
            <div className="form-group">
                <label htmlFor="nameSignUp">Имя пользователя</label>
                <input onChange={onChangeFormHandler} value={nameSignUp} type="text" className="form-control" id="nameSignUp" pattern="[A-Za-z]*" minLength="2" maxLength="25" required/>
                <small className="form-text text-muted">Латинские буквы</small>
            </div>
            <div className="form-group">
                <label htmlFor="emailSignUp">Email</label>
                <input onChange={onChangeFormHandler} value={emailSignUp} type="email" className="form-control" id="emailSignUp" required/>
            </div>
            <div className="form-group">
                <label htmlFor="passwordSignUp">Пароль</label>
                <input onChange={onChangeFormHandler} value={passwordSignUp} type="password" className="form-control" id="passwordSignUp" minLength="6" required/>
                <small className="form-text text-muted">Минимум шесть символов</small>
            </div>
            <div className="form-group">
                <label htmlFor="passwordRepeatSignUp">Повторите пароль</label>
                <input onChange={onChangeFormHandler} value={passwordRepeatSignUp} type="password" className="form-control" id="passwordRepeatSignUp" required/>
            </div>
            <button type="submit" className="btn btn-primary">Зарегистрироваться</button>
        </fieldset>
    </form>;

    const signInForm = <form onSubmit={onSubmitSignInHandler} className="mt-3">
        <fieldset disabled={isLoading}>
            <div className="form-group">
                <label htmlFor="emailSignIn">Email</label>
                <input onChange={onChangeFormHandler} value={emailSignIn} type="email" className="form-control" id="emailSignIn" required/>
            </div>
            <div className="form-group">
                <label htmlFor="passwordSignIn">Пароль</label>
                <input onChange={onChangeFormHandler} value={passwordSignIn} type="password" className="form-control" id="passwordSignIn" minLength="6" required/>
            </div>
            <button type="submit" className="btn btn-primary">Войти</button>
        </fieldset>
    </form>;

    return (<>
        <button href="#" onClick={modalToggleHandler} className="btn btn-link btn-sm p-0" title="Зарегистрироваться или войти в уже существующий профиль">Аккаунт</button>
        { isOpened && 
            <div className={styles.wrapper}>

                    <div className="modal-dialog">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Аккаунт</h5>
                            <button type="button" onClick={modalToggleHandler} className="close" data-dismiss="modal" aria-label="Close">&times;</button>
                        </div>
                        <div className="modal-body">
                            { currentForm === "profile" && user ? <UserCard /> : changeFormForm}
                            { currentForm === "signUpForm" && signUpForm }
                            { currentForm === "signInForm" && signInForm }
                        </div>
                        <div className="modal-footer">
                            <div style={{color: "red"}} className="mb-2">{error}</div>
                            <button type="button" onClick={modalToggleHandler} className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                        </div>
                        </div>
                    </div>
                </div>

        }
    </>)
}

const mapStateToProps = (state) => ({
    userState: state.userState,
})

export default connect(mapStateToProps)(ModalRegistration);