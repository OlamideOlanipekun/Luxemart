import React, { useState, useEffect } from 'react';
import { LayoutGrid, Save, Image as ImageIcon, Plus, Trash2, ExternalLink, Sparkles, Upload } from 'lucide-react';
import { api } from '../../../services/api';
import { Category } from '../../../types';

const CollectionsView: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await api.categories.getAll();
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string, updates: Partial<Category>) => {
    setSavingId(id);
    setStatusMsg(null);
    try {
      await api.categories.update(id, updates);
      setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
      setStatusMsg({ type: 'success', text: 'Collection updated successfully' });
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err) {
      console.error("Failed to update category", err);
      setStatusMsg({ type: 'error', text: 'Failed to update collection' });
    } finally {
      setSavingId(null);
    }
  };

  const handleImageUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingId(id);
    try {
      const { url } = await api.admin.uploadImage(file);
      await handleUpdate(id, { image: url });
    } catch (err: any) {
      alert(err.message || 'Failed to upload image');
    } finally {
      setUploadingId(null);
      // Reset input manually using e.target
      e.target.value = '';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                <LayoutGrid className="w-5 h-5 text-white" />
             </div>
             Collections
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Manage homepage categories, titles, and visual storytelling.</p>
        </div>
        
        {statusMsg && (
          <div className={`px-4 py-2 rounded-xl text-xs font-bold animate-in fade-in slide-in-from-right-4 ${
            statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
          }`}>
            {statusMsg.text}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8 space-y-6 group">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <Sparkles className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tighter italic">{category.name}</h3>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-full">{category.id}</span>
                 </div>
              </div>
              {savingId === category.id ? (
                 <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              ) : null}
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Display Title</label>
                <input 
                  type="text" 
                  defaultValue={category.name}
                  onBlur={(e) => {
                    if (e.target.value !== category.name) handleUpdate(category.id, { name: e.target.value });
                  }}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Archive Subtitle</label>
                <input 
                  type="text" 
                  defaultValue={category.subtitle || ''}
                  onBlur={(e) => {
                    if (e.target.value !== category.subtitle) handleUpdate(category.id, { subtitle: e.target.value });
                  }}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Visual Cover URL / Upload</label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input 
                      type="text" 
                      defaultValue={category.image}
                      onBlur={(e) => {
                        if (e.target.value !== category.image) handleUpdate(category.id, { image: e.target.value });
                      }}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all pl-10"
                    />
                    <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>
                  
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
                      disabled={uploadingId === category.id}
                      onChange={(e) => handleImageUpload(category.id, e)}
                    />
                    <button 
                      type="button"
                      disabled={uploadingId === category.id}
                      className="w-12 h-12 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-2xl flex items-center justify-center transition-colors disabled:opacity-50"
                      title="Upload Local File"
                    >
                      {uploadingId === category.id ? (
                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Upload className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <a 
                    href={category.image} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="relative aspect-[16/6] rounded-3xl overflow-hidden border border-slate-100 shadow-inner">
               <img src={category.image} alt="" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <div className="text-[8px] font-black uppercase tracking-widest opacity-60">Series Preview</div>
                    <div className="text-lg font-black italic tracking-tighter uppercase">{category.name}</div>
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollectionsView;
