import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Link from 'next/link';

import FavoriteButton from '../../src/components/FavoriteButton/FavoriteButton';
import mealService from '../../src/service/MealService';
import checkContentState from '../../src/utils/checkContentState';
import componentDidMountFunction from '../../src/utils/componentDidMountFunction';
import createServerSideError from '../../src/utils/createServerSideError';
import { initialSingleMealState } from '../../src/store/initialStates';
import {
    applySingleMealServerStateAction,
    fetchSingleMealThunkAction,
} from '../../src/actions/actions';
import StandartLayout from '../../src/components/StandartLayout/StandartLayout';
import appTitle from '../../src/constants/appTitle';
import ROUTES from '../../src/constants/routes';

const Page = (props) => {
    const router = useRouter();
    const { mealId } = router.query;
    const {
        applySingleMealServerStateAction,
        fetchSingleMealThunkAction,
        serverSideState,
        singleMealState,
    } = props;

    useEffect(componentDidMountFunction(
        serverSideState,
        applySingleMealServerStateAction,
        fetchSingleMealThunkAction,
        mealService.getMealById,
        mealId,
    ), []);
    
    const { meal, isLoading, error} = serverSideState ? serverSideState : singleMealState;
    const contentState = checkContentState(error, isLoading);

    let Content, mealTitle;
    if (contentState) {
        Content = () => contentState;
        mealTitle = "";
    } else if (meal) {
        mealTitle = meal.title;
        const {
            category,
            area,
            description,
            thumb,
            ingredients,
            measures,
        } = meal;
        Content = () => <>
            <div className="mb-3">
                <FavoriteButton mealId={mealId}/>
            </div>
            <img src={thumb} alt={mealTitle} style={{maxWidth: "100%"}} />
            <p className="card-subtitle my-2 text-muted">Категория: <Link href={`${ROUTES.CATEGORIES}/${category}`}><a className="card-link">{category}</a></Link></p>
            <p className="card-subtitle mb-3 text-muted">Страна происхождения: {area}</p>
            <p className="card-text" style={{whiteSpace: "pre-wrap"}}>{description.trim()}</p>
            <h5 className="mt-3">Ингридиенты:</h5>
            <ul className="list-group list-group-flush">
                { ingredients.map((ingredient, index) => 
                    <li className="list-group-item" key={`ing_${index}`}>{`${ingredient}: ${measures[index]}`}</li>
                )}
            </ul>
        </>
    } else {
        Content = () => null;
    }
    
    return (<>
        <Head>
            <title>{`${appTitle}: Рецепт ${mealTitle}`}</title>
            <meta name="description" content={`Рецепт и фото блюда ${mealTitle}`} />
            { (serverSideState && serverSideState.error) && <meta name="robots" content="noindex" /> } 
        </Head>

        <StandartLayout>
            <h1 className="mt-3 mb-0">{`Рецепт блюда ${mealTitle}`}</h1>
            <Content />
        </StandartLayout>
    </>)
}

Page.getInitialProps = async ({ req, query }) => {
    if (!req) {
        return { serverSideState: null }
    }

    const { mealId } = query;
    let serverSideState = { ...initialSingleMealState };
    try {
        serverSideState.meal = await mealService.getMealById(mealId);
    } catch (error) {
        serverSideState.error = createServerSideError(error);
    }
    return { serverSideState };
}

Page.propTypes = {
    applySingleMealServerStateAction: PropTypes.func,
    fetchSingleMealThunkAction: PropTypes.func,
    serverSideState: PropTypes.object,
    singleMealState: PropTypes.object,
}

const mapStateToProps = (state) => ({
    singleMealState: state.singleMealState,
});
const mapDispatchToProps = {
    applySingleMealServerStateAction,
    fetchSingleMealThunkAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);