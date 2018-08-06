import { all, fork } from 'redux-saga/effects';
import watchInitiative from './initiative';

export default function* rootSaga() {
	yield all([fork(watchInitiative)]);
}
