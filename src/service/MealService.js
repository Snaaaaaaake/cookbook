import {
    res200Check,
    res404Check,
    formatMealFunction,
    formatCategoryFunction,
} from '../utils/mealServiceUtils';

class MealService {
    constructor(apiKey) {
        this._apiKey = apiKey;
        this._itemsPerPage = 8;
        this.searchTypeUrl = {
            contains: `https://www.themealdb.com/api/json/v1/${this._apiKey}/search.php?s=`,
            category: `https://www.themealdb.com/api/json/v1/${this._apiKey}/filter.php?c=`,
        };
        this.searchResponseDataProperties = {
            category: 'strCategory',
        }
    }

    _listAndPagesCounter = (dataArray, page) => {
        const pages = Math.ceil(dataArray.length/this._itemsPerPage);
        const list = dataArray.splice((page-1)*this._itemsPerPage, this._itemsPerPage);  
        return { list, pages };
    }

    getRandomMeal = () => {
        return fetch(`https://www.themealdb.com/api/json/v1/${this._apiKey}/random.php`)
            .then(res200Check)
            .then(data => formatMealFunction(data.meals[0]))
    }

    getCategoriesList = () => {
        return fetch(`https://www.themealdb.com/api/json/v1/${this._apiKey}/categories.php`)
            .then(res200Check)
            .then(data => {
                const categories = data.categories.map(item => formatCategoryFunction(item));
                return categories;
            })
    }

    getMealListByCategory = (category, page=1) => {
        return fetch(`https://www.themealdb.com/api/json/v1/${this._apiKey}/filter.php?c=${category.toLowerCase()}`)
            .then(res200Check)
            .then(res404Check)
            .then(data => {
                const meals = data.meals.map(item => formatMealFunction(item));
                return this._listAndPagesCounter(meals, page);
            });
    }

    getMealById = (mealId) => {
        return fetch(`https://www.themealdb.com/api/json/v1/${this._apiKey}/lookup.php?i=${mealId}`)
            .then(res200Check)
            .then(res404Check)
            .then(data => formatMealFunction(data.meals[0]))
    }

    getFavoritesList = async (idArray, page=1) => {
        const promiseArray = idArray.map(mealId => this.getMealById(mealId));
        const meals =  await Promise.all(promiseArray);
        return this._listAndPagesCounter(meals, page);
    }

    getFilteredList = async (filter, page=1) => {
        // Отсеиваем заполненые поля фильтра
        const filterKeys = Object.keys(filter).filter(key => filter[key]);
        // Ссылка для первого запроса на сервер будет зависеть от первого из заполненных полей, 
        // т.к.  по разным критериям API ищет материалы по разным ссылкам
        const searchMethodUrl = this.searchTypeUrl[filterKeys[0]];
        const searchKey = filter[filterKeys[0]];
        let filteredData = await fetch(`${searchMethodUrl + searchKey}`)
            .then(res200Check)
            .then(data => data.meals)
        if (filteredData === null) {
            throw new Error('Ничего не найдено!')
        }
        // Если какие-то материалы найдены и заполнены другие поля фильтра,
        // то продолжаем поиск, но уже своими средствами
        if (filteredData && filteredData.length > 0) {
            for (let i=1; i<filterKeys.length; i++) {
                const filterKey = filterKeys[i];
                const filterValue = filter[filterKey];
                const responseProperty = this.searchResponseDataProperties[filterKey];
                filteredData = filteredData.filter(item => item[responseProperty] === filterValue);
            }
        }
        const meals = filteredData.map(item => formatMealFunction(item));
        return this._listAndPagesCounter(meals, page);
    }
}

const mealService = new MealService(process.env.REACT_APP_MEAL_SERVICE_KEY);
export default mealService;