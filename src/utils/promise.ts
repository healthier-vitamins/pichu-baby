import { AxiosError, AxiosResponse } from "axios";

function to(promise: any) {
  return promise
    .then((res: any) => {
      return [null, res];
    })
    .catch((err: any) => {
      return [err];
    });
}

/** //TODO to be replace with axios interceptors */
function axiosTo(axios: any) {
  return axios
    .then((res: AxiosResponse) => {
      return [null, res.data];
    })
    .catch((err: AxiosError) => {
      return [err.response];
    });
}

function resolvePromise(promise: any) {
  new Promise((resolve, reject) => {
    promise.then((res: any) => resolve(res)).catch((err: any) => reject(err));
  });
}

export { to, axiosTo, resolvePromise };
