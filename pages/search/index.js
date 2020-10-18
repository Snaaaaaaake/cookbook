import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

import mealService from '../../src/service/MealService';
import checkContentState from '../../src/utils/checkContentState';
import { initialMealListState } from '../../src/store/initialStates';
import createServerSideError from '../../src/utils/createServerSideError';
import {
    fetchCategoriesListThunkAction,
    applyMealListServerStateAction,
    applyCategoriesListStateAction,
    fetchMealListThunkAction,
    resetMealListAction,
} from '../../src/actions/actions';
import StandartLayout from '../../src/components/StandartLayout/StandartLayout';
import MealCard from '../../src/components/MealCard/MealCard';
import Pagination from '../../src/components/Pagination/Pagination';
import appTitle from '../../src/constants/appTitle';
import initialFilter from '../../src/constants/initialFilter';
import ROUTES from '../../src/constants/routes';

const Page = (props) => {
    const router = useRouter();
    const {
        fetchCategoriesListThunkAction,
        applyCategoriesListStateAction,
        fetchMealListThunkAction,
        applyMealListServerStateAction,
        resetMealListAction,
        serverSideState,
        mealListState,
        categoriesListState,
    } = props;
    
    const pagePath = router.asPath;
    const pageQuery = { ...router.query };
    const page = +pageQuery.page || 1;
    delete pageQuery.page;

    const [ filter, setFilter ] = useState({ ...initialFilter, ...pageQuery });
    const { list, pages, isLoading, error } = serverSideState ? serverSideState : mealListState;
    const contentState = checkContentState(error, isLoading);
    const notEmptyFilterKeys = Object.keys(filter).filter(key => filter[key]);
    const categoriesList = serverSideState ? serverSideState.categoriesList : categoriesListState.list;
    
    useEffect(() => {
        // Первичная загрузка списка категорий
        const fetchCondition = { canceled: false };
        if (categoriesList.length === 0) {
            fetchCategoriesListThunkAction(mealService.getCategoriesList, fetchCondition);
        } else {
            applyCategoriesListStateAction({list: categoriesList, error: null, isLoading: false});
        }
        return () => fetchCondition.canceled = true;
    }, []);

    useEffect(() => {
        const fetchCondition = { canceled: false };
        // Запрос списка материалов,
        // если есть критерии поиска и нет данных с беэкэнда
        if (notEmptyFilterKeys.length > 0 && !serverSideState) {
            fetchMealListThunkAction(mealService.getFilteredList, fetchCondition, filter, page);
        } else if (serverSideState) {
        // Иначе добавляем в хранилище данные с сервера
            applyMealListServerStateAction(serverSideState);
        } else {
        // При сбросе фильтра
            resetMealListAction();
        }
        return () => fetchCondition.canceled = true;
    }, [pagePath]);

    const onChangeFilterHandler = (event) => {
        setFilter({
            ...filter,
            [event.target.id]: event.target.value,
        })
    }

    const onSubmitHandler = (event) => {
        event.preventDefault();
        if (notEmptyFilterKeys.length > 0) {
            const query = notEmptyFilterKeys.map(key => `${key}=${filter[key]}`);
            router.push(`${ROUTES.SEARCH}?${query.join('&')}`);
        } 
    }

    const onResetHandler = () => {
        setFilter({...initialFilter})
        router.push(ROUTES.SEARCH);
    }
    
    let Content;
    if (contentState) {
        Content = contentState;
    } else if (list.length === 0) {
        Content = () => <p>Введите данные для начала поиска</p>
    } else {
        Content = () => (<>
            <h4 className="mb-3">Результаты поиска</h4>
            { list.map(meal => <MealCard meal={meal} key={meal.mealId}/>) }
        </>)
    }

    return (<>
        <Head>
            <title>{`${appTitle}: Поиск блюда`}</title>
            <meta name="robots" content="noindex" />
        </Head>

        <StandartLayout>
            <h1 className="my-3">Поиск блюда</h1>

            <form onSubmit={onSubmitHandler}>
                <fieldset disabled={isLoading}>
                    <div className="form-group">
                        <label htmlFor="contains">Название содержит:</label>
                        <input id="contains" className="form-control" onChange={onChangeFilterHandler} value={filter.contains} type="text" placeholder="Введите текст" /></div>
                    <div className="form-group">
                        <label htmlFor="category">Категория:</label>
                        <select id="category" className="form-control" onChange={onChangeFilterHandler} value={filter.category}>
                            <option disabled value="Выберите из списка">Выберите из списка</option>
                            <option value=""></option>
                            { categoriesList.map((category, index) => <option key={`cat_${index}`} value={category.title}>{category.title}</option>)}
                        </select>
                    </div>
                    <button type="submit" className="btn btn-outline-primary mr-3">Поиск</button>
                    <button onClick={onResetHandler} className="btn btn-outline-secondary">Сбросить</button>
                </fieldset>
            </form>

            <div className="mt-4">
                { contentState ? contentState : <Content /> }
            </div>

            <Pagination pages={pages} currentPage={page}/>
        </StandartLayout>
    </>)
}

Page.getInitialProps = async ({ req, query }) => {
    if (!req) {
        return { serverSideState: null }
    }

    const serverSideState = { ...initialMealListState, categoriesList: [] };
    try {
        const categoriesList = await mealService.getCategoriesList();
        const filter = { ...query };
        const { page } = filter;
        delete filter.page;
        serverSideState.categoriesList = categoriesList;
        if (Object.keys(filter).length > 0) {
            const { list, pages } = await mealService.getFilteredList(filter, page);
            serverSideState.list = list;
            serverSideState.pages = pages;
        }
    } catch (error) {
        serverSideState.error = createServerSideError(error);
    }
    return { serverSideState }
}

Page.propTypes = {
    fetchCategoriesListThunkAction: PropTypes.func,
    applyMealListServerStateAction: PropTypes.func,
    applyCategoriesListStateAction: PropTypes.func,
    fetchMealListThunkAction: PropTypes.func,
    resetMealListAction: PropTypes.func,
    serverSideState: PropTypes.object,
    mealListState: PropTypes.object,
    categoriesListState: PropTypes.object,
}

const mapStateToProps = (state) => ({
    mealListState: state.mealListState,
    categoriesListState: state.categoriesListState,
});
const mapDispatchToProps = {
    fetchCategoriesListThunkAction,
    applyMealListServerStateAction,
    applyCategoriesListStateAction,
    fetchMealListThunkAction,
    resetMealListAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);