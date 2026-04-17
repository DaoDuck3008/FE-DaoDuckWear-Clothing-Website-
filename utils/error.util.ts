import { AxiosError } from "axios";
import { toast } from "react-toastify";

/**
 * Định dạng phản hồi lỗi từ Backend (HttpExceptionFilter)
 */
interface ApiErrorResponse {
  success: boolean;
  statusCode: number;
  message: string | string[];
  path: string;
  method: string;
  timestamp: string;
}

/**
 * Xử lý lỗi tập trung từ API trả về.
 * @param error Lỗi nhận được từ axios/try-catch
 * @param fallbackMessage Tin nhắn mặc định nếu không parse được lỗi từ server
 * @returns Tin nhắn lỗi cuối cùng (dùng để lưu log hoặc debug)
 */
export const handleApiError = (
  error: any,
  fallbackMessage: string = "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
) => {
  const axiosError = error as AxiosError<ApiErrorResponse>;
  const responseData = axiosError.response?.data;

  let finalMessage = fallbackMessage;

  // 1. Trích xuất message từ response của Backend
  if (responseData?.message) {
    if (Array.isArray(responseData.message)) {
      // Nếu là mảng, lấy lỗi đầu tiên
      finalMessage = responseData.message[0];
    } else {
      finalMessage = responseData.message;
    }
  }
  // 2. Nếu không có message từ backend, dùng message mặc định của Axios
  else if (axiosError.message) {
    finalMessage = axiosError.message;
  }

  // Hiển thị thông báo Toast
  toast.error(finalMessage);

  // Trả về message để component có thể sử dụng tiếp nếu cần (vd: clear form)
  return finalMessage;
};
