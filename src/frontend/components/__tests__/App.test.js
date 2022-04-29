import React from 'react';
import { render } from '@testing-library/react';
import ProviderMock from '../../../__mocks__/ProviderMock';
import App from '../App';

describe('<App/> Component', () => {
    beforeEach(() => {
        fetch.resetMocks();
    });

    test('Should render root <App /> Component', async () => {
        fetch.mockResponseOnce(JSON.stringify({
            //First Data Fetch
            data: 'data'
        }));

        render(
            <ProviderMock>
                <App />
            </ProviderMock>
        )
    })
})