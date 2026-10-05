const LoadingScreen = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <img
          src="/assets/logo.png"
          alt="BloodConnect"
          className="h-12 w-auto"
        />

        <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-[#b4232c]" />

        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;