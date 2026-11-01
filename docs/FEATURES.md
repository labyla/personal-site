# Feature tracker guide

`FEATURES.json` is the source of truth for agreed, user-visible work. Add one feature at a time during initialization, using this shape:

```json
{
  "id": "F-001",
  "priority": 1,
  "area": "{{AREA}}",
  "title": "{{SHORT_TITLE}}",
  "user_visible_behavior": "{{OBSERVABLE_BEHAVIOR}}",
  "acceptance_criteria": ["{{CHECKABLE_CRITERION}}"],
  "verification": ["{{COMMAND_OR_REPRODUCIBLE_STEPS}}"],
  "status": "not_started",
  "evidence": [],
  "notes": ""
}
```

Allowed statuses: `not_started`, `in_progress`, `blocked`, `passing`. Keep one feature in progress by default. Mark a feature `passing` only after its acceptance criteria have been checked and the evidence is recorded. If behavior or verification is unclear, ask the user before treating the feature as agreed.
