import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

const StandartLayout = (props) => (
    <div className="container">
        <h1 className="my-3">Поваренная книга</h1>
        <div className="card mb-3" style={{position: 'static'}}>
            <ErrorBoundary>
                <Header/>
            </ErrorBoundary>
            <ErrorBoundary>
                <main className="px-2 pt-2">
                    {props.children}
                </main>
            </ErrorBoundary>
            <ErrorBoundary>
                <Footer/>
            </ErrorBoundary>
        </div>
    </div>
);

export default StandartLayout;