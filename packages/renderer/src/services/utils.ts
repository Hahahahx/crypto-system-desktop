export function changeUpdateParamsBoolToNumber<T>(params: any) {
  type KeyName = keyof T;
  const newParams: any = {};
  const newData = params.new_data;
  Object.keys(newData).forEach((k: any) => {
    if (typeof newData[k as KeyName] === "boolean") {
      newParams[k] = Number(newData[k as KeyName]);
    } else {
      newParams[k] = newData[k as KeyName];
    }
  });
  params.new_data = newParams;
  return params;
}

export function changeCreateParamsBoolToNumber<T>(params: any) {
  type KeyName = keyof T;
  const newParams: any = {};
  Object.keys(params).forEach((k: any) => {
    if (typeof params[k as KeyName] === "boolean") {
      newParams[k] = Number(params[k as KeyName]);
    } else {
      newParams[k] = params[k as KeyName];
    }
  });
  return newParams;
}

export function filterParams(Oldobj: any, newObj: any) {
  let filterObj: any = {};
  Object.keys(Oldobj).forEach((key) => {
    if (Oldobj[key] !== newObj[key]) {
      filterObj[key] = newObj[key];
    }
  });
  return filterObj;
}
