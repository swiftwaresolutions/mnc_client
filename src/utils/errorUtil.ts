import { AxiosError } from "axios";
import { errorHandling } from "../error/state/error-handle-action";

const handleError = (dispatch: (payload: any) => void, error: any) => {
  if (error instanceof AxiosError) {
     if (error.response && error.response?.data?.message) {
      if (error.response?.data?.status == 500) {
        error = "Inform to Admin";
      } else if (error.response?.data?.status == 400) {
        error = "Bad Params : " + error.response?.data?.message;
      } else {
        error = error.response?.data?.message;
      }
    } else if (error.response && error.response?.data?.message) {
      if (error.response?.data?.status == 500) {
        error = "Inform to Admin";
      } else if (error.response?.data?.status == 400) {
        error = "Bad Params : " + error.response?.data?.error;
      } else {
        error = error.response?.data?.message;
      }
    }
    if (typeof error == "object") {
      error= "Inform To Admin :  "+error.message
    }
    dispatch(errorHandling(error));
  }
  console.error(error);
};

export { handleError };
