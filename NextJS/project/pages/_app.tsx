import "./globals.css";

import type { AppProps } from "next/app";
import { getSession, SessionProvider } from "next-auth/react";

const Application = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
	return (
		<SessionProvider session={pageProps.session}>
			<div className={"w-screen h-screen max-w-screen max-h-screen"}>
				<main className={"w-screen h-screen bg-[#2b2d30] max-w-screen max-h-screen"}>
					<Component {...pageProps} />
				</main>
			</div>
		</SessionProvider>
	);
};

export default Application;
