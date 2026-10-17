# Housing MVP pipeline

The first vertical slice is Spain-wide and national-level (`ambito=Estatal`),
with housing as the only active topic.

1. Collect a public promise source from Congress, La Moncloa, or an official progress report.
2. Extract a candidate promise with the exact quotation, party/candidate, date, topic, territory, and URL.
3. Human-review the quotation and source before it enters the promise table.
4. Search the official BOE consolidated-legislation API for housing-related actions.
5. Normalize metadata and retain the original BOE URL and retrieval date.
6. Retrieve and store the official BOE text for each candidate.
7. Generate evidence candidates; never mark a promise as fulfilled automatically.
8. Human-review the candidate relationship and assign the provisional status.
9. Store the promise status, plain-language explanation, unresolved notes, and review timestamp.
10. Publish only approved records to the frontend.

BOE metadata identifies the issuing department and legal instrument. It does
not identify which political party made a promise, so party attribution comes
from the promise source and must not be inferred from the BOE record.
