import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const Pagination = (props) => {
    const router = useRouter();
    const { pages, currentPage } = props;

    const pagesArray = [];
    for (let i=1; i<=pages; i++) {
        pagesArray.push(i);
    }

    const onPageChange = (page) => (event) => {
        event.preventDefault();
        const { asPath: pagePath } = router;
        const pageIndexStr = `page=${page}`;
        let newPagePath;
        if (pagePath.includes('page=')) {
            newPagePath = pagePath.replace(/page=\d{1,2}/, pageIndexStr);
        } else {
            const hasQueries = pagePath.includes('?');
            newPagePath = hasQueries ? `${pagePath}&${pageIndexStr}` : `${pagePath}?${pageIndexStr}`;
        }
        router.push(newPagePath);
    }

    return (
            <ul className="pagination justify-content-center">
                { pagesArray.length <= 1 ? 
                    null :            
                    pagesArray.map(pageIndex => {
                        const classes = classnames({
                            'page-item': true,
                            disabled: pageIndex==currentPage,
                        });
                        return (
                            <li key={`page_${pageIndex}`} className={classes}>
                                <button
                                    disabled={pageIndex==currentPage}
                                    onClick={onPageChange(pageIndex)}
                                    className="page-link">
                                        {pageIndex}
                                </button>
                            </li>
                        )}
                )}
            </ul>
    );
}

Pagination.propTypes = {
    pages: PropTypes.number,
    currentPage: PropTypes.number,
}

export default Pagination;