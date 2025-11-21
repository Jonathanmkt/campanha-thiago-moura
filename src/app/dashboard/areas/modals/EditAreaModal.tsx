import React from 'react';
import type { Area } from '../hooks/useAreas';

interface EditAreaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  area: Area | null;
  onUpdateArea: (areaId: string, areaData: any) => void;
}

export function EditAreaModal({ open, onOpenChange, area, onUpdateArea }: EditAreaModalProps) {
  if (!open || !area) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold mb-4">Editar Área</h2>
        <p className="text-gray-600 mb-2">Área: {area.nome}</p>
        <p className="text-gray-600 mb-4">Modal de edição de área será implementado em breve.</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onUpdateArea(area.id, { nome: area.nome + ' (editada)' });
              onOpenChange(false);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
