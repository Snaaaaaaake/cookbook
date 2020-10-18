// С сервера просто так не передать объект ошибки
export default function createServerSideError (error) {
    return { message: 'Ошибка ' + error.message };
}