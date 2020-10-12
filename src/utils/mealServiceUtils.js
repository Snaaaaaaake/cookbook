const res200Check = (res) => {
    if(!res.ok) {
        throw new Error(res.status)
    }
    return res.json();
}
const res404Check = (res) => {
    if (res.meals === null) {
        throw new Error("404: запрошенный ресурс не найден")
    }
    return res
}
const formatMealFunction = (rawData) => {
    const ingredients = [];
    const measures = [];
    for (let i=1; i<=20; i++) {
        const ing = rawData[`strIngredient${i}`];
        const mes = rawData[`strMeasure${i}`];
        if (ing) {
            ingredients.push(ing);
            measures.push(mes);
        }
    }
    return {
        mealId: rawData.idMeal,
        title: rawData.strMeal,
        thumb: rawData.strMealThumb,
        area: rawData.strArea,
        description: rawData.strInstructions,
        category: rawData.strCategory,
        ingredients,
        measures,
    };
}

const formatCategoryFunction = (rawData) => {
    return {
        categoryId: rawData.idCategory,
        title: rawData.strCategory,
        thumb: rawData.strCategoryThumb,
        description: rawData.strCategoryDescription,
    }
}

export {
    res200Check,
    res404Check,
    formatMealFunction,
    formatCategoryFunction,
} 