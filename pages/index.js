import { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Head from 'next/head';

import StandartLayout from '../src/components/StandartLayout/StandartLayout';
import MealCard from '../src/components/MealCard/MealCard';
import mealService from '../src/service/MealService';
import getInitialPropsFunction from '../src/utils/getInitialPropsFunction';
import checkContentState from '../src/utils/checkContentState';
import appTitle from '../src/constants/appTitle';
import {
  fetchSingleMealSuccessAction,
  fetchSingleMealThunkAction,
} from '../src/actions/actions';

const Page = (props) => {
  const {
    fetchSingleMealSuccessAction,
    fetchSingleMealThunkAction,
    serverSideData,
    singleMealState,
  } = props;
  
  const { error, isLoading } = singleMealState
  const meal = serverSideData ? serverSideData : singleMealState.meal;
  const contentState = checkContentState(error, isLoading);

  useEffect(()=>{
    const fetchState = { canceled: false };
    if (serverSideData) {
      fetchSingleMealSuccessAction(serverSideData);
    } else {
      fetchSingleMealThunkAction(mealService.getRandomMeal, fetchState)
    }
    return () => fetchState.canceled = true;
  }, []);

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

Page.getInitialProps = getInitialPropsFunction(mealService.getRandomMeal);

Page.propTypes = {
  fetchSingleMealSuccessAction: PropTypes.func,
  fetchSingleMealThunkAction: PropTypes.func,
  serverSideData: PropTypes.object,
  singleMealState: PropTypes.object,
}

const mapStateToProps = (state) => ({
  singleMealState: state.singleMealState,
});
const mapDispatchToProps = {
  fetchSingleMealSuccessAction,
  fetchSingleMealThunkAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);