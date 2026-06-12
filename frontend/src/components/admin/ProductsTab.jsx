import React, { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import api from "../../lib/api";
import { Th, Td, TabSpinner } from "./TableBits";

const ProductRow = ({ p, edit, onEdit, onSave }) => {
  const dirty = Object.keys(edit).length > 0;
  const inStock = edit.inStock ?? p.inStock !== false;
  return (
    <tr>
      <Td className="max-w-[320px]"><div className="flex items-center gap-2"><img src={p.image} alt="" className="w-8 h-8 object-contain rounded bg-slate-50" /><span className="text-xs font-medium line-clamp-2">{p.name}</span></div></Td>
      <Td><Input className="w-24 h-8 text-sm" value={edit.price ?? p.price} onChange={(ev) => onEdit(p.id, "price", ev.target.value)} data-testid={`admin-price-${p.id}`} /></Td>
      <Td><Input className="w-24 h-8 text-sm" value={edit.originalPrice ?? (p.originalPrice || "")} onChange={(ev) => onEdit(p.id, "originalPrice", ev.target.value)} /></Td>
      <Td><Input className="w-28 h-8 text-sm" value={edit.badge ?? (p.badge || "")} placeholder="—" onChange={(ev) => onEdit(p.id, "badge", ev.target.value)} /></Td>
      <Td>
        <button onClick={() => onEdit(p.id, "inStock", !inStock)}
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${inStock ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}
          data-testid={`admin-stock-${p.id}`}>
          {inStock ? "In Stock" : "Out of Stock"}
        </button>
      </Td>
      <Td>{dirty && <Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-700" onClick={() => onSave(p)} data-testid={`admin-save-${p.id}`}>Save</Button>}</Td>
    </tr>
  );
};

const ProductsTab = ({ toast }) => {
  const [rows, setRows] = useState(null);
  const [edits, setEdits] = useState({});
  const load = useCallback(() => api.get("/api/admin/products").then(({ data }) => setRows(data)), []);
  useEffect(() => { load(); }, [load]);

  const save = async (p) => {
    const e = edits[p.id] || {};
    try {
      await api.patch(`/api/admin/products/${p.id}`, {
        price: e.price !== undefined ? parseFloat(e.price) : undefined,
        originalPrice: e.originalPrice !== undefined ? parseFloat(e.originalPrice) : undefined,
        badge: e.badge,
        inStock: e.inStock,
      });
      toast({ title: "Product updated", description: p.name });
      setEdits((s) => { const c = { ...s }; delete c[p.id]; return c; });
      load();
    } catch (err) {
      toast({ title: "Update failed", description: err.response?.data?.detail || err.message });
    }
  };
  const setEdit = (id, k, v) => setEdits((s) => ({ ...s, [id]: { ...s[id], [k]: v } }));

  if (!rows) return <TabSpinner />;
  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
      <table className="w-full" data-testid="admin-products-table">
        <thead className="border-b border-slate-100"><tr><Th>Product</Th><Th>Price</Th><Th>Was</Th><Th>Badge</Th><Th>In Stock</Th><Th /></tr></thead>
        <tbody className="divide-y divide-slate-50">
          {rows.map((p) => <ProductRow key={p.id} p={p} edit={edits[p.id] || {}} onEdit={setEdit} onSave={save} />)}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsTab;
