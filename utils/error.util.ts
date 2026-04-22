import { AxiosError } from "axios";
import { ApiError } from "@/types/api";
import { toast } from "react-toastify";

/**
 * Tiện ích xử lý lỗi từ API một cách thống nhất cho toàn bộ Frontend.
 * Nó sẽ bóc tách dữ liệu từ cấu trúc chuẩn RESTful mà Backend trả về (success, statusCode, errorCode, message, errors).
 *
 * @param error - Đối tượng lỗi từ Axios hoặc lỗi không xác định
 * @param customMessage - Thông báo thay thế nếu bạn không mún dùng message từ Backend
 */
export const handleApiError = (error: unknown, customMessage?: string) => {
  const axiosError = error as AxiosError<ApiError>;

  // 1. Trích xuất dữ liệu lỗi từ response của backend
  const apiError = axiosError.response?.data;

  // 2. Xác định message hiển thị:
  // Thử lấy message từ backend -> Nếu không có thì lấy customMessage -> Cuối cùng mới lấy message mặc định của Axios
  const message =
    apiError?.message ||
    customMessage ||
    axiosError.message ||
    "Đã có lỗi xảy ra, vui lòng thử lại sau!";

  // 3. Xử lý hiển thị thông báo lỗi
  if (apiError?.errors && Array.isArray(apiError.errors)) {
    // Trường hợp lỗi Validation (có danh sách các field bị sai)
    // Hiển thị message tổng quát trước
    toast.error(message);

    // Hiển thị chi tiết từng lỗi nhỏ (nếu cần)
    apiError.errors.forEach((err) => {
      toast.error(`• ${err}`);
    });
  } else {
    // Trường hợp lỗi thông thường hoặc lỗi logic nghiệp vụ
    toast.error(message);
  }

  // 4. Logging nâng cao cho môi trường Development
  if (
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_NODE_ENV === "development"
  ) {
    console.group("--- [FRONTEND API ERROR] ---");
    console.error(
      `Endpoint: [${axiosError.config?.method?.toUpperCase()}] ${axiosError.config?.url}`,
    );
    console.error(
      `Status: ${axiosError.response?.status} (${apiError?.errorCode || "N/A"})`,
    );
    console.error(`Message: ${message}`);
    if (apiError?.errors) console.error("Validation Errors:", apiError.errors);
    if (apiError?.stack) {
      console.error("Server Stack Trace:");
      console.error(apiError.stack);
    }
    console.groupEnd();
  }

  // Trả về object lỗi đã được chuẩn hóa để component có thể xử lý thêm nếu muốn
  return {
    message,
    errorCode: apiError?.errorCode,
    errors: apiError?.errors,
    statusCode: axiosError.response?.status || 500,
  };
};

/** Alias cho handleApiError để dùng linh hoạt */
export const handleError = handleApiError;
