import Spinner from '../components/Spinner/Spinner';
import ErrorComponent from '../components/ErrorComponent/ErrorComponent';

export default function checkContentState(error, isLoading) {
    if (isLoading) {
      return <Spinner />
    } else if (error) {
      return <ErrorComponent error={error} />
    } else {
      return false;
    }
  }