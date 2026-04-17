"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  ShoppingBag,
  Loader2,
  ArrowRight,
  Check,
} from "lucide-react";
import { toast } from "react-toastify";
import { register } from "@/apis/auth.api";
import { RegisterForm } from "@/types/auth.type";
import {
  validateRegisterForm,
  passwordStrengthRules,
  type RegisterErrors,
} from "@/validators/register.validator";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState<RegisterForm>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [passwordFocused, setPasswordFocused] = useState(false);

  const validate = (): boolean => {
    const newErrors = validateRegisterForm(form);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof RegisterForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await register(form);
      toast.success("Đăng ký thành công! Hãy đăng nhập để tiếp tục. 🎉");
      router.push("/login");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ?? "Đăng ký thất bại. Vui lòng thử lại.";
      toast.error(Array.isArray(message) ? message[0] : message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: keyof RegisterForm) =>
    `h-11 w-full rounded-xl border bg-white pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm outline-none transition focus:ring-2 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-600 ${
      errors[field]
        ? "border-red-400 focus:ring-red-400/30 dark:border-red-500"
        : "border-zinc-200 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-zinc-700 dark:focus:border-indigo-400"
    }`;

  return (
    <div className="flex min-h-screen">
      {/* ── Left panel (decorative) ── */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 p-12 lg:flex">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white" />
          <div className="absolute -bottom-32 -left-20 h-[500px] w-[500px] rounded-full bg-white" />
          <div className="absolute left-1/3 top-1/3 h-64 w-64 rounded-full bg-white" />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <ShoppingBag className="h-8 w-8 text-white" />
          <span className="text-2xl font-bold text-white">DaoDuckWear</span>
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl font-bold leading-snug text-white">
            Gia nhập cộng đồng
            <br />
            <span className="text-blue-200">thời trang của chúng tôi.</span>
          </h2>
          <p className="text-lg text-blue-100">
            Tạo tài khoản miễn phí và bắt đầu khám phá những outfit tuyệt vời.
          </p>

          {/* Feature list */}
          <ul className="space-y-3">
            {[
              "Ưu đãi thành viên độc quyền",
              "Theo dõi đơn hàng dễ dàng",
              "Lưu sản phẩm yêu thích",
            ].map((feat) => (
              <li
                key={feat}
                className="flex items-center gap-3 text-sm text-blue-100"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                  <Check className="h-3 w-3 text-white" />
                </span>
                {feat}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-sm text-blue-200">
          © {new Date().getFullYear()} DaoDuckWear. All rights reserved.
        </p>
      </div>

      {/* ── Right panel (form) ── */}
      <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-12 dark:bg-zinc-950">
        {/* Mobile logo */}
        <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
          <ShoppingBag className="h-7 w-7 text-indigo-600" />
          <span className="text-xl font-bold text-zinc-900 dark:text-white">
            DaoDuckWear
          </span>
        </Link>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
              Tạo tài khoản
            </h1>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Đã có tài khoản?{" "}
              <Link
                href="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Đăng nhập
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Username */}
            <div className="space-y-1.5">
              <label
                htmlFor="username"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Tên người dùng
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="nguyenvana"
                  className={inputClass("username")}
                />
              </div>
              {errors.username && (
                <p className="text-xs text-red-500">{errors.username}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="ten@example.com"
                  className={inputClass("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  placeholder="••••••••"
                  className={`${inputClass("password")} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  tabIndex={-1}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password}</p>
              )}
              {/* Password strength hints */}
              {(passwordFocused || form.password.length > 0) && (
                <div className="mt-2 grid grid-cols-3 gap-1.5">
                  {passwordStrengthRules.map((rule) => {
                    const passed = rule.test(form.password);
                    return (
                      <div
                        key={rule.label}
                        className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors ${
                          passed
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                            : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
                        }`}
                      >
                        <Check
                          className={`h-3 w-3 shrink-0 ${passed ? "opacity-100" : "opacity-0"}`}
                        />
                        {rule.label}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div className="space-y-1.5">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`${inputClass("confirmPassword")} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  tabIndex={-1}
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500">{errors.confirmPassword}</p>
              )}
              {!errors.confirmPassword &&
                form.confirmPassword.length > 0 &&
                form.password === form.confirmPassword && (
                  <p className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                    <Check className="h-3 w-3" />
                    Mật khẩu khớp
                  </p>
                )}
            </div>

            {/* Terms */}
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Bằng cách đăng ký, bạn đồng ý với{" "}
              <Link
                href="/terms"
                className="font-medium text-indigo-600 hover:underline"
              >
                Điều khoản dịch vụ
              </Link>{" "}
              và{" "}
              <Link
                href="/privacy"
                className="font-medium text-indigo-600 hover:underline"
              >
                Chính sách bảo mật
              </Link>{" "}
              của chúng tôi.
            </p>

            {/* Submit */}
            <button
              id="register-submit-button"
              type="submit"
              disabled={loading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition hover:bg-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang tạo tài khoản...
                </>
              ) : (
                <>
                  Tạo tài khoản
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
