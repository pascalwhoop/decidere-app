#!/bin/bash

# Load environment variables from .env if it exists
if [ ! -f .env ]; then
  echo "Error: .env file not found."
  exit 1
fi

# Determine environment (default to production if not specified)
ENV_ARG=""
if [ "$1" == "preview" ]; then
  ENV_ARG="--env preview"
  echo "Setting secrets for PREVIEW environment..."
elif [ "$1" == "production" ]; then
  echo "Setting secrets for PRODUCTION environment..."
else
  echo "Setting secrets for default (PRODUCTION) environment..."
fi

# Define which keys should NOT be uploaded as secrets
# Some might be for local use or CI only
EXCLUDE_KEYS=("GITHUB_TOKEN" "GITHUB_REPO" "NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION" "NEXT_PUBLIC_SITE_URL")

# Function to check if a key is excluded
is_excluded() {
  local key=$1
  for excluded in "${EXCLUDE_KEYS[@]}"; do
    if [[ "$key" == "$excluded" ]]; then
      return 0
    fi
  done
  return 1
}

# Process .env file
# 1. Ignore comments and empty lines
# 2. Extract key and value
# 3. Handle quoted values correctly
grep -v '^#' .env | grep -v '^[[:space:]]*$' | while IFS='=' read -r key value; do
  # Trim whitespace from key
  key=$(echo "$key" | xargs)
  
  if is_excluded "$key"; then
    echo "⏭️  Skipping $key (excluded)"
    continue
  fi

  # Clean the value: remove surrounding quotes if they exist
  # Use sed to handle both single and double quotes
  clean_value=$(echo "$value" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")

  if [ -z "$clean_value" ]; then
    echo "⚠️  Skipping $key: value is empty"
    continue
  fi

  echo "🔐 Setting secret: $key"
  echo "$clean_value" | npx wrangler secret put "$key" $ENV_ARG
done

echo "✅ All secrets processed."
