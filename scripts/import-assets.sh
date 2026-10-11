#!/usr/bin/env bash
# Copies the curated CC0 models from assets-src/ (downloaded packs, see ASSETS.md) into public/models/.
set -euo pipefail
cd "$(dirname "$(readlink -f "$0")")/.."
S=assets-src; D=public/models
rm -rf "$D"; mkdir -p "$D"/{chars,props,nature,food,commercial,suburban}
cp "$S/polypizza/business-man.glb" "$D/chars/rep.glb"
cp "$S/polypizza/casual-character.glb" "$D/chars/guide.glb"
cp "$S/polypizza/market-stand.glb" "$S/polypizza/computer-screen.glb" "$D/props/"
N="$S/kenney/kenney_nature-kit/Models/GLTF format"
for m in tree_default tree_oak tree_detailed tree_fat tree_cone tree_small tree_palm tree_palmShort tree_palmDetailedTall tree_palmBend \
         plant_bush plant_bushLarge plant_bushDetailed plant_bushSmall flower_yellowA flower_redA flower_purpleA grass grass_large \
         rock_smallA rock_smallC rock_largeA rock_tallA stump_round fence_simple; do cp "$N/$m.glb" "$D/nature/"; done
F="$S/kenney/kenney_food-kit/Models/GLB format"
for m in apple orange lemon tomato pear grapes carrot cabbage eggplant paprika pumpkin-basic watermelon bread loaf-baguette cheese honey fish bag onion corn; do cp "$F/$m.glb" "$D/food/"; done
mkdir -p "$D/food/Textures" && cp "$F/Textures/colormap.png" "$D/food/Textures/"
C="$S/kenney/kenney_city-kit-commercial/Models/GLB format"
for m in building-a building-b building-c building-d building-e building-f building-g building-h low-detail-building-a low-detail-building-b \
         low-detail-building-c low-detail-building-d detail-awning detail-awning-wide detail-parasol-a detail-parasol-b detail-overhang; do cp "$C/$m.glb" "$D/commercial/"; done
mkdir -p "$D/commercial/Textures" && cp "$C/Textures/colormap.png" "$D/commercial/Textures/"
U="$S/kenney/kenney_city-kit-suburban/Models/GLB format"
for f in "$U"/building-type-*.glb "$U"/planter.glb "$U"/tree-large.glb "$U"/tree-small.glb "$U"/fence-low.glb "$U"/path-stones-long.glb; do cp "$f" "$D/suburban/"; done
mkdir -p "$D/suburban/Textures" && cp "$U/Textures/colormap.png" "$U/../Textures/variation-b.png" "$D/suburban/Textures/"
du -sh "$D"
