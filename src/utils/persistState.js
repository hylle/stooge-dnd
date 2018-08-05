const createPersistStateFunction = (storageKey) => (state) => {
	window.localStorage.setItem(storageKey, JSON.stringify(state));

	return state;
};

export default createPersistStateFunction;
