import Link from 'next/link';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import classnames from 'classnames';
import ModalRegistration from '../ModalRegistration/ModalRegistration';
import ROUTES from '../../constants/routes';

const Header = (props) => {
    const router = useRouter();
    const { userState: { user } } = props;
    const menuItems = {
        main: [ROUTES.MAIN, 'Главная'],
        categories: [ROUTES.CATEGORIES, 'Категории'],
        search: [ROUTES.SEARCH, 'Поиск'],
        favorites: [ROUTES.FAVORITES, 'Избранное'],
    }
    if (!user) {
        delete menuItems.favorites;
    }
    const menuKeys = Object.keys(menuItems);
    const path = router.asPath;
    let active;
    if (path.length > 1) {
        active  = menuKeys.find(key => path.startsWith(`/${key}`));
    } else {
        active = 'main';
    }

    return (<>
        <nav className="card-header d-flex justify-content-between">
            <ul className="nav nav-tabs card-header-tabs">
                { menuKeys.map(key => {
                    const [ url, text ] = menuItems[key];
                    const classes = classnames({
                        'nav-link': true,
                        active: active === key,
                        disabled: active === key,
                    });
                    return (
                    <li key={key} className="nav-item">
                        <Link href={url}><a className={classes}>{text}</a></Link>
                    </li>
                )})}
            </ul>
            <ModalRegistration />
        </nav>
    </>)
}

const mapStateToProps = (state) => ({
    userState: state.userState,
});

export default connect(mapStateToProps)(Header);