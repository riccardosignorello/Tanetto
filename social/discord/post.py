# Posts today's Tanetto update to the Discord #announcements webhook (run by GitHub Actions).
import json, os, sys, subprocess, datetime, zoneinfo
here = os.path.dirname(os.path.abspath(__file__))
today = os.environ.get("POST_DATE") or datetime.datetime.now(zoneinfo.ZoneInfo("Europe/Rome")).date().isoformat()
item = json.load(open(os.path.join(here, "schedule.json"), encoding="utf-8")).get(today)
hook = os.environ.get("DISCORD_WEBHOOK", "")
if not hook:
    print("DISCORD_WEBHOOK secret missing"); sys.exit(1)
if not item:
    # nothing to post today: just check that the webhook still works (GET does not post anything)
    r = subprocess.run(["curl", "-sS", "--fail", "-o", "/dev/null", "-w", "%{http_code}", hook], capture_output=True, text=True)
    print("nothing scheduled for", today, "- webhook check:", r.stdout or r.stderr[:200])
    sys.exit(0 if r.returncode == 0 else 1)
payload = json.dumps({"content": item["text"], "username": "Tanetto", "allowed_mentions": {"parse": []}})
args = ["curl", "-sS", "--fail-with-body", "-X", "POST", hook + "?wait=true", "-F", "payload_json=" + payload]
if item.get("image"):
    args += ["-F", "files[0]=@" + os.path.join(here, item["image"])]
r = subprocess.run(args, capture_output=True, text=True)
print(r.returncode, r.stdout[:300], r.stderr[:300])
sys.exit(r.returncode)
