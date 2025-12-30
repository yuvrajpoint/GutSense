"use client";

import Card from "./Card";
type Props = {
  value: number | null;
  onChange: (val: number) => void;
};

const stoolTypes = [
  {
    id: 1,
    disc: "Hard, separate pellet-like lumps that are difficult to pass",
  },
  { id: 2, disc: "Lumpy, sausage-shaped stool" },
  { id: 3, disc: "Sausage-shaped stool with cracks on the surface" },
  { id: 4, disc: "Sausage-shaped stool but smooth and soft(like a snake)" },
  { id: 5, disc: "Blobs that are soft and pass easily" },
  { id: 6, disc: "Mushy stool in the form of fluffy pieces with ragged edges" },
  { id: 7, disc: "Entirely liquid; no solid pieces" },
];

export default function StoolSelector({ value, onChange }: Props) {
  return (
    <div>
      <p className="font-medium mb-2 text-gray-800">Select stool type</p>

      <div className="flex flex-wrap justify-center gap-3">
        {stoolTypes.map((s) => (
          <button
            key={s.id}
            onClick={() => onChange(s.id)}
            style={{ borderRadius: "12px" }}
            className={`rounded p-2 transition-all duration-200 border-2
    ${
      value === s.id
        ? "ring-3 ring-green-200/10 ring-inset shadow-[0_0_12px_3px_rgba(74,222,128,0.4)]"
        : "border-transparent bg-white"
    }`}
          >
            <div className="relative w-[200px] aspect-[2/3] rounded-lg overflow-hidden">
              <Card name={s.id} disc={s.disc} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
