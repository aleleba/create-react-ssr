import { defineConfig } from 'cypress';
export default defineConfig({
	env: {},
	e2e: {
		/*setupNodeEvents(on, config) {
			// implement node event listeners here
		},*/
		baseUrl: 'http://localhost',
		specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
		experimentalRunAllSpecs: true,
	},
});