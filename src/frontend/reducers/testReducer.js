const initialState = {
    hello: 'world'
}

let testReducer = (state = initialState, action) => {
    switch (action.type){
        case 'CHANGE_HELLO': {
            let newHello = action.payload.hello
            return {
                hello: newHello
            }
        }
        default:
            return state
    }
}

export default testReducer