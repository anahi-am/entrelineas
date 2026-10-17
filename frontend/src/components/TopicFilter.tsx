import { TOPICS, TOPIC_META } from '../domain/labels';
import type { Topic } from '../domain/types';

export function TopicFilter({
  active,
  onChange,
}: {
  active: Topic | null;
  onChange: (topic: Topic | null) => void;
}) {
  return (
    <div role="group" aria-labelledby="topic-filter-label" className="filter">
      <p id="topic-filter-label" className="filter-label">
        Filtrar por tema
      </p>
      <div className="filter-buttons">
        <button
          type="button"
          className="chip"
          aria-pressed={active === null}
          onClick={() => onChange(null)}
        >
          Todos
        </button>
        {TOPICS.map((topic) => (
          <button
            key={topic}
            type="button"
            className="chip"
            aria-pressed={active === topic}
            onClick={() => onChange(topic)}
          >
            {TOPIC_META[topic].label}
          </button>
        ))}
      </div>
    </div>
  );
}
