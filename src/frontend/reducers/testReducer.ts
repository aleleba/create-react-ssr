import { TTest } from '@actions';

const initialState = {
	hello: 'world'
};

const testReducer = (state = initialState, action: TTest) => {
	switch (action.type){
	case 'CHANGE_HELLO': {
		const newHello = action.payload.hello;
		return {
			hello: newHello
		};
	}
	default:
		return state;
	}
};

export default testReducer;
