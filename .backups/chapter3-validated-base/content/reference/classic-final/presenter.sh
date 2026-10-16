#!/usr/bin/env bash
# Soutenance sur deux écrans : la présentation en plein écran sur l'écran HDMI,
# la vue présentateur (notes, minuteur, diapositive suivante) sur l'écran de l'ordinateur.
# Usage : ./presenter.sh [--swap] [deck.offline.html]
#   --swap : l'inverse (présentation sur l'ordinateur, notes sur l'écran HDMI)
set -euo pipefail
cd "$(dirname "$0")"
SWAP=; if [ "${1:-}" = "--swap" ]; then SWAP=1; shift; fi
DECK="${1:-deck.offline.html}"
[[ "$DECK" = /* ]] || DECK="$PWD/$DECK"
if [ ! -f "$DECK" ]; then echo "Présentation introuvable : $DECK" >&2; exit 1; fi
geo() { xrandr --query | awk -v want="$1" '/ connected/ { isint = ($1 ~ /^(eDP|LVDS|DSI)/); if ((want == "int") == isint && match($0, /[0-9]+x[0-9]+\+-?[0-9]+\+-?[0-9]+/)) { print substr($0, RSTART, RLENGTH); exit } }'; }
EXT=$(geo ext); INT=$(geo int)
if [ -z "$EXT" ] || [ -z "$INT" ] || [ "${EXT#*+}" = "${INT#*+}" ]; then
  echo "Un seul écran, ou deux écrans en miroir : Paramètres > Écrans > « Joindre », puis relancez."
  exec google-chrome "$DECK"
fi
[ -n "$SWAP" ] && { T=$EXT; EXT=$INT; INT=$T; }
IFS='x+' read -r EW EH EX EY <<< "$EXT"
IFS='x+' read -r IW IH IX IY <<< "$INT"
# Separate profile + X11 backend: Wayland ignores window positions, and a running Chrome would ignore these flags.
# The profile allows "window management" for file:// so the presenter window may open on the other screen.
PROF="${ZAWEDNI_20MIN_CHROME_PROFILE:-$HOME/.cache/zawedni-classique-20min-chrome}"
mkdir -p "$PROF/Default"
[ -f "$PROF/Default/Preferences" ] || echo '{"translate":{"enabled":false},"profile":{"content_settings":{"exceptions":{"window_placement":{"file:///*,*":{"setting":1}}}}}}' > "$PROF/Default/Preferences"
exec google-chrome --ozone-platform=x11 --user-data-dir="$PROF" \
  --no-first-run --no-default-browser-check --disable-popup-blocking --autoplay-policy=no-user-gesture-required --disable-session-crashed-bubble --disable-features=Translate \
  --window-position="$EX,$EY" --window-size="$EW,$EH" --start-fullscreen ${PV_DEBUG:+--remote-debugging-port=9333} \
  "file://$DECK?pv=$IX,$IY,$IW,$IH" >/dev/null 2>&1
