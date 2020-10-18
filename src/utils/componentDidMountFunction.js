export default function componentDidMountFunction (
    serverSideState,
    applySatateAction,
    fetchAction,
    service,
    ...rest
) {
    return () => {
        // useEffect
        const fetchCondition = { canceled: false };
        if (serverSideState) {
            applySatateAction(serverSideState)
        } else {
            fetchAction(service, fetchCondition, ...rest);
        }
        return () => fetchCondition.canceled = true;
        //
    }
}