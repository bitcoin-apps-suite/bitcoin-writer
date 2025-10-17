#!/bin/bash

# Script to extract articles from ArticlePage.tsx and create Markdown files

INPUT_FILE="src/pages/ArticlePage.tsx"
OUTPUT_DIR="content/articles"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Function to slugify titles for filenames
slugify() {
    echo "$1" | iconv -t ascii//TRANSLIT | sed -E 's|[~^]+||g' | sed -E 's|[:/]+| |g' | sed -E 's|[^a-zA-Z0-9 ]+||g' | sed -E 's| +|-|g' | tr '[:upper:]' '[:lower:]'
}

# Titles to exclude
EXCLUDE_TITLES=("Revolutionizing Writing with Bitcoin Writer" "How to Build a 'bOS': A Pragmatic Strategic Plan for Decentralized Finance")

# Get all article titles with line numbers
TITLES=$(grep -n 'title:' "$INPUT_FILE" | cut -d: -f1,2-)

# Loop through each title to process articles
IFS=$'\n'
for LINE_INFO in $TITLES; do
    LINE_NUM=$(echo "$LINE_INFO" | cut -d: -f1)
    TITLE=$(echo "$LINE_INFO" | cut -d: -f2- | sed "s/    title: '//" | sed "s/',//")
    
    # Check if this title should be excluded
    SKIP=0
    for EXCLUDE in "${EXCLUDE_TITLES[@]}"; do
        if [[ "$TITLE" == "$EXCLUDE" ]]; then
            SKIP=1
            break
        fi
    done
    if [[ $SKIP -eq 1 ]]; then
        echo "Skipping excluded article: $TITLE"
        continue
    fi
    
    # Extract metadata (author, date, etc.)
    AUTHOR_LINE=$((LINE_NUM + 1))
    DATE_LINE=$((LINE_NUM + 2))
    CATEGORY_LINE=$((LINE_NUM + 3))
    
    AUTHOR=$(sed -n "${AUTHOR_LINE}p" "$INPUT_FILE" | sed "s/    author: '//" | sed "s/',//")
    DATE=$(sed -n "${DATE_LINE}p" "$INPUT_FILE" | sed "s/    date: '//" | sed "s/',//")
    CATEGORY=$(sed -n "${CATEGORY_LINE}p" "$INPUT_FILE" | sed "s/    category: '//" | sed "s/',//")
    
    # Find the start of content
    CONTENT_START=$(awk -v ln=$LINE_NUM 'NR > ln && /content: `/ {print NR; exit}' "$INPUT_FILE")
    if [[ -z "$CONTENT_START" ]]; then
        CONTENT_START=$(awk -v ln=$LINE_NUM "NR > ln && /content: '/ {print NR; exit}" "$INPUT_FILE")
    fi
    
    # Find the end of content (look for closing backtick or quote followed by comma)
    CONTENT_END=$(awk -v cs=$CONTENT_START 'NR > cs && /`.*,/ {print NR; exit}' "$INPUT_FILE")
    if [[ -z "$CONTENT_END" ]]; then
        CONTENT_END=$(awk -v cs=$CONTENT_START 'NR > cs && /\'.*,/ {print NR; exit}' "$INPUT_FILE")
    fi
    
    if [[ -z "$CONTENT_START" || -z "$CONTENT_END" ]]; then
        echo "Could not parse content for $TITLE"
        continue
    fi
    
    # Extract content lines
    CONTENT=$(sed -n "${CONTENT_START},${CONTENT_END}p" "$INPUT_FILE" | grep -v 'content: ' | sed 's/        //')
    
    # Create slug for filename
    SLUG=$(slugify "$TITLE")
    OUTPUT_FILE="$OUTPUT_DIR/$SLUG.md"
    
    # Write to Markdown file with frontmatter
    cat > "$OUTPUT_FILE" << EOF
---
title: "$TITLE"
author: "$AUTHOR"
date: "$DATE"
category: "$CATEGORY"
---

$CONTENT
EOF
    
    echo "Created article: $TITLE -> $OUTPUT_FILE"
done

echo "Article extraction complete."
