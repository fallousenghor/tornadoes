import { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Plus, Filter, Eye, Trash2, FileText, FileCheck, FileX, Calendar, User, Upload } from 'lucide-react';
import documentService, {
  Document,
  DocumentType,
  DocumentCategory,
  DocumentStatus,
  documentTypeLabels,
  documentCategoryLabels
} from '../../services/documentService';
import employeeService from '../../services/employeeService';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import Modal from '../../components/common/Modal';
import { LoadingSpinner } from '../../components/common/Loading';
import { useToast } from '../../store/toastStore';
import { useTheme } from '../../contexts/ThemeContext';
import { Colors, BorderRadius, Spacing } from '../../constants/theme';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  employeeNumber?: string;
}

const CATEGORY_OPTIONS = [
  { value: '', label: 'Toutes catégories' },
  { value: 'RH', label: 'Ressources Humaines' },
  { value: 'FINANCE', label: 'Finance' },
  { value: 'JURIDIQUE', label: 'Juridique' },
  { value: 'TECHNIQUE', label: 'Technique' },
  { value: 'COMMERCIAL', label: 'Commercial' },
  { value: 'GENERAL', label: 'Général' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'Tous statuts' },
  { value: 'DRAFT', label: 'Brouillon' },
  { value: 'PENDING_SIGNATURE', label: 'En attente' },
  { value: 'SIGNED', label: 'Signé' },
  { value: 'EXPIRED', label: 'Expiré' },
];

const TYPE_ICONS: Record<DocumentType, string> = {
  CONTRACT: '📄',
  CNSS: '🛂',
  ID: '🪪',
  DIPLOMA: '🎓',
  INVOICE: '💰',
  REPORT: '📊',
  POLICY: '📋',
  OTHER: '📁',
};

const getStatusStyle = (status: DocumentStatus, colors: any) => {
  const statusMap: Record<string, { bg: string; color: string; label: string }> = {
    DRAFT: { bg: colors.neutralMuted || 'rgba(100, 140, 255, 0.1)', color: colors.textMuted || '#6b7280', label: 'Brouillon' },
    PENDING_SIGNATURE: { bg: colors.warningMuted || 'rgba(251, 146, 60, 0.15)', color: colors.warning || '#fb923c', label: 'En attente' },
    SIGNED: { bg: colors.successMuted || 'rgba(62, 207, 142, 0.15)', color: colors.success || '#3ecf8e', label: 'Signé' },
    EXPIRED: { bg: colors.dangerMuted || 'rgba(224, 80, 80, 0.15)', color: colors.danger || '#e05050', label: 'Expiré' },
  };
  return statusMap[status] || statusMap.DRAFT;
};

const getCategoryColor = (category: DocumentCategory, colors: any) => {
  const colorMap: Record<DocumentCategory, string> = {
    RH: colors.primary || '#6490ff',
    FINANCE: colors.success || '#3ecf8e',
    JURIDIQUE: colors.purple || '#a855f7',
    TECHNIQUE: colors.orange || '#f97316',
    COMMERCIAL: colors.warning || '#fb923c',
    GENERAL: colors.textMuted || '#6b7280',
  };
  return colorMap[category] || colorMap.GENERAL;
};

export function Documents() {
  const { colors } = useTheme();
  const toast = useToast();
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'OTHER' as DocumentType,
    category: 'GENERAL' as DocumentCategory,
    fileUrl: '',
    employeeId: '',
  });
  const [employees, setEmployees] = useState<Employee[]>([]);

  const loadEmployees = useCallback(async () => {
    try {
      const result = await employeeService.getEmployees({ page: 0, pageSize: 200 });
      setEmployees(result.data.map((emp: any) => ({
        id: emp.id,
        firstName: emp.firstName,
        lastName: emp.lastName,
        employeeNumber: emp.employeeNumber,
      })));
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  }, []);

  const loadDocuments = useCallback(async () => {
    try {
      setLoading(true);
      const result = await documentService.getDocuments({
        page: 0,
        size: 100,
        category: categoryFilter as DocumentCategory || undefined,
        status: statusFilter as DocumentStatus || undefined,
        search: searchQuery || undefined,
      });
      setDocuments(result.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, statusFilter, searchQuery]);

  useEffect(() => {
    loadDocuments();
    loadEmployees();
  }, [loadDocuments, loadEmployees]);

  // Client-side filtering
  const filteredDocuments = useMemo(() => {
    let result = documents;

    if (categoryFilter) {
      result = result.filter(doc => doc.category === categoryFilter);
    }
    if (statusFilter) {
      result = result.filter(doc => doc.status === statusFilter);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(doc =>
        doc.name.toLowerCase().includes(query) ||
        (doc.description && doc.description.toLowerCase().includes(query))
      );
    }

    return result;
  }, [documents, categoryFilter, statusFilter, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    const total = documents.length;
    const draft = documents.filter(d => d.status === 'DRAFT').length;
    const pending = documents.filter(d => d.status === 'PENDING_SIGNATURE').length;
    const signed = documents.filter(d => d.status === 'SIGNED').length;
    const expired = documents.filter(d => d.status === 'EXPIRED').length;
    return { total, draft, pending, signed, expired };
  }, [documents]);

  const handleOpenCreate = () => {
    setIsCreateMode(true);
    setSelectedDoc(null);
    setFormData({
      name: '',
      description: '',
      type: 'OTHER',
      category: 'GENERAL',
      fileUrl: '',
      employeeId: '',
    });
    setShowModal(true);
  };

  const handleOpenView = (doc: Document) => {
    setIsCreateMode(false);
    setSelectedDoc(doc);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await documentService.createDocument({
        name: formData.name,
        description: formData.description || undefined,
        type: formData.type,
        category: formData.category,
        fileUrl: formData.fileUrl || undefined,
        employeeId: formData.employeeId || undefined,
      });
      
      toast.success('Document créé', 'Le nouveau document a été ajouté');
      setShowModal(false);
      loadDocuments();
    } catch (error: any) {
      console.error('Error creating document:', error);
      toast.error('Erreur', 'Une erreur est survenue lors de la création');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce document?')) return;
    try {
      await documentService.deleteDocument(id);
      toast.success('Document supprimé');
      setShowModal(false);
      loadDocuments();
    } catch (error) {
      toast.error('Erreur de suppression');
    }
  };

  const handleSign = async (id: string) => {
    try {
      await documentService.updateDocument(id, { status: 'SIGNED' });
      toast.success('Document signé');
      loadDocuments();
    } catch (error) {
      toast.error('Erreur lors de la signature');
    }
  };

  const handleMarkExpired = async (id: string) => {
    try {
      await documentService.updateDocument(id, { status: 'EXPIRED' });
      toast.success('Document marqué comme expiré');
      loadDocuments();
    } catch (error) {
      toast.error('Erreur lors du marquage');
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: Spacing.lg, color: colors.textMuted }}><LoadingSpinner size="lg" /></div>;

  return (
    <div style={{ padding: Spacing.lg, display: 'flex', flexDirection: 'column', gap: Spacing.lg }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: colors.text, margin: 0 }}>
            Gestion Documentaire
          </h1>
          <p style={{ fontSize: 13, color: colors.textMuted, marginTop: 4 }}>
            Documents · Catégories · Archivage
          </p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus style={{ width: 16, height: 16, marginRight: 8 }} />
          Nouveau Document
        </Button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: Spacing.md }}>
        <Card style={{ padding: Spacing.md, background: colors.card, border: `1px solid ${colors.border}`, borderRadius: BorderRadius.lg }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.sm }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: 'rgba(100, 140, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              color: '#6490ff',
            }}>
              <FileText size={20} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {stats.total}
              </div>
            </div>
          </div>
        </Card>

        <Card style={{ padding: Spacing.md, background: colors.card, border: `1px solid ${colors.border}`, borderRadius: BorderRadius.lg }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.sm }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: 'rgba(251, 146, 60, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              color: '#fb923c',
            }}>
              <Filter size={20} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                En Attente
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {stats.pending}
              </div>
            </div>
          </div>
        </Card>

        <Card style={{ padding: Spacing.md, background: colors.card, border: `1px solid ${colors.border}`, borderRadius: BorderRadius.lg }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.sm }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: 'rgba(62, 207, 142, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              color: '#3ecf8e',
            }}>
              <FileCheck size={20} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Signés
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {stats.signed}
              </div>
            </div>
          </div>
        </Card>

        <Card style={{ padding: Spacing.md, background: colors.card, border: `1px solid ${colors.border}`, borderRadius: BorderRadius.lg }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.sm }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: 'rgba(224, 80, 80, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              color: '#e05050',
            }}>
              <FileX size={20} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Expirés
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {stats.expired}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters Card */}
      <Card style={{ padding: Spacing.md, background: colors.card, border: `1px solid ${colors.border}`, borderRadius: BorderRadius.lg }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: Spacing.md, alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search style={{ position: 'absolute', left: Spacing.sm, width: 16, height: 16, color: colors.textMuted }} />
              <Input
                placeholder="Rechercher un document..."
                value={searchQuery}
                onChange={(value) => setSearchQuery(value)}
                style={{ paddingLeft: 36, background: colors.input, color: colors.text, borderColor: colors.border }}
              />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: colors.textMuted, marginBottom: 4 }}>
              Catégorie
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{
                padding: '10px 12px',
                borderRadius: BorderRadius.md,
                border: `1px solid ${colors.border}`,
                background: colors.bg,
                color: colors.text,
                fontSize: 13,
                minWidth: 180,
              }}
            >
              {CATEGORY_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: colors.textMuted, marginBottom: 4 }}>
              Statut
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '10px 12px',
                borderRadius: BorderRadius.md,
                border: `1px solid ${colors.border}`,
                background: colors.bg,
                color: colors.text,
                fontSize: 13,
                minWidth: 150,
              }}
            >
              {STATUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Documents List */}
      {filteredDocuments.length === 0 ? (
        <Card style={{ padding: Spacing.lg, textAlign: 'center', color: colors.textMuted }}>
          <FileText size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Aucun document trouvé</p>
          <p style={{ fontSize: 13 }}>Commencez par créer un nouveau document</p>
        </Card>
      ) : (
        <Card style={{ padding: 0, overflow: 'hidden', background: colors.card, border: `1px solid ${colors.border}`, borderRadius: BorderRadius.lg }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(100, 140, 255, 0.05)' }}>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Document
                  </th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Catégorie
                  </th>
                  <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Statut
                  </th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Employé
                  </th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Date
                  </th>
                  <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((doc, index) => {
                  const statusStyle = getStatusStyle(doc.status, colors);
                  const catColor = getCategoryColor(doc.category, colors);
                  return (
                    <tr
                      key={doc.id}
                      style={{
                        borderBottom: `1px solid ${colors.border}`,
                        background: index % 2 === 0 ? 'transparent' : 'rgba(100, 140, 255, 0.02)',
                      }}
                    >
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 20 }}>{TYPE_ICONS[doc.type] || '📄'}</span>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{doc.name}</div>
                            {doc.description && (
                              <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>
                                {doc.description.substring(0, 50)}{doc.description.length > 50 ? '...' : ''}
                              </div>
                            )}
                            {doc.fileUrl && (
                              <div style={{ fontSize: 10, color: colors.primary || '#6490ff', marginTop: 2 }}>
                                🔗 Fichier joint
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: BorderRadius.sm,
                          fontSize: 11,
                          fontWeight: 600,
                          background: `${catColor}20`,
                          color: catColor,
                        }}>
                          {documentCategoryLabels[doc.category]}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: BorderRadius.sm,
                          fontSize: 11,
                          fontWeight: 600,
                          background: statusStyle.bg,
                          color: statusStyle.color,
                        }}>
                          {statusStyle.label}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 12, color: colors.textMuted }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <User size={12} />
                          {(() => {
                            const emp = employees.find(e => e.id === doc.employeeId);
                            return emp ? `${emp.firstName} ${emp.lastName}` : '—';
                          })()}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 12, color: colors.textMuted }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Calendar size={12} />
                          {formatDate(doc.updatedAt)}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                          <button
                            onClick={() => handleOpenView(doc)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: BorderRadius.sm,
                              border: `1px solid ${colors.border}`,
                              background: 'transparent',
                              color: colors.textMuted,
                              fontSize: 11,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                            }}
                          >
                            <Eye size={12} />
                            Voir
                          </button>
                          {doc.status === 'DRAFT' && (
                            <button
                              onClick={() => handleSign(doc.id)}
                              style={{
                                padding: '6px 12px',
                                borderRadius: BorderRadius.sm,
                                border: 'none',
                                background: 'rgba(62, 207, 142, 0.15)',
                                color: '#3ecf8e',
                                fontSize: 11,
                                cursor: 'pointer',
                                fontWeight: 500,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                              }}
                            >
                              <FileCheck size={12} />
                              Signer
                            </button>
                          )}
                          {doc.status !== 'EXPIRED' && (
                            <button
                              onClick={() => handleMarkExpired(doc.id)}
                              style={{
                                padding: '6px 12px',
                                borderRadius: BorderRadius.sm,
                                border: 'none',
                                background: 'rgba(224, 80, 80, 0.15)',
                                color: '#e05050',
                                fontSize: 11,
                                cursor: 'pointer',
                                fontWeight: 500,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                              }}
                            >
                              <FileX size={12} />
                              Expirer
                            </button>
                          )}
                          {doc.status === 'DRAFT' && (
                            <button
                              onClick={() => handleDelete(doc.id)}
                              style={{
                                padding: '6px 12px',
                                borderRadius: BorderRadius.sm,
                                border: 'none',
                                background: 'rgba(224, 80, 80, 0.15)',
                                color: '#e05050',
                                fontSize: 11,
                                cursor: 'pointer',
                                fontWeight: 500,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                              }}
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Create/View Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setSelectedDoc(null); }}
        title={isCreateMode ? 'Nouveau Document' : selectedDoc?.name || 'Détails du document'}
        size="lg"
      >
        {isCreateMode ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: Spacing.md }}>
            <Input
              label="Nom du document *"
              value={formData.name}
              onChange={(value) => setFormData({ ...formData, name: value })}
              placeholder="Contrat de travail..."
              style={{ background: colors.input, borderColor: colors.border, color: colors.text }}
            />
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: colors.text, marginBottom: Spacing.xs }}>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description du document..."
                style={{
                  width: '100%',
                  padding: Spacing.sm,
                  border: `1px solid ${colors.border}`,
                  borderRadius: BorderRadius.md,
                  background: colors.input,
                  color: colors.text,
                  fontFamily: 'inherit',
                  fontSize: 13,
                }}
                rows={3}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: colors.text, marginBottom: Spacing.xs }}>
                Lien vers le fichier (optionnel)
              </label>
              <input
                type="text"
                value={formData.fileUrl}
                onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                placeholder="https://drive.google.com/... ou https://..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: BorderRadius.md,
                  border: `1px solid ${colors.border}`,
                  background: colors.input,
                  color: colors.text,
                  fontSize: 13,
                  boxSizing: 'border-box',
                }}
              />
              <p style={{ fontSize: 11, color: colors.textMuted, marginTop: 4 }}>
                Lien Google Drive, Dropbox, SharePoint, OneDrive, etc.
              </p>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: colors.text, marginBottom: Spacing.xs }}>
                Employé lié (optionnel)
              </label>
              <select
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: BorderRadius.md,
                  border: `1px solid ${colors.border}`,
                  background: colors.input,
                  color: colors.text,
                  fontSize: 13,
                }}
              >
                <option value="">-- Aucun --</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName}{emp.employeeNumber ? ` (${emp.employeeNumber})` : ''}
                  </option>
                ))}
              </select>
              <p style={{ fontSize: 11, color: colors.textMuted, marginTop: 4 }}>
                Associer ce document à un employé (contrat, bulletin, etc.)
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: Spacing.md }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: colors.text, marginBottom: Spacing.xs }}>
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as DocumentType })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: BorderRadius.md,
                    border: `1px solid ${colors.border}`,
                    background: colors.input,
                    color: colors.text,
                    fontSize: 13,
                  }}
                >
                  {Object.entries(documentTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: colors.text, marginBottom: Spacing.xs }}>
                  Catégorie
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as DocumentCategory })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: BorderRadius.md,
                    border: `1px solid ${colors.border}`,
                    background: colors.input,
                    color: colors.text,
                    fontSize: 13,
                  }}
                >
                  {Object.entries(documentCategoryLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: Spacing.md, paddingTop: Spacing.md, borderTop: `1px solid ${colors.border}` }}>
              <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                Annuler
              </Button>
              <Button type="submit">
                Créer
              </Button>
            </div>
          </form>
        ) : selectedDoc ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.md }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: Spacing.md }}>
              <div>
                <p style={{ fontSize: 12, color: colors.textMuted, marginBottom: 4 }}>Type</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 20 }}>{TYPE_ICONS[selectedDoc.type] || '📄'}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>
                    {documentTypeLabels[selectedDoc.type]}
                  </span>
                </div>
              </div>
              <div>
                <p style={{ fontSize: 12, color: colors.textMuted, marginBottom: 4 }}>Catégorie</p>
                <span style={{
                  padding: '6px 12px',
                  borderRadius: BorderRadius.sm,
                  fontSize: 12,
                  fontWeight: 600,
                  background: `${getCategoryColor(selectedDoc.category, colors)}20`,
                  color: getCategoryColor(selectedDoc.category, colors),
                }}>
                  {documentCategoryLabels[selectedDoc.category]}
                </span>
              </div>
              <div>
                <p style={{ fontSize: 12, color: colors.textMuted, marginBottom: 4 }}>Statut</p>
                <span style={{
                  padding: '6px 12px',
                  borderRadius: BorderRadius.sm,
                  fontSize: 12,
                  fontWeight: 600,
                  background: getStatusStyle(selectedDoc.status, colors).bg,
                  color: getStatusStyle(selectedDoc.status, colors).color,
                }}>
                  {getStatusStyle(selectedDoc.status, colors).label}
                </span>
              </div>
              <div>
                <p style={{ fontSize: 12, color: colors.textMuted, marginBottom: 4 }}>Dernière modification</p>
                <p style={{ fontSize: 13, color: colors.text }}>{formatDate(selectedDoc.updatedAt)}</p>
              </div>
              {selectedDoc.employeeId && (
                <div>
                  <p style={{ fontSize: 12, color: colors.textMuted, marginBottom: 4 }}>Employé lié</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <User size={14} style={{ color: colors.primary || '#6490ff' }} />
                    <span style={{ fontSize: 13, color: colors.text }}>
                      {(() => {
                        const emp = employees.find(e => e.id === selectedDoc.employeeId);
                        return emp ? `${emp.firstName} ${emp.lastName}` : 'Inconnu';
                      })()}
                    </span>
                  </div>
                </div>
              )}
            </div>
            {selectedDoc.description && (
              <div>
                <p style={{ fontSize: 12, color: colors.textMuted, marginBottom: 4 }}>Description</p>
                <p style={{ fontSize: 13, color: colors.text, lineHeight: 1.5 }}>{selectedDoc.description}</p>
              </div>
            )}
            {selectedDoc.fileUrl && (
              <div>
                <p style={{ fontSize: 12, color: colors.textMuted, marginBottom: 4 }}>Fichier</p>
                <a
                  href={selectedDoc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 16px',
                    borderRadius: BorderRadius.md,
                    background: 'rgba(100, 140, 255, 0.1)',
                    color: colors.primary || '#6490ff',
                    fontSize: 13,
                    fontWeight: 500,
                    textDecoration: 'none',
                  }}
                >
                  🔗 Ouvrir le fichier
                </a>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: Spacing.md, paddingTop: Spacing.md, borderTop: `1px solid ${colors.border}` }}>
              <Button variant="danger" onClick={() => handleDelete(selectedDoc.id)}>
                Supprimer
              </Button>
              <Button variant="secondary" onClick={() => { setShowModal(false); setSelectedDoc(null); }}>
                Fermer
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}

export default Documents;
