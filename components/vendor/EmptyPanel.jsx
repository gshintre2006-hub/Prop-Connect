import { C } from "@/lib/tokens";

export function EmptyPanel({ icon: Icon, title, body }) {
  return (
    <div>
      <h1 className="text-xl mb-6" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>{title}</h1>
      <div className="rounded-2xl py-16 px-8 text-center" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
        <Icon size={30} color={C.secondary} className="mx-auto mb-4" />
        <h3 className="text-base mb-1.5" style={{ color: C.ink, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>{title} is ready to build</h3>
        <p className="text-sm max-w-[340px] mx-auto" style={{ color: "#8AA2A6" }}>{body}</p>
      </div>
    </div>
  );
}
