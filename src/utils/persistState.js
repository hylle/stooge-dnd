const getInitialStateFromStorage = (
	defaultState,
	storageKey,
	storageVersion,
) => {
	const storage = JSON.parse(window.localStorage.getItem(storageKey));
	const initialState = {
		...defaultState,
		storageVersion,
	};

	return storage && storage.storageVersion === storageVersion
		? storage
		: initialState;
};

const createPersistStateFunction = (storageKey) => (state) => {
	window.localStorage.setItem(storageKey, JSON.stringify(state));

	return state;
};

export default createPersistStateFunction;

export { getInitialStateFromStorage };
