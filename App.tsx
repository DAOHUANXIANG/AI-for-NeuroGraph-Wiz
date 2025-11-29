import React, { useState } from 'react';
import CodePanel from './components/CodePanel';
import GraphCanvas from './components/GraphCanvas';
import ChatPanel from './components/ChatPanel';
import { analyzeCodeAndGenerateGraph } from './services/geminiService';
import { GraphData } from './types';
import { LayoutDashboard, AlertCircle, MessageSquare, Code, Monitor, Download } from 'lucide-react';

const DEFAULT_CODE = `import torch
import torch.nn as nn
import torch.nn.functional as F

# Example: Paste your complex model here or upload files

class SimpleNet(nn.Module):
    def __init__(self):
        super(SimpleNet, self).__init__()
        self.conv1 = nn.Conv2d(1, 10, kernel_size=5)
        self.conv2 = nn.Conv2d(10, 20, kernel_size=5)
        self.fc1 = nn.Linear(320, 50)
        self.fc2 = nn.Linear(50, 10)

    def forward(self, x):
        x = F.relu(F.max_pool2d(self.conv1(x), 2))
        x = F.relu(F.max_pool2d(self.conv2(x), 2))
        x = x.view(-1, 320)
        x = F.relu(self.fc1(x))
        x = self.fc2(x)
        return x
`;

const App: React.FC = () => {
  const [code, setCode] = useState<string>(DEFAULT_CODE);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Layout state
  const [showChat, setShowChat] = useState(true);
  const [showCode, setShowCode] = useState(true);

  const handleGenerate = async () => {
    if (!code.trim()) return;

    setIsGenerating(true);
    setError(null);
    try {
      const data = await analyzeCodeAndGenerateGraph(code);
      setGraphData(data);
      // Auto-open chat if it was closed, to encourage interaction
      if (!showChat) setShowChat(true);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGraphUpdateFromChat = (newData: GraphData) => {
    setGraphData(newData);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-950 text-gray-100 overflow-hidden font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="h-14 bg-gray-900 border-b border-gray-800 flex items-center px-4 shrink-0 z-20 shadow-sm justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-1.5 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg shadow-lg shadow-blue-900/40">
            <LayoutDashboard size={20} className="text-white" />
          </div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            NeuroGraph Wiz
          </h1>
          <span className="text-[10px] font-bold tracking-wider bg-gray-800 text-gray-400 px-2 py-0.5 rounded border border-gray-700 uppercase">Pro Studio</span>
        </div>

        {/* Center Actions (Optional) */}
        <div className="hidden md:flex items-center text-sm text-gray-500 space-x-4">
             <div className="flex items-center gap-1">
                 <Monitor size={14} />
                 <span>Desktop Mode</span>
             </div>
        </div>

        <div className="flex items-center space-x-2">
            <button 
                onClick={() => setShowCode(!showCode)}
                className={`p-2 rounded-md transition-all duration-200 ${showCode ? 'bg-gray-800 text-blue-400 shadow-inner' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'}`}
                title="Toggle Code View"
            >
                <Code size={18} />
            </button>
            <button 
                onClick={() => setShowChat(!showChat)}
                className={`p-2 rounded-md transition-all duration-200 ${showChat ? 'bg-gray-800 text-purple-400 shadow-inner' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'}`}
                title="Toggle AI Assistant"
            >
                <MessageSquare size={18} />
            </button>
        </div>
      </header>

      {/* Main Content: 3-Column Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Left: Code Editor (Collapsible) */}
        <div 
            className={`shrink-0 h-full border-r border-gray-800 transition-all duration-300 ease-in-out bg-gray-900 ${
                showCode ? 'w-[400px] translate-x-0' : 'w-0 -translate-x-full opacity-0'
            }`}
        >
          <div className="w-[400px] h-full"> {/* Inner container to prevent layout reflow during transition */}
            <CodePanel 
                code={code} 
                setCode={setCode} 
                onGenerate={handleGenerate} 
                isGenerating={isGenerating} 
            />
          </div>
        </div>

        {/* Center: Graph Canvas */}
        <div className="flex-1 h-full relative bg-gray-950 flex flex-col">
          {error && (
             <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-900/95 border border-red-700 text-red-100 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 max-w-lg animate-in slide-in-from-top-4 duration-300">
               <AlertCircle size={20} className="text-red-400" />
               <span className="text-sm font-medium">{error}</span>
               <button onClick={() => setError(null)} className="ml-auto hover:bg-red-800 p-1 rounded transition-colors">✕</button>
             </div>
          )}
          
          <GraphCanvas graphData={graphData} />
        </div>

        {/* Right: AI Chat (Collapsible) */}
        <div 
            className={`shrink-0 h-full border-l border-gray-800 transition-all duration-300 ease-in-out bg-gray-900 ${
                showChat ? 'w-[360px] translate-x-0' : 'w-0 translate-x-full opacity-0'
            }`}
        >
            <div className="w-[360px] h-full">
                <ChatPanel 
                    code={code} 
                    graphData={graphData} 
                    onGraphUpdate={handleGraphUpdateFromChat} 
                />
            </div>
        </div>

      </div>
    </div>
  );
};

export default App;
