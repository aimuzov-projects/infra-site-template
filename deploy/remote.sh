#!/usr/bin/env bash
# Deploy on the server itself: pull main and rebuild the containers.
# GitHub Actions runs it on every push to main and on a manual workflow run.
# It's the only command allowed for the Actions key (command= in authorized_keys).
set -euo pipefail

# The body is a block, so bash reads all of it before git pull replaces this file.
{
	cd /srv/__PROJECT__

	# Two pushes in a row must not run compose at once: the second waits for the first.
	exec 9>/tmp/__PROJECT__-deploy.lock
	flock 9

	git pull --ff-only --quiet
	git log -1 --oneline
	docker compose -f deploy/docker-compose.yml up -d --build --quiet-pull
	docker image prune -f >/dev/null
	exit
}
