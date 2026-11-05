#!/usr/bin/env python3
"""Флешка с уроками для брата: скачать по sources.txt и собрать плейлист «нажал Play — идёт всё подряд».

  python3 halal_usb.py download E:\\            # скачать всё (докачивает новое, уже скачанное пропускает)
  python3 halal_usb.py playlist E:\\            # пересобрать плейлисты
  python3 halal_usb.py all E:\\                 # оба шага
  python3 halal_usb.py plan                     # прикинуть объём флешки

Нужны: yt-dlp (pip install -U yt-dlp) и ffmpeg в PATH.
"""
import argparse
import itertools
import shutil
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
VIDEO_EXT = {".mp4", ".mkv", ".webm", ".m4v"}

# 720p H.264 — Xiaomi TV Stick декодирует аппаратно, без тормозов. Для уроков больше не нужно.
FMT_AV = "bv*[height<=720][vcodec^=avc1]+ba[ext=m4a]/b[height<=720][ext=mp4]/bv*[height<=720]+ba/b"
FMT_MUTE = "bv*[height<=720][vcodec^=avc1]/bv*[height<=720]"


def parse_sources(path):
    out = []
    for n, raw in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        parts = [p.strip() for p in line.split("|")]
        if len(parts) != 5:
            sys.exit(f"{path.name}:{n}: нужно 5 полей через |, а здесь {len(parts)}")
        folder, order, limit, flags, url = parts
        flags = set() if flags == "-" else {f.strip() for f in flags.split(",")}
        out.append(dict(folder=folder, order=order, limit=int(limit), flags=flags, url=url))
    return out


def split_long(folder, minutes):
    """Длинные ролики природы (8–12 ч) режем на куски, чтобы они чередовались с уроками."""
    for f in videos(folder):
        if " - part" in f.stem:
            continue
        r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(f)],
                           capture_output=True, text=True)
        try:
            dur = float(r.stdout.strip())
        except ValueError:
            continue
        if dur <= minutes * 60 * 1.5:
            continue
        out = f.with_name(f"{f.stem} - part%03d{f.suffix}")
        ok = subprocess.run(["ffmpeg", "-v", "error", "-i", str(f), "-map", "0", "-c", "copy", "-f", "segment",
                             "-segment_time", str(minutes * 60), "-reset_timestamps", "1", str(out)]).returncode == 0
        if ok:
            f.unlink()
            print(f"   нарезан: {f.name}")


def download(dest, sources, cookies=None, split=20):
    if not shutil.which("yt-dlp"):
        sys.exit("Нет yt-dlp: pip install -U yt-dlp")
    archive = dest / ".downloaded.txt"
    for n, s in enumerate(sources, 1):
        if "ВСТАВЬ" in s["url"]:
            print(f"— пропуск {s['folder']}: ссылка-заглушка")
            continue
        prefix = {"list": "%(playlist_index)04d", "date": "%(upload_date)s"}.get(s["order"], f"{n:04d}")  # video: по строке файла
        cmd = [
            "yt-dlp", s["url"],
            "-f", FMT_MUTE if "mute" in s["flags"] else FMT_AV,
            "--merge-output-format", "mp4",
            "-o", str(dest / s["folder"] / f"{prefix} - %(title).70B.%(ext)s"),
            "--windows-filenames",            # FAT32/exFAT: без запрещённых символов
            "--download-archive", str(archive),
            "--match-filter", "duration > 120 & !is_live",  # без шортсов и эфиров
            "--ignore-errors", "--no-overwrites", "--continue",
        ]
        if cookies:
            cmd += ["--cookies-from-browser", cookies]  # если YouTube просит «подтвердите, что вы не бот»
        if s["order"] == "date":
            cmd.append("--playlist-reverse")  # канал отдаёт новые сверху — берём от старых
        if s["limit"]:
            cmd += ["--playlist-items", f"1:{s['limit']}"]
        if "ru-subs" in s["flags"]:
            # .srt рядом с видео с тем же именем — VLC подхватывает сам
            cmd += ["--write-subs", "--write-auto-subs", "--sub-langs", "ru.*", "--convert-subs", "srt"]
        print(f"\n=== {s['folder']}")
        subprocess.run(cmd)
        if "nature" in s["flags"] and split:
            split_long(dest / s["folder"], split)


def videos(folder):
    # рекурсивно: курсы одного устаза лежат подпапками 1_..., 2_... и идут друг за другом
    return sorted(p for p in folder.rglob("*") if p.suffix.lower() in VIDEO_EXT) if folder.is_dir() else []


def write_m3u(path, files, root):
    lines = ["#EXTM3U"]
    for f in files:
        lines.append(f"#EXTINF:-1,{f.parent.name} — {f.stem}")
        lines.append(f.relative_to(root).as_posix())  # относительные пути: флешка работает в любом гнезде
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def playlist(dest, sources, every):
    # группа = устаз (первая часть пути папки); внутри — его курсы по порядку
    groups = list(dict.fromkeys(s["folder"].split("/")[0] for s in sources if "lecture" in s["flags"]))
    lectures = [videos(dest / g) for g in groups]
    nature_dirs = list(dict.fromkeys(s["folder"].split("/")[0] for s in sources if "nature" in s["flags"]))
    nature = [f for d in nature_dirs for f in videos(dest / d)]

    for g in groups + nature_dirs:
        files = videos(dest / g)
        if files:
            write_m3u(dest / g / "_по_порядку.m3u8", files, dest / g)

    # Устазы по кругу (урок А, урок Б, ... урок А2 ...), серия каждого — строго по порядку.
    rr = [f for group in itertools.zip_longest(*lectures) for f in group if f]
    mixed, nat = [], itertools.cycle(nature) if nature else None
    for i, f in enumerate(rr, 1):
        mixed.append(f)
        if nat and every and i % every == 0:
            mixed.append(next(nat))
    if not mixed:
        sys.exit("Нет скачанных уроков — сначала download.")
    write_m3u(dest / "0_СМОТРЕТЬ_ВСЁ.m3u8", mixed, dest)
    write_m3u(dest / "0_ТОЛЬКО_УРОКИ.m3u8", rr, dest)
    if nature:
        write_m3u(dest / "0_ТОЛЬКО_ПРИРОДА.m3u8", nature, dest)
    print(f"Готово: {len(rr)} уроков, {len(nature)} роликов природы, в общем плейлисте {len(mixed)} позиций.")


def plan():
    # [ОЦЕНКА] 720p H.264 урок (статичная картинка) ≈ 0.5 ГБ/ч; природа 720p ≈ 1.0 ГБ/ч
    print("Флешка | часов уроков (0.5 ГБ/ч) | часов природы (1 ГБ/ч) при смеси 2:1 по времени")
    for gb in (64, 128, 256):
        usable = gb * 0.93
        h = usable / (2 / 3 * 0.5 + 1 / 3 * 1.0)
        print(f"{gb:>4} ГБ | ~{h * 2 / 3:.0f} ч | ~{h / 3:.0f} ч | итого ~{h:.0f} ч ≈ {h / 10:.0f} дней по 10 ч без повторов")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("cmd", choices=["download", "playlist", "all", "plan"])
    ap.add_argument("dest", nargs="?", help="корень флешки или папка, которую потом скопируешь на флешку")
    ap.add_argument("--sources", default=str(HERE / "sources.txt"))
    ap.add_argument("--every", type=int, default=2, help="после скольких уроков вставлять ролик природы (0 = не вставлять)")
    ap.add_argument("--cookies", help="браузер для cookies YouTube: chrome / firefox / edge / yandex")
    ap.add_argument("--split", type=int, default=20, help="резать ролики природы на куски по N минут (0 = не резать)")
    a = ap.parse_args()
    if a.cmd == "plan":
        return plan()
    if not a.dest:
        ap.error("укажи dest — путь к флешке")
    dest = Path(a.dest)
    dest.mkdir(parents=True, exist_ok=True)
    sources = parse_sources(Path(a.sources))
    if a.cmd in ("download", "all"):
        download(dest, sources, a.cookies, a.split)
    if a.cmd in ("playlist", "all"):
        playlist(dest, sources, a.every)


if __name__ == "__main__":
    main()
