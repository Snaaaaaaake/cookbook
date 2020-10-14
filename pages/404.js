import Head from 'next/head';
import StandartLayout from '../src/components/StandartLayout/StandartLayout';
import appTitle from '../src/constants/appTitle';

function Error() {
    return (<>
        <Head>
            <title>{`${appTitle}: ошибка`}</title>
            <meta name="robots" content="noindex" />
        </Head>

        <StandartLayout>
            <h1 className="mt-3">
                Ошибка 404: ресурс не найден.
            </h1>
        </StandartLayout>
    </>)
  }

  export default Error;