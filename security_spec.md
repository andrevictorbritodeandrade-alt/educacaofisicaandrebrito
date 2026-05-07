# Security Specification - CLUBE DO XADREZ

## Data Invariants
1. **Authentication Mandatory**: All read and write operations require a signed-in user.
2. **Schema Integrity**: Every document must strictly follow the schema defined in `firebase-blueprint.json`.
3. **Singleton Records**: Collections like `activities`, `tournaments`, and `gallery` use specific document IDs (`log`, `active`, `main`). Writes to other IDs in these collections are forbidden.
4. **Immutable Identities**: Fields like `id` must not be changed after creation.
5. **Temporal Sanity**: `lastUpdated` and similar timestamps must be valid server timestamps.

## The Dirty Dozen Payloads

### 1. Anonymous Read Attempt
**Action**: GET `/dashboard/total_students`
**Context**: Unauthenticated user.
**Result**: PERMISSION_DENIED.

### 2. Large Value Injection (Denial of Wallet)
**Action**: UPDATE `/dashboard/status`
**Payload**: `{ "value": "A".repeat(1024 * 1024) }`
**Result**: PERMISSION_DENIED (Size limit check).

### 3. ID Poisoning
**Action**: CREATE `/classes/VERY_LONG_ID_WITH_SPECIAL_CHARS_$%^&*()`
**Result**: PERMISSION_DENIED (isValidId check).

### 4. Shadow Field Injection
**Action**: UPDATE `/dashboard/total_students`
**Payload**: `{ "value": 150, "isAdmin": true, "lastUpdated": 1715092200000 }`
**Result**: PERMISSION_DENIED (affectedKeys().hasOnly check).

### 5. Type Mismatch (Enum)
**Action**: UPDATE `/dashboard/total_students`
**Payload**: `{ "type": "malicious_type", "value": 150, "lastUpdated": 1715092200000 }`
**Result**: PERMISSION_DENIED (isValidDashboardCard check).

### 6. Immutability Failure
**Action**: UPDATE `/classes/601`
**Payload**: `{ "id": "602", ... }`
**Result**: PERMISSION_DENIED (incoming().id == existing().id).

### 7. Missing Required Fields
**Action**: CREATE `/classes/800`
**Payload**: `{ "name": "New Class" }` (Missing `grade`, `students`)
**Result**: PERMISSION_DENIED (isValidClass check).

### 8. Invalid Tournament Result
**Action**: UPDATE `/tournaments/active`
**Payload**: `{ "matches": [{ "id": "1", "result": "WIN" }] }`
**Result**: PERMISSION_DENIED (Enum validation).

### 9. Future Timestamp
**Action**: UPDATE `/dashboard/total_students`
**Payload**: `{ "lastUpdated": 9999999999999 }`
**Result**: PERMISSION_DENIED (request.time check).

### 10. Invalid Student ID Type
**Action**: UPDATE `/classes/601`
**Payload**: `{ "students": [{ "id": "NaN", "name": "Hack", "attendance": {} }] }`
**Result**: PERMISSION_DENIED (Type check - id must be number).

### 11. Empty Gallery URL
**Action**: UPDATE `/gallery/main`
**Payload**: `{ "images": [{ "id": "1", "title": "No URL", "url": "", "createdAt": 123 }] }`
**Result**: PERMISSION_DENIED (size() check).

### 12. Unauthorized Collection
**Action**: CREATE `/unauthorized_collection/doc`
**Result**: PERMISSION_DENIED (Default deny).
