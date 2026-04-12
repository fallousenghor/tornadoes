import { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Filter, Eye, Edit2, Trash2, X, Building, Mail, Phone, MapPin, User } from 'lucide-react';
import contactService from '../../services/contactService';
import { Contact, ContactType } from '../../types';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import Modal from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingSpinner } from '../../components/common/Loading';
import { useToast } from '../../store/toastStore';
import { useTheme } from '../../contexts/ThemeContext';
import { Colors, BorderRadius, Spacing } from '../../constants/theme';

const CONTACT_TYPES: { value: ContactType | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'Tous' },
  { value: 'CLIENT', label: 'Client' },
  { value: 'FOURNISSEUR', label: 'Fournisseur' },
  { value: 'PARTENAIRE', label: 'Partenaire' },
  { value: 'PROSPECT', label: 'Prospect' },
];

// Get contact type colors from theme
const getTypeColorStyle = (type: ContactType, colors: any) => {
  switch (type) {
    case 'CLIENT':
      return {
        bg: colors.successMuted,
        color: colors.success,
        borderColor: colors.success,
      };
    case 'FOURNISSEUR':
      return {
        bg: colors.primaryMuted,
        color: colors.primary,
        borderColor: colors.primary,
      };
    case 'PARTENAIRE':
      return {
        bg: colors.purpleMuted,
        color: colors.purple,
        borderColor: colors.purple,
      };
    case 'PROSPECT':
      return {
        bg: colors.warningMuted,
        color: colors.warning,
        borderColor: colors.warning,
      };
    default:
      return {
        bg: colors.bgSecondary,
        color: colors.textSecondary,
        borderColor: colors.border,
      };
  }
};

export function Contacts() {
  const { colors } = useTheme();
  const [allContacts, setAllContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ContactType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const toast = useToast();

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Senegal',
    type: 'CLIENT' as ContactType,
    notes: '',
  });

  useEffect(() => {
    loadContacts();
  }, []); // Load once on mount

  // Client-side filtering
  const filteredContacts = useMemo(() => {
    let result = allContacts;

    // Filter by type
    if (filter !== 'ALL') {
      result = result.filter(contact => contact.type === filter);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(contact => {
        const fullName = `${contact.firstName || ''} ${contact.lastName || ''} ${contact.contactName || ''}`.toLowerCase();
        return (
          fullName.includes(query) ||
          contact.companyName?.toLowerCase().includes(query) ||
          contact.email?.toLowerCase().includes(query) ||
          contact.phone?.toLowerCase().includes(query)
        );
      });
    }

    return result;
  }, [allContacts, filter, searchQuery]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      // Load ALL contacts without filters
      const response: any = await contactService.getAll();
      console.log('Contacts API raw response:', response);
      const contacts = Array.isArray(response) ? response : response?.data || [];
      console.log('Mapped contacts:', contacts);
      setAllContacts(contacts);
    } catch (error) {
      console.error('Error loading contacts:', error);
      toast.error('Erreur de chargement', 'Impossible de charger les contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    // Filters are now client-side, no need to reload
  };

  const handleOpenCreate = () => {
    setSelectedContact(null);
    setFormData({
      firstName: '',
      lastName: '',
      companyName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: 'Senegal',
      type: 'CLIENT',
      notes: '',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (contact: Contact) => {
    setSelectedContact(contact);
    console.log('Contact object to edit:', contact);
    
    // Use firstName/lastName if available, otherwise split contactName
    let firstName = contact.firstName || '';
    let lastName = contact.lastName || '';
    
    // If no firstName/lastName but contactName exists, split it
    if (!firstName && !lastName && contact.contactName) {
      const nameParts = contact.contactName.split(' ');
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || nameParts[0] || '';
    }
    
    console.log('Setting form data:', { firstName, lastName, companyName: contact.companyName, email: contact.email });
    setFormData({
      firstName,
      lastName,
      companyName: contact.companyName || '',
      email: contact.email || '',
      phone: contact.phone || '',
      address: contact.address || '',
      city: contact.city || '',
      country: contact.country || 'Senegal',
      type: contact.type,
      notes: contact.notes || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting contact form data:', formData);
    try {
      if (selectedContact) {
        console.log('Updating contact:', selectedContact.id, 'with data:', formData);
        await contactService.update(selectedContact.id, formData);
        toast.success('Contact mis à jour', 'Les modifications ont été enregistrées');
      } else {
        console.log('Creating new contact with data:', formData);
        await contactService.create(formData);
        toast.success('Contact créé', 'Le nouveau contact a été ajouté');
      }
      setShowModal(false);
      loadContacts(); // Reload all contacts from API
    } catch (error: any) {
      console.error('Error saving contact:', error);
      console.error('Error response:', error.response?.data);
      
      // Extract detailed validation errors
      let errorMsg = 'Une erreur est survenue lors de l\'enregistrement';
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
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce contact?')) return;
    try {
      await contactService.delete(id);
      toast.success('Contact supprimé');
      loadContacts();
    } catch (error) {
      toast.error('Erreur de suppression');
    }
  };

  const handleView = (contact: Contact) => {
    // Could open a detail modal - for now just log
    console.log('Viewing contact:', contact);
  };

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: Spacing.lg, color: colors.textMuted }}><LoadingSpinner size="lg" /></div>;

  return (
    <div style={{ padding: Spacing.lg, display: 'flex', flexDirection: 'column', gap: Spacing.lg }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: colors.text, margin: 0 }}>Gestion des Contacts</h1>
        <Button onClick={handleOpenCreate}>
          <Plus style={{ width: 16, height: 16, marginRight: 8 }} />
          Nouveau Contact
        </Button>
      </div>

      {/* Filters Card */}
      <Card style={{ padding: Spacing.md, background: colors.card, border: `1px solid ${colors.border}`, borderRadius: BorderRadius.lg }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: Spacing.md, alignItems: 'center' }}>
          {/* Search Input */}
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search style={{ position: 'absolute', left: Spacing.sm, width: 16, height: 16, color: colors.textMuted }} />
              <Input
                placeholder="Rechercher un contact..."
                value={searchQuery}
                onChange={(value) => setSearchQuery(value)}
                style={{ paddingLeft: 36, background: colors.input, color: colors.text, borderColor: colors.border }}
              />
            </div>
          </div>

          {/* Type Filters */}
          <div style={{ display: 'flex', gap: Spacing.sm, flexWrap: 'wrap' }}>
            {CONTACT_TYPES.map(({ value, label }) => (
              <Button
                key={value}
                variant={filter === value ? 'primary' : 'secondary'}
                onClick={() => setFilter(value)}
                size="sm"
                style={{
                  background: filter === value ? colors.primary : colors.bgSecondary,
                  color: filter === value ? colors.textInverse : colors.text,
                  border: `1px solid ${filter === value ? colors.primary : colors.border}`,
                  borderRadius: BorderRadius.md,
                  padding: `${Spacing.xs} ${Spacing.sm}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Contacts Grid */}
      {filteredContacts.length === 0 ? (
        <EmptyState
          title="Aucun contact trouvé"
          description="Commencez par créer un nouveau contact"
          icon={<User style={{ width: 48, height: 48, color: colors.textMuted }} />}
          actionLabel="Créer un contact"
          onAction={handleOpenCreate}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: Spacing.md }}>
          {filteredContacts.map((contact) => {
            const typeStyle = getTypeColorStyle(contact.type, colors);
            return (
              <Card 
                key={contact.id} 
                style={{
                  padding: Spacing.md,
                  background: colors.card,
                  border: `1px solid ${colors.border}`,
                  borderRadius: BorderRadius.lg,
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.sm }}>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.sm, marginBottom: 4 }}>
                        {/* Avatar */}
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            background: typeStyle.bg,
                            border: `2px solid ${typeStyle.color}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 12,
                            fontWeight: 600,
                            color: typeStyle.color,
                            flexShrink: 0,
                          }}
                        >
                          {contact.firstName?.[0]?.toUpperCase() || contact.contactName?.[0]?.toUpperCase() || '?'}
                          {(contact.lastName?.[0] || contact.contactName?.[1] || '').toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>
                            {contact.firstName} {contact.lastName}
                          </div>
                          {contact.companyName && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: colors.textMuted, marginTop: 2 }}>
                              <Building size={12} />
                              {contact.companyName}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Badge */}
                    <div
                      style={{
                        padding: '4px 12px',
                        background: typeStyle.bg,
                        color: typeStyle.color,
                        borderRadius: BorderRadius.md,
                        fontSize: 11,
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        marginLeft: Spacing.sm,
                      }}
                    >
                      {contact.type}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.xs }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: colors.textSecondary }}>
                      <Mail size={14} style={{ color: colors.textMuted, flexShrink: 0 }} />
                      <span>{contact.email}</span>
                    </div>
                    {contact.phone && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: colors.textSecondary }}>
                        <Phone size={14} style={{ color: colors.textMuted, flexShrink: 0 }} />
                        <span>{contact.phone}</span>
                      </div>
                    )}
                    {(contact.city || contact.country) && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: colors.textSecondary }}>
                        <MapPin size={14} style={{ color: colors.textMuted, flexShrink: 0 }} />
                        <span>{contact.city}{contact.city && contact.country ? ', ' : ''}{contact.country}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: Spacing.xs, paddingTop: Spacing.sm, borderTop: `1px solid ${colors.border}` }}>
                    <Button variant="secondary" size="sm" onClick={() => handleView(contact)} style={{ flex: 1 }}>
                      <Eye size={13} style={{ marginRight: 4 }} />
                      Voir
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => handleOpenEdit(contact)} style={{ flex: 1 }}>
                      <Edit2 size={13} style={{ marginRight: 4 }} />
                      Modifier
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(contact.id)}>
                      <Trash2 size={13} />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedContact ? 'Modifier le Contact' : 'Nouveau Contact'}
        size="lg"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: Spacing.md }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: Spacing.md }}>
            <Input
              label="Prénom"
              value={formData.firstName}
              onChange={(value) => setFormData({ ...formData, firstName: value })}
              placeholder="Jean"
              style={{ background: colors.input, borderColor: colors.border, color: colors.text }}
            />
            <Input
              label="Nom"
              value={formData.lastName}
              onChange={(value) => setFormData({ ...formData, lastName: value })}
              placeholder="Dupont"
              style={{ background: colors.input, borderColor: colors.border, color: colors.text }}
            />
          </div>
          <Input
            label="Entreprise"
            value={formData.companyName}
            onChange={(value) => setFormData({ ...formData, companyName: value })}
            style={{ background: colors.input, borderColor: colors.border, color: colors.text }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: Spacing.md }}>
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(value) => setFormData({ ...formData, email: value })}
              style={{ background: colors.input, borderColor: colors.border, color: colors.text }}
            />
            <Input
              label="Téléphone"
              value={formData.phone}
              onChange={(value) => setFormData({ ...formData, phone: value })}
              type="tel"
              style={{ background: colors.input, borderColor: colors.border, color: colors.text }}
            />
          </div>
          <Input
            label="Adresse"
            value={formData.address}
            onChange={(value) => setFormData({ ...formData, address: value })}
            style={{ background: colors.input, borderColor: colors.border, color: colors.text }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: Spacing.md }}>
            <Input
              label="Ville"
              value={formData.city}
              onChange={(value) => setFormData({ ...formData, city: value })}
              style={{ background: colors.input, borderColor: colors.border, color: colors.text }}
            />
            <Input
              label="Pays"
              value={formData.country}
              onChange={(value) => setFormData({ ...formData, country: value })}
              style={{ background: colors.input, borderColor: colors.border, color: colors.text }}
            />
          </div>
          <Select
            label="Type de Contact"
            value={formData.type}
            onChange={(value) => setFormData({ ...formData, type: value as ContactType })}
            options={CONTACT_TYPES.filter(t => t.value !== 'ALL').map(({ value, label }) => ({
              value,
              label,
            }))}
            style={{ background: colors.input, borderColor: colors.border, color: colors.text }}
          />
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
              {selectedContact ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Contacts;
