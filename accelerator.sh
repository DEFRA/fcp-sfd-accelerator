#!/bin/bash

set -e

if [ "$#" -lt 2 ] || [ "$#" -gt 3 ]; then
  echo "Usage: $0 <template-repo-url> <target-repo-url> [target-branch]"
  echo "Example: $0 https://github.com/DEFRA/fcp-sfd-accelerator.git https://github.com/DEFRA/fcp-sfd-example.git template-setup"
  exit 1
fi

TEMPLATE_REPO="$1"
TARGET_REPO="$2"
TARGET_BRANCH="${3:-template-setup}"

TEMP_DIR=$(mktemp -d)

echo "Cloning target repo..."
git clone "$TARGET_REPO" "$TEMP_DIR"
cd "$TEMP_DIR"

echo "Creating target branch '$TARGET_BRANCH'..."
git checkout -b "$TARGET_BRANCH"

echo "Adding template repo as a remote..."
git remote add template "$TEMPLATE_REPO"

echo "Fetching template repo..."
git fetch template

echo "Merging template repo 'main' branch into '$TARGET_BRANCH'..."
git merge template/main --allow-unrelated-histories

echo "Pushing new branch to target repo..."
git push -u origin "$TARGET_BRANCH"

cd ..
rm -rf "$TEMP_DIR"
