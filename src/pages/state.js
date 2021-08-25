import { proxy } from 'valtio';
import { useSnapshot } from 'valtio';

const state = proxy({ islogged: false });

const isLoggedIn = () => {
	const snap = useSnapshot(state);
	if (localStorage.getItem('islogged')) {
		state.islogged = true;
		return snap;
	} else {
		state.islogged = false;
		return snap;
	}
};

export { state, isLoggedIn };
