#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "--- Installing Python Dependencies ---"
pip install --upgrade pip
pip install -r requirements.txt

echo "--- Collecting Static Files ---"
python manage.py collectstatic --no-input

echo "--- Running Database Migrations ---"
python manage.py migrate --no-input

echo "--- Build Completed Successfully ---"
