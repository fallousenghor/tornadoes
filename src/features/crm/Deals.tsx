import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, TrendingUp, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import dealService from '../../services/dealService';
import { Deal, DealStage, DealStatus } from '../../types';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingSpinner } from '../../components/common/Loading';
import { useToast } from '../../store/toastStore';
import { formatCurrency } from '../../utils/currency';
import { useTheme } from '../../contexts/ThemeContext';
import { Colors, BorderRadius, Spacing } from '../../constants/theme';

const DEAL_STAGES: DealStage[] = ['PROSPECTION', 'QUALIFICATION', 'PROPOSITION', 'NEGOTIATION', 'WON', 'LOST'];

const STAGE_LABELS: Record<DealStage, string> = {
  PROSPECTION: 'Prospection',
  QUALIFICATION: 'Qualification',
  PROPOSITION: 'Proposition',
  NEGOTIATION: 'Négociation',
  WON: 'Gagné',
  LOST: 'Perdu',
};

// Helper function to get stage style object using theme colors
const getStageStyle = (stage: DealStage, colors: any): React.CSSProperties => {
  const stageColorMap: Record<DealStage, { bg: string; color: string }> = {
    PROSPECTION: { bg: colors.neutral, color: colors.text },
    QUALIFICATION: { bg: colors.primaryMuted, color: colors.primary },
    PROPOSITION: { bg: colors.warningMuted, color: colors.warning },
    NEGOTIATION: { bg: colors.warningMuted, color: colors.warning },
    WON: { bg: colors.successMuted, color: colors.success },
    LOST: { bg: colors.dangerMuted, color: colors.danger },
  };
  const style = stageColorMap[stage];
  return {
    display: 'inline-block',
    padding: '6px 12px',
    borderRadius: BorderRadius.sm,
    backgroundColor: style?.bg || colors.neutral,
    color: style?.color || colors.text,
    fontSize: '12px',
    fontWeight: '600',
  };
};

export function Deals() {
  const { colors } = useTheme();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    stage: 'PROSPECTION' as DealStage,
    amount: 0,
    currency: 'XOF',
    expectedClose: '',
    contactId: '',
    contactName: '',
    notes: '',
    ownerName: '',
    status: 'OPEN' as DealStatus,
  });
  const toast = useToast();

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      setLoading(true);
      const response: any = await dealService.getAll();
      const deals = Array.isArray(response) ? response : response?.data || [];
      setDeals(deals);
    } catch (error) {
      toast.error('Erreur de chargement', 'Impossible de charger les opportunités');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setSelectedDeal(null);
    setFormData({
      title: '',
      description: '',
      stage: 'PROSPECTION',
      amount: 0,
      currency: 'XOF',
      expectedClose: '',
      contactId: '',
      contactName: '',
      notes: '',
      ownerName: '',
      status: 'OPEN',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (deal: Deal) => {
    setSelectedDeal(deal);
    setFormData({
      title: deal.title,
      description: deal.description || '',
      stage: deal.stage,
      amount: deal.amount,
      currency: deal.currency || 'XOF',
      expectedClose: deal.expectedClose?.toString() || '',
      contactId: deal.contactId || '',
      contactName: deal.contactName || '',
      notes: deal.notes || '',
      ownerName: deal.ownerName || '',
      status: deal.status || 'OPEN',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting deal form data:', formData);
    
    try {
      const submitData: any = {
        title: formData.title,
        description: formData.description,
        stage: formData.stage,
        value: Number(formData.amount),
        currency: formData.currency || 'XOF',
        expectedCloseDate: formData.expectedClose || undefined,
        contactId: formData.contactId || undefined,
        contactName: formData.contactName || undefined,
        notes: formData.notes || undefined,
      };
      
      console.log('Sending to backend:', submitData);
      
      if (selectedDeal) {
        await dealService.update(selectedDeal.id, submitData);
        toast.success('Opportunité mise à jour');
      } else {
        await dealService.create(submitData);
        toast.success('Opportunité créée');
      }
      setShowModal(false);
      loadDeals();
    } catch (error: any) {
      console.error('Error saving deal:', error);
      console.error('Error response:', error.response?.data);
      
      let errorMsg = 'Une erreur est survenue';
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        errorMsg = Object.entries(errors).map(([field, msg]) => `${field}: ${msg}`).join('\n');
      }
      
      toast.error('Erreur', errorMsg);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette opportunité?')) return;
    try {
      await dealService.delete(id);
      toast.success('Opportunité supprimée');
      loadDeals();
    } catch (error) {
      toast.error('Erreur de suppression');
    }
  };

  const handleAdvanceStage = async (id: string) => {
    try {
      await dealService.advanceStage(id);
      toast.success('Étape avancée');
      loadDeals();
    } catch (error) {
      toast.error('Erreur', 'Impossible d\'avancer l\'étape');
    }
  };

  const handleMarkWon = async (id: string) => {
    try {
      await dealService.markAsWon(id);
      toast.success('Opportunité gagnée!');
      loadDeals();
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const handleMarkLost = async (id: string) => {
    try {
      await dealService.markAsLost(id, 'Perdue');
      toast.success('Opportunité marquée comme perdue');
      loadDeals();
    } catch (error) {
      toast.error('Erreur');
    }
  };

  // Group deals by stage
  const dealsByStage = DEAL_STAGES.reduce((acc, stage) => {
    acc[stage] = deals.filter(d => d.stage === stage);
    return acc;
  }, {} as Record<DealStage, Deal[]>);

  // Calculate stats
  const totalDeals = deals.length;
  const openDeals = deals.filter(d => !['WON', 'LOST'].includes(d.stage)).length;
  const pipelineValue = deals
    .filter(d => !['WON', 'LOST'].includes(d.stage))
    .reduce((sum, d) => sum + d.amount, 0);
  const wonDeals = deals.filter(d => d.stage === 'WON').length;

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: Spacing.lg }}><LoadingSpinner size="lg" /></div>;

  return (
    <div style={{ padding: Spacing.lg, background: colors.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: Spacing.lg }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: Spacing.md }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: colors.text, margin: 0 }}>Opportunités</h1>
          <p style={{ fontSize: 14, color: colors.textMuted, margin: `${Spacing.xs} 0 0` }}>Gérez votre pipeline de ventes</p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus style={{ width: 16, height: 16, marginRight: 8 }} />
          Nouvelle Opportunité
        </Button>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: Spacing.md }}>
        <Card style={{ padding: Spacing.md, background: colors.card, border: `1px solid ${colors.border}`, borderRadius: BorderRadius.md }}>
          <p style={{ fontSize: 12, color: colors.textMuted, margin: 0, marginBottom: Spacing.xs, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Opportunités</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: 28, fontWeight: 700, color: colors.primary, margin: 0 }}>{totalDeals}</p>
            <TrendingUp style={{ width: 24, height: 24, color: colors.primary, opacity: 0.5 }} />
          </div>
        </Card>
        <Card style={{ padding: Spacing.md, background: colors.card, border: `1px solid ${colors.border}`, borderRadius: BorderRadius.md }}>
          <p style={{ fontSize: 12, color: colors.textMuted, margin: 0, marginBottom: Spacing.xs, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>En Cours</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: 28, fontWeight: 700, color: colors.success, margin: 0 }}>{openDeals}</p>
            <DollarSign style={{ width: 24, height: 24, color: colors.success, opacity: 0.5 }} />
          </div>
        </Card>
        <Card style={{ padding: Spacing.md, background: colors.card, border: `1px solid ${colors.border}`, borderRadius: BorderRadius.md }}>
          <p style={{ fontSize: 12, color: colors.textMuted, margin: 0, marginBottom: Spacing.xs, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Valeur Pipeline</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: 28, fontWeight: 700, color: colors.primary, margin: 0 }}>{formatCurrency(pipelineValue)}</p>
            <TrendingUp style={{ width: 24, height: 24, color: colors.primary, opacity: 0.5 }} />
          </div>
        </Card>
        <Card style={{ padding: Spacing.md, background: colors.card, border: `1px solid ${colors.border}`, borderRadius: BorderRadius.md }}>
          <p style={{ fontSize: 12, color: colors.textMuted, margin: 0, marginBottom: Spacing.xs, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Gagnées</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: 28, fontWeight: 700, color: colors.success, margin: 0 }}>{wonDeals}</p>
            <CheckCircle style={{ width: 24, height: 24, color: colors.success, opacity: 0.5 }} />
          </div>
        </Card>
      </div>

      {/* Pipeline Stages Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: Spacing.md }}>
        {DEAL_STAGES.map((stage) => {
          const stageDeals = dealsByStage[stage];
          const stageTotal = stageDeals.reduce((sum, d) => sum + d.amount, 0);

          return (
            <Card key={stage} style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: BorderRadius.md, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {/* Stage Header */}
              <div style={{ ...getStageStyle(stage, colors), padding: `${Spacing.sm} ${Spacing.md}`, marginBottom: Spacing.md }}>
                {STAGE_LABELS[stage]}
              </div>

              {/* Stage Content */}
              <div style={{ padding: Spacing.md, paddingTop: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: Spacing.md }}>
                  <p style={{ fontSize: 11, color: colors.textMuted, margin: 0, marginBottom: Spacing.xs }}>
                    {stageDeals.length} deal{stageDeals.length !== 1 ? 's' : ''}
                  </p>
                  <p style={{ fontSize: 16, fontWeight: 700, color: colors.text, margin: 0 }}>
                    {formatCurrency(stageTotal)}
                  </p>
                </div>

                {/* Deals List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.sm, flex: 1 }}>
                  {stageDeals.length === 0 ? (
                    <p style={{ fontSize: 11, color: colors.textMuted, textAlign: 'center', padding: `${Spacing.md} 0` }}>Aucune opportunité</p>
                  ) : (
                    stageDeals.map((deal) => (
                      <div
                        key={deal.id}
                        onClick={() => handleOpenEdit(deal)}
                        style={{
                          padding: Spacing.sm,
                          background: colors.bg,
                          border: `1px solid ${colors.border}`,
                          borderRadius: BorderRadius.sm,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = colors.primary;
                          e.currentTarget.style.backgroundColor = colors.hover;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = colors.border;
                          e.currentTarget.style.backgroundColor = colors.bg;
                        }}
                      >
                        <h4 style={{ fontSize: 12, fontWeight: 600, color: colors.text, margin: 0, marginBottom: `${Spacing.xs}` }}>
                          {deal.title}
                        </h4>
                        <div style={{ fontSize: 11, color: colors.primary, fontWeight: 700, marginBottom: `${Spacing.xs}` }}>
                          {formatCurrency(deal.amount)}
                        </div>
                        {deal.contactName && (
                          <p style={{ fontSize: 11, color: colors.textMuted, margin: 0, marginBottom: `${Spacing.xs}` }}>
                            {deal.contactName}
                          </p>
                        )}
                        <div style={{ display: 'flex', gap: Spacing.xs, justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 10, color: colors.textMuted }}>{deal.probability}%</span>
                          {!['WON', 'LOST'].includes(stage) && (
                            <div style={{ display: 'flex', gap: '2px' }}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkWon(deal.id);
                                }}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  padding: 0,
                                  display: 'flex',
                                  alignItems: 'center',
                                  color: colors.success,
                                  opacity: 0.7,
                                  transition: 'opacity 0.2s',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
                                title="Gagné"
                              >
                                <CheckCircle style={{ width: 14, height: 14 }} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(deal.id);
                                }}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  padding: 0,
                                  display: 'flex',
                                  alignItems: 'center',
                                  color: colors.danger,
                                  opacity: 0.7,
                                  transition: 'opacity 0.2s',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
                                title="Supprimer"
                              >
                                <Trash2 style={{ width: 14, height: 14 }} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedDeal ? 'Modifier l\'Opportunité' : 'Nouvelle Opportunité'}
        size="lg"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: Spacing.md }}>
          <Input
            label="Titre"
            value={formData.title}
            onChange={(value) => setFormData({ ...formData, title: value })}
          />
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: Spacing.xs, color: colors.text }}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{
                width: '100%',
                padding: Spacing.sm,
                border: `1px solid ${colors.border}`,
                borderRadius: BorderRadius.md,
                backgroundColor: colors.bg,
                color: colors.text,
                fontSize: 14,
              }}
              rows={3}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: Spacing.md }}>
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: Spacing.xs, color: colors.text }}>
                Étape
              </label>
              <select
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value as DealStage })}
                style={{
                  width: '100%',
                  padding: Spacing.sm,
                  border: `1px solid ${colors.border}`,
                  borderRadius: BorderRadius.md,
                  backgroundColor: colors.bg,
                  color: colors.text,
                  fontSize: 14,
                }}
              >
                {DEAL_STAGES.map((stage) => (
                  <option key={stage} value={stage}>
                    {STAGE_LABELS[stage]}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Valeur"
              type="number"
              value={String(formData.amount)}
              onChange={(value) => setFormData({ ...formData, amount: parseFloat(value) || 0 })}
            />
          </div>
          <Input
            label="Date de clôture prévue"
            type="date"
            value={formData.expectedClose}
            onChange={(value) => setFormData({ ...formData, expectedClose: value })}
          />
          <Input
            label="Nom du Contact"
            value={formData.contactName}
            onChange={(value) => setFormData({ ...formData, contactName: value })}
          />
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: Spacing.xs, color: colors.text }}>
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              style={{
                width: '100%',
                padding: Spacing.sm,
                border: `1px solid ${colors.border}`,
                borderRadius: BorderRadius.md,
                backgroundColor: colors.bg,
                color: colors.text,
                fontSize: 14,
              }}
              rows={3}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: Spacing.md, paddingTop: Spacing.md }}>
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
              Annuler
            </Button>
            <Button type="submit">
              {selectedDeal ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Deals;
