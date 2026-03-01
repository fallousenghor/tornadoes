// Documents Feature - AEVUM Enterprise ERP
// Refactored with DRY & SOLID principles

import React, { useState, useMemo } from 'react';
import { Card, Button, Modal, FilterBar, PaginationControls } from '../../components/common';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Colors } from '../../constants/theme';
import { useFilterable } from '../../hooks/useFilterable';

// Document type icons
const docTypeIcons: Record<string, string> = {
  contract: '📄',
  cnss: '🛂',
  id: '🪪',
  diploma: '🎓',
  invoice: '💰',
  report: '📊',
  policy: '📋',
  other: '📁',
};

// Category colors
const categoryColors: Record<string, string> = {
  rh: '#6490ff',
  finance: '#3ecf8e',
  juridique: '#a78bfa',
  technique: '#fb923c',
  commercial: '#c9a84c',
  general: '#5a6480',
};

// Mock documents data
const mockDocuments = [
  { id: '1', name: 'Contrat CDI - Amadou Sall', type: 'contract', category: 'rh', version: 3, status: 'signed', uploadedBy: 'Fatou Diallo', uploadedAt: new Date('2025-01-15'), updatedAt: new Date('2025-01-20'), signatureRequired: true, signedBy: ['DG', 'Employé'], departmentId: '1' },
  { id: '2', name: 'Facture #INV-2045 - Sonatel', type: 'invoice', category: 'finance', version: 1, status: 'signed', uploadedBy: 'Moussa Sow', uploadedAt: new Date('2025-01-18'), updatedAt: new Date('2025-01-18'), signatureRequired: true, signedBy: ['DAF', 'Client'], departmentId: '3' },
  { id: '3', name: 'Convention de stage - Université', type: 'contract', category: 'rh', version: 2, status: 'pending_signature', uploadedBy: 'Fatou Diallo', uploadedAt: new Date('2025-01-20'), updatedAt: new Date('2025-01-22'), signatureRequired: true, signedBy: [], departmentId: '2' },
  { id: '4', name: 'Politique RGPD 2025', type: 'policy', category: 'juridique', version: 1, status: 'signed', uploadedBy: 'Direction', uploadedAt: new Date('2025-01-01'), updatedAt: new Date('2025-01-05'), signatureRequired: true, signedBy: ['DG'], departmentId: undefined },
  { id: '5', name: 'Rapport mensuelle technique', type: 'report', category: 'technique', version: 5, status: 'signed', uploadedBy: 'Sara Mendy', uploadedAt: new Date('2025-01-25'), updatedAt: new Date('2025-01-25'), signatureRequired: false, signedBy: [], departmentId: '1' },
  { id: '6', name: 'Devis Formation Python', type: 'invoice', category: 'commercial', version: 1, status: 'pending_signature', uploadedBy: 'Ibou Gaye', uploadedAt: new Date('2025-01-22'), updatedAt: new Date('2025-01-23'), signatureRequired: true, signedBy: [], departmentId: '4' },
  { id: '7', name: 'Attestation de travail - Rokhaya', type: 'other', category: 'rh', version: 1, status: 'signed', uploadedBy: 'Fatou Diallo', uploadedAt: new Date('2025-01-10'), updatedAt: new Date('2025-01-10'), signatureRequired: true, signedBy: ['DRH'], departmentId: '2' },
  { id: '8', name: 'Procès-verbal AG 2024', type: 'report', category: 'juridique', version: 1, status: 'signed', uploadedBy: 'Direction', uploadedAt: new Date('2024-12-15'), updatedAt: new Date('2024-12-20'), signatureRequired: true, signedBy: ['DG', 'Secrétaire'], departmentId: undefined },
  { id: '9', name: 'Bulletin de paie - Janvier', type: 'invoice', category: 'finance', version: 1, status: 'signed', uploadedBy: 'Comptable', uploadedAt: new Date('2025-01-31'), updatedAt: new Date('2025-01-31'), signatureRequired: false, signedBy: [], departmentId: '3' },
  { id: '10', name: 'Licence Logiciel CRM', type: 'contract', category: 'technique', version: 2, status: 'expired', uploadedBy: 'IT', uploadedAt: new Date('2024-06-01'), updatedAt: new Date('2024-06-01'), signatureRequired: true, signedBy: ['DG'], departmentId: '1' },
  { id: '11', name: 'Diplôme Master - Data Science', type: 'diploma', category: 'rh', version: 1, status: 'signed', uploadedBy: 'RH', uploadedAt: new Date('2024-09-01'), updatedAt: new Date('2024-09-01'), signatureRequired: false, signedBy: [], departmentId: '2' },
  { id: '12', name: 'NDA Client BNK Group', type: 'contract', category: 'commercial', version: 1, status: 'signed', uploadedBy: 'Direction', uploadedAt: new Date('2025-01-05'), updatedAt: new Date('2025-01-08'), signatureRequired: true, signedBy: ['DG', 'Client'], departmentId: '4' },
];

// Filter options
const categoryOptions = [
  { value: 'all', label: 'Toutes catégories' },
  { value: 'rh', label: 'RH' },
  { value: 'finance', label: 'Finance' },
  { value: 'juridique', label: 'Juridique' },
  { value: 'technique', label: 'Technique' },
  { value: 'commercial', label: 'Commercial' },
];

const statusOptions = [
  { value: 'all', label: 'Tous statuts' },
  { value: 'draft', label: 'Brouillon' },
  { value: 'pending_signature', label: 'En attente' },
  { value: 'signed', label: 'Signé' },
  { value: 'expired', label: 'Expiré' },
];

export const Documents: React.FC = () => {
  // State
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use the filterable hook
  const {
    searchQuery,
    setSearchQuery,
    filters,
    setFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
    totalItems,
    showingFrom,
    showingTo,
  } = useFilterable({
    data: mockDocuments,
    itemsPerPage: 10,
    searchFields: ['name'],
  });

  // Filter by category and status
  const filteredDocs = useMemo(() => {
    const category = filters.category || 'all';
    const status = filters.status || 'all';
    
    return paginatedData.filter((doc: any) => {
      const matchesCategory = category === 'all' || doc.category === category;
      const matchesStatus = status === 'all' || doc.status === status;
      return matchesCategory && matchesStatus;
    });
  }, [paginatedData, filters.category, filters.status]);

  // Summary stats
  const stats = useMemo(() => {
    return {
      total: mockDocuments.length,
      pending: mockDocuments.filter(d => d.status === 'pending_signature').length,
      signed: mockDocuments.filter(d => d.status === 'signed').length,
      expired: mockDocuments.filter(d => d.status === 'expired').length,
    };
  }, []);

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // View mode tabs
  const viewModes = [
    { id: 'list', label: 'Liste', icon: '☰' },
    { id: 'grid', label: 'Grille', icon: '▦' },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: Colors.text, marginBottom: 4 }}>
            Documents
          </h1>
          <p style={{ fontSize: 13, color: Colors.textMuted }}>
            Gestion documentaire · Versions · Signatures · Archivage
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
            ↺ Exporter
          </Button>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            + Nouveau document
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(100, 140, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#6490ff' }}>
              📁
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total Documents
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {stats.total}
              </div>
            </div>
          </div>
        </Card>
        
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(201, 168, 76, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#c9a84c' }}>
              ⏳
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                En Attente
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {stats.pending}
              </div>
            </div>
          </div>
        </Card>
        
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(62, 207, 142, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#3ecf8e' }}>
              ✓
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Signés
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {stats.signed}
              </div>
            </div>
          </div>
        </Card>
        
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(224, 80, 80, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#e05050' }}>
              ⚠
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Expirés
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {stats.expired}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: 20, padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <FilterBar
            filters={[
              { key: 'category', type: 'select', options: categoryOptions, placeholder: 'Catégorie' },
              { key: 'status', type: 'select', options: statusOptions, placeholder: 'Statut' },
            ]}
            values={filters}
            onChange={setFilter}
            onSearch={setSearchQuery}
            searchValue={searchQuery}
            searchPlaceholder="Rechercher un document..."
          />
          
          <div style={{ display: 'flex', gap: 4, background: 'rgba(100, 140, 255, 0.05)', padding: 4, borderRadius: 10 }}>
            {viewModes.map(mode => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id as any)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: 'none',
                  background: viewMode === mode.id ? 'rgba(100, 140, 255, 0.15)' : 'transparent',
                  color: viewMode === mode.id ? Colors.accent : Colors.textMuted,
                  fontSize: 12,
                  fontWeight: viewMode === mode.id ? 600 : 400,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                <span>{mode.icon}</span>
                {mode.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Documents List */}
      {viewMode === 'list' && (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(100, 140, 255, 0.05)' }}>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' }}>Document</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' }}>Catégorie</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' }}>Version</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' }}>Statut</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' }}>Modifié par</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' }}>Date</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.map((doc: any, index: number) => {
                  const catColor = categoryColors[doc.category] || categoryColors.general;
                  return (
                    <tr 
                      key={doc.id}
                      style={{ 
                        borderBottom: `1px solid ${Colors.border}`,
                        background: index % 2 === 0 ? 'transparent' : 'rgba(100, 140, 255, 0.02)',
                        cursor: 'pointer',
                      }}
                      onClick={() => { setSelectedDoc(doc); setIsModalOpen(true); }}
                    >
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 20 }}>{docTypeIcons[doc.type] || '📄'}</span>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: Colors.text }}>{doc.name}</div>
                            <div style={{ fontSize: 10, color: Colors.textMuted }}>
                              {doc.signatureRequired && '🔏 Signature requise'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ 
                          padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 500,
                          background: `${catColor}20`, color: catColor,
                          textTransform: 'capitalize',
                        }}>
                          {doc.category}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <span style={{ 
                          padding: '4px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
                          background: 'rgba(100, 140, 255, 0.1)', color: Colors.accent,
                        }}>
                          v{doc.version}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <StatusBadge status={doc.status} />
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 12, color: Colors.textMuted }}>
                        {doc.uploadedBy}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 12, color: Colors.textMuted }}>
                        {formatDate(doc.updatedAt)}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                          <button style={{ padding: '4px 8px', borderRadius: 4, border: `1px solid ${Colors.border}`, background: 'transparent', color: Colors.textMuted, fontSize: 10, cursor: 'pointer' }} title="Télécharger">↓</button>
                          <button style={{ padding: '4px 8px', borderRadius: 4, border: `1px solid ${Colors.border}`, background: 'transparent', color: Colors.textMuted, fontSize: 10, cursor: 'pointer' }} title="Partager">↗</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            showingFrom={showingFrom}
            showingTo={showingTo}
            onPageChange={setCurrentPage}
          />
        </Card>
      )}

      {/* Documents Grid */}
      {viewMode === 'grid' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {filteredDocs.map((doc: any) => {
            const catColor = categoryColors[doc.category] || categoryColors.general;
            return (
              <div 
                key={doc.id}
                onClick={() => { setSelectedDoc(doc); setIsModalOpen(true); }}
                style={{
                  background: Colors.card,
                  border: `1px solid ${Colors.border}`,
                  borderRadius: 12,
                  padding: 16,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <span style={{ fontSize: 32 }}>{docTypeIcons[doc.type] || '📄'}</span>
                  <span style={{ padding: '3px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600, background: 'rgba(100, 140, 255, 0.15)', color: Colors.accent }}>
                    v{doc.version}
                  </span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: Colors.text, marginBottom: 8, lineHeight: 1.3 }}>
                  {doc.name}
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                  <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, background: `${catColor}20`, color: catColor, textTransform: 'capitalize' }}>
                    {doc.category}
                  </span>
                  {doc.signatureRequired && (
                    <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, background: 'rgba(201, 168, 76, 0.15)', color: '#c9a84c' }}>
                      🔏 Signature
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <StatusBadge status={doc.status} size="sm" />
                  <span style={{ fontSize: 10, color: Colors.textMuted }}>
                    {formatDate(doc.updatedAt)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Document Details Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setSelectedDoc(null); }} 
        title={selectedDoc ? selectedDoc.name : 'Nouveau document'}
        size="lg"
      >
        {selectedDoc ? (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>TYPE</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 24 }}>{docTypeIcons[selectedDoc.type] || '📄'}</span>
                  <span style={{ fontSize: 14, color: Colors.text, textTransform: 'capitalize' }}>{selectedDoc.type}</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>CATÉGORIE</div>
                <span style={{ padding: '6px 12px', borderRadius: 6, fontSize: 12, background: `${categoryColors[selectedDoc.category] || categoryColors.general}20`, color: categoryColors[selectedDoc.category] || categoryColors.general, textTransform: 'capitalize' }}>
                  {selectedDoc.category}
                </span>
              </div>
              <div>
                <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>STATUT</div>
                <StatusBadge status={selectedDoc.status} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>VERSION</div>
                <span style={{ padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: 'rgba(100, 140, 255, 0.15)', color: Colors.accent }}>
                  v{selectedDoc.version}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 8 }}>INFORMATIONS</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, background: 'rgba(100, 140, 255, 0.03)', padding: 16, borderRadius: 8 }}>
                <div><div style={{ fontSize: 10, color: Colors.textMuted }}>Modifié par</div><div style={{ fontSize: 13, color: Colors.text }}>{selectedDoc.uploadedBy}</div></div>
                <div><div style={{ fontSize: 10, color: Colors.textMuted }}>Dernière modification</div><div style={{ fontSize: 13, color: Colors.text }}>{formatDate(selectedDoc.updatedAt)}</div></div>
                <div><div style={{ fontSize: 10, color: Colors.textMuted }}>Date de création</div><div style={{ fontSize: 13, color: Colors.text }}>{formatDate(selectedDoc.uploadedAt)}</div></div>
                <div><div style={{ fontSize: 10, color: Colors.textMuted }}>Signature requise</div><div style={{ fontSize: 13, color: Colors.text }}>{selectedDoc.signatureRequired ? 'Oui' : 'Non'}</div></div>
              </div>
            </div>

            {selectedDoc.signedBy && selectedDoc.signedBy.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 8 }}>SIGNATURES</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {selectedDoc.signedBy.map((sig: string, idx: number) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'rgba(62, 207, 142, 0.1)', borderRadius: 20, border: '1px solid rgba(62, 207, 142, 0.2)' }}>
                      <span style={{ fontSize: 12 }}>✓</span>
                      <span style={{ fontSize: 12, color: '#3ecf8e' }}>{sig}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => { setIsModalOpen(false); setSelectedDoc(null); }}>Fermer</Button>
              <Button variant="primary">Modifier</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Nom du document</label>
                <input type="text" placeholder="Contrat de travail..." style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Type</label>
                <select style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}>
                  <option value="contract">Contrat</option>
                  <option value="invoice">Facture</option>
                  <option value="report">Rapport</option>
                  <option value="policy">Politique</option>
                  <option value="other">Autre</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Catégorie</label>
                <select style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}>
                  <option value="rh">RH</option>
                  <option value="finance">Finance</option>
                  <option value="juridique">Juridique</option>
                  <option value="technique">Technique</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
              <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>Annuler</Button>
              <Button variant="primary" type="submit">Créer</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Documents;

