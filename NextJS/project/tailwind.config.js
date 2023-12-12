/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",

		// Or if using `src` directory:
		"./src/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			boxShadow: {
				left: "-20px 0px 20px -10px rgba(0, 0, 0, 0.1)",
			},
			backgroundImage: {
				"landing-main": "./public/background.jpg",
			},
			transitionProperty: {
				fontColor: "color",
				background: "background, background-color, background-image",
				size: "width, height",
				passwordStrength: "background-color, width",
				opacity: "opacity",
				newsLink: "background-color, opacity",
				transform: "transform",
			},
			backgroundColor: {
				passwordStrength: {
					0: "#c0ff33",
					25: "#feff5c",
					50: "#ffc163",
					75: "#ffa879",
					100: "#fb4b4b",
				},
			},
		},
	},
	plugins: [],
};
