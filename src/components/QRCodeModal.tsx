import React from 'react';
import { X } from 'lucide-react';
import { BOOTH } from '../config/booth';
import { CopyButton } from './ui';

export const QRCodeModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const url = BOOTH.publicUrl || window.location.origin;
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=480x480&margin=12&data=${encodeURIComponent(url)}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="접속 QR 코드"
    >
      <div className="rise w-full max-w-sm rounded-3xl bg-surface p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-[18px] font-extrabold">스마트폰으로 접속</h3>
            <p className="mt-1 text-[13px] text-muted">카메라로 QR을 비추면 열려요.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-1.5 text-muted active:bg-paper" aria-label="닫기">
            <X className="h-5 w-5" />
          </button>
        </div>
        <img src={qr} alt="AI 쇼츠 스튜디오 접속 QR 코드" className="mx-auto mt-5 aspect-square w-60 rounded-xl" />
        <p className="mt-4 break-all text-center text-[12px] text-muted">{url}</p>
        <CopyButton text={url} label="주소 복사" className="mt-3 w-full" />
      </div>
    </div>
  );
};
