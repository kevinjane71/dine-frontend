'use client';

import { useMemo } from 'react';

const statusStyles = {
  available: { bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0' },
  serving: { bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe' },
  occupied: { bg: '#fef2f2', text: '#991b1b', border: '#fecaca' },
  reserved: { bg: '#fef3c7', text: '#92400e', border: '#fde68a' },
  'out-of-service': { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb' },
  maintenance: { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb' }
};

export default function DashboardTablesPanel({
  floors = [],
  tables = [],
  isRefreshing = false,
  onTakeOrder
}) {
  // Prefer floor.tables if present; fall back to flat tables prop
  const grouped = useMemo(() => {
    if (Array.isArray(floors) && floors.length > 0 && floors.some(f => Array.isArray(f.tables))) {
      return floors.map(f => ({ info: { id: f.id, name: f.name || f.floorName || 'Floor' }, tables: f.tables || [] }));
    }
    // Group flat tables by floor
    const byFloor = {};
    floors.forEach(f => { byFloor[f.id || f.name || 'default'] = { info: { name: f.name || 'Floor' }, tables: [] }; });
    (tables || []).forEach(t => {
      const key = t.floorId || t.floor || t.floorName || 'default';
      if (!byFloor[key]) byFloor[key] = { info: { name: t.floorName || t.floor || 'Floor' }, tables: [] };
      byFloor[key].tables.push(t);
    });
    return Object.values(byFloor);
  }, [floors, tables]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {grouped.map((group, idx) => (
        <div key={idx} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
          <div style={{
            padding: '10px 12px',
            borderBottom: '1px solid #f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ fontWeight: 700, color: '#1f2937' }}>{group.info?.name || `Floor ${idx + 1}`}</div>
            {isRefreshing && (
              <div style={{ fontSize: '11px', color: '#6b7280' }}>Refreshing…</div>
            )}
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '10px',
            padding: '12px'
          }}>
            {(group.tables || []).map((t, tIdx) => {
              const st = statusStyles[t.status] || statusStyles.available;
              return (
                <div key={t.id || tIdx}
                  style={{
                    background: '#ffffff',
                    border: `1px solid ${st.border}`,
                    borderRadius: '10px',
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontWeight: 800, color: '#111827', fontSize: '16px' }}>{t.name || t.number}</div>
                    <div style={{ fontSize: '10px', color: st.text, fontWeight: 700, background: st.bg, borderRadius: '999px', padding: '2px 8px', border: `1px solid ${st.border}` }}>
                      {t.status || 'available'}
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Seats: {t.capacity || '-'}</div>
                  {(t.status === 'available' || t.status === 'serving') && (
                    <button
                      onClick={() => onTakeOrder && onTakeOrder(t.name || t.number)}
                      style={{
                        marginTop: '2px',
                        background: t.status === 'available' ? '#22c55e' : '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 700,
                        padding: '6px 8px',
                        cursor: 'pointer'
                      }}
                    >
                      {t.status === 'available' ? 'TAKE ORDER' : 'ADD ITEMS'}
                    </button>
                  )}
                </div>
              );
            })}
            {(!group.tables || group.tables.length === 0) && (
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>No tables on this floor.</div>
            )}
          </div>
        </div>
      ))}
      {grouped.length === 0 && (
        <div style={{ textAlign: 'center', color: '#9ca3af', padding: '12px' }}>No floors/tables found.</div>
      )}
    </div>
  );
}


