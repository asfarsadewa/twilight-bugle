#!/usr/bin/env bash
# Generate the art pieces listed in prompts/jobs.txt, five at a time. A piece that already exists is skipped.
#   bash productions/gema-masa-muda/art/gen_art.sh [piece ...]
cd "$(dirname "$0")"
GEN="${IMAGE_GEN:?Set IMAGE_GEN to an image generation CLI. The README lists the commands it needs.}"
one() {
  name=$1 size=$2 bg=$(printf '%s' "$3" | tr -d '\r')
  [ -f "src/$name.png" ] && { echo "$name: exists"; return; }
  python "$GEN" edit --image key-art.png --prompt-file "prompts/$name.prompt" --size "$size" --quality high \
    --background "$bg" --output-format png --no-augment --out "src/$name.png" > "src/$name.log" 2>&1
  echo "$name: rc=$?"
}
export -f one
export GEN
if [ $# -gt 0 ]; then
  for n in "$@"; do grep "^$n " prompts/jobs.txt; done
else
  cat prompts/jobs.txt
fi | xargs -P 5 -L 1 bash -c 'one "$@"' _
