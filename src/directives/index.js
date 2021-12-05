import hasPermi from "./hasPermi";

//  注册权限
export default function installDirective(app){
  app.directive('hasPermi',hasPermi)
}