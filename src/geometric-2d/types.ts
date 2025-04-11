/** 点坐标: [x, y] */
export type IPoint = [number, number];

/** 直线: [[x1,y1], [x2,y2]] */
export type ILine = [IPoint, IPoint];

export interface IEllipse {
  centerPoint: IPoint;
  radiusX: number;
  radiusY: number;
}

export type IPolygon = IPoint[];

