import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import mealService from '../../src/service/MealService';
import { fetchMealListThunkAction } from '../../src/actions/actions';
import checkContentState from '../../src/utils/checkContentState';
import StandartLayout from '../../src/components/StandartLayout/StandartLayout';
import MealCard from '../../src/components/MealCard/MealCard';
import Pagination from '../../src/components/Pagination/Pagination';
import appTitle from '../../src/constants/appTitle';
import ROUTES from '../../src/constants/routes';

const Page = (props) => {
    const router = useRouter();
    const {
        userState: { user, favorites },
        mealListState: { list, error, isLoading, pages },
        fetchMealListThunkAction,
    } = props;
    const page = +router.query.page || 1;
    const contentState = checkContentState(error, isLoading);

    useEffect(() => {
        const fetchState = { canceled: false };
        if (favorites.length > 0) {
            fetchMealListThunkAction(mealService.getFavoritesList, fetchState, favorites, 1);
            router.replace(ROUTES.FAVORITES);
        }
        return () => fetchState.canceled = true;
    }, [favorites]);

    useEffect(() => {
        const fetchState = { canceled: false };
        if (favorites.length > 0) {
            fetchMealListThunkAction(mealService.getFavoritesList, fetchState, favorites, page);
        }
        return () => fetchState.canceled = true;
    }, [page]);

    let Content;
    if (!user) {
        Content = () => <p className="card-text">Войдите в аккаунт, чтобы вести список избранных рецептов</p>;
    } else if (contentState) {
        Content = () => contentState;
    } else if (favorites.length === 0) {
        Content = () => <p className="card-text">Вы пока не добавили в избранное ни одного рецепта</p>;
    } else {
        Content = () => (<>
            {list.map(item => <MealCard meal={item} key={item.mealId}/>)}
            <Pagination pages={pages} currentPage={page}/>
        </>)
    }

    return (<>
        <Head>
            <title>{`${appTitle}: Избранные рецепты`}</title>
            <meta name="robots" content="noindex" />
        </Head>

        <StandartLayout>
            <h1 className="my-3">Избранные рецепты</h1>
            <Content />
        </StandartLayout>
    </>);
}

const mapStateToProps = (state) => ({
    userState: state.userState,
    mealListState: state.mealListState,
});

const mapDispatchToProps = {
    fetchMealListThunkAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);