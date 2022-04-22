export interface ITestReducer {
	hello: any | undefined
}

const initialState = {
	hello: 'world'
};

let testReducer = (state = initialState, action: { type: any; payload: { hello: any; }; }) => {
	switch (action.type){
	case 'CHANGE_HELLO': {
		let newHello = action.payload.hello;
		return {
			hello: newHello
		};
	}
	default:
		return state;
	}
};

export default testReducer;
