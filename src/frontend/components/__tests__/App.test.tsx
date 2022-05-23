import React from 'react';
import { render } from '@testing-library/react';
import ProviderMock from '../../../__mocks__/ProviderMock';
import App from '../App';

describe('<App/> Component', () => {
    beforeEach(() => {
        fetchMock.resetMocks();
    });

    test('Should render root <App /> Component', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({
            //First Data Fetch
            data: 'data'
        }));

        render(
            <ProviderMock initialState={undefined}>
                <App />
            </ProviderMock>
        )
    })
})