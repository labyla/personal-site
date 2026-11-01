#!/usr/bin/env python3
"""Small standard-library checks for the reusable project harness."""

import argparse
import re
import sys
from pathlib import Path

PLACEHOLDER = re.compile(r"\{\{[^{}]+\}\}")
PROJECT_DOCS = (
    Path("AGENTS.md"),
    Path("docs/PROJECT_BRIEF.md"),
    Path("docs/ARCHITECTURE.md"),
    Path("docs/DECISIONS.md"),
    Path("docs/PLANS.md"),
    Path("docs/PROGRESS.md"),
    Path("docs/HANDOFF.md"),
)
HANDOFF_SECTIONS = (
    "## Current verified state",
    "## Still open",
    "## Next action",
)


def validate_template(root: Path) -> int:
    """Report unresolved markers in project documents; templates start with them."""
    unresolved = []
    for relative_path in PROJECT_DOCS:
        path = root / relative_path
        if not path.is_file():
            unresolved.append(f"{relative_path}: required file is missing")
            continue
        for line_number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
            for match in PLACEHOLDER.finditer(line):
                unresolved.append(f"{relative_path}:{line_number}: {match.group(0)}")

    if unresolved:
        print("Unresolved project template fields:")
        print("\n".join(f"- {item}" for item in unresolved))
        print("Fill these from confirmed project information; ask the user about unclear decisions.")
        return 1

    print("Project documents contain no unresolved template fields.")
    return 0


def check_handoff(root: Path) -> int:
    """Check that the latest handoff has required sections and no empty markers."""
    path = root / "docs/HANDOFF.md"
    if not path.is_file():
        print("Handoff check failed: docs/HANDOFF.md is missing.")
        return 1

    content = path.read_text(encoding="utf-8")
    problems = []
    for section in HANDOFF_SECTIONS:
        if section not in content:
            problems.append(f"missing section: {section}")
    for match in PLACEHOLDER.finditer(content):
        problems.append(f"unfilled field: {match.group(0)}")

    if problems:
        print("Handoff check failed:")
        print("\n".join(f"- {problem}" for problem in problems))
        return 1

    print("Handoff has its required sections and no template markers.")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("check", choices=("validate-template", "check-handoff"))
    parser.add_argument("--root", type=Path, default=Path.cwd(), help="project root (default: current directory)")
    args = parser.parse_args()
    root = args.root.resolve()
    if args.check == "validate-template":
        return validate_template(root)
    return check_handoff(root)


if __name__ == "__main__":
    sys.exit(main())
