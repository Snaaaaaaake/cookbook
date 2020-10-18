import { useEffect } from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';
import PropTypes from 'prop-types';

import mealService from '../../src/service/MealService';
import { initialCategoriesListState } from '../../src/store/initialStates';
import componentDidMountFunction from '../../src/utils/componentDidMountFunction';
import createServerSideError from '../../src/utils/createServerSideError';
import checkContentState from '../../src/utils/checkContentState';
import StandartLayout from '../../src/components/StandartLayout/StandartLayout';
import {
    applyCategoriesListStateAction,
    fetchCategoriesListThunkAction,
} from '../../src/actions/actions';
import appTitle from '../../src/constants/appTitle';
import CategoryCard from '../../src/components/CategoryCard/CategoryCard';

const Page = (props) => {
    const {
        applyCategoriesListStateAction,
        fetchCategoriesListThunkAction,
        serverSideState,
        categoriesListState,
    } = props;
    const { list, isLoading, error } = serverSideState ? serverSideState : categoriesListState;
    const contentState = checkContentState(error, isLoading);

    useEffect(componentDidMountFunction(
        serverSideState,
        applyCategoriesListStateAction,
        fetchCategoriesListThunkAction,
        mealService.getCategoriesList,
    ), [])
    
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

Page.getInitialProps = async ({ req }) => {
    if (!req) {
      return { serverSideState: null }
    }
  
    const serverSideState = { ...initialCategoriesListState };
    try {
      serverSideState.list = await mealService.getCategoriesList();
    } catch (error) {
      serverSideState.error = createServerSideError(error);
    }
    return { serverSideState };
  }

Page.propTypes = {
    applyCategoriesListStateAction: PropTypes.func,
    fetchCategoriesListThunkAction: PropTypes.func,
    serverSideState: PropTypes.object,
    categoriesListState: PropTypes.object,
}

const mapStateToProps = (state) => ({
    categoriesListState: state.categoriesListState,
});
const mapDispatchToProps = ({
    applyCategoriesListStateAction,
    fetchCategoriesListThunkAction,
});

export default connect(mapStateToProps, mapDispatchToProps)(Page);