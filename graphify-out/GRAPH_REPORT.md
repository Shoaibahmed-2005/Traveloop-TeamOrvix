# Graph Report - traveloop_TeamOrvix  (2026-05-10)

## Corpus Check
- 71 files · ~44,289 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 173 nodes · 138 edges · 6 communities detected
- Extraction: 78% EXTRACTED · 22% INFERRED · 0% AMBIGUOUS · INFERRED: 31 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 14|Community 14]]

## God Nodes (most connected - your core abstractions)
1. `useAuth()` - 9 edges
2. `formatCurrency()` - 9 edges
3. `formatDateRange()` - 7 edges
4. `ErrorBoundary` - 5 edges
5. `useDebounce()` - 5 edges
6. `TripDetail()` - 5 edges
7. `ItineraryBuilder()` - 4 edges
8. `TripCard()` - 4 edges
9. `daysBetween()` - 4 edges
10. `generateToken()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `Navbar()` --calls--> `useAuth()`  [INFERRED]
  frontend\src\components\common\Navbar.jsx → frontend\src\context\AuthContext.jsx
- `ProtectedRoute()` --calls--> `useAuth()`  [INFERRED]
  frontend\src\components\common\ProtectedRoute.jsx → frontend\src\context\AuthContext.jsx
- `AdminDashboard()` --calls--> `useAuth()`  [INFERRED]
  frontend\src\pages\Admin\AdminDashboard.jsx → frontend\src\context\AuthContext.jsx
- `Login()` --calls--> `useAuth()`  [INFERRED]
  frontend\src\pages\Auth\Login.jsx → frontend\src\context\AuthContext.jsx
- `Community()` --calls--> `useAuth()`  [INFERRED]
  frontend\src\pages\Community\Community.jsx → frontend\src\context\AuthContext.jsx

## Communities

### Community 0 - "Community 0"
Cohesion: 0.11
Nodes (13): BudgetView(), CreateTrip(), formatCurrency(), daysBetween(), daysRemaining(), formatDate(), formatDateRange(), ItineraryBuilder() (+5 more)

### Community 1 - "Community 1"
Cohesion: 0.12
Nodes (8): AdminDashboard(), useAuth(), Dashboard(), Login(), Navbar(), ProtectedRoute(), getPasswordStrength(), Register()

### Community 3 - "Community 3"
Cohesion: 0.25
Nodes (5): ActivitySearch(), CitySearch(), getCostLabel(), Community(), useDebounce()

### Community 5 - "Community 5"
Cohesion: 0.38
Nodes (3): generateToken(), login(), register()

### Community 8 - "Community 8"
Cohesion: 0.33
Nodes (1): ErrorBoundary

### Community 14 - "Community 14"
Cohesion: 0.5
Nodes (2): start(), initDB()

## Knowledge Gaps
- **Thin community `Community 8`** (6 nodes): `ErrorBoundary`, `.componentDidCatch()`, `.constructor()`, `.getDerivedStateFromError()`, `.render()`, `ErrorBoundary.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (4 nodes): `start()`, `app.js`, `db.js`, `initDB()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useAuth()` connect `Community 1` to `Community 0`, `Community 3`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Why does `formatCurrency()` connect `Community 0` to `Community 1`, `Community 3`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Why does `Dashboard()` connect `Community 1` to `Community 0`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Are the 8 inferred relationships involving `useAuth()` (e.g. with `Navbar()` and `ProtectedRoute()`) actually correct?**
  _`useAuth()` has 8 INFERRED edges - model-reasoned connections that need verification._
- **Are the 8 inferred relationships involving `formatCurrency()` (e.g. with `BudgetView()` and `Dashboard()`) actually correct?**
  _`formatCurrency()` has 8 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `formatDateRange()` (e.g. with `ItineraryBuilder()` and `ItineraryView()`) actually correct?**
  _`formatDateRange()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `useDebounce()` (e.g. with `Community()` and `ItineraryBuilder()`) actually correct?**
  _`useDebounce()` has 4 INFERRED edges - model-reasoned connections that need verification._