// Documents Feature - Tornadoes Job Document Management
// Connected to backend API

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, Button, Modal, FilterBar, PaginationControls } from '../../components/common';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Colors } from '../../constants/theme';
import documentService, { 
  Document, 
  DocumentType, 
  DocumentCategory, 
  DocumentStatus,
  DocumentStats,
  documentTypeLabels,
  documentCategoryLabels 
} from '../../services/documentService';

// Document type icons
const docTypeIcons: Record<string, string> = {
  CONTRACT: '📄',
  CNSS: '🛂',
  ID: '🪪',
  DIPLOMA: '🎓',
  INVOICE: '💰',
  REPORT: '📊',
  POLICY: '📋',
  OTHER: '📁',
};

// Category colors
const categoryColors: Record<string, string> = {
  RH: '#6490ff',
  FINANCE: '#3ecf8e',
  JURIDIQUE: '#a78bfa',
  TECHNIQUE: '#fb923c',
  COMMERCIAL: '#c9a84c',
  GENERAL: '#5a6480',
};

// Filter options matching backend enums
const categoryOptions = [
  { value: '', label: 'Toutes catégories' },
  { value: 'RH', label: 'RH' },
  { value: 'FINANCE', label: 'Finance' },
  { value: 'JURIDIQUE', label: 'Juridique' },
  { value: 'TECHNIQUE', label: 'Technique' },
  { value: 'COMMERCIAL', label: 'Commercial' },
  { value: 'GENERAL', label: 'Général' },
];

const statusOptions = [
  { value: '', label: 'Tous statuts' },
  { value: 'DRAFT', label: 'Brouillon' },
  { value: 'PENDING_SIGNATURE', label: 'En attente' },
  { value: 'SIGNED', label: 'Signé' },
  { value: 'EXPIRED', label: 'Expiré' },
];

// Get frontend-friendly status for StatusBadge
const getStatusBadgeStatus = (status: DocumentStatus): string => {
  const statusMap: Record<DocumentStatus, string> = {
    DRAFT: 'draft',
    PENDING_SIGNATURE: 'pending_signature',
    SIGNED: 'signed',
    EXPIRED: 'expired',
  };
  return statusMap[status] || 'draft';
};

export const Documents: React.FC = () => {
  // State
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [stats, setStats] = useState<DocumentStats>({ total: 0, draft: 0, pending: 0, signed: 0, expired: 0 });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Fetch documents from API
  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await documentService.getDocuments({
        page: currentPage,
        size: pageSize,
        category: categoryFilter as DocumentCategory || undefined,
        status: statusFilter as DocumentStatus || undefined,
        search: searchQuery || undefined,
        sortBy: 'createdAt',
        sortDir: 'DESC',
      });
      setDocuments(result.data);
      setTotalItems(result.total);
      setTotalPages(Math.ceil(result.total / pageSize));
    } catch (error) {
      console.error('Error fetching documents:', error);
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, categoryFilter, statusFilter, searchQuery]);

  // Fetch stats from API
  const fetchStats = useCallback(async () => {
    try {
      const result = await documentService.getDocumentStats();
      setStats(result);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchDocuments();
    fetchStats();
  }, [fetchDocuments, fetchStats]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle filter change
  const handleFilterChange = (key: string, value: string) => {
    if (key === 'category') {
      setCategoryFilter(value);
    } else if (key === 'status') {
      setStatusFilter(value);
    }
    setCurrentPage(0); // Reset to first page
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(0); // Reset to first page
  };

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // View mode tabs
  const viewModes = [
    { id: 'list', label: 'Liste', icon: '☰' },
    { id: 'grid', label: 'Grille', icon: '▦' },
  ];

  // Calculate pagination values
  const showingFrom = totalItems > 0 ? currentPage * pageSize + 1 : 0;
  const showingTo = Math.min((currentPage + 1) * pageSize, totalItems);

  // Handle create document
  const handleCreateDocument = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      await documentService.createDocument({
        name: formData.get('name') as string,
        type: formData.get('type') as DocumentType,
        category: formData.get('category') as DocumentCategory,
        description: formData.get('description') as string || undefined,
        signatureRequired: formData.get('signatureRequired') === 'on',
      });
      setIsModalOpen(false);
      fetchDocuments();
      fetchStats();
    } catch (error) {
      console.error('Error creating document:', error);
    }
  };

  // Handle delete document
  const handleDeleteDocument = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) return;
    
    try {
      await documentService.deleteDocument(id);
      setIsModalOpen(false);
      setSelectedDoc(null);
      fetchDocuments();
      fetchStats();
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

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
          <Button variant="primary" onClick={() => { setSelectedDoc(null); setIsModalOpen(true); }}>
            + Nouveau document
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 }}>
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(100, 140, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#6490ff' }}>
              📁
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {isLoading ? '...' : stats.total}
              </div>
            </div>
          </div>
        </Card>
        
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(90, 100, 128, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#5a6480' }}>
              📝
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Brouillons
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {isLoading ? '...' : stats.draft}
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
                {isLoading ? '...' : stats.pending}
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
                {isLoading ? '...' : stats.signed}
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
                {isLoading ? '...' : stats.expired}
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
            values={{ category: categoryFilter, status: statusFilter }}
            onChange={handleFilterChange}
            onSearch={handleSearch}
            searchValue={searchQuery}
            searchPlaceholder="Rechercher un document..."
          />
          
          <div style={{ display: 'flex', gap: 4, background: 'rgba(100, 140, 255, 0.05)', padding: 4, borderRadius: 10 }}>
            {viewModes.map(mode => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id as 'list' | 'grid')}
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
          {isLoading ? (
            <div style={{ padding: 40, textAlign: 'center', color: Colors.textMuted }}>
              Chargement des documents...
            </div>
          ) : documents.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: Colors.textMuted }}>
              Aucun document trouvé
            </div>
          ) : (
            <>
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
                    {documents.map((doc, index) => {
                      const catColor = categoryColors[doc.category] || categoryColors.GENERAL;
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
                            }}>
                              {documentCategoryLabels[doc.category] || doc.category}
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
                            <StatusBadge status={getStatusBadgeStatus(doc.status)} />
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
                onPageChange={handlePageChange}
              />
            </>
          )}
        </Card>
      )}

      {/* Documents Grid */}
      {viewMode === 'grid' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {isLoading ? (
            <div style={{ gridColumn: '1 / -1', padding: 40, textAlign: 'center', color: Colors.textMuted }}>
              Chargement des documents...
            </div>
          ) : documents.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', padding: 40, textAlign: 'center', color: Colors.textMuted }}>
              Aucun document trouvé
            </div>
          ) : (
            documents.map((doc) => {
              const catColor = categoryColors[doc.category] || categoryColors.GENERAL;
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
                    <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, background: `${catColor}20`, color: catColor }}>
                      {documentCategoryLabels[doc.category] || doc.category}
                    </span>
                    {doc.signatureRequired && (
                      <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, background: 'rgba(201, 168, 76, 0.15)', color: '#c9a84c' }}>
                        🔏 Signature
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <StatusBadge status={getStatusBadgeStatus(doc.status)} size="sm" />
                    <span style={{ fontSize: 10, color: Colors.textMuted }}>
                      {formatDate(doc.updatedAt)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
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
                  <span style={{ fontSize: 14, color: Colors.text }}>
                    {documentTypeLabels[selectedDoc.type] || selectedDoc.type}
                  </span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>CATÉGORIE</div>
                <span style={{ 
                  padding: '6px 12px', borderRadius: 6, fontSize: 12, 
                  background: `${categoryColors[selectedDoc.category] || categoryColors.GENERAL}20`, 
                  color: categoryColors[selectedDoc.category] || categoryColors.GENERAL,
                }}>
                  {documentCategoryLabels[selectedDoc.category] || selectedDoc.category}
                </span>
              </div>
              <div>
                <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>STATUT</div>
                <StatusBadge status={getStatusBadgeStatus(selectedDoc.status)} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>VERSION</div>
                <span style={{ padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: 'rgba(100, 140, 255, 0.15)', color: Colors.accent }}>
                  v{selectedDoc.version}
                </span>
              </div>
            </div>

            {selectedDoc.description && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 8 }}>DESCRIPTION</div>
                <div style={{ fontSize: 13, color: Colors.text }}>{selectedDoc.description}</div>
              </div>
            )}

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
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {selectedDoc.signedBy.map((sig, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'rgba(62, 207, 142, 0.1)', borderRadius: 20, border: '1px solid rgba(62, 207, 142, 0.2)' }}>
                      <span style={{ fontSize: 12 }}>✓</span>
                      <span style={{ fontSize: 12, color: '#3ecf8e' }}>{sig}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <Button 
                variant="secondary" 
                onClick={() => handleDeleteDocument(selectedDoc.id)}
                style={{ color: '#e05050', borderColor: '#e05050' }}
              >
                Supprimer
              </Button>
              <Button variant="secondary" onClick={() => { setIsModalOpen(false); setSelectedDoc(null); }}>Fermer</Button>
              <Button variant="primary">Modifier</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreateDocument}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Nom du document *</label>
                <input 
                  name="name" 
                  type="text" 
                  required
                  placeholder="Contrat de travail..." 
                  style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }} 
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Description</label>
                <textarea 
                  name="description"
                  placeholder="Description du document..."
                  rows={3}
                  style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13, resize: 'vertical' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Type *</label>
                <select 
                  name="type" 
                  required
                  style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}
                >
                  <option value="">Sélectionner...</option>
                  <option value="CONTRACT">Contrat</option>
                  <option value="CNSS">CNSS</option>
                  <option value="ID">Pièce identité</option>
                  <option value="DIPLOMA">Diplôme</option>
                  <option value="INVOICE">Facture</option>
                  <option value="REPORT">Rapport</option>
                  <option value="POLICY">Politique</option>
                  <option value="OTHER">Autre</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Catégorie *</label>
                <select 
                  name="category" 
                  required
                  style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}
                >
                  <option value="">Sélectionner...</option>
                  <option value="RH">Ressources Humaines</option>
                  <option value="FINANCE">Finance</option>
                  <option value="JURIDIQUE">Juridique</option>
                  <option value="TECHNIQUE">Technique</option>
                  <option value="COMMERCIAL">Commercial</option>
                  <option value="GENERAL">Général</option>
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input 
                    name="signatureRequired" 
                    type="checkbox"
                    style={{ width: 16, height: 16 }}
                  />
                  <span style={{ fontSize: 13, color: Colors.text }}>Signature requise</span>
                </label>
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

