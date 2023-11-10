import './globals.css';

import { CacheProvider, EmotionCache } from '@emotion/react';
import type { AppProps } from 'next/app';
import {FunctionComponent} from "react";
import createCache from "@emotion/cache";

interface ApplicationAppProps extends AppProps {
	emotionCache?: EmotionCache;
}
const createEmotionCache = () => {
	return createCache({ key: 'css', prepend: true });
}
const clientSideEmotionCache = createEmotionCache();

const Application : FunctionComponent<ApplicationAppProps> = (props) => {
	const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
	
	return (
		<div data-theme="light" className={' max-w-screen h-screen overflow-hidden'}>
			<main className={'w-screen h-screen'}>
				<Component {...pageProps} />
			</main>
		</div>
	)
}

export default Application;
