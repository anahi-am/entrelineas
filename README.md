# Entrelineas

Entrelineas is an AImpacto Hackathon prototype for checking public housing
commitments against official Spanish government evidence.

## Current scope

- Spain-wide, national-level records only
- Housing/vivienda only for the MVP
- Official promise sources: investiture speeches and government progress reports
- Official evidence source: BOE consolidated-legislation API
- Context source: INE public statistics API; indicators provide context and do not prove promise fulfilment
- Human review is required before any evidence relationship is published
- Education/educación and sanidad are future expansions, not current classifier topics

## Architecture

`public promise source → reviewed housing promise → BOE retrieval → evidence candidate → human review → approved public record`

See [docs/pipeline.md](docs/pipeline.md) and [docs/setup.md](docs/setup.md).
