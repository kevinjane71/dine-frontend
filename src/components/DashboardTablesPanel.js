'use client';

import { useMemo } from 'react';
import { FaEye } from 'react-icons/fa';

const statusStyles = {
  available: { bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0' },
  serving: { bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe' },
  // occupied: switch to yellow theme
  occupied: { bg: '#fef9c3', text: '#92400e', border: '#fde68a' },
  // reserved: switch to blue theme
  reserved: { bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe' },
  'out-of-service': { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb' },
  maintenance: { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb' }
};

export default function DashboardTablesPanel({
  floors = [],
  tables = [],
  isRefreshing = false,
  onTakeOrder,
  onViewOrder
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
      <style jsx>{`
        @keyframes tableSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
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
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '16px',
            padding: '12px'
          }}>
            {(group.tables || []).map((t, tIdx) => {
              const st = statusStyles[t.status] || statusStyles.available;
              const isOccupied = (t.status === 'occupied');
              const isReserved = (t.status === 'reserved');
              const isBooked = isOccupied || isReserved;
              const occupiedBorderColor = '#f59e0b';
              return (
                <div key={t.id || tIdx}
                  style={{
                    position: 'relative',
                    background: '#ffffff',
                    border: `${isOccupied ? '1px solid transparent' : '1px solid ' + st.border}`,
                    borderRadius: '12px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '10px',
                    height: '160px',
                    width: '100%',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    transition: 'all 0.2s ease'
                  }}>
                  {isOccupied && (
                    <svg
                      viewBox="0 0 300 200"
                      preserveAspectRatio="none"
                      style={{
                        position: 'absolute',
                        inset: '-6px',
                        width: 'calc(100% + 12px)',
                        height: 'calc(100% + 12px)',
                        pointerEvents: 'none'
                      }}
                    >
                      <rect
                        x="1.5"
                        y="1.5"
                        width="297"
                        height="197"
                        rx="12"
                        ry="12"
                        fill="none"
                        stroke={occupiedBorderColor}
                        strokeWidth="2.5"
                        strokeDasharray="5,5"
                        strokeDashoffset="100"
                      >
                        <animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" repeatCount="indefinite" />
                      </rect>
                    </svg>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <div style={{ fontWeight: 800, color: '#111827', fontSize: '17px', flex: 1 }}>{t.name || t.number}</div>
                    <div style={{ fontSize: '10px', color: st.text, fontWeight: 700, background: st.bg, borderRadius: '999px', padding: '3px 9px', border: `1px solid ${st.border}`, whiteSpace: 'nowrap' }}>
                      {t.status || 'available'}
                    </div>
                  </div>
                  <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: 500 }}>Seats: {t.capacity || '-'}</div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: 'auto' }}>
                    {isBooked && t.currentOrderId && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onViewOrder) {
                            onViewOrder(t.currentOrderId, t);
                          }
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          width: '32px',
                          height: '32px',
                          cursor: 'pointer',
                          flexShrink: 0,
                          transition: 'all 0.2s ease',
                          boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#2563eb';
                          e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = '#3b82f6';
                          e.target.style.transform = 'scale(1)';
                        }}
                        title="View Order"
                      >
                        <FaEye size={14} />
                      </button>
                    )}
                    {(t.status === 'available' || t.status === 'serving') ? (
                      <button
                        onClick={() => onTakeOrder && onTakeOrder(t.name || t.number)}
                        style={{
                          flex: 1,
                          background: t.status === 'available' ? '#22c55e' : '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 700,
                          padding: '8px 12px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 2px 4px rgba(34, 197, 94, 0.2)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-1px)';
                          e.target.style.boxShadow = '0 4px 8px rgba(34, 197, 94, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 2px 4px rgba(34, 197, 94, 0.2)';
                        }}
                      >
                        {t.status === 'available' ? 'TAKE ORDER' : 'ADD ITEMS'}
                      </button>
                    ) : isBooked && !t.currentOrderId ? (
                      <div style={{ flex: 1, height: '32px', borderRadius: '8px', visibility: 'hidden' }} />
                    ) : null}
                  </div>
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


