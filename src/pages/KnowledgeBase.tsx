import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileText, 
  Upload, 
  Trash2, 
  RefreshCw, 
  X,
  Search,
  ChevronDown,
  HelpCircle,
  Bell,
  Globe,
  Grid,
  List as ListIcon,
  Lightbulb,
  ArrowUpRight
} from 'lucide-react';

export const KnowledgeBase: React.FC = () => {
  const { knowledgeBase, addKBText, uploadKBFile, deleteKBDocument } = useApp();
  
  // Custom manual paste form
  const [showForm, setShowForm] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docContent, setDocContent] = useState('');
  const [docCategory, setDocCategory] = useState<'Policies' | 'FAQ' | 'Products' | 'General'>('General');

  // File upload simulation queue
  const [uploadingFiles, setUploadingFiles] = useState<{ name: string; progress: number }[]>([]);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim() || !docContent.trim()) return;
    
    // Add document
    addKBText(docTitle, docContent);
    setDocTitle('');
    setDocContent('');
    setShowForm(false);
  };

  const handleFileUploadSim = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    Array.from(files).forEach(file => {
      const fileName = file.name;
      const fileExt = fileName.split('.').pop()?.toLowerCase() as 'pdf' | 'docx' | 'txt' || 'txt';
      
      // Add to upload queue
      const queueItem = { name: fileName, progress: 10 };
      setUploadingFiles(prev => [...prev, queueItem]);
      
      // Simulate progress ticks
      let currentProgress = 10;
      const interval = setInterval(() => {
        currentProgress += 30;
        if (currentProgress >= 100) {
          clearInterval(interval);
          setUploadingFiles(prev => prev.filter(f => f.name !== fileName));
          
          // Complete file upload in Context
          uploadKBFile(
            fileName, 
            fileExt, 
            `Simulated index content of file ${fileName}. This provides contextual RAG retrieval for keywords inside this file.`
          );
        } else {
          setUploadingFiles(prev => prev.map(f => f.name === fileName ? { ...f, progress: currentProgress } : f));
        }
      }, 600);
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getCategoryColorClass = (category: string) => {
    switch (category) {
      case 'Policies':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'FAQ':
        return 'bg-emerald-50 text-emerald-650 border-emerald-250';
      case 'Products':
        return 'bg-purple-50 text-purple-600 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  const getFileIcon = (type: string) => {
    const color = type === 'pdf' ? 'text-red-500' : type === 'docx' ? 'text-blue-500' : 'text-slate-400';
    return (
      <div className={`p-2 rounded bg-slate-50 ${color} flex-shrink-0 font-bold border border-slate-100 uppercase text-[8px]`}>
        {type}
      </div>
    );
  };

  // Filter KB list
  const filteredKB = knowledgeBase.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase());
    
    // Simulating custom categories for defaults if not explicitly stored
    let cat = 'General';
    if (doc.name.toLowerCase().includes('policy')) cat = 'Policies';
    else if (doc.name.toLowerCase().includes('question') || doc.name.toLowerCase().includes('faq')) cat = 'FAQ';
    else if (doc.name.toLowerCase().includes('product') || doc.name.toLowerCase().includes('info')) cat = 'Products';

    const matchesCategory = categoryFilter === 'all' || cat.toLowerCase() === categoryFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in text-slate-700">
      
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-850 font-outfit">Knowledge Base</h1>
          <p className="text-xs text-slate-400 mt-1">Add and manage information that AutoReply AI can use to answer your customers.</p>
        </div>

        {/* Header Right Widgets */}
        <div className="flex items-center gap-2.5">
          <div className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-sm flex items-center gap-1.5">
            <span className="h-4 w-4 bg-blue-600 rounded text-white flex items-center justify-center text-[9px] font-bold">A</span>
            <span>ABC Store</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </div>

          <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-405 hover:text-slate-655 shadow-sm hover:bg-slate-50 transition-colors">
            <HelpCircle className="h-4.5 w-4.5" />
          </button>
          
          <button className="relative p-2 bg-white border border-slate-200 rounded-xl text-slate-405 hover:text-slate-655 shadow-sm hover:bg-slate-50 transition-colors">
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 border border-white"></span>
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef}
        accept=".pdf,.docx,.txt"
        multiple
        onChange={handleFileUploadSim}
        className="hidden" 
      />

      {/* 2. Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Tabs, Filters, Table (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Document list card container */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden p-6 space-y-5">
            
            {/* Catalog sub-tabs */}
            <div className="flex items-center gap-5 border-b border-slate-100 pb-3 text-xs font-semibold">
              <button className="pb-2 text-blue-600 border-b-2 border-blue-600 font-bold">
                Documents
              </button>
              <button className="pb-2 text-slate-400 hover:text-slate-650">
                Text Snippets
              </button>
              <button className="pb-2 text-slate-400 flex items-center gap-1.5 pointer-events-none">
                Q&A Pairs
                <span className="px-1.5 py-0.5 rounded bg-purple-50 border border-purple-100 text-[8px] text-purple-550 font-bold uppercase">Coming Soon</span>
              </button>
              <button className="pb-2 text-slate-400 flex items-center gap-1.5 pointer-events-none">
                Websites
                <span className="px-1.5 py-0.5 rounded bg-purple-50 border border-purple-100 text-[8px] text-purple-550 font-bold uppercase">Coming Soon</span>
              </button>
            </div>

            {/* Table search & filter row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
                {/* Search */}
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 text-xs focus:outline-none focus:border-blue-500 shadow-sm"
                  />
                </div>

                {/* All Categories */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 text-xs font-semibold focus:outline-none focus:border-blue-500 shadow-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="policies">Policies</option>
                  <option value="faq">FAQ</option>
                  <option value="products">Products</option>
                  <option value="general">General</option>
                </select>

                {/* All Status */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 text-xs font-semibold focus:outline-none focus:border-blue-500 shadow-sm"
                >
                  <option value="all">All Status</option>
                  <option value="ready">Indexed</option>
                  <option value="indexing">Processing</option>
                </select>
              </div>

              {/* View switches */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <select className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-650 text-xs font-semibold focus:outline-none focus:border-blue-500 shadow-sm">
                  <option>Sort by: Newest</option>
                  <option>Sort by: Oldest</option>
                </select>
                
                <div className="flex border border-slate-200 rounded-xl overflow-hidden p-0.5 bg-slate-50">
                  <button className="p-1.5 bg-white text-blue-650 rounded-lg shadow-sm">
                    <ListIcon className="h-3.5 w-3.5" />
                  </button>
                  <button className="p-1.5 text-slate-400 hover:text-slate-600">
                    <Grid className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Paste text wizard box inside catalog drawer */}
            {showForm && (
              <form onSubmit={handlePasteSubmit} className="bg-slate-50/50 border border-blue-200 rounded-2xl p-5 shadow-inner animate-fade-in space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <h3 className="text-xs font-bold text-slate-800 font-outfit uppercase">Paste Policy Text</h3>
                  <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-slate-405 mb-1.5">Document Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Return Policy Changes"
                      value={docTitle}
                      onChange={(e) => setDocTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1.5">Category</label>
                    <select
                      value={docCategory}
                      onChange={(e) => setDocCategory(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 text-xs font-semibold focus:outline-none focus:border-blue-500"
                    >
                      <option value="General">General</option>
                      <option value="Policies">Policies</option>
                      <option value="FAQ">FAQ</option>
                      <option value="Products">Products</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1.5">Content</label>
                  <textarea
                    placeholder="Type store guidelines here..."
                    value={docContent}
                    onChange={(e) => setDocContent(e.target.value)}
                    rows={4}
                    className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 text-xs font-semibold">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-xl transition-all"
                  >
                    Add Custom Doc
                  </button>
                </div>
              </form>
            )}

            {/* Live Upload Progress */}
            {uploadingFiles.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 shadow-inner">
                <h4 className="text-xs font-bold text-slate-600 flex items-center gap-1.5 animate-pulse">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin text-blue-600" />
                  Indexing uploaded documents...
                </h4>
                <div className="space-y-2">
                  {uploadingFiles.map((file) => (
                    <div key={file.name} className="text-xs space-y-1">
                      <div className="flex justify-between text-slate-500 font-medium">
                        <span>{file.name}</span>
                        <span>{file.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1">
                        <div className="bg-blue-600 h-1 rounded-full transition-all duration-300" style={{ width: `${file.progress}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Documents Library Table Grid */}
            <div className="border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 bg-slate-50/10 font-bold">
                      <th className="p-4 uppercase tracking-wider text-[10px]">Name</th>
                      <th className="p-4 uppercase tracking-wider text-[10px]">Category</th>
                      <th className="p-4 uppercase tracking-wider text-[10px]">Status</th>
                      <th className="p-4 uppercase tracking-wider text-[10px]">Last Updated</th>
                      <th className="p-4 uppercase tracking-wider text-[10px]">Added By</th>
                      <th className="p-4 text-right uppercase tracking-wider text-[10px]"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-655 font-medium">
                    {filteredKB.map((doc) => {
                      // Categorizing logically
                      let cat = 'General';
                      if (doc.name.toLowerCase().includes('policy')) cat = 'Policies';
                      else if (doc.name.toLowerCase().includes('question') || doc.name.toLowerCase().includes('faq')) cat = 'FAQ';
                      else if (doc.name.toLowerCase().includes('product') || doc.name.toLowerCase().includes('info')) cat = 'Products';

                      return (
                        <tr key={doc.id} className="hover:bg-slate-50/30 transition-colors">
                          <td className="p-4 flex items-center gap-3">
                            {getFileIcon(doc.type)}
                            <div className="truncate max-w-[200px]">
                              <span className="font-bold text-slate-800 truncate block leading-tight">{doc.name}</span>
                              <span className="text-[9px] text-slate-400 font-mono mt-0.5 uppercase block">{doc.type} • 245 KB</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-bold ${getCategoryColorClass(cat)}`}>
                              {cat}
                            </span>
                          </td>
                          <td className="p-4">
                            {doc.status === 'ready' ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[10px] font-bold flex items-center gap-1.5 w-max">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                Indexed
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-600 text-[10px] font-bold flex items-center gap-1.5 w-max animate-pulse">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping"></span>
                                Processing
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-slate-450 text-[10px] leading-normal font-semibold">
                            {doc.uploadDate}<br />
                            <span className="text-slate-400 font-normal">10:30 AM</span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold text-[10px] uppercase">
                                M
                              </div>
                              <span className="text-slate-700 text-xs font-semibold">Mahmudul Hasan</span>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => deleteKBDocument(doc.id)}
                                className="p-1.5 rounded border border-transparent hover:border-rose-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all"
                                title="Delete document"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredKB.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400 text-sm">
                          No documents indexed under this search
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="px-6 py-3 bg-slate-50/20 border-t border-slate-100 text-xs text-slate-450 font-medium">
                Showing 1 to {filteredKB.length} of {filteredKB.length} documents
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Upload options, Overviews, Guidelines (1/3 width) */}
        <div className="space-y-6">
          
          {/* Add New Content Card Button Deck */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-805 font-outfit">Add New Content</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Upload documents or add text that AI can use to answer customer questions.</p>
            </div>

            <div className="space-y-3">
              {/* Option 1: Upload Documents */}
              <button 
                onClick={triggerFileInput}
                className="w-full p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/5 text-left flex items-center gap-3.5 transition-all"
              >
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl flex-shrink-0 border border-blue-100">
                  <Upload className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-805 leading-none">Upload Documents</h4>
                  <p className="text-[9px] text-slate-400 mt-1.5 leading-none">PDF, DOCX, TXT (Max 10MB)</p>
                </div>
              </button>

              {/* Option 2: Add Text Manually */}
              <button
                onClick={() => setShowForm(true)}
                className="w-full p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/5 text-left flex items-center gap-3.5 transition-all"
              >
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl flex-shrink-0 border border-blue-100">
                  <FileText className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-850 leading-none">Add Text Manually</h4>
                  <p className="text-[9px] text-slate-400 mt-1.5 leading-none">Paste or type content</p>
                </div>
              </button>

              {/* Option 3: Import Website */}
              <div
                className="w-full p-4 rounded-xl border border-slate-200 text-left flex items-center gap-3.5 relative select-none opacity-60"
              >
                <div className="p-2.5 bg-slate-100 text-slate-400 rounded-xl flex-shrink-0">
                  <Globe className="h-4.5 w-4.5" />
                </div>
                <div className="flex-1 truncate">
                  <div className="flex items-center justify-between gap-1.5">
                    <h4 className="text-xs font-bold text-slate-800 leading-none">Import from Website</h4>
                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-500 uppercase tracking-wide">
                      Coming Soon
                    </span>
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1.5 leading-none">Crawl and import content</p>
                </div>
              </div>
            </div>
          </div>

          {/* Knowledge Base Overview Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-805 font-outfit">Knowledge Base Overview</h3>
            
            <div className="space-y-3 text-xs leading-normal">
              <div className="flex justify-between py-1 items-center border-b border-slate-100 pb-2">
                <span className="text-slate-450">Total Documents</span>
                <span className="text-slate-805 font-bold">8</span>
              </div>
              <div className="flex justify-between py-1 items-center border-b border-slate-100 pb-2">
                <span className="text-slate-450">Total Words</span>
                <span className="text-slate-805 font-bold">12,450</span>
              </div>
              <div className="flex justify-between py-1 items-center border-b border-slate-100 pb-2">
                <span className="text-slate-450">Storage Used</span>
                <span className="text-slate-805 font-bold">8.6 MB</span>
              </div>
              <div className="flex justify-between py-1 items-center">
                <span className="text-slate-450">Last Updated</span>
                <span className="text-slate-805 font-bold">May 20, 2024</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 leading-relaxed border-t border-slate-100 pt-3">
              AI uses this knowledge to generate accurate and helpful replies.
            </p>
          </div>

          {/* Tips Card with Check Marks */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-805 flex items-center gap-2 font-outfit">
              <Lightbulb className="h-4.5 w-4.5 text-blue-650" />
              Tips
            </h3>

            <ul className="space-y-3 text-xs text-slate-500">
              <li className="flex items-start gap-2">
                <span className="h-4.5 w-4.5 rounded-full bg-emerald-50 border border-emerald-250 text-emerald-600 flex items-center justify-center flex-shrink-0 text-[10px] font-bold">✓</span>
                <span>Add detailed information about your products and services.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-4.5 w-4.5 rounded-full bg-emerald-50 border border-emerald-250 text-emerald-600 flex items-center justify-center flex-shrink-0 text-[10px] font-bold">✓</span>
                <span>Keep your knowledge base up to date.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-4.5 w-4.5 rounded-full bg-emerald-50 border border-emerald-250 text-emerald-600 flex items-center justify-center flex-shrink-0 text-[10px] font-bold">✓</span>
                <span>Use clear and simple language.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-4.5 w-4.5 rounded-full bg-emerald-50 border border-emerald-250 text-emerald-600 flex items-center justify-center flex-shrink-0 text-[10px] font-bold">✓</span>
                <span>Organize content into categories.</span>
              </li>
            </ul>

            <button className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:text-blue-700">
              Learn more about knowledge base <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
