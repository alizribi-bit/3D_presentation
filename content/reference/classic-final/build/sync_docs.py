"""Keep the current plan and its delivery estimate derived from the speech rows."""

from pathlib import Path
import re

from estimate import estimate, mmss
from script_rows import R

ROOT = Path(__file__).resolve().parent.parent


def sync_plan() -> None:
    current = ROOT.joinpath("PLAN_PRESENTATION.md").read_text(encoding="utf-8")
    rule = current.split("## 2. Règle du discours", 1)[1]
    result = estimate(R)
    added = estimate([row for row in R if row[0] in {"problematique", "besoins", "methodologie"}])
    chapters = [str(i) for i, row in enumerate(R, 1) if row[1] and row[5] == "dip"]
    rule = rule.replace("slide 39", "slide 42").replace("slide 19", "slide 22")
    plan = f"""# Plan de la soutenance ZAWEDNI (v9, 11/10/2026)

Source : corrections ciblées d'Ali sur la révision v8 de la présentation classique. Faits : rapport final (sections 1.6, 1.8, 1.9, tableau 1.6, sections 3.3–3.4 et chapitres 4–6), bilan des corrections acceptées ; création en décembre 2025 fournie par Ali. La SARL figure dans le tableau 1.1. Le développement de la plateforme précède la chaîne DevSecOps et se poursuit pendant sa réalisation. Aucun calendrier ni rôle Scrum formel n'est ajouté.

Discours : `build/script_rows.py` → `SCRIPT.md` → notes intégrées, `DISCOURS.md` et `discours.html`. Questions du jury : `FICHE_PRIVEE_QUESTIONS.md`, jamais projetée. Le film et les captures acceptées sont conservés ; la capture réelle d'attribution de la grille est ajoutée à l'entrée de la slide 15.

## 0. Fil et durée

On part du besoin métier RSE et de la réponse ZAWEDNI. Après le BMC, on présente les enjeux globaux, les besoins et l'organisation du travail. La suite reste thématique : plateforme, architecture DevSecOps, livraison, supervision, bilan et perspectives, film, conclusion. Le parcours va du compte à la décision sur la grille et à l'accès aux fonctions concernées. La transition du chapitre 3 ouvre ensuite la partie technique.

| Élément | Durée estimée |
|---|---|
| Parole : {result.words:,} mots dits ou lus (dont {result.read_words} lus sur les slides), à 115 mots/min | {mmss(result.speech_seconds)} |
| Pauses : 0,5 s par révélation et 1 s entre diapositives | {mmss(result.pause_seconds)} |
| Film, slide 43 (H.264 et AAC conservés) | {mmss(result.film_seconds)} |
| **Total** | **≈ {mmss(result.total_seconds)}, soit environ {round(result.total_seconds / 60)} minutes** |
| Enjeux, besoins et organisation : {added.words} mots, {added.clicks} clics | ≈ {mmss(added.total_seconds)} |

Estimation calculée par `python3 build/estimate.py`, **pas une répétition chronométrée**. Prévoir environ {round(result.total_seconds / 60)} à {round(result.total_seconds / 60) + 2} minutes selon le débit et les pauses. Les notes ciblées ont été simplifiées selon la consigne. Chronométrer une répétition avec `./presenter.sh`.

## 1. Déroulé ({result.slides} slides, {result.clicks} clics de révélation)

{result.slides + result.clicks} états ; {result.slides - 1} passages entre slides, soit {result.clicks + result.slides - 1} avances pour parcourir tout le deck depuis son premier état. `camera` dans une partie ; `dip` clair à l'ouverture d'une partie (slides {', '.join(chapters)}). Couverture et sommaire : un clic lance leur séquence automatique. Film après les perspectives et avant la conclusion.

| # | Slide | Clics | Mise en scène |
|---|---|---|---|
"""
    plan += "".join(f"| {i} | {row[2]} | {row[3]} | {row[4]} |\n" for i, row in enumerate(R, 1))
    plan += "\n## 2. Règle du discours" + rule
    ROOT.joinpath("PLAN_PRESENTATION.md").write_text(plan, encoding="utf-8")


def sync_guides() -> None:
    """Replace only generated delivery facts, keeping the launcher's accepted instructions."""
    result = estimate(R)
    minutes = round(result.total_seconds / 60)
    facts = f"{result.slides} diapositives, {result.clicks} clics de révélation, {result.slides + result.clicks} états"
    duration = f"environ **{minutes} minutes** ({mmss(result.total_seconds)} à 115 mots/min, film et pauses inclus)"
    path = ROOT / "LIRE_MOI.md"
    text = path.read_text(encoding="utf-8")
    text = re.sub(r"révision v\d+", "révision v9", text)
    text = re.sub(r"\*\*\d+ diapositives,.*?faire une répétition chronométrée\.",
                  f"**{facts}.** Durée estimée : {duration} ; prévoir {minutes} à {minutes + 2} minutes et faire une répétition chronométrée.", text)
    text = text.replace("soutenance-v7-accepted.zip", "classique-v8-avant-v9-20261011.zip").replace("sauvegarde complète de la version acceptée", "sauvegarde sélective de la v8")
    path.write_text(text, encoding="utf-8")
    path = ROOT / "PRESENTER.md"
    text = path.read_text(encoding="utf-8")
    text = re.sub(r"\(\d+ clics de révélation, \d+ états\)", f"({result.clicks} clics de révélation, {result.slides + result.clicks} états)", text)
    text = re.sub(r"Repères de la révision v\d+", "Repères de la révision v9", text)
    text = re.sub(r"- Après le BMC :.*", "- Après le BMC : enjeux (8, un clic), besoins (9, un clic), organisation et releases (10, un clic). Les quatre enjeux apparaissent à l'entrée ; le clic affiche la question générale.", text)
    text = re.sub(r"- Durée calculée :.*", f"- Durée calculée : {duration}. Prévoir {minutes} à {minutes + 2} minutes et chronométrer une répétition.", text)
    path.write_text(text, encoding="utf-8")


if __name__ == "__main__":
    sync_plan()
    sync_guides()
    print("Plan and estimated duration synced from speech rows.")
