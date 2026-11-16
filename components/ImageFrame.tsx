'use client';
import { useState } from 'react';
import { ImagePlus } from 'lucide-react';

/** Зураг. src-г slidesData.ts дотор солино. Файл чирч тавьж түр харж болно. */
export default function ImageFrame({ src, ratio = '16:9', className = '' }: { src?: string; ratio?: string; className?: string }) {
  const [img, setImg] = useState(src);
  const [err, setErr] = useState(false);
  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const f = e.dataTransfer.files?.[0];
        if (f?.type.startsWith('image/')) { setImg(URL.createObjectURL(f)); setErr(false); }
      }}
      style={{ aspectRatio: ratio.replace(':', '/') }}
      className={`group relative w-full overflow-hidden rounded-[2rem] bg-black/20 shadow-2xl ${className}`}
    >
      {img && !err ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={img} alt="" onError={() => setErr(true)} draggable={false}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-[#D4AF37]/20 text-[#D4AF37]"><ImagePlus size={40} /></div>
      )}
    </div>
  );
}
