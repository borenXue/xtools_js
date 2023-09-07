import { accAdd, accDiv, accMulti } from "../number";
import { IPoint } from "./basic";

/** 根据角度求椭圆上的点坐标 */
export function mathEllipsePointByRadian(centerPoint: IPoint, radiusX: number, radiusY: number, radian: number) {
  /**
   * 方式一: 根据 椭圆方式 && y/x=tan(radian) && tan=sin/cos 推导而来 - 执行结果不对
   *    公式参考: https://blog.csdn.net/gongjianbo1992/article/details/107476030
   */
  const divDown1 = accMulti(
    radiusX, Math.sin(radian),
    radiusX, Math.sin(radian),
  );
  const divDown2 = accMulti(
    radiusY, Math.cos(radian),
    radiusY, Math.cos(radian),
  );
  const divDown = Math.sqrt(accAdd(divDown1, divDown2));

  const xDivUp = accMulti(radiusX, radiusY, Math.cos(radian));
  const yDivUp = accMulti(radiusX, radiusY, Math.sin(radian));
  
  const x = accAdd(centerPoint.x, accDiv(xDivUp, divDown));
  const y = accAdd(centerPoint.y, accDiv(yDivUp, divDown));

  return {x,y};




  /**
   * 方式二: 根据 椭圆方式 && y/x=tan(radian) 推导而来 - 执行结果不对
   */
  // const divUp = accMulti(radiusX, radiusY);
  // const divDownSqrt = accAdd(
  //   accMulti(radiusY, radiusY),
  //   accMulti(radiusX, radiusX, Math.tan(radian), Math.tan(radian)),
  // );
  // let x = accDiv(divUp, Math.sqrt(divDownSqrt));
  // const tempVal = accDiv(Math.PI, 2);;
  // if (!(radian > - tempVal && radian < tempVal)) {
  //   x = x;
  // }

  // const y = accMulti(x, Math.tan(radian));
  // return { x: accAdd(x, centerPoint.x), y: accAdd(y, centerPoint.y) };




  /**
   * 方式三: GitHub AI 自动生成代码...只有特殊角度正确,其他角度都不对
   */
  // const x = centerPoint.x + radiusX * Math.cos(radian);
  // const y = centerPoint.y + radiusY * Math.sin(radian);
  // return { x, y };
}
