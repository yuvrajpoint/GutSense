"use client";

type Props = {
  selected: string[];
  onChange: (val: string[]) => void;
};

const symptomsList = ["bloating", "abdominal_pain", "cramps", "nausea"];

export default function Symptoms({ selected, onChange }: Props) {
  const toggle = (symptom: string) => {
    if (selected.includes(symptom)) {
      onChange(selected.filter((s) => s !== symptom));
    } else {
      onChange([...selected, symptom]);
    }
  };

  return (
    <div>
      <p className="font-medium mb-2 text-gray-900">Symptoms (if any)</p>
      <div className="grid grid-cols-2 gap-2">
        {symptomsList.map((s) => (
          <label key={s} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selected.includes(s)}
              onChange={() => toggle(s)}
            />
            <span className="text-gray-800 capitalize">
              {s.replace("_", " ")}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
