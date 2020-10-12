import { useContext } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import FirebaseContext from '../context/FirebaseContext';

const FavoriteButton = (props) => {
    const firebaseService = useContext(FirebaseContext);
    const { mealId, userState: {  user, favorites } } = props;

    const addToFavoritesHandler = () => {
        firebaseService.addToFavorites(mealId);
    }

    const removeFromFavoritesHandler = () => {
        firebaseService.removeFromFavorites(mealId)
    }

    return (
        <div> { user
            ? favorites.some(item => item === mealId) ?
                <button onClick={removeFromFavoritesHandler} className="btn btn-link px-0">Удалить из избранного</button> :
                <button onClick={addToFavoritesHandler} className="btn btn-link px-0">Добавить в избранное</button>
            : <p className="card-text">Войдите в аккаунт, чтобы добавлять блюда в избранное</p>
        } </div>
    );
}

FavoriteButton.propTypes = {
    mealId: PropTypes.string,
    userState: PropTypes.object,
}

const mapStateToProps = (state) => ({
    userState: state.userState,
})

export default connect(mapStateToProps)(FavoriteButton);