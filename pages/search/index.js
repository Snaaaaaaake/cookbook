import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

import mealService from '../../src/service/MealService';
import checkContentState from '../../src/utils/checkContentState';
import {
    fetchCategoriesListSuccessAction,
    fetchMealListSuccessAction,
    fetchMealListFailureAction,
    fetchMealListThunkAction,
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
        fetchCategoriesListSuccessAction,
        fetchMealListSuccessAction,
        fetchMealListFailureAction,
        fetchMealListThunkAction,
        serverSideData,
        mealListState,
        categoriesListState,
    } = props;
    
    const pagePath = router.asPath;
    const pageQuery = { ...router.query };
    const page = +pageQuery.page || 1;
    delete pageQuery.page;

    const [ filter, setFilter ] = useState({ ...initialFilter, ...pageQuery });
    const { error, isLoading } = mealListState;
    const { list: mealList, pages } = serverSideData.data || mealListState;
    const contentState = checkContentState(error, isLoading);
    const notEmptyFilterKeys = Object.keys(filter).filter(key => filter[key]);
    const categoriesList = serverSideData.categoriesList || categoriesListState.list;

    useEffect(() => {
        // Первичная загрузка списка категорий
        if (categoriesList.length === 0) {
            mealService.getCategoriesList()
                .then(fetchCategoriesListSuccessAction)
                .catch(fetchMealListFailureAction)
        } else {
            fetchCategoriesListSuccessAction(categoriesList)
        }
    }, []);

    useEffect(() => {
        const fetchState = { canceled: false };
        // Запрос списка материалов,
        // если есть критерии поиска и нет данных с беэкэнда
        if (notEmptyFilterKeys.length > 0 && !serverSideData.data) {
            fetchMealListThunkAction(mealService.getFilteredList, fetchState, filter, page);
        } else if (serverSideData.data) {
        // Иначе добавляем в хранилище данные с сервера
            fetchMealListSuccessAction({ list: mealList, pages});
        } else {
        // При сбросе фильтра
            fetchMealListSuccessAction({ list: [], pages: 1});
        }
        return () => fetchState.canceled = true;
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
    } else if (mealList.length === 0) {
        Content = () => <p>Введите данные для начала поиска</p>
    } else {
        Content = () => (<>
            <h4 className="mb-3">Результаты поиска</h4>
            { mealList.map(meal => <MealCard meal={meal} key={meal.mealId}/>) }
        </>)
    }

    return (<>
        <Head>
            <title>{`${appTitle}: Поиск блюда`}</title>
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
        return { serverSideData: {} }
    }

    try {
        const categoriesList = await mealService.getCategoriesList();
        const filter = { ...query };
        const { page } = filter;
        delete filter.page;
        let data;
        if (Object.keys(filter).length > 0) {
            data = await mealService.getFilteredList(filter, page);
        } else {
            data = null;
        }
        return { serverSideData: { data, categoriesList } }
    } catch {
        return { serverSideData: {} }
    }
}

Page.propTypes = {
    fetchFilteredListSuccess: PropTypes.func,
    fetchFilteredListFailure: PropTypes.func,
    fetchCategoriesListSuccessAction: PropTypes.func,
    fetchFilteredList: PropTypes.func,
    serverSideData: PropTypes.object,
    filterState: PropTypes.object,
    categoriesListState: PropTypes.object,
}

const mapStateToProps = (state) => ({
    mealListState: state.mealListState,
    categoriesListState: state.categoriesListState,
});
const mapDispatchToProps = {
    fetchCategoriesListSuccessAction,
    fetchMealListSuccessAction,
    fetchMealListFailureAction,
    fetchMealListThunkAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);