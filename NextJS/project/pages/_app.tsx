import './globals.css';

import type { AppProps } from 'next/app';
import {SessionProvider} from "next-auth/react";

const Application = ({Component, pageProps: {session, ...pageProps}}: AppProps) => {
	
	return (
		<SessionProvider session={pageProps.session}>
			<div className={'w-screen h-screen overflow-hidden'}>
				<main className={'w-screen h-screen'}>
					<Component {...pageProps} />
				</main>
			</div>
		</SessionProvider>
	)
}

export default Application;
