const ErrorComponent = (props) => {
    // Баг API, вместо json отправляет html страницу в некоторых случаях
    if (props.error.message.includes('Unexpected token < in JSON at position 0')) {
        return <div className="my-3 text-center">Ошибка 404: нет такой страницы</div>
    }
    return <div className="my-3 text-center">{props.error.message}</div>
}
export default ErrorComponent;