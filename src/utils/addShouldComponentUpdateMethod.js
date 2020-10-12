import React from 'react';

// Костыль, чтоюбы не рендерить страницу дважды при добавлении 
// полученной из SSR информации в стор.
export default function addShouldComponentUpdateMethod(RawPage) {
    function areEqual(prevProps) {
        if (prevProps.serverSideData === null) {
            // Ответа от сервера не было, рендерим
            return false
        } else {
            // Ответ был, повторный рендер не нужен
            return true;
        }
    }
    return React.memo(RawPage, areEqual);
}