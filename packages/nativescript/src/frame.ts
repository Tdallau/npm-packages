declare let Frame: any;
declare type Frame = any;
declare type ViewBase = any;

export function getTopUiFrame(): Frame {
  return getParentFrame(Frame.topmost());
}

export function getParentFrame(frame: Frame): Frame {
  if(frame && frame.page) {
    return getParentFrame(frame.page.frame);
  } else {
    return frame;
  }
}

export function getViewChildrenByClassName(v: ViewBase, className: string, agg: ViewBase[]) {
  if(v.cssClasses.has(className)) {
    agg.push(v);
  }

  v.eachChild((vb: ViewBase) => {
    getViewChildrenByClassName(vb, className, agg);
    return true;
  })
}

export function getElementByClassName(className: string, topView = getTopUiFrame()) {
  const rtr: ViewBase[] = [];
  getViewChildrenByClassName(topView, className, rtr);

  return rtr;
}