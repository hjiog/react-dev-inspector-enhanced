import path from 'path';
import type { NextHandleFunction, IncomingMessage } from 'connect';
import type { RequestHandler } from 'express';
import createReactLaunchEditorMiddleware from 'react-dev-utils/errorOverlayMiddleware';
import launchEditorEndpoint from 'react-dev-utils/launchEditorEndpoint.js';
import { addHOC } from './addHOC';

const reactLaunchEditorMiddleware: RequestHandler =
  createReactLaunchEditorMiddleware();

export const queryParserMiddleware: NextHandleFunction = (
  req: IncomingMessage & { query?: Object },
  res,
  next,
) => {
  if (!req.query && req.url) {
    const url = new URL(req.url, 'https://placeholder.domain');
    req.query = Object.fromEntries(url.searchParams.entries());
  }
  next();
};

export const launchEditorMiddleware: RequestHandler = (req, res, next) => {
  if (req.url.startsWith(launchEditorEndpoint)) {
    /**
     * retain origin endpoint for backward compatibility <= v1.2.0
     */
    if (
      // relative route used in `Inspector.tsx` `gotoEditor()`
      req.url.startsWith(`${launchEditorEndpoint}/relative`) &&
      typeof req.query.fileName === 'string'
    ) {
      req.query.fileName = path.join(process.cwd(), req.query.fileName);
    }

    reactLaunchEditorMiddleware(req, res, next);
  } else if (req.url.startsWith('/hoc')) {
    const HOC = JSON.parse((req.query.HOC as string) || '{}') as {
      importCode: string;
      name: string;
      params?: Record<string, any>;
    };
    const colNumber = Number(req.query.colNumber);
    const lineNumber = Number(req.query.lineNumber);
    const absolutePath = path.resolve(req.query.fileName as string);
    addHOC({
      componentName: HOC.name,
      importCode: HOC.importCode,
      colNumber,
      lineNumber,
      absolutePath,
    });
  } else {
    next();
  }
};

/**
 * retain create method for backward compatibility <= v1.2.0
 */
export const createLaunchEditorMiddleware: () => RequestHandler = () =>
  launchEditorMiddleware;
