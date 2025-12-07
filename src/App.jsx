import React, { useState } from 'react';
import { Plus, Trash2, RotateCcw, Zap, Info } from 'lucide-react';

export default function BinaryTreeShowcase() {
  const [bstInput, setBstInput] = useState('');
  const [bst, setBst] = useState([50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 65]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [stats, setStats] = useState({});

  const buildTreeFromArray = (arr, low = 0, high = arr.length - 1) => {
    if (low > high) return null;
    const mid = Math.floor((low + high) / 2);
    return {
      value: arr[mid],
      left: buildTreeFromArray(arr, low, mid - 1),
      right: buildTreeFromArray(arr, mid + 1, high)
    };
  };

  const calculateStats = (arr) => {
    if (arr.length === 0) return { height: 0, nodes: 0, leaves: 0, depth: 0 };
    const height = Math.ceil(Math.log2(arr.length + 1));
    const leaves = Math.ceil(arr.length / 2);
    return {
      nodes: arr.length,
      height: height,
      leaves: leaves,
      balanced: Math.abs(Math.log2(arr.length + 1) - Math.floor(Math.log2(arr.length + 1))) < 0.5
    };
  };

  const searchInTree = (tree, val) => {
    if (!tree) return false;
    if (tree.value === val) return true;
    if (val < tree.value) return searchInTree(tree.left, val);
    return searchInTree(tree.right, val);
  };

  const handleSearch = () => {
    const val = parseInt(searchValue);
    if (!isNaN(val)) {
      const found = searchInTree(treeData, val);
      setSearchResult({ value: val, found: found });
    }
  };

  const addToBst = () => {
    if (bstInput.trim()) {
      const newVal = parseInt(bstInput);
      if (!bst.includes(newVal)) {
        const newArr = [...bst, newVal].sort((a, b) => a - b);
        setBst(newArr);
        setStats(calculateStats(newArr));
      }
      setBstInput('');
    }
  };

  const removeFromBst = (val) => {
    const newArr = bst.filter(v => v !== val);
    setBst(newArr);
    setStats(calculateStats(newArr));
    setSelectedNode(null);
  };

  const treeData = buildTreeFromArray(bst);
  const currentStats = calculateStats(bst);

  const TreeNode = ({ node, x, y, offsetX, depth = 0 }) => {
    if (!node) return null;
    const nextOffsetX = offsetX / 2.2;
    const yGap = 90;
    const isSelected = selectedNode === node.value;
    const isFound = searchResult && searchResult.found && searchResult.value === node.value;

    return (
      <>
        {node.left && (
          <>
            <line 
              x1={x} 
              y1={y} 
              x2={x - offsetX} 
              y2={y + yGap} 
              stroke="#a78bfa" 
              strokeWidth="3" 
              opacity="0.5"
            />
            <TreeNode 
              node={node.left} 
              x={x - offsetX} 
              y={y + yGap} 
              offsetX={nextOffsetX}
              depth={depth + 1}
            />
          </>
        )}
        {node.right && (
          <>
            <line 
              x1={x} 
              y1={y} 
              x2={x + offsetX} 
              y2={y + yGap} 
              stroke="#a78bfa" 
              strokeWidth="3" 
              opacity="0.5"
            />
            <TreeNode 
              node={node.right} 
              x={x + offsetX} 
              y={y + yGap} 
              offsetX={nextOffsetX}
              depth={depth + 1}
            />
          </>
        )}
        
        <g 
          onClick={() => setSelectedNode(isSelected ? null : node.value)}
          style={{ cursor: 'pointer' }}
        >
          {/* Outer glow */}
          <circle 
            cx={x} 
            cy={y} 
            r="28" 
            fill={isFound ? "#22c55e" : "#8b5cf6"} 
            opacity="0.3"
          />
          
          {/* Main circle */}
          <circle 
            cx={x} 
            cy={y} 
            r="24" 
            fill={isFound ? "#10b981" : isSelected ? "#ec4899" : "#a78bfa"}
            filter="drop-shadow(0 10px 20px rgba(0,0,0,0.3))"
          />
          
          {/* Border */}
          <circle 
            cx={x} 
            cy={y} 
            r="24" 
            fill="none" 
            stroke={isFound ? "#34d399" : isSelected ? "#fbbf24" : "#e9d5ff"} 
            strokeWidth={isFound ? "3" : isSelected ? "3" : "2"}
          />
          
          {/* Text */}
          <text 
            x={x} 
            y={y} 
            textAnchor="middle" 
            dy="0.35em" 
            fill="white" 
            fontSize="16" 
            fontWeight="bold"
          >
            {node.value}
          </text>

          {/* Search found checkmark */}
          {isFound && (
            <text 
              x={x + 18} 
              y={y - 18} 
              textAnchor="middle" 
              dy="0.35em" 
              fill="#10b981" 
              fontSize="20" 
              fontWeight="bold"
            >
              ✓
            </text>
          )}
        </g>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-2xl">
              <Zap size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-black text-white">Binary Search Tree</h1>
              <p className="text-purple-300 text-lg mt-1">Interactive visualization & operations</p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Panel - Tree Visualization */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-10 shadow-2xl border border-purple-500 border-opacity-30">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Tree Structure</h2>
                <div className="text-right">
                  <div className="text-sm text-slate-400">Total Nodes</div>
                  <div className="text-3xl font-bold text-purple-400">{currentStats.nodes}</div>
                </div>
              </div>

              {/* Tree Visualization */}
              <div className="bg-slate-700 bg-opacity-40 rounded-2xl p-6 overflow-x-auto border border-slate-600">
                {bst.length === 0 ? (
                  <div className="text-slate-400 text-center py-32 italic text-xl">
                    <div className="text-5xl mb-4">🌳</div>
                    Tree is empty. Add some values to get started!
                  </div>
                ) : (
                  <svg 
                    width="100%" 
                    height="550" 
                    viewBox="0 0 800 550" 
                    preserveAspectRatio="xMidYMid meet"
                    style={{ minHeight: '550px' }}
                  >
                    {treeData && <TreeNode node={treeData} x={400} y={40} offsetX={100} />}
                  </svg>
                )}
              </div>

              {/* Info Box */}
              <div className="mt-8 bg-gradient-to-r from-blue-500 to-cyan-500 bg-opacity-20 border border-blue-500 border-opacity-50 rounded-2xl p-6">
                <div className="flex gap-3">
                  <Info className="text-blue-400 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="text-blue-100 text-sm">
                      <span className="font-bold">Click on nodes</span> to select/deselect them, then use the delete button to remove. 
                      <span className="font-bold ml-2">Add values</span> to expand the tree. Tree automatically maintains BST property.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Controls & Stats */}
          <div className="space-y-8">
            {/* Add Node Card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-green-500 border-opacity-30">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Plus size={24} className="text-green-400" />
                Insert Node
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Value</label>
                  <input
                    type="number"
                    value={bstInput}
                    onChange={(e) => setBstInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addToBst()}
                    placeholder="Enter a number"
                    className="w-full px-4 py-3 rounded-xl bg-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 border border-slate-600"
                  />
                </div>
                <button
                  onClick={addToBst}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95"
                >
                  <Plus className="inline mr-2" size={20} /> Add Node
                </button>
              </div>
            </div>

            {/* Search Card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-blue-500 border-opacity-30">
              <h3 className="text-xl font-bold text-white mb-6">🔍 Search Node</h3>
              <div className="space-y-4">
                <input
                  type="number"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search value"
                  className="w-full px-4 py-3 rounded-xl bg-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-600"
                />
                <button
                  onClick={handleSearch}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95"
                >
                  Search
                </button>
                {searchResult && (
                  <div className={`mt-4 p-4 rounded-xl text-center font-semibold ${
                    searchResult.found 
                      ? 'bg-green-500 bg-opacity-20 border border-green-500 text-green-300' 
                      : 'bg-red-500 bg-opacity-20 border border-red-500 text-red-300'
                  }`}>
                    {searchResult.found ? `✓ Found ${searchResult.value}` : `✗ Not found ${searchResult.value}`}
                  </div>
                )}
              </div>
            </div>

            {/* Delete Selected Card */}
            {selectedNode !== null && (
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-red-500 border-opacity-30 animate-pulse">
                <h3 className="text-xl font-bold text-white mb-4">🗑️ Delete Selected</h3>
                <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded-xl p-4 mb-4">
                  <div className="text-sm text-red-300 mb-1">Selected Node</div>
                  <div className="text-3xl font-bold text-red-400">{selectedNode}</div>
                </div>
                <button
                  onClick={() => removeFromBst(selectedNode)}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95"
                >
                  <Trash2 className="inline mr-2" size={20} /> Delete Node
                </button>
              </div>
            )}

            {/* Stats Card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-purple-500 border-opacity-30">
              <h3 className="text-xl font-bold text-white mb-6">📊 Tree Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-slate-700 bg-opacity-50 rounded-xl">
                  <span className="text-slate-300">Height</span>
                  <span className="text-2xl font-bold text-purple-400">{currentStats.height}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-700 bg-opacity-50 rounded-xl">
                  <span className="text-slate-300">Leaf Nodes</span>
                  <span className="text-2xl font-bold text-purple-400">{currentStats.leaves}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-700 bg-opacity-50 rounded-xl">
                  <span className="text-slate-300">Balanced</span>
                  <span className="text-2xl font-bold">
                    {currentStats.balanced ? <span className="text-green-400">✓</span> : <span className="text-orange-400">−</span>}
                  </span>
                </div>
              </div>
            </div>

            {/* Clear Button */}
            <button
              onClick={() => {
                setBst([]);
                setSelectedNode(null);
                setSearchResult(null);
              }}
              className="w-full bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg"
            >
              <RotateCcw className="inline mr-2" size={20} /> Reset Tree
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-purple-400 font-bold text-lg mb-3">⏱️ Time Complexity</h4>
              <ul className="text-sm text-slate-300 space-y-2">
                <li><span className="text-purple-300">Search:</span> O(log n) avg</li>
                <li><span className="text-purple-300">Insert:</span> O(log n) avg</li>
                <li><span className="text-purple-300">Delete:</span> O(log n) avg</li>
              </ul>
            </div>
            <div>
              <h4 className="text-cyan-400 font-bold text-lg mb-3">💾 Space Complexity</h4>
              <ul className="text-sm text-slate-300 space-y-2">
                <li><span className="text-cyan-300">Space:</span> O(n)</li>
                <li><span className="text-cyan-300">Recursive Depth:</span> O(h)</li>
                <li><span className="text-cyan-300">h = Height</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-pink-400 font-bold text-lg mb-3">🎯 Properties</h4>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>Left &lt; Parent &lt; Right</li>
                <li>No duplicate values</li>
                <li>In-order traversal = sorted</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}