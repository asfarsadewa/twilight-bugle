#!/usr/bin/env bash
# Generate the art pieces listed in prompts/jobs.txt, five at a time, with an explicit image model. A piece that
# already exists is skipped. Each finished piece gets a receipt in receipts/.
#   bash productions/derzhis-lyod/art/gen_art.sh [piece ...]
cd "$(dirname "$0")"
GEN="${IMAGE_GEN:?Set IMAGE_GEN to an image generation CLI. The README lists the commands it needs.}"
MODEL="${IMAGE_MODEL:-gpt-image-2.6-sunburst}"
mkdir -p src receipts
one() {
  name=$1 size=$2 bg=$(printf '%s' "$3" | tr -d '\r')
  [ -f "src/$name.png" ] && { echo "$name: exists"; return; }
  start=$(date +%s)
  python "$GEN" edit --model "$MODEL" --image key-art.png --prompt-file "prompts/$name.prompt" --size "$size" --quality high \
    --background "$bg" --output-format png --no-augment --out "src/$name.png" > "src/$name.log" 2>&1
  rc=$?
  [ $rc -eq 0 ] && python receipt.py "$name" "$MODEL" "$size" "$bg" $(( $(date +%s) - start ))
  echo "$name: rc=$rc"
}
export -f one
export GEN MODEL
if [ $# -gt 0 ]; then
  for n in "$@"; do grep "^$n " prompts/jobs.txt; done
else
  cat prompts/jobs.txt
fi | xargs -P 5 -L 1 bash -c 'one "$@"' _
