import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface NovoEleitorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NovoEleitorModal({ isOpen, onClose }: NovoEleitorModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Novo Eleitor</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p>Formulário de novo eleitor será implementado aqui</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
