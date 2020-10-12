import Head from 'next/head';
import StandartLayout from '../src/components/StandartLayout/StandartLayout';
import appTitle from '../src/constants/appTitle';

function Error({ statusCode }) {
    return (<>
        <Head>
            <title>{`${appTitle}: ошибка`}</title>
            <meta name="robots" content="noindex" />
        </Head>

        <StandartLayout>
            <h1 className="mt-3">
            {statusCode
                ? `Ошибка ${statusCode}`
                : 'На сервере произошла ошибка'}
            </h1>
        </StandartLayout>
    </>)
  }
  
  Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    return { statusCode }
  }
  
  export default Error