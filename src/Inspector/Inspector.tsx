import React, { useEffect, useRef, ReactElement } from 'react';
import type { Fiber } from 'react-reconciler';
import hotkeys, { KeyHandler } from 'hotkeys-js';
import { setupHighlighter } from './utils/highlight';
import {
  getElementCodeInfo,
  gotoEditor,
  getElementInspect,
  CodeInfo,
  addHOC,
  HOCConfigType,
} from './utils/inspect';
import Overlay from './Overlay';

export interface InspectParams {
  /** hover / click event target dom element */
  element: HTMLElement;
  /** nearest named react component fiber for dom element */
  fiber?: Fiber;
  /** source file line / column / path info for react component */
  codeInfo?: CodeInfo;
  /** react component name for dom element */
  name?: string;
}

export type ElementHandler = (params: InspectParams) => void;

export const defaultHotKeys = ['control', 'shift', 'command', 'c'];

const defaultHOCKeys = ['command', 'l'];

export interface InspectorProps extends Record<string, any> {
  /**
   * inspector toggle hotkeys
   *
   * supported keys see: https://github.com/jaywcjlove/hotkeys#supported-keys
   */
  keys?: {
    gotoEditor: string[];
    addHOC: string[];
  };
  onHoverElement?: ElementHandler;
  onClickElement?: ElementHandler;
  /**
   * whether disable click react component to open IDE for view component code
   */
  disableLaunchEditor?: boolean;
  HOC?: HOCConfigType;
}

export const Inspector: React.FC<InspectorProps> = props => {
  const {
    keys,
    onHoverElement,
    onClickElement,
    disableLaunchEditor,
    children,
    HOC,
  } = props;
  const {
    gotoEditor: gotoEditorKeys = defaultHotKeys,
    addHOC: addHOCKeys = defaultHOCKeys,
  } = keys || {};
  // hotkeys-js params need string
  const gotoEditorHotKey = gotoEditorKeys.join('+');
  const addHOCHotKey = addHOCKeys.join('+');
  /** inspector tooltip overlay */
  const overlayRef = useRef<Overlay>();
  const shouldAddHOCRef = useRef(false);
  const mousePointRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const recordMousePoint = ({ clientX, clientY }: MouseEvent) => {
    mousePointRef.current.x = clientX;
    mousePointRef.current.y = clientY;
  };

  const startInspect = () => {
    const overlay = new Overlay();
    overlayRef.current = overlay;

    const stopCallback = setupHighlighter({
      onPointerOver: handleHoverElement,
      onClick: handleClickElement,
    });

    overlay.setRemoveCallback(stopCallback);

    // inspect element immediately at mouse point
    const initPoint = mousePointRef.current;
    const initElement = document.elementFromPoint(initPoint.x, initPoint.y);
    if (initElement) handleHoverElement(initElement as HTMLElement);
  };

  const stopInspect = () => {
    overlayRef.current?.remove();
    overlayRef.current = undefined;
  };

  const handleHoverElement = (element: HTMLElement) => {
    const overlay = overlayRef.current;

    const codeInfo = getElementCodeInfo(element);
    const relativePath = codeInfo?.relativePath;
    const absolutePath = codeInfo?.absolutePath;

    const { fiber, name, title } = getElementInspect(element);

    overlay?.inspect?.([element], title, relativePath ?? absolutePath);

    onHoverElement?.({
      element,
      fiber,
      codeInfo,
      name,
    });
  };

  const handleClickElement = (element: HTMLElement) => {
    stopInspect();

    const codeInfo = getElementCodeInfo(element);
    const { fiber, name } = getElementInspect(element);

    console.log(shouldAddHOCRef, codeInfo, HOC);

    if (shouldAddHOCRef) {
      addHOC(codeInfo, HOC);
    }
    if (!disableLaunchEditor) {
      gotoEditor(codeInfo);
    }
    onClickElement?.({
      element,
      fiber,
      codeInfo,
      name,
    });
  };

  useEffect(() => {
    document.addEventListener('mousemove', recordMousePoint, true);
    return () => {
      document.removeEventListener('mousemove', recordMousePoint, true);
    };
  }, []);

  useEffect(() => {
    const handleHotKeys: KeyHandler = (event, handler) => {
      console.log(handler);
      if (handler.key === gotoEditorHotKey) {
        overlayRef.current ? stopInspect() : startInspect();
        shouldAddHOCRef.current = false;
      } else if (handler.key === addHOCHotKey) {
        overlayRef.current ? stopInspect() : startInspect();
        shouldAddHOCRef.current = true;
      } else if (handler.key === 'esc' && overlayRef.current) {
        stopInspect();
        shouldAddHOCRef.current = false;
      }
    };

    // https://github.com/jaywcjlove/hotkeys
    hotkeys(`${gotoEditorHotKey}, esc, ${addHOCHotKey}`, handleHotKeys);

    /**
     * @deprecated only for debug, will remove in next version
     */
    window.__REACT_DEV_INSPECTOR_TOGGLE__ = () =>
      overlayRef.current ? stopInspect() : startInspect();

    return () => {
      hotkeys.unbind(
        `${gotoEditorHotKey}, esc ,${addHOCHotKey}`,
        handleHotKeys,
      );
      delete window.__REACT_DEV_INSPECTOR_TOGGLE__;
    };
  }, [gotoEditorHotKey]);

  return children as ReactElement;
};
