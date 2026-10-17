# Housing MVP pipeline

The first vertical slice is Spain-wide and national-level (`ambito=Estatal`),
with housing as the only active topic.

1. Collect a public promise source from Congress, La Moncloa, or an official progress report.
2. Extract a candidate promise with the exact quotation, party/candidate, date, topic, territory, and URL.
3. Human-review the quotation and source before it enters the promise table.
4. Discover candidates from the official BOE daily-summary endpoint and search the consolidated-legislation endpoint for legal text.
5. Normalize metadata and retain the original BOE URL and retrieval date.
6. Retrieve and store the official BOE text for each candidate.
7. Generate evidence candidates; never mark a promise as fulfilled automatically.
8. Human-review the candidate relationship and assign the provisional status.
9. Store the promise status, plain-language explanation, unresolved notes, and review timestamp.
10. Human approves the complete public record, including source, relationship, status, evidence tier, and limitations.
11. Set `publication_status = approved` only after that review.
12. Publish only records with `publication_status = approved` to the frontend.

The Transparency Portal is an official discovery and evidence source for plans,
budgets, budget execution, contracts, subsidies, statistics, and accountability
documents. It is not a promise source by itself, and each document still needs
human verification before it can support a public record.

The BOE daily-summary endpoint is a discovery path for documents published on a
given date. The consolidated-legislation endpoint is the legal-text and metadata
path. They are complementary and must not be treated as interchangeable.

BOE metadata identifies the issuing department and legal instrument. It does
not identify which political party made a promise, so party attribution comes
from the promise source and must not be inferred from the BOE record.

## Evidence tiers

- Tier 1: an official source explicitly reports the outcome related to the promise.
- Tier 2: an official law, decree, budget, contract, or programme is related to the promise, but does not prove the final outcome.
- Tier 3: an official statistic, such as INE, provides context but does not attribute the outcome to the promise.
- Tier 4: press, NGO, or independent research can guide discovery but is not sufficient alone for a published result.
