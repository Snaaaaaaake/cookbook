import { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Head from 'next/head';

import StandartLayout from '../src/components/StandartLayout/StandartLayout';
import MealCard from '../src/components/MealCard/MealCard';
import mealService from '../src/service/MealService';
import componentDidMountFunction from '../src/utils/componentDidMountFunction';
import createServerSideError from '../src/utils/createServerSideError';
import checkContentState from '../src/utils/checkContentState';
import { initialSingleMealState } from '../src/store/initialStates';
import appTitle from '../src/constants/appTitle';
import {
  applySingleMealServerStateAction,
  fetchSingleMealThunkAction,
} from '../src/actions/actions';

const Page = (props) => {
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
    mealService.getRandomMeal,
  ), []);

  const { meal, error, isLoading } = serverSideState ? serverSideState : singleMealState;
  const contentState = checkContentState(error, isLoading);

  return (<>
      <Head>
        <title>{appTitle}</title>
        <meta name="description" content="Онлайн книга с рецептами для приготовления блюд" />
      </Head>

      <StandartLayout>
        <h3 className="my-3">Добро пожаловать!</h3>
        <p>Вы находитесь на главной странице электронной поваренной книги. 
          Это тренировочный проект, используется React/Redux, при первом запросе страница рендерится на сервере (Next.js), далее в браузере.
          Данные рецептов берутся из Themealdb.com (к сожалению, все на английском).</p>
        <h4>Случайный рецепт</h4>
        {contentState ? contentState : <MealCard meal={meal} />}
      </StandartLayout>
  </>)
}

Page.getInitialProps = async ({ req }) => {
  if (!req) {
    return { serverSideState: null }
  }

  const serverSideState = { ...initialSingleMealState };
  try {
    serverSideState.meal = await mealService.getRandomMeal();
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