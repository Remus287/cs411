declare module "@auth/core" {
	interface User {
		_id: string;
		username: string;
		email: string;
		name: string;
		image: string;
		provider: string;
		favorites: string[];
		verified: boolean;
		password: string;
	}
}
