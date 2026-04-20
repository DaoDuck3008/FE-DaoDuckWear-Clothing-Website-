import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-editorial-background px-6">
      <div className="max-w-md w-full text-center space-y-12">
        <div className="space-y-4">
          <h1 className="text-8xl font-bold tracking-tighter text-editorial-primary">
            403
          </h1>
          <h2 className="text-2xl font-bold tracking-tight text-editorial-primary uppercase">
            Truy cập bị từ chối
          </h2>
          <div className="h-px w-12 bg-editorial-accent mx-auto"></div>
        </div>

        <p className="text-stone-500 text-sm leading-relaxed">
          Rất tiếc, bạn không có quyền truy cập vào khu vực này. <br />
          Vui lòng liên hệ quản trị viên hoặc quay lại trang chủ.
        </p>

        <div className="pt-8">
          <Link
            href="/"
            className="inline-block bg-black text-white px-12 py-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all hover:bg-stone-800"
          >
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
