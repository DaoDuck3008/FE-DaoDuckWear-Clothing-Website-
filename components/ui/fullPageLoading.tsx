const FullPageLoading = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6">
        {/* Editorial styled loader */}
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 border-t-2 border-black rounded-full animate-spin"></div>
          <div className="absolute inset-0 border-r-2 border-stone-200 rounded-full"></div>
        </div>

        <div className="space-y-2 text-center">
          <h2 className="font-serif text-xl font-bold tracking-tighter text-black">
            ATELIER
          </h2>
          <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400 animate-pulse">
            CRAFTING EXPERIENCE...
          </p>
        </div>
      </div>
    </div>
  );
};

export default FullPageLoading;
