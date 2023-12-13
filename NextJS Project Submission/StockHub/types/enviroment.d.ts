declare global {
	interface ProcessEnv {
		MONGODB_URI: string;
		NODE_ENV: "development" | "production";

		NEXT_PUBLIC_API_URL: string;
		NEXT_AUTH_SECRET: string;

		ALPHA_VANTAGE_API_KEY: string;
		TWELVE_DATA_API_KEY: string;
		STOCK_NEWS_API_KEY: string;

		GITHUB_ID: string;
		GITHUB_SECRET: string;

		GOOGLE_ID: string;
		GOOGLE_SECRET: string;

		SENDGRID_API_KEY: string;
	}
}
export {};
