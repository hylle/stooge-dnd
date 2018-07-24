import { combineReducers } from 'redux';
import players from './players';
import monsters from './monsters';

export default combineReducers({
	players,
	monsters,
});
