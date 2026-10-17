export function SearchBar({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <label className="search-bar">
      <span>Buscar promesas, partidos y fuentes</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Ej. alquiler, vivienda, BOE…"
        aria-label="Buscar promesas, partidos y fuentes"
      />
    </label>
  );
}
