import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Link from 'next/link';

import mealService from '../../src/service/MealService';
import checkContentState from '../../src/utils/checkContentState';
import {
    fetchMealListSuccessAction,
    fetchMealListThunkAction,
} from '../../src/actions/actions';
import MealCard from '../../src/components/MealCard/MealCard';
import StandartLayout from '../../src/components/StandartLayout/StandartLayout';
import Pagination from '../../src/components/Pagination/Pagination';
import appTitle from '../../src/constants/appTitle';
import ROUTES from '../../src/constants/routes';

const Page = (props) => {
    const router = useRouter();
    const { category } = router.query;
    const page = +router.query.page || 1;

    const {
        fetchMealListSuccessAction,
        fetchMealListThunkAction,
        serverSideData,
        mealListState,
    } = props;
    const { isLoading, error } = mealListState;
    const { list, pages } = serverSideData ? serverSideData : mealListState;
    const contentState = checkContentState(error, isLoading);

    useEffect(() => {
        const fetchState = { canceled: false };
        if (serverSideData) {
            fetchMealListSuccessAction(serverSideData)
        } else {
            fetchMealListThunkAction(mealService.getMealListByCategory, fetchState, category, page);
        }
        return () => fetchState.canceled = true;
    }, [page]);

    return (<>
        <Head>
            <title>{`${appTitle}: Категории - ${category}`}</title>
            <meta name="description" content={`Рецепты блюд в категории ${category} с фотографиями`} /> 
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
      return { serverSideData: null }
    }
    
    const page = query.page ? query.page : 1;
    try {
      const data = await mealService.getMealListByCategory(query.category, page);
      return { serverSideData: data }
    } catch {
      return { serverSideData: null }
    }
}

Page.propTypes = {
    fetchMealListSuccessAction: PropTypes.func,
    fetchMealListThunkAction: PropTypes.func,
    serverSideData: PropTypes.object,
    mealListState: PropTypes.object,
}

const mapStateToProps = (state) => ({
    mealListState: state.mealListState,
});
const mapDispatchToProps = {
    fetchMealListSuccessAction,
    fetchMealListThunkAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);