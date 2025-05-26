import ResizableLayout from "./ResizableLayout";

const Index = () => {
  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-blue-400">ChaiCode</h1>
          <span className="text-gray-400 text-sm">[CPP Practice] D19 Q2</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <ResizableLayout />
      </div>
    </div>
  );
};

export default Index;
