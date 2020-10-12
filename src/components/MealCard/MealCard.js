import Link from 'next/link';
import PropTypes from 'prop-types';
import FavoriteButton from '../FavoriteButton/FavoriteButton';
import ROUTES from '../../constants/routes';

const MealCard = (props) => {
    if (!props.meal) {
        return null;
    }
    const { 
        mealId,
        title,
        thumb,
        area,
        category,
    } = props.meal;
    
    return (
        <div className="card border-light mb-3">
            <div className="row no-gutters">
                <div className="col-md-4">
                    <img src={thumb} className="card-img-top" alt={title} />
                </div>
                <div className="col-md-8">
                    <div className="card-body">
                        <h5 className="card-title">{title}</h5>
                        <Link href={`${ROUTES.MEALS}/${mealId}`}><a className="card-link">Посмотреть рецепт</a></Link>
                        { category && <p className="card-text mb-0">Категория: {category}</p> }
                        { area && <p className="card-text">Страна: {area}</p> }
                        <FavoriteButton mealId={mealId} />
                    </div>
                </div>
            </div>
        </div>
    );
}

MealCard.propTypes = {
    meal: PropTypes.object,
}

export default MealCard;