const getInitialPropsFunction = (serviceMethod) => async ({ req }) => {
    // Проверка запрос из браузера или уже из постоенного приложения
    if (!req) {
      return { serverSideData: null }
    }
  
    try {
      const data = await serviceMethod();
      return { serverSideData: data }
    } catch {
      return { serverSideData: null }
    }
}

export default getInitialPropsFunction;