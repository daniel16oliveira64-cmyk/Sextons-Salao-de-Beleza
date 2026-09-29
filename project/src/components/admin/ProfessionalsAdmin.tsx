import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Power, Clock } from 'lucide-react';
import { useSalon } from '@/store';
import { DAY_LABELS, type Professional } from '@/types';
import { Modal } from '../Modal';

const DEFAULT_PHOTO = 'https://images.pexels.com/photos/3993458/pexels-photo-3993458.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

export function ProfessionalsAdmin() {
  const { professionals, services, addProfessional, updateProfessional, deleteProfessional } = useSalon();
  const [editing, setEditing] = useState<Professional | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const openAdd = () => {
    setEditing({
      id: '',
      name: '',
      specialty: '',
      bio: '',
      photo: DEFAULT_PHOTO,
      active: true,
      serviceIds: [],
      workingDays: [1, 2, 3, 4, 5],
      workingStart: '08:00',
      workingEnd: '18:00',
    });
    setIsAdding(true);
  };

  const openEdit = (prof: Professional) => {
    setEditing({ ...prof });
    setIsAdding(false);
  };

  const handleSave = () => {
    if (!editing || !editing.name.trim()) return;
    if (isAdding) {
      const { id, ...rest } = editing;
      void id;
      addProfessional(rest);
    } else {
      updateProfessional(editing.id, editing);
    }
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente remover este profissional?')) {
      deleteProfessional(id);
    }
  };

  const toggleService = (svcId: string) => {
    if (!editing) return;
    const has = editing.serviceIds.includes(svcId);
    setEditing({
      ...editing,
      serviceIds: has ? editing.serviceIds.filter((s) => s !== svcId) : [...editing.serviceIds, svcId],
    });
  };

  const toggleDay = (day: number) => {
    if (!editing) return;
    const has = editing.workingDays.includes(day);
    setEditing({
      ...editing,
      workingDays: has ? editing.workingDays.filter((d) => d !== day) : [...editing.workingDays, day],
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-ink-900">Profissionais</h1>
          <p className="text-ink-500 text-sm mt-1">{professionals.length} profissionais cadastrados</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 bg-gradient-gold text-ink-900 px-4 py-2.5 rounded-xl text-sm font-semibold hover:shadow-gold transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> Adicionar
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {professionals.map((prof) => {
          const profServices = services.filter((s) => prof.serviceIds.includes(s.id));
          return (
            <div key={prof.id} className="bg-white rounded-2xl border border-ink-100 overflow-hidden hover:shadow-card transition-shadow">
              <div className="relative h-40 overflow-hidden">
                <img src={prof.photo} alt={prof.name} className="w-full h-full object-cover" />
                {!prof.active && (
                  <div className="absolute inset-0 bg-ink-950/60 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">Inativo</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-serif text-lg text-ink-900">{prof.name}</h3>
                <p className="text-sm text-gold-600 mb-2">{prof.specialty}</p>
                <div className="flex items-center gap-1.5 text-xs text-ink-500 mb-3">
                  <Clock className="w-3.5 h-3.5" />
                  {prof.workingStart} — {prof.workingEnd}
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {profServices.slice(0, 3).map((s) => (
                    <span key={s.id} className="text-xs bg-nude-50 text-nude-700 px-2 py-0.5 rounded-full">{s.name}</span>
                  ))}
                  {profServices.length > 3 && <span className="text-xs text-ink-400">+{profServices.length - 3}</span>}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(prof)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-ink-100 text-ink-700 py-2 rounded-lg text-xs font-medium hover:bg-ink-200 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Editar
                  </button>
                  <button
                    onClick={() => updateProfessional(prof.id, { active: !prof.active })}
                    className={`p-2 rounded-lg transition-colors ${prof.active ? 'text-green-600 hover:bg-green-50' : 'text-ink-400 hover:bg-ink-100'}`}
                    aria-label="Ativar/desativar"
                  >
                    <Power className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(prof.id)}
                    className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    aria-label="Remover"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={isAdding ? 'Adicionar Profissional' : 'Editar Profissional'} size="lg">
        {editing && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-2">Nome</label>
                <input
                  type="text"
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-ink-100 focus:border-gold-400 focus:outline-none transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-2">Especialidade</label>
                <input
                  type="text"
                  value={editing.specialty}
                  onChange={(e) => setEditing({ ...editing, specialty: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-ink-100 focus:border-gold-400 focus:outline-none transition-colors text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-700 mb-2">Bio</label>
              <textarea
                value={editing.bio}
                onChange={(e) => setEditing({ ...editing, bio: e.target.value })}
                rows={2}
                className="w-full px-3 py-2.5 rounded-xl border-2 border-ink-100 focus:border-gold-400 focus:outline-none transition-colors text-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-700 mb-2">URL da Foto</label>
              <input
                type="text"
                value={editing.photo}
                onChange={(e) => setEditing({ ...editing, photo: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border-2 border-ink-100 focus:border-gold-400 focus:outline-none transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-700 mb-2">Serviços que realiza</label>
              <div className="flex flex-wrap gap-2">
                {services.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => toggleService(s.id)}
                    className={`text-xs px-3 py-1.5 rounded-full border-2 transition-all ${editing.serviceIds.includes(s.id) ? 'border-gold-400 bg-gold-50 text-gold-700' : 'border-ink-200 text-ink-400 hover:border-ink-300'}`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-700 mb-2">Dias de atendimento</label>
              <div className="flex flex-wrap gap-2">
                {DAY_LABELS.map((day, idx) => (
                  <button
                    key={idx}
                    onClick={() => toggleDay(idx)}
                    className={`text-xs px-3 py-1.5 rounded-full border-2 transition-all ${editing.workingDays.includes(idx) ? 'border-gold-400 bg-gold-50 text-gold-700' : 'border-ink-200 text-ink-400 hover:border-ink-300'}`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-2">Início</label>
                <input
                  type="time"
                  value={editing.workingStart}
                  onChange={(e) => setEditing({ ...editing, workingStart: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-ink-100 focus:border-gold-400 focus:outline-none transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-2">Fim</label>
                <input
                  type="time"
                  value={editing.workingEnd}
                  onChange={(e) => setEditing({ ...editing, workingEnd: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-ink-100 focus:border-gold-400 focus:outline-none transition-colors text-sm"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editing.active}
                onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
                className="w-4 h-4 rounded accent-gold-500"
              />
              <span className="text-sm text-ink-700">Profissional ativo</span>
            </label>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setEditing(null)}
                className="flex-1 py-3 rounded-xl border-2 border-ink-200 text-ink-600 text-sm font-medium hover:bg-ink-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-3 rounded-xl bg-gradient-gold text-ink-900 text-sm font-semibold hover:shadow-gold transition-all active:scale-95"
              >
                Salvar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

void X;
