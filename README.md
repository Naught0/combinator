# Combinator

A small site built using FastAPI and React that returns all the combos in your Magic: The Gathering Commander/EDH deck.

Combo data is retrieved from the wonderful [Commander Spellbook](https://commanderspellbook.com/)

You can find the site at [mtgcombinator.com](https://mtgcombinator.com/)

## TODO:

**Frontend**:   
- [ ] Create refresh cache invalidation button to let users opt out of caching
- [ ] Combo hiding? (to show only relevant ones for a second? solved by filter?)
- [ ] Add a 'next combo' button to jump from combo to combo
- [ ] Make 'add 1' and maybe 'combos' URL routes
- [ ] Add per-combo "toggle images" for quick referencing while scrolling in non-image mode
- [ ] Finish 'add 1' tab
   - Needs to be a route
   - Add expand-all etc options to each combo/entire section
- [ ] Show 'no combos found' when searching "add 1" tab
- [ ] Fix 'search cards' tab
- [ ] Make drag drop / sortable
   - Combine ids of cards as unique combo ID to remember sorts?
- [ ] Improve metadata & seo stuff (keywords, etc)
- [ ] Sync user search params to url
- [ ] Explore loading skeletons? (nice2have)
- [ ] Create list-only view of moxfield user decks
