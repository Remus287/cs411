import './globals.css';

import type { AppProps } from 'next/app';
import {FunctionComponent} from "react";
import createCache from "@emotion/cache";
import {SessionProvider, useSession} from "next-auth/react";
import {Session} from "next-auth";
import {NextComponentType} from "next";


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
