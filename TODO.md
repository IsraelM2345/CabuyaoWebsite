# TODO

- [ ] Create pagination action handler that uses a single best-practice function (avoids inline calls) and always fetches with the latest filters.
- [ ] Make pagination button labels + disabled state fully dynamic using paginator metadata returned from backend (current_page, last_page, total).
- [ ] Fix React rendering/JS error in ContactInbox.jsx caused by malformed JSX structure near the pagination section.
- [ ] Ensure local search/status filtering isn’t double-applied against server pagination (either remove client-side filtering or align total logic).
- [ ] Test by loading ContactInbox and clicking pagination buttons with different status/search combinations.
