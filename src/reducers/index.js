import { combineReducers } from 'redux';
import players from './players';
import monsters from './monsters';
import initiative from './initiative';

export default combineReducers({
	players,
	monsters,
	initiative,
});
