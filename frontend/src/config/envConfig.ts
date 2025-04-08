type ENVConfigT = {
	APP_STAGE: string;
	BASE_API: string;
};

const { VITE_APP_STAGE, VITE_API_SERVER_PORT } = import.meta.env;

const baseConfig = {
	APP_STAGE: VITE_APP_STAGE,
};

const getEnvConfig = (): ENVConfigT => {
	switch (VITE_APP_STAGE) {
		case 'prod':
			return {
				...baseConfig,

				BASE_API: 'https://integration-project-team-2.onrender.com',
			};
		case 'dev':
			return {
				...baseConfig,

				BASE_API: 'https://ourforum-api-dev.com',
			};
		default:
			// local
			return {
				...baseConfig,

				BASE_API: `http://localhost:${VITE_API_SERVER_PORT}`,
			};
	}
};

export const envConfig = getEnvConfig();
