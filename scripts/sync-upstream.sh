#!/bin/bash
# WTFB Template Sync Helper
# Usage: ./scripts/sync-upstream.sh
#
# This script helps manually sync updates from the upstream template.

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  WTFB Template Sync Helper${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Get upstream URL from project.json
if [ -f ".wtfb/project.json" ]; then
    UPSTREAM_URL=$(jq -r '.template.upstream // empty' .wtfb/project.json)
else
    echo -e "${RED}Error: .wtfb/project.json not found${NC}"
    exit 1
fi

if [ -z "$UPSTREAM_URL" ]; then
    echo -e "${RED}Error: No upstream template configured in .wtfb/project.json${NC}"
    exit 1
fi

echo -e "Upstream template: ${BLUE}$UPSTREAM_URL${NC}"
echo ""

# Add upstream if not exists
if ! git remote get-url upstream >/dev/null 2>&1; then
    echo "Adding upstream remote..."
    git remote add upstream "$UPSTREAM_URL"
fi

# Fetch upstream
echo "Fetching upstream..."
git fetch upstream

# Show what's available
echo ""
echo -e "${YELLOW}Template updates available:${NC}"
echo ""
git log HEAD..upstream/main --oneline 2>/dev/null || echo "  (none or already up to date)"

BEHIND=$(git rev-list HEAD..upstream/main --count 2>/dev/null || echo "0")

if [ "$BEHIND" -eq 0 ]; then
    echo ""
    echo -e "${GREEN}Your project is up to date with the template!${NC}"
    exit 0
fi

echo ""
echo -e "${YELLOW}You are $BEHIND commit(s) behind upstream.${NC}"
echo ""

# Show sync paths
echo -e "${BLUE}Paths that will be updated (from syncPaths):${NC}"
jq -r '.syncPaths[]?' .wtfb/project.json 2>/dev/null || echo "  .github/workflows/**, scripts/**, .wtfb/ai-harness/**, templates/**"

echo ""
echo -e "${BLUE}Paths that will NOT be changed (from protectedPaths):${NC}"
jq -r '.protectedPaths[]?' .wtfb/project.json 2>/dev/null || echo "  *.fountain, manuscript/**, README.md, marketing/wtfb-marketing.json"

echo ""
echo -e "${YELLOW}To merge updates:${NC}"
echo ""
echo "  git merge upstream/main --no-commit"
echo "  # Review changes carefully"
echo "  # Resolve any conflicts"
echo "  git commit -m 'sync: merge upstream template updates'"
echo ""
echo -e "${YELLOW}Or create a branch first:${NC}"
echo ""
echo "  git checkout -b sync/upstream-$(date +%Y%m%d)"
echo "  git merge upstream/main"
echo "  # Review, then create a PR"
echo ""

read -p "Would you like to proceed with merge? [y/N] " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Creating sync branch..."
    BRANCH_NAME="sync/upstream-$(date +%Y%m%d)"
    git checkout -b "$BRANCH_NAME" 2>/dev/null || git checkout "$BRANCH_NAME"

    echo "Merging upstream..."
    if git merge upstream/main --no-commit; then
        echo ""
        echo -e "${GREEN}Merge successful! Review the changes and commit when ready:${NC}"
        echo ""
        echo "  git status"
        echo "  git diff --cached"
        echo "  git commit -m 'sync: merge upstream template updates'"
    else
        echo ""
        echo -e "${YELLOW}Merge has conflicts. Please resolve them:${NC}"
        echo ""
        echo "  git status  # See conflicted files"
        echo "  # Edit files to resolve conflicts"
        echo "  git add <resolved-files>"
        echo "  git commit -m 'sync: merge upstream template updates'"
    fi
else
    echo ""
    echo "Sync cancelled. Run this script again when ready."
fi
