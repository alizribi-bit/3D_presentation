#!/usr/bin/env bash
# ZAWEDNI Story 3D — la soutenance sur deux écrans, en une commande :
#   fenêtre jury en plein écran sur l'écran externe (HDMI), vue présentateur sur l'écran de l'ordinateur.
# Usage : ./present.sh [--swap]      (--swap : jury sur l'ordinateur, notes sur l'écran externe)
# Préparation, une seule fois et avec Internet : npm install && npm run build   (voir PRESENTER.md)
set -u
DIR="$(cd "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")" && pwd)"
PORT=4317
URL="http://127.0.0.1:$PORT"
SWAP=; MODE_QUERY=
for arg in "$@"; do
  case "$arg" in
    --swap) SWAP=1 ;;
    --prototype) MODE_QUERY="prototype&" ;;
    *) echo "Usage: $0 [--swap] [--prototype]"; exit 2 ;;
  esac
done
LOG="${XDG_RUNTIME_DIR:-/tmp}/zawedni-story-3d-server.log"

if [ ! -f "$DIR/dist/index.html" ] || [ ! -f "$DIR/dist/presenter.html" ]; then
  echo "La version de présentation n'est pas construite. Une seule fois, avec Internet :"
  echo "  cd \"$DIR\" && npm install && npm run build"
  exit 1
fi

# 1 · serveur local : réutilisé s'il est déjà lancé (fichier témoin), sinon démarré depuis dist/
ours() { curl -fsS -m 1 "$URL/zawedni-story-3d.txt" 2>/dev/null | grep -q zawedni-story-3d; }
if ! ours; then
  if curl -s -m 1 -o /dev/null "$URL/"; then
    echo "Le port $PORT est déjà pris par une autre application. Fermez-la, ou changez PORT dans present.sh."
    exit 1
  fi
  nohup python3 -m http.server "$PORT" --bind 127.0.0.1 --directory "$DIR/dist" >"$LOG" 2>&1 &
  for _ in $(seq 50); do ours && break; sleep 0.2; done
  ours || { echo "Le serveur local ne répond pas (journal : $LOG)."; exit 1; }
fi

# 2 · écrans : l'écran intégré (eDP/LVDS) reçoit les notes, l'autre la présentation
geo() { xrandr --query 2>/dev/null | awk -v want="$1" '/ connected/ { isint = ($1 ~ /^(eDP|LVDS|DSI)/); if ((want == "int") == isint && match($0, /[0-9]+x[0-9]+\+-?[0-9]+\+-?[0-9]+/)) { print substr($0, RSTART, RLENGTH); exit } }'; }
EXT=$(geo ext); INT=$(geo int)

# un profil Chrome dédié : nos options sont appliquées même si Chrome est déjà ouvert, et la page a le droit
# de placer la fenêtre présentateur sur l'autre écran (gestion des fenêtres) et de l'ouvrir sans bloqueur.
PROF="$HOME/.cache/zawedni-story-3d-chrome"
mkdir -p "$PROF/Default"
[ -f "$PROF/Default/Preferences" ] || echo '{"translate":{"enabled":false},"profile":{"content_settings":{"exceptions":{"window_placement":{"http://127.0.0.1:4317,*":{"setting":1}},"popups":{"http://127.0.0.1:4317,*":{"setting":1}}}}}}' > "$PROF/Default/Preferences"
pkill -f "user-data-dir=$PROF" 2>/dev/null && sleep 1   # une fenêtre restée d'un lancement précédent avalerait celui-ci
FLAGS=(--ozone-platform=x11 --user-data-dir="$PROF" --no-first-run --no-default-browser-check --disable-popup-blocking
       --disable-session-crashed-bubble --disable-features=Translate --password-store=basic)

if [ -z "$EXT" ] || [ -z "$INT" ] || [ "${EXT#*+}" = "${INT#*+}" ]; then
  echo "Un seul écran, ou deux écrans en miroir : les deux fenêtres s'ouvrent sur le même écran."
  echo "Pour deux écrans : Paramètres > Écrans > « Joindre », puis relancez ./present.sh"
  nohup google-chrome "${FLAGS[@]}" --start-maximized "$URL/?${MODE_QUERY}pv=auto#A0" >/dev/null 2>&1 &
  exit 0
fi
[ -n "$SWAP" ] && { T=$EXT; EXT=$INT; INT=$T; }
IFS='x+' read -r EW EH EX EY <<< "$EXT"
IFS='x+' read -r IW IH IX IY <<< "$INT"
nohup google-chrome "${FLAGS[@]}" --window-position="$EX,$EY" --window-size="$EW,$EH" --start-fullscreen \
  "$URL/?${MODE_QUERY}pv=$IX,$IY,$IW,$IH#A0" >/dev/null 2>&1 &
echo "Présentation : écran $EW×$EH · notes : écran $IW×$IH. Touches : → / ← (ou le clicker), F plein écran, N rouvre les notes."
