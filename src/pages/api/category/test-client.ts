import { createServer } from 'http';

import type { NextApiHandler } from 'next';
import type { __ApiPreviewProps } from 'next/dist/next-server/server/api-utils';
import { apiResolver } from 'next/dist/next-server/server/api-utils';
import request from 'supertest';

export default (handler: NextApiHandler, query: Record<string, unknown> | undefined): request.SuperTest<request.Test> =>
	request(
		createServer(async (req, res) => {
			return apiResolver(req, res, query, handler, {} as __ApiPreviewProps, false);
		}),
	);

// import { IncomingMessage, ServerResponse, createServer } from 'http';

// import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
// import { __ApiPreviewProps, apiResolver } from 'next/dist/next-server/server/api-utils';
// import request from 'supertest';

// export default (handler: NextApiHandler, query: Record<string, unknown> | undefined, isPost: boolean): request.SuperTest<request.Test> =>
// 	request(
// 		createServer(async (req: IncomingMessage, res: ServerResponse) => {
// 			return apiResolver(
// 				req,
// 				res,
// 				isPost ? null : query,
// 				async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
// 					if (isPost) {
// 						req.body = query;
// 					}
// 					handler(req, res);
// 				},
// 				{} as __ApiPreviewProps,
// 				false,
// 			);
// 		}),
// 	);
