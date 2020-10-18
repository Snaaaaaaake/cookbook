import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Link from 'next/link';

import mealService from '../../src/service/MealService';
import checkContentState from '../../src/utils/checkContentState';
import componentDidMountFunction from '../../src/utils/componentDidMountFunction';
import createServerSideError from '../../src/utils/createServerSideError';
import {
    applyMealListServerStateAction,
    fetchMealListThunkAction,
} from '../../src/actions/actions';
import MealCard from '../../src/components/MealCard/MealCard';
import StandartLayout from '../../src/components/StandartLayout/StandartLayout';
import Pagination from '../../src/components/Pagination/Pagination';
import appTitle from '../../src/constants/appTitle';
import { initialMealListState } from '../../src/store/initialStates';
import ROUTES from '../../src/constants/routes';

const Page = (props) => {
    const router = useRouter();
    const { category } = router.query;
    const page = +router.query.page || 1;

    const {
        applyMealListServerStateAction,
        fetchMealListThunkAction,
        serverSideState,
        mealListState,
    } = props;
    
    const { list, pages, isLoading, error } = serverSideState ? serverSideState : mealListState;
    const contentState = checkContentState(error, isLoading);

    useEffect(componentDidMountFunction(
        serverSideState,
        applyMealListServerStateAction,
        fetchMealListThunkAction,
        mealService.getMealListByCategory,
        category,
        page,
    ), [page]);

    return (<>
        <Head>
            <title>{`${appTitle}: Категории - ${category}`}</title>
            <meta name="description" content={`Рецепты блюд в категории ${category} с фотографиями`} />
            { (serverSideState && serverSideState.error) && <meta name="robots" content="noindex" /> } 
        </Head>

        <StandartLayout>
            <h3 className="mt-3 mb-0">{`Список блюд в категории ${category}`}</h3>
            <p className="card-text mb-3"><Link href={ROUTES.CATEGORIES}><a>Категории</a></Link> » {category}</p>
            { 
                contentState ?
                contentState :
                list.map(item => <MealCard meal={item} key={item.mealId}/>)
            }
            <Pagination pages={pages} currentPage={page}/>
        </StandartLayout>
    </>)
}

Page.getInitialProps = async ({ req, query }) => {
    if (!req) {
        return { serverSideState: null }
    }
    
    const page = query.page ? query.page : 1;
    const serverSideState = { ...initialMealListState };
    try {
        const { list, pages } = await mealService.getMealListByCategory(query.category, page);
        serverSideState.list = list;
        serverSideState.pages = pages;
    } catch (error) {
        serverSideState.error = createServerSideError(error);
    }
    return { serverSideState };
}

Page.propTypes = {
    applyMealListServerStateAction: PropTypes.func,
    fetchMealListThunkAction: PropTypes.func,
    serverSideState: PropTypes.object,
    mealListState: PropTypes.object,
}

const mapStateToProps = (state) => ({
    mealListState: state.mealListState,
});
const mapDispatchToProps = {
    applyMealListServerStateAction,
    fetchMealListThunkAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);