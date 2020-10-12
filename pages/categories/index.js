import { useEffect } from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';
import PropTypes from 'prop-types';

import mealService from '../../src/service/MealService';
import getInitialPropsFunction from '../../src/utils/getInitialPropsFunction';
import checkContentState from '../../src/utils/checkContentState';
import StandartLayout from '../../src/components/StandartLayout/StandartLayout';
import {
    fetchCategoriesListSuccessAction,
    fetchCategoriesListThunkAction,
} from '../../src/actions/actions';
import appTitle from '../../src/constants/appTitle';
import CategoryCard from '../../src/components/CategoryCard/CategoryCard';

const Page = (props) => {
    const {
        fetchCategoriesListSuccessAction,
        fetchCategoriesListThunkAction,
        serverSideData,
        categoriesListState,
    } = props;
    const { isLoading, error } = categoriesListState;
    const list = serverSideData ? serverSideData : categoriesListState.list;
    const contentState = checkContentState(error, isLoading);

    useEffect(() => {
        const fetchState = { canceled: false };
        if (serverSideData) {
            fetchCategoriesListSuccessAction(serverSideData)
        } else {
            fetchCategoriesListThunkAction(mealService.getCategoriesList, fetchState);
        }
        return () => fetchState.canceled = true;
    }, [])
    
    return (<>
        <Head>
            <title>{`${appTitle}: Категории`}</title>
            <meta name="description" content="Категории блюд и рецептов к ним" /> 
        </Head>
        
        <StandartLayout>
            <h3 className="my-3">Категории рецептов</h3>
            { 
                contentState ?
                contentState :
                list.map(item => <CategoryCard category={item} key={item.categoryId}/>)
            }
        </StandartLayout>
    </>)
}

Page.getInitialProps = getInitialPropsFunction(mealService.getCategoriesList);

Page.propTypes = {
    fetchCategoriesListSuccessAction: PropTypes.func,
    fetchCategoriesListThunkAction: PropTypes.func,
    serverSideData: PropTypes.array,
    categoriesListState: PropTypes.object,
}

const mapStateToProps = (state) => ({
    categoriesListState: state.categoriesListState,
});
const mapDispatchToProps = ({
    fetchCategoriesListSuccessAction,
    fetchCategoriesListThunkAction,
});

export default connect(mapStateToProps, mapDispatchToProps)(Page);