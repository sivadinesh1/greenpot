import { proxy } from 'valtio';
import { useSnapshot } from 'valtio';

const state = proxy({ islogged: false, user: null });

const isLoggedIn = () => {
	const snap = useSnapshot(state);
	if (localStorage.getItem('islogged')) {
		state.islogged = true;
		state.user = localStorage.getItem('user');
		return snap;
	} else {
		state.islogged = false;
		state.user = null;
		return snap;
	}
};

export { state, isLoggedIn };
