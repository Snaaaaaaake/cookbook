import Link from 'next/link';
import PropTypes from 'prop-types';
import ROUTES from '../../constants/routes';

const CategoryCard = (props) => {
    const {
        title,
        thumb,
        description,
    } = props.category;

    return (
        <div className="card border-light mb-3">
            <div className="row no-gutters">
                <div className="col-md-4">
                    <img src={thumb} className="card-img-top" alt={title} />
                </div>
                <div className="col-md-8">
                <div className="card-body">
                <h5 className="card-title">{title}</h5>
                    <p className="card-text">{description}</p>
                    <Link href={`${ROUTES.CATEGORIES}/${title.toLowerCase()}`}><a className="card-link">Список блюд</a></Link>
                </div>
                </div>
            </div>
        </div>
    );
}

CategoryCard.propTypes = {
    category: PropTypes.object,
}

export default CategoryCard;