import { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Eye, Edit2, Trash2, CheckCircle, XCircle, Package, Search, Filter, Calendar, Truck, DollarSign } from 'lucide-react';
import purchaseOrderService from '../../services/purchaseOrderService';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import Modal from '../../components/common/Modal';
import { LoadingSpinner } from '../../components/common/Loading';
import { useToast } from '../../store/toastStore';
import { useTheme } from '../../contexts/ThemeContext';
import { Colors, BorderRadius, Spacing } from '../../constants/theme';
import { formatCurrency } from '../../utils/currency';

type PurchaseOrderStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'SENT' | 'PARTIAL' | 'RECEIVED' | 'CANCELLED';

interface PurchaseOrderItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierName: string;
  supplierEmail?: string;
  orderDate: string;
  deliveryDate?: string;
  status: PurchaseOrderStatus;
  totalAmount: number;
  currency: string;
  notes?: string;
  items: PurchaseOrderItem[];
}

const STATUS_LABELS: Record<PurchaseOrderStatus, string> = {
  DRAFT: 'Brouillon',
  PENDING: 'En attente',
  APPROVED: 'Approuvée',
  SENT: 'Envoyée',
  PARTIAL: 'Partiellement reçue',
  RECEIVED: 'Reçue',
  CANCELLED: 'Annulée',
};

const getStageStyle = (status: PurchaseOrderStatus, colors: any) => {
  const statusColorMap: Record<PurchaseOrderStatus, { bg: string; color: string }> = {
    DRAFT: { bg: colors.neutralMuted || 'rgba(100, 140, 255, 0.1)', color: colors.textMuted || '#6b7280' },
    PENDING: { bg: colors.warningMuted || 'rgba(251, 146, 60, 0.15)', color: colors.warning || '#fb923c' },
    APPROVED: { bg: colors.primaryMuted || 'rgba(100, 140, 255, 0.15)', color: colors.primary || '#6490ff' },
    SENT: { bg: colors.purpleMuted || 'rgba(168, 85, 247, 0.15)', color: colors.purple || '#a855f7' },
    PARTIAL: { bg: colors.orangeMuted || 'rgba(251, 146, 60, 0.15)', color: colors.orange || '#f97316' },
    RECEIVED: { bg: colors.successMuted || 'rgba(62, 207, 142, 0.15)', color: colors.success || '#3ecf8e' },
    CANCELLED: { bg: colors.dangerMuted || 'rgba(224, 80, 80, 0.15)', color: colors.danger || '#e05050' },
  };
  return statusColorMap[status] || statusColorMap.DRAFT;
};

export function Purchases() {
  const { colors } = useTheme();
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PurchaseOrderStatus | 'ALL'>('ALL');
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [viewOrder, setViewOrder] = useState<PurchaseOrder | null>(null);
  const [formData, setFormData] = useState({
    supplierName: '',
    supplierEmail: '',
    orderDate: new Date().toISOString().split('T')[0],
    deliveryDate: '',
    notes: '',
    items: [{ description: '', quantity: 1, unitPrice: 0 }] as PurchaseOrderItem[],
  });
  const toast = useToast();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await purchaseOrderService.getAll();
      setOrders(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Erreur de chargement', 'Impossible de charger les commandes');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Client-side filtering
  const filteredOrders = useMemo(() => {
    let result = orders;

    if (statusFilter !== 'ALL') {
      result = result.filter(order => order.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(order =>
        order.orderNumber.toLowerCase().includes(query) ||
        order.supplierName.toLowerCase().includes(query) ||
        (order.supplierEmail && order.supplierEmail.toLowerCase().includes(query))
      );
    }

    return result;
  }, [orders, statusFilter, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
    const receivedOrders = orders.filter(o => o.status === 'RECEIVED').length;
    const totalValue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    return { totalOrders, pendingOrders, receivedOrders, totalValue };
  }, [orders]);

  const handleOpenCreate = () => {
    setSelectedOrder(null);
    setFormData({
      supplierName: '',
      supplierEmail: '',
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate: '',
      notes: '',
      items: [{ description: '', quantity: 1, unitPrice: 0 }],
    });
    setShowModal(true);
  };

  const handleOpenEdit = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    setFormData({
      supplierName: order.supplierName,
      supplierEmail: order.supplierEmail || '',
      orderDate: order.orderDate,
      deliveryDate: order.deliveryDate || '',
      notes: order.notes || '',
      items: order.items.length > 0 ? order.items : [{ description: '', quantity: 1, unitPrice: 0 }],
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const totalAmount = formData.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

    try {
      const data: any = {
        supplierName: formData.supplierName,
        supplierEmail: formData.supplierEmail || undefined,
        orderDate: formData.orderDate,
        deliveryDate: formData.deliveryDate || undefined,
        notes: formData.notes || undefined,
        items: formData.items,
        totalAmount,
        currency: 'XOF',
      };

      if (selectedOrder) {
        await purchaseOrderService.update(selectedOrder.id, data);
        toast.success('Commande mise à jour', 'Les modifications ont été enregistrées');
      } else {
        await purchaseOrderService.create(data);
        toast.success('Commande créée', 'La nouvelle commande a été ajoutée');
      }
      setShowModal(false);
      loadOrders();
    } catch (error: any) {
      console.error('Error saving order:', error);
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
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette commande?')) return;
    try {
      await purchaseOrderService.delete(id);
      toast.success('Commande supprimée');
      loadOrders();
    } catch (error) {
      toast.error('Erreur de suppression');
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await purchaseOrderService.approve(id);
      toast.success('Commande approuvée');
      loadOrders();
    } catch (error) {
      toast.error('Erreur d\'approbation');
    }
  };

  const handleDeliver = async (id: string) => {
    try {
      await purchaseOrderService.receive(id);
      toast.success('Commande marquée comme reçue');
      loadOrders();
    } catch (error) {
      toast.error('Erreur de livraison');
    }
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, unitPrice: 0 }],
    });
  };

  const removeItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const updateItem = (index: number, field: keyof PurchaseOrderItem, value: string | number) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: Spacing.lg, color: colors.textMuted }}><LoadingSpinner size="lg" /></div>;

  return (
    <div style={{ padding: Spacing.lg, display: 'flex', flexDirection: 'column', gap: Spacing.lg }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: colors.text, margin: 0 }}>
            Commandes d'Achat
          </h1>
          <p style={{ fontSize: 13, color: colors.textMuted, marginTop: 4 }}>
            Gestion · Suivi · Approvisionnement
          </p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus style={{ width: 16, height: 16, marginRight: 8 }} />
          Nouvelle Commande
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
              <Package size={20} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total Commandes
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {stats.totalOrders}
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
                {stats.pendingOrders}
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
              <CheckCircle size={20} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Reçues
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {stats.receivedOrders}
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
              background: 'rgba(168, 85, 247, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              color: '#a855f7',
            }}>
              <DollarSign size={20} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Valeur Totale
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {formatCurrency(stats.totalValue)}
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
                placeholder="Rechercher une commande..."
                value={searchQuery}
                onChange={(value) => setSearchQuery(value)}
                style={{ paddingLeft: 36, background: colors.input, color: colors.text, borderColor: colors.border }}
              />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: colors.textMuted, marginBottom: 4 }}>
              Statut
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as PurchaseOrderStatus | 'ALL')}
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
              <option value="ALL">Tous les statuts</option>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <Card style={{ padding: Spacing.lg, textAlign: 'center', color: colors.textMuted }}>
          <Package size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Aucune commande trouvée</p>
          <p style={{ fontSize: 13 }}>Commencez par créer une nouvelle commande d'achat</p>
        </Card>
      ) : (
        <Card style={{ padding: 0, overflow: 'hidden', background: colors.card, border: `1px solid ${colors.border}`, borderRadius: BorderRadius.lg }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(100, 140, 255, 0.05)' }}>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    N° Commande
                  </th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Fournisseur
                  </th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Date
                  </th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Livraison
                  </th>
                  <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Statut
                  </th>
                  <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Montant
                  </th>
                  <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => {
                  const statusStyle = getStageStyle(order.status, colors);
                  return (
                    <tr
                      key={order.id}
                      style={{
                        borderBottom: `1px solid ${colors.border}`,
                        background: index % 2 === 0 ? 'transparent' : 'rgba(100, 140, 255, 0.02)',
                      }}
                    >
                      <td style={{ padding: '14px 16px', fontSize: 13, fontFamily: 'monospace', fontWeight: 600, color: colors.accent }}>
                        {order.orderNumber}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{order.supplierName}</div>
                        {order.supplierEmail && (
                          <div style={{ fontSize: 11, color: colors.textMuted }}>{order.supplierEmail}</div>
                        )}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: colors.textMuted }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Calendar size={12} />
                          {new Date(order.orderDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: order.deliveryDate ? colors.textMuted : colors.textMuted }}>
                        {order.deliveryDate ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Truck size={12} />
                            {new Date(order.deliveryDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                        ) : '—'}
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
                          {STATUS_LABELS[order.status]}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 14, fontWeight: 600, fontFamily: "'DM Serif Display', serif", color: colors.text }}>
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                          <button
                            onClick={() => setViewOrder(order)}
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
                            Détails
                          </button>
                          {order.status === 'DRAFT' && (
                            <button
                              onClick={() => handleOpenEdit(order)}
                              style={{
                                padding: '6px 12px',
                                borderRadius: BorderRadius.sm,
                                border: 'none',
                                background: 'rgba(100, 140, 255, 0.15)',
                                color: colors.primary || '#6490ff',
                                fontSize: 11,
                                cursor: 'pointer',
                                fontWeight: 500,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                              }}
                            >
                              <Edit2 size={12} />
                              Modifier
                            </button>
                          )}
                          {order.status === 'PENDING' && (
                            <button
                              onClick={() => handleApprove(order.id)}
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
                              <CheckCircle size={12} />
                              Approuver
                            </button>
                          )}
                          {(order.status === 'APPROVED' || order.status === 'SENT') && (
                            <button
                              onClick={() => handleDeliver(order.id)}
                              style={{
                                padding: '6px 12px',
                                borderRadius: BorderRadius.sm,
                                border: 'none',
                                background: 'rgba(168, 85, 247, 0.15)',
                                color: '#a855f7',
                                fontSize: 11,
                                cursor: 'pointer',
                                fontWeight: 500,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                              }}
                            >
                              <Package size={12} />
                              Réceptionner
                            </button>
                          )}
                          {order.status === 'DRAFT' && (
                            <button
                              onClick={() => handleDelete(order.id)}
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

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedOrder ? 'Modifier la Commande' : 'Nouvelle Commande'}
        size="xl"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: Spacing.md }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: Spacing.md }}>
            <Input
              label="Fournisseur"
              value={formData.supplierName}
              onChange={(value) => setFormData({ ...formData, supplierName: value })}
              style={{ background: colors.input, borderColor: colors.border, color: colors.text }}
            />
            <Input
              label="Email Fournisseur"
              type="email"
              value={formData.supplierEmail}
              onChange={(value) => setFormData({ ...formData, supplierEmail: value })}
              style={{ background: colors.input, borderColor: colors.border, color: colors.text }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: Spacing.md }}>
            <Input
              label="Date de Commande"
              type="date"
              value={formData.orderDate}
              onChange={(value) => setFormData({ ...formData, orderDate: value })}
              style={{ background: colors.input, borderColor: colors.border, color: colors.text }}
            />
            <Input
              label="Date de Livraison Prévue"
              type="date"
              value={formData.deliveryDate}
              onChange={(value) => setFormData({ ...formData, deliveryDate: value })}
              style={{ background: colors.input, borderColor: colors.border, color: colors.text }}
            />
          </div>

          {/* Items */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.sm }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>Articles</h3>
              <Button type="button" variant="secondary" size="sm" onClick={addItem}>
                <Plus style={{ width: 12, height: 12, marginRight: 4 }} />
                Ajouter
              </Button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.sm }}>
              {formData.items.map((item, index) => (
                <div key={index} style={{ display: 'flex', gap: Spacing.sm, alignItems: 'center', padding: Spacing.sm, border: `1px solid ${colors.border}`, borderRadius: BorderRadius.md }}>
                  <input
                    type="text"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      fontSize: 13,
                      border: `1px solid ${colors.border}`,
                      borderRadius: BorderRadius.sm,
                      background: colors.input,
                      color: colors.text,
                    }}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Qté"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                    style={{
                      width: 70,
                      padding: '8px 12px',
                      fontSize: 13,
                      border: `1px solid ${colors.border}`,
                      borderRadius: BorderRadius.sm,
                      background: colors.input,
                      color: colors.text,
                    }}
                    min="1"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Prix unitaire"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                    style={{
                      width: 120,
                      padding: '8px 12px',
                      fontSize: 13,
                      border: `1px solid ${colors.border}`,
                      borderRadius: BorderRadius.sm,
                      background: colors.input,
                      color: colors.text,
                    }}
                    min="0"
                    required
                  />
                  <span style={{ fontSize: 13, fontWeight: 600, color: colors.text, minWidth: 100, textAlign: 'right' }}>
                    {formatCurrency(item.quantity * item.unitPrice)}
                  </span>
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: BorderRadius.sm,
                        border: 'none',
                        background: 'rgba(224, 80, 80, 0.15)',
                        color: '#e05050',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <XCircle size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div style={{ marginTop: Spacing.sm, textAlign: 'right', fontSize: 15, fontWeight: 700, color: colors.accent, fontFamily: "'DM Serif Display', serif" }}>
              Total: {formatCurrency(formData.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: colors.text, marginBottom: Spacing.xs }}>
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
                background: colors.input,
                color: colors.text,
                fontFamily: 'inherit',
                fontSize: 13,
              }}
              rows={3}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: Spacing.md, paddingTop: Spacing.md, borderTop: `1px solid ${colors.border}` }}>
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
              Annuler
            </Button>
            <Button type="submit">
              {selectedOrder ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Order Modal */}
      {viewOrder && (
        <Modal
          isOpen={!!viewOrder}
          onClose={() => setViewOrder(null)}
          title={`Commande ${viewOrder.orderNumber}`}
          size="lg"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.md }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: Spacing.md }}>
              <div>
                <p style={{ fontSize: 12, color: colors.textMuted, marginBottom: 4 }}>Fournisseur</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>{viewOrder.supplierName}</p>
                {viewOrder.supplierEmail && (
                  <p style={{ fontSize: 12, color: colors.textMuted }}>{viewOrder.supplierEmail}</p>
                )}
              </div>
              <div>
                <p style={{ fontSize: 12, color: colors.textMuted, marginBottom: 4 }}>Statut</p>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: BorderRadius.sm,
                  fontSize: 11,
                  fontWeight: 600,
                  background: getStageStyle(viewOrder.status, colors).bg,
                  color: getStageStyle(viewOrder.status, colors).color,
                }}>
                  {STATUS_LABELS[viewOrder.status]}
                </span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: Spacing.md }}>
              <div>
                <p style={{ fontSize: 12, color: colors.textMuted, marginBottom: 4 }}>Date de commande</p>
                <p style={{ fontSize: 13, color: colors.text }}>
                  {new Date(viewOrder.orderDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div>
                <p style={{ fontSize: 12, color: colors.textMuted, marginBottom: 4 }}>Date de livraison prévue</p>
                <p style={{ fontSize: 13, color: colors.text }}>
                  {viewOrder.deliveryDate
                    ? new Date(viewOrder.deliveryDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
                    : '—'}
                </p>
              </div>
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: Spacing.sm }}>Articles</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.xs }}>
                {viewOrder.items.map((item, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: Spacing.sm, background: colors.bgSecondary, borderRadius: BorderRadius.md }}>
                    <span style={{ fontSize: 13, color: colors.text }}>{item.description} × {item.quantity}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{formatCurrency(item.quantity * item.unitPrice)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: 18, fontWeight: 700, color: colors.accent, fontFamily: "'DM Serif Display', serif", paddingTop: Spacing.sm, borderTop: `1px solid ${colors.border}` }}>
              Total: {formatCurrency(viewOrder.totalAmount)}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Purchases;
