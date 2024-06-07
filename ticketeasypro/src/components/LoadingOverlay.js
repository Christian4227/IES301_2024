const LoadingOverlay = () => (
    <div className="fixed inset-0 flex justify-center items-center z-20">
        <div className="absolute inset-0 bg-black bg-opacity-[16]"></div>
        <div className="relative z-30 text-white text-xs">Loading...</div>
    </div>
);

export default LoadingOverlay;
