# Graph Report - backend  (2026-05-10)

## Corpus Check
- 30 files · ~5,481 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 89 nodes · 62 edges · 2 communities detected
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 10|Community 10]]

## God Nodes (most connected - your core abstractions)
1. `generateToken()` - 3 edges
2. `start()` - 2 edges
3. `initDB()` - 2 edges
4. `register()` - 2 edges
5. `login()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `start()` --calls--> `initDB()`  [INFERRED]
  src\app.js → src\config\db.js

## Communities

### Community 2 - "Community 2"
Cohesion: 0.38
Nodes (3): generateToken(), login(), register()

### Community 10 - "Community 10"
Cohesion: 0.5
Nodes (2): start(), initDB()

## Knowledge Gaps
- **Thin community `Community 10`** (4 nodes): `app.js`, `start()`, `db.js`, `initDB()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Not enough signal to generate questions. This usually means the corpus has no AMBIGUOUS edges, no bridge nodes, no INFERRED relationships, and all communities are tightly cohesive. Add more files or run with --mode deep to extract richer edges._