/* Зелена крапка з пульсом — той самий знак, що й на статус-сторінках:
   система в церкві не «була впроваджена колись», а працює просто зараз.

   Колір зашитий, а не береться з акценту церкви: зелений тут означає
   стан, а не бренд, тож він має бути однаковим скрізь. Пульс гасне при
   prefers-reduced-motion — лишається сама крапка. */

const LIVE = "#22c55e";

export default function LiveDot({ size = 8 }: { size?: number }) {
  return (
    <span aria-hidden className="relative inline-flex shrink-0" style={{ width: size, height: size }}>
      <span
        className="absolute inset-0 rounded-full opacity-75 motion-safe:animate-ping"
        style={{ background: LIVE }}
      />
      <span className="relative inline-flex w-full h-full rounded-full" style={{ background: LIVE }} />
    </span>
  );
}
