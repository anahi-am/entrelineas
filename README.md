# Entrelineas

Entrelineas is an AImpacto Hackathon prototype for checking public housing
commitments against official Spanish government evidence.

## Current scope

- Spain-wide, national-level records only
- Housing/vivienda only for the MVP
- Official promise sources: investiture speeches and government progress reports
- Official evidence sources: BOE daily summaries for discovery and BOE consolidated legislation for legal text and metadata
- Context source: INE public statistics API; indicators provide context and do not prove promise fulfilment
- Human review is required before any evidence relationship is published
- Education/educación and sanidad are future expansions, not current classifier topics

## Architecture

`public promise source → reviewed housing promise → BOE retrieval → evidence candidate → human review → approved public record`

See [docs/pipeline.md](docs/pipeline.md) and [docs/setup.md](docs/setup.md).
