import React, { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { KeyRound, Trash2 } from "lucide-react";
import api from "../../lib/api";
import { TabSpinner } from "./TableBits";

const KeyRow = ({ k, productName, onDelete }) => (
  <div className="flex items-center gap-2 text-xs border border-slate-100 rounded-lg px-2.5 py-1.5">
    <span className={`shrink-0 w-2 h-2 rounded-full ${k.status === "available" ? "bg-emerald-500" : "bg-slate-300"}`} />
    <span className="font-mono truncate">{k.key}</span>
    <span className="ml-auto text-[10px] text-slate-400 truncate max-w-[120px]">{productName}</span>
    {k.status === "available"
      ? <button onClick={() => onDelete(k.key_id)} className="text-red-400 hover:text-red-600" aria-label="Delete key"><Trash2 className="w-3.5 h-3.5" /></button>
      : <span className="text-[10px] font-semibold text-slate-400">#{k.order_number}</span>}
  </div>
);

const KeysTab = ({ toast }) => {
  const [products, setProducts] = useState([]);
  const [data, setData] = useState(null);
  const [productId, setProductId] = useState("");
  const [keysText, setKeysText] = useState("");

  const load = useCallback(() => api.get("/api/admin/keys").then(({ data }) => setData(data)), []);
  useEffect(() => { api.get("/api/admin/products").then(({ data }) => setProducts(data)); load(); }, [load]);

  const addKeys = async () => {
    if (!productId || !keysText.trim()) return;
    try {
      const { data: res } = await api.post("/api/admin/keys", { product_id: productId, keys: keysText.split("\n") });
      toast({ title: `${res.added} key(s) added` });
      setKeysText("");
      load();
    } catch (err) { toast({ title: "Failed", description: err.response?.data?.detail || err.message }); }
  };
  const del = async (keyId) => {
    try { await api.delete(`/api/admin/keys/${keyId}`); load(); }
    catch (err) { toast({ title: "Failed", description: err.response?.data?.detail || err.message }); }
  };

  if (!data) return <TabSpinner />;
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-bold text-slate-900 text-sm mb-3">Add License Keys</h3>
        <select value={productId} onChange={(e) => setProductId(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" data-testid="admin-keys-product-select">
          <option value="">Select a product…</option>
          {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <textarea value={keysText} onChange={(e) => setKeysText(e.target.value)} rows={6} placeholder={"One key per line, e.g.\nXXXXX-XXXXX-XXXXX-XXXXX-XXXXX"}
          className="mt-3 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono" data-testid="admin-keys-textarea" />
        <Button onClick={addKeys} disabled={!productId || !keysText.trim()} className="mt-3 bg-blue-600 hover:bg-blue-700 w-full" data-testid="admin-keys-add-btn"><KeyRound className="w-4 h-4 mr-1.5" />Add Keys</Button>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-5 overflow-y-auto max-h-[480px]">
        <h3 className="font-bold text-slate-900 text-sm mb-3">Inventory ({data.keys.filter((k) => k.status === "available").length} available / {data.keys.length} total)</h3>
        {data.keys.length === 0 && <p className="text-sm text-slate-400">No keys yet — add some on the left. Orders placed without available keys will say "key follows shortly" in the email.</p>}
        <div className="space-y-1.5" data-testid="admin-keys-list">
          {data.keys.map((k) => (
            <KeyRow key={k.key_id} k={k} onDelete={del}
              productName={products.find((p) => p.id === k.product_id)?.name?.slice(0, 24) || k.product_id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default KeysTab;
