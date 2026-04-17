"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShoppingBag,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-toastify";
import { useAuthStore } from "@/stores/auth.store";
import { login } from "@/apis/auth.api";
import { LoginForm } from "@/types/auth.type";
import {
  validateLoginForm,
  type LoginErrors,
} from "@/validators/login.validator";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});

  const validate = (): boolean => {
    const newErrors = validateLoginForm(form);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // clear field error on change
    if (errors[name as keyof LoginForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await login(form);
      const { accessToken, user } = res.data;
      setAuth(accessToken, user);
      toast.success(`Chào mừng trở lại, ${user.username}! 🎉`);
      router.push("/");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ?? "Đăng nhập thất bại. Vui lòng thử lại.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* ── Left panel (decorative) ── */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-12 lg:flex">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-white" />
          <div className="absolute -bottom-32 -right-20 h-[500px] w-[500px] rounded-full bg-white" />
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <ShoppingBag className="h-8 w-8 text-white" />
          <span className="text-2xl font-bold text-white">DaoDuckWear</span>
        </div>

        <div className="relative z-10 space-y-4">
          <h2 className="text-4xl font-bold leading-snug text-white">
            Phong cách của bạn,
            <br />
            <span className="text-indigo-200">câu chuyện của bạn.</span>
          </h2>
          <p className="text-lg text-indigo-100">
            Khám phá bộ sưu tập thời trang độc đáo dành riêng cho bạn.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4">
          <div className="flex -space-x-3">
            {["D", "A", "O"].map((l) => (
              <div
                key={l}
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-indigo-500 bg-white text-sm font-bold text-indigo-600"
              >
                {l}
              </div>
            ))}
          </div>
          <p className="text-sm text-indigo-200">
            Hơn <strong className="text-white">10,000+</strong> khách hàng tin tưởng
          </p>
        </div>
      </div>

      {/* ── Right panel (form) ── */}
      <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-12 dark:bg-zinc-950">
        {/* Mobile logo */}
        <Link
          href="/"
          className="mb-8 flex items-center gap-2 lg:hidden"
        >
          <ShoppingBag className="h-7 w-7 text-indigo-600" />
          <span className="text-xl font-bold text-zinc-900 dark:text-white">
            DaoDuckWear
          </span>
        </Link>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
              Đăng nhập
            </h1>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Chưa có tài khoản?{" "}
              <Link
                href="/register"
                className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
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
                  className={`h-11 w-full rounded-xl border bg-white pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm outline-none transition focus:ring-2 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-600 ${
                    errors.email
                      ? "border-red-400 focus:ring-red-400/30 dark:border-red-500"
                      : "border-zinc-200 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-zinc-700 dark:focus:border-indigo-400"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Mật khẩu
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`h-11 w-full rounded-xl border bg-white pl-10 pr-11 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm outline-none transition focus:ring-2 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-600 ${
                    errors.password
                      ? "border-red-400 focus:ring-red-400/30 dark:border-red-500"
                      : "border-zinc-200 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-zinc-700 dark:focus:border-indigo-400"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
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
            </div>

            {/* Remember me */}
            <label className="flex cursor-pointer items-center gap-2.5">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={form.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 cursor-pointer rounded border-zinc-300 accent-indigo-600"
              />
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                Ghi nhớ đăng nhập
              </span>
            </label>

            {/* Submit */}
            <button
              id="login-submit-button"
              type="submit"
              disabled={loading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition hover:bg-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  Đăng nhập
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
