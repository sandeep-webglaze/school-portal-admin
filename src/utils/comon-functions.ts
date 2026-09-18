interface PlainObject {
  [key: string]: any;
}

const replacePathParams = (path: string, pathParams?: PlainObject) => {
  let pathToGo = path;

  if (pathParams) {
    Object.keys(pathParams).forEach((param) => {
      pathToGo = pathToGo.replace(`:${param}`, pathParams[param]);
    });
  }

  return pathToGo;
};

export { replacePathParams };
