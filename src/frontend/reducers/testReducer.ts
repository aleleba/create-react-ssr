export interface ITestReducer {
	hello: any | undefined
}

const initialState = {
	hello: 'world'
};

const testReducer = (state = initialState, action: { type: any; payload: { hello: any; }; }) => {
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
