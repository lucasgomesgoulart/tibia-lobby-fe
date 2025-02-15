interface VocationSelectionProps {
  selectedVocation: string;
  setSelectedVocation: (vocation: string) => void;
}

const vocations = [
  { name: "SORCERER", image: "/images/outfits/Mage_Male.gif" },
  { name: "DRUID", image: "/images/outfits/Druid_Male.gif" },
  { name: "PALADIN", image: "/images/outfits/Hunter_Male.gif" },
  { name: "KNIGHT", image: "/images/outfits/Knight_Male.gif" },
];

export default function VocationSelection({ selectedVocation, setSelectedVocation }: VocationSelectionProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {vocations.map((vocation) => (
        <label key={vocation.name} className="cursor-pointer border p-4 rounded-lg text-center flex flex-col items-center">
          <img src={vocation.image} alt={vocation.name} className="w-16 h-16 mb-2" />
          <input type="radio" name="vocation" value={vocation.name} checked={selectedVocation === vocation.name} onChange={() => setSelectedVocation(vocation.name)} className="hidden" />
          <span>{vocation.name}</span>
        </label>
      ))}
    </div>
  );
}
