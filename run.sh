#!/usr/bin/env bash
#
# Run the application with the gunicorn wsgi framework in daemon mode. Auto-reload on code changes
gunicorn --bind 127.0.0.1:8000 --reload --daemon --pythonpath /srv/www/www.flashkort.no/flashcards wsgi