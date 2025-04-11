import { IChangeHelloPayload } from '@actions';
export interface IInitialState {
	testReducer?: IChangeHelloPayload | undefined
}
const initialState: IInitialState = {};
export default  initialState;
