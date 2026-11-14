#!/usr/bin/env python3
"""Write the Korean song, translations and Lyria audition prompts.

Run from the repository root:
  python productions/are-you-still-there/song/make_sheet.py

No provider calls. The exact per-take prompts live in prompts/.
"""
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
TITLE = {
    "ko": "형은 여기 있다",
    "en": "Your Brother Is Here",
    "id": "Kakak Ada di Sini",
    "zh": "哥在这里",
}

CHORUS = [
    ("민아, 아직 거기 있니", "Min, masihkah kau di sana?", "Min, are you still there?"),
    ("저녁밥 짓는 연기 아래", "Di bawah asap tungku makan malam", "Beneath the smoke of supper fires"),
    ("형 먼저 가라던 그 한마디", "Kata-katamu: Kak, pergilah dulu", "Those words of yours: Brother, go first"),
    ("아직도 나를 붙잡는구나", "Hingga kini masih menahanku", "Still hold me where I stood"),
    ("네가 없는 집은 집이 아니더라", "Tanpamu, rumah tak lagi terasa rumah", "Without you, home never felt like home"),
    ("동생아, 내 목소리 들리니", "Adikku, terdengarkah suaraku?", "Little brother, can you hear my voice?"),
]

SECTIONS = [
    ("intro", "Intro", "instrumental; a lone oboe over piano, dusk by the river", None),
    ("v1", "Verse 1", "present day; intimate, mature male solo", [
        ("해 질 무렵 그 강가에 서면", "Saat senja, aku berdiri di tepi sungai itu", "When I stand by that river at dusk"),
        ("저편 우리 마을에 불이 켜진다", "Lampu menyala di kampung kita di seberang", "Lights come on in our village across the water"),
        ("내 머리는 어느새 하얘졌는데", "Tanpa terasa rambutku telah memutih", "My hair has turned white before I knew it"),
        ("기억 속의 너는 아직 열아홉", "Dalam ingatanku, kau masih sembilan belas", "In my memory, you are still nineteen"),
    ]),
    ("pre1", "Pre-chorus 1", "strings rise, the memory approaches", [
        ("강바람에 갈대만 스쳐도", "Angin sungai baru menyentuh ilalang", "At the slightest river wind through the reeds"),
        ("내 이름 부르던 네 목소리", "Terdengar suaramu yang memanggil namaku", "I hear the voice that used to call my name"),
    ]),
    ("ch1", "Chorus 1", "a broad, unforgettable rising melody; full orchestra", CHORUS),
    ("v2", "Verse 2", "June 1950 remembered; quiet again, same lead singer", [
        ("장맛비 쏟아지던 그날 아침", "Pagi itu, hujan musim panas tercurah", "That morning when the monsoon rain poured down"),
        ("네 몫의 밥을 내 손에 쥐여 주고", "Kau letakkan jatah nasimu di tanganku", "You pressed your own share of rice into my hand"),
        ("내 손을 놓으며 웃던 그 얼굴", "Wajahmu tersenyum saat melepas tanganku", "That face that smiled as you let go of my hand"),
        ("내가 돌아선 뒤 울진 않았을까", "Setelah aku berpaling, mungkinkah kau menangis?", "After I turned away, did you perhaps begin to cry?"),
    ]),
    ("pre2", "Pre-chorus 2", "guilt builds into the refrain", [
        ("널 지키겠다던 형의 약속인데", "Kakaklah yang berjanji akan menjagamu", "It was your older brother's promise to protect you"),
        ("왜 네가 날 지켜야만 했나", "Mengapa justru kau yang harus menjagaku?", "Why did you have to be the one to protect me?"),
    ]),
    ("ch2", "Chorus 2", "the same chorus melody, more urgent and expansive", CHORUS),
    ("bridge", "Bridge", "piano and solo cello; almost a private question, then a long crescendo", [
        ("혹시 너도 이 노을을 보니", "Mungkinkah kau juga melihat lembayung ini?", "Could you be watching this same sunset?"),
        ("저녁이면 내 이름을 부르니", "Saat senja, apakah kau memanggil namaku?", "When evening comes, do you call my name?"),
        ("살아서 집에 가라던 네 말에", "Karena katamu: Hiduplah, pulanglah", "Because you told me to stay alive and go home"),
        ("난 오늘도 살아 여기 서 있다", "Hari ini aku masih hidup, berdiri di sini", "I am alive and standing here again today"),
    ]),
    ("lift", "Orchestral lift", "instrumental; strings and horns carry the refrain into the final chorus", None),
    ("ch3", "Final chorus", "the chorus melody returns at its largest; grief and love, unresolved", [
        ("민아, 아직 거기 있니", "Min, masihkah kau di sana?", "Min, are you still there?"),
        ("형은 여기서 널 기다린다", "Kakak menunggumu di sini", "Your brother is waiting for you here"),
        ("늦어서 미안하다, 내 동생아", "Maaf aku terlambat, adikku", "I am sorry I am so late, my little brother"),
        ("이번엔 형이 남아 있을게", "Kali ini, biar kakak yang tinggal", "This time your brother will stay behind"),
        ("해가 지면 춥다, 내 동생아", "Selepas matahari terbenam, dingin, adikku", "It gets cold after sunset, my little brother"),
        ("집에 가자, 우리 함께 가자", "Mari pulang, kita pulang bersama", "Let us go home; let us go together"),
    ]),
    ("outro", "Outro", "orchestra falls away; the same man alone, no reply", [
        ("대답 없는 강 위로 해는 저물고", "Matahari tenggelam di atas sungai yang tak menjawab", "The sun goes down over the river that gives no answer"),
        ("민아, 형은 여기 있다", "Min, kakak ada di sini", "Min, your brother is here"),
    ]),
]

COMMON = """An original Korean-language orchestral ballad, sung entirely in Korean. This is a complete melodic song, approximately 3 minutes 40 seconds to 4 minutes long, with verses, a clearly recurring chorus, a bridge and an intentional ending. Sing every supplied lyric line in order, including both full six-line choruses and the changed final chorus. The section headings are arrangement directions and must not be sung.

Story: Cheol, an older Korean man with white hair, stands beside a river at dusk, many years after the Korean War separated him from his younger blood brother Min. Min was nineteen when he told his older brother to cross the bridge first and stay alive. The older brother survived; he still does not know whether Min is alive. The present-day sunset and village lights give way to memories of monsoon rain, a shared rice ball and a hand letting go. This is love for a family broken apart, the older brother's regret and an unanswered hope. The last chorus reverses the old farewell: this time the older brother will stay and wait. There is no reunion and no answer from the younger brother.

Voice: ONE mature male soloist throughout, a warm, resonant baritone with an open, ringing upper register. Tender low verses, clear natural Korean diction, and a soaring melodic belt in the choruses. He sings with long legato phrases, controlled vibrato and human vulnerability. Build the intensity without losing pitch or turning the melody into shouted declamation. A younger voice must not answer him. No second lead, no rap and no spoken narration. A quiet wordless choir may support only the very last climax, with the lead words always clear.

Melody and harmony: the heart of the composition is a beautiful, memorable, fully sung chorus. Give '민아, 아직 거기 있니' a rising, sustained melodic arch that returns recognizably in every chorus. Let the question reach out across the river. Spacious minor-key verses, rich functional chord changes, suspensions, aching major-key warmth within the refrain and a strong melodic release. Leave breaths between lyric lines. The final chorus carries the same tune with new words. End alone and unresolved in feeling, with a complete musical ending.

Orchestra: a full symphony orchestra, divided violins and violas, deep cellos, double basses, French horns, warm woodwinds, grand piano, concert harp, restrained timpani and suspended cymbal swells. A lone oboe and solo cello carry the remembered tenderness. A faint daegeum colour may appear as a distant breath. The orchestra must grow in moving counterlines beneath the vocal melody. The choruses sound majestic, spacious and overwhelming, yet the singer stays close and intelligible. The final domestic words '해가 지면 춥다' are sung with tenderness, not military triumph.

Structure: short instrumental opening; intimate present-day verse; rising pre-chorus; full first chorus; pull back for the June-rain memory; pre-chorus and second chorus; strip down for the bridge; a short orchestral lift; the largest final chorus; then return to the solitary older brother for the two-line outro. Honour every section. Finish with piano and one sustained cello or oboe note fading naturally after the last sung word.

Production: warm cinematic concert-hall depth, wide real-sounding orchestra, dynamic and clear lead, no electronic dance pulse, no marching snare, no heroic military march, no rock guitar and no sound effects. A heartbreaking Korean family lament, majestic in musical scale and intimate in the words.
"""

VARIANTS = {
    "t1": {
        "label": "The River at Dusk",
        "direction": "The principal version: a grand Korean orchestral drama ballad in a slow 4/4, around 70 BPM. Begin with piano, oboe and low strings. The chorus opens into an especially strong, singable melodic lift, driven by flowing strings and noble French horns. Give each chorus an unmistakable peak and breathing space afterwards. A half-step lift may heighten the last chorus, followed by a deeply quiet outro. Large and majestic, with a warm, weathered male lead.",
    },
    "t2": {
        "label": "A Brother's Evening Prayer",
        "direction": "A broad, swaying 6/8 orchestral lament, dotted-quarter pulse around 52 BPM. A simple piano figure, solo cello and oboe open the song. Let the verse sound like an older brother quietly calling a familiar name. The chorus has a huge lyrical sweep over rolling harp and string arpeggios, with singing countermelodies and deeply resonant horns. The climax comes from harmonic release and a long high vocal line. Keep the first two choruses restrained enough to make the final one devastating. Elegiac, melodic and warm, ending with one lonely voice.",
    },
    "t3": {
        "label": "The Promise Across the Water",
        "direction": "The most expansive symphonic version: an unhurried 4/4 Korean orchestral power ballad, around 66 BPM, with an immediately memorable rising chorus. Piano and strings introduce the tune, a resonant baritone begins intimately, and each section opens the orchestra further. Use soaring violins, answering cello lines, full French horns and orchestral timpani rolls. Keep the rhythm orchestral, with no marching or pop backbeat. The bridge drops to piano and voice; a luminous whole-step modulation launches the final chorus, with a soft wordless choir deep behind the soloist. End with the solo singer alone and the river's unanswered question.",
    },
}


LAMENT_BRIEF = """Compose an ORIGINAL, deeply melodic Korean symphonic lament, sung in Korean, approximately three minutes long. One male soloist with a warm dark lower register and a ringing lyrical upper register. The singer is Cheol, an older brother at dusk, looking across a river for the little brother lost to him in the war. The lyrics are accepted: sing every supplied line, in order, with clear Korean diction. Nobody answers him.

COMPOSITION FIRST: Write one beautiful, immediately memorable tragic theme. State its melody clearly on piano and cellos in the opening, before any words, and let the orchestra recall it between vocal phrases. The first two lines of every chorus form a simple, balanced four-bar hook: a short call on '민아', a rest, then the longer pleading question '아직 거기 있니'. Repeat that hook recognizably in all three choruses. Use a decisive interval, a sustained high note and a falling, sighing answer; make the melody easy to hum after one hearing. Develop the rest of the chorus as an answering phrase with a real cadence. Sing the verse on a tune too; leave the chorus a larger register and a stronger rhythmic identity.

HARMONY: Sustain a minor-key tragic identity. Use a moving descending bass, rich inversions, minor subdominant, half-diminished approach chords, dominant flat-nine tension and appoggiaturas that resolve a beat late. At the question, hold the harmony on a suspension or half cadence; let the following phrase release it. Follow the take's chord roadmap below as closely as musically possible. The orchestra must express yearning through changing harmony and an independently singing cello line. A swell alone is not the emotional event. Brief major-colour memories return to the minor present; do not turn the refrain into a cheerful victory anthem. Keep the final chorus in the same key and make its return hurt through melodic recognition and orchestral development.

SOUND AND ARC: Full symphonic strings, grand piano, lyrical cellos, oboe and French horns, supported by harp and restrained orchestral timpani. Warm concert-hall depth. The intro and first verse are tender, the chorus is sweeping and fully melodic, the second verse remembers the June rain, the bridge pulls back, and the last chorus is the largest statement of the same theme. Return to a solo, quiet two-line ending and a complete instrumental cadence. Natural legato, clear pitch, expressive controlled vibrato. No speech-like reciting, sobbing sound effects, second lead, marching snare, drum-kit backbeat, rock guitar or electronic pulse. The scale is majestic; the emotion is the pain of an irretrievable family life.

This is a new composition with its own tune, rhythm and orchestration, not a quotation or recreation of an existing film theme. Section headings are directions, not sung words.
"""

VARIANTS.update({
    "t4": {
        "label": "The Uncrossed River",
        "round": 2,
        "direction": "D minor, broad adagio 4/4 around 68 BPM. Chorus harmonic roadmap, one bar per cell: Dm(add9) | Dm/C | Bbmaj7 | A7sus4-A7 | Gm(add9) | Dm/F | Em7b5-A7(b9) | Dm(add9). The first four bars carry the title call and its answer. Let the bass descend D-C-Bb-A beneath a strongly shaped lyrical vocal arch. At '거기 있니', suspend the voice above the dominant before resolving. Repeat the initial call rhythm in the next phrase and give '동생아' an aching, clear cadential answer. Piano and cellos establish this original tune in the intro; broad violins and horns take it up in the chorus. A warm high baritone or lyric tenor, fully sung and never breathlessly whispered.",
    },
    "t5": {
        "label": "The Promise I Could Not Keep",
        "round": 2,
        "direction": "G minor, an unhurried 4/4 around 72 BPM, with the most incisive vocal hook. Chorus harmonic roadmap: Gm | D/F# | Gm/F | C/E | Cm/Eb | Gm/D | Am7b5-D7(b9) | Gm(add9). The bass moves G-F#-F-E-Eb-D: a warm remembered chord darkens as C major becomes C minor. Give '민아' the same short two-note call every time, then let '아직 거기 있니' rise into one long pleading note and fall in a small sigh. The answering phrase must be equally singable. A clear resonant male lyric tenor, legato strings and a cello countermelody. Keep grief in the chord movement, with breadth and a strong refrain rather than a pop groove. The bridge's question about the same sunset starts almost alone; the exact hook returns over the full orchestra in the final chorus.",
    },
    "t6": {
        "label": "Your Brother Is Here",
        "round": 2,
        "direction": "C minor, a very lyrical 6/8 symphonic elegy around dotted-quarter 48 BPM. Chorus roadmap: Cm(add9) | Abmaj7 | Fm(add9) | G7sus4-G7 | Cm/Bb | Abmaj7 | Dm7b5-G7(b9) | Cm(add9). Set the first two lyric lines as a memorable four-bar question: repeat the name-call rhythm, open into a broad rising melodic arc, then let it fall against a suspended dominant. Rocking piano and cello figures support the melody with changing bass and expressive suspensions. The theme should sound like a remembered song of home, clear and beautiful even on solo piano. On its orchestral return the same tune becomes tragic. One warm, ringing male lead; the last domestic plea is tender. No triumphant key change; let the same melody and minor cadence carry the final climax, then the solitary outro.",
    },
})

ROUND_TWO_NOTES = {
    "intro": "instrumental; state the original chorus theme clearly on piano and cellos",
    "ch1": "the recurring four-bar title hook and a strong answering melodic phrase; minor-key lament",
    "ch2": "repeat the same chorus melody recognizably, with a developing cello countermelody",
    "lift": "instrumental; recall the original theme, remain in the same key",
    "ch3": "the same chorus tune with the changed final words; full symphonic lament, no reply",
}


EPILOGUE_BRIEF = """An original Korean vocal ballad with the sweeping, tragic end-credit feeling of the EPILOGUE cue from Taegukgi: The Brotherhood of War, Lee Dong June, 2004. The reference is Epilogue: retrospective family love, remembered tenderness and an overwhelming return of a lyrical theme. Create a new melody, not a quotation of the soundtrack. A complete song of approximately three minutes, sung by one expressive Korean male lead with a warm lower register and a ringing upper register.

COMPOSE THE CHORUS FIRST. It must be the strongest, most memorable tune in the song. '민아, 아직 거기 있니' is one distinct two-bar hook: a short name-call, a breath, then a broad pleading melodic answer. Give it a clear rhythm, an expressive interval and a sustained vowel at the peak. The next line answers it in another two bars. Let the remaining lines build to a satisfying, singable cadence. Repeat the SAME hook melody and rhythm in all three choruses, including the changed final chorus. State that original hook clearly on piano or solo cello in the intro. Give the verses a simpler, lower melody so the chorus has room to open. Use the take's original melodic seed or contour below as a starting point and develop it musically. The melody should carry the song on piano and voice alone.

The orchestra supports the tune: long singing violin phrases, a moving cello countermelody, grand piano, French horns, oboe, harp and restrained timpani and cymbal swells. Warm symphonic depth, natural legato and clear Korean diction. Let tender major-colour memories and painful minor resolutions create emotional contrast. Suspensions resolve late; the bass and chords move beneath held vocal notes. The final chorus is a full, majestic return of a tune we already love, followed by a solitary, quiet ending. Keep the lead fully melodic, with clear sustained pitch; no speech-like reciting, second lead, marching snare, pop drum backbeat or electronic production.

Cheol is the older blood brother, many years after the war. At dusk he calls across the river for Min, who is still nineteen in his memory. The June rain and the rice ball interrupt the present-day sunset. He should have protected Min; Min protected him instead. Perhaps his little brother is still on the other bank. Nobody answers. Sing every supplied Korean lyric line in its given order, without additional words. All section labels and musical directions are unsung.
"""

VARIANTS.update({
    "t7": {
        "label": "A Name Across the River",
        "round": 3,
        "reference": "Taegukgi - Epilogue",
        "direction": "D minor, broad lyrical 4/4, around 72 BPM. Give the opening title line an original eight-note seed: D4-A4-F4-E4 | G4-F4-E4-D4, one pitch per sung syllable of '민 아 아 직 거 기 있 니'. The leap on the name and the falling answer make the hook; stretch it naturally over two bars, with a breath after the name. It is a guide for a beautiful tune, not a mechanical scale exercise. Repeat its rhythm and contour exactly when the refrain returns. The second line is a related rising answer. Use Dm(add9)-Bbmaj7-Gm9-A7sus4/A7, with inversions and an aching dominant preparation before the chorus. Grand legato strings and French horns broaden the tune; the singer remains clear, tender and direct. The final chorus is emotionally open and majestic, then falls back to the lone brother.",
    },
    "t8": {
        "label": "The Evening Call",
        "round": 3,
        "reference": "Taegukgi - Epilogue",
        "direction": "C minor, a gently swaying 6/8 symphonic lament, dotted-quarter around 50 BPM. Retain a broad rocking sadness but make the chorus melody much more definite. Original title-hook seed, eight syllables: G3-C4-D4-Eb4 | G4-F4-Eb4-D4. A short pickup rises into the name, climbs into a long pleading note and falls to an unresolved question; the next line completes the phrase. Repeat this recognizably in all choruses. Let Cm(add9)-Abmaj7-Fm9-G7(b9) support the hook, with descending bass and late suspensions. Piano and cello introduce the hook alone, then the voice inherits it. Let the violin melody and horn counterline answer the lead between phrases, with the full Epilogue-like retrospective sweep in the final refrain. One warm, ringing male singer, and an unanswered, intimate outro.",
    },
    "t9": {
        "label": "The Home We Remember",
        "round": 3,
        "reference": "Taegukgi - Epilogue",
        "direction": "A broad 4/4 end-credit ballad, around 68 BPM, in F major with a D-minor shadow. The melody recalls the beautiful home life the brothers should have shared. Give '민아' a repeated, unmistakable two-note calling figure; the rest of the title line rises in a long singing arc, then falls with a small sigh. Let the answering line repeat that rhythmic identity so the chorus is immediately memorable. Harmonic colour: F-C/E-Dm-Am/C-Bbmaj7-Bbm6-F/A/C7-Dm(add9). The borrowed minor subdominant and the deceptive minor landing make the warm memory hurt. This is tenderness and loss, not a victory fanfare. A lyrical tenor or high baritone, luminous strings and French horns; develop the same theme into the largest final chorus. The sorrow comes from hearing that beautiful tune return while the brother remains absent. End quietly with Cheol alone.",
    },
})

ROUND_THREE_NOTES = {
    "intro": "instrumental; clearly introduce the original title-hook melody on piano or cello",
    "v1": "present day; a simple, lower melodic verse, leaving room above for the chorus",
    "pre1": "harmonic preparation; leave a breath before the title hook",
    "ch1": "the strongest, most memorable tune; the recurring two-bar title hook and its melodic answer",
    "pre2": "the guilt grows; prepare a clear return of the refrain",
    "ch2": "repeat the SAME strong hook and answering tune, with developing strings",
    "lift": "instrumental; recall the original title hook and prepare its final return",
    "ch3": "same hook tune with the final words; majestic retrospective sweep, no answering voice",
    "outro": "the same singer alone; a tender fully sung ending, with no reply",
}


def write_json(path, data):
    path.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")


def main():
    sections, lines, prompt_lines, round_two_lines, round_three_lines, lyric_text, suno_lines = [], [], [], [], [], [], []
    for sid, label, note, rows in SECTIONS:
        sec = {"id": sid, "label": label, "note": note}
        prompt_lines.append(f"[{label} - {note}]")
        round_two_lines.append(f"[{label} - {ROUND_TWO_NOTES.get(sid, note)}]")
        round_three_lines.append(f"[{label} - {ROUND_THREE_NOTES.get(sid, note)}]")
        suno_lines.append(f"[{label}]")
        lyric_text.append(f"## {label}\n")
        if rows:
            sec["lines"] = [{"who": "cheol", "ko": ko, "id": ind, "en": en} for ko, ind, en in rows]
            lines.extend({"section": sid, **ln, "sung": ln["ko"]} for ln in sec["lines"])
            prompt_lines.extend(ln["ko"] for ln in sec["lines"])
            round_two_lines.extend(ln["ko"] for ln in sec["lines"])
            round_three_lines.extend(ln["ko"] for ln in sec["lines"])
            suno_lines.extend(ln["ko"] for ln in sec["lines"])
            for ko, ind, en in rows:
                lyric_text.extend([f"**{ko}**  ", f"{en}  ", f"{ind}\n"])
        else:
            lyric_text.append("*Instrumental.*\n")
        sections.append(sec)
        prompt_lines.append("")
        round_two_lines.append("")
        round_three_lines.append("")
        suno_lines.append("")
    write_json(HERE / "lyrics.json", {
        "title": TITLE, "sung": "ko", "subs": ["id", "en"],
        "voices": {"cheol": {"name": "Cheol", "voice": "one mature male baritone with a warm, resonant low register and a ringing upper register", "heard": "male", "part": "the older blood brother, many years after the separation"}},
        "about": "At dusk, an older man looks across the river towards home and calls the little brother he has not seen since the war. A companion to Brother, Go First.",
        "sections": sections,
    })
    write_json(HERE / "lines.json", lines)
    write_json(HERE / "variants.json", VARIANTS)
    (HERE / "brief.txt").write_text(EPILOGUE_BRIEF + "\nTAKE DIRECTION: " + VARIANTS["t7"]["direction"] + "\n", encoding="utf-8")
    (HERE / "prompts").mkdir(exist_ok=True)
    lyrics = "\n".join(prompt_lines).strip() + "\n"
    round_two_lyrics = "\n".join(round_two_lines).strip() + "\n"
    round_three_lyrics = "\n".join(round_three_lines).strip() + "\n"
    for take, variant in VARIANTS.items():
        round_no = variant.get("round", 1)
        brief = {1: COMMON, 2: LAMENT_BRIEF, 3: EPILOGUE_BRIEF}[round_no]
        take_lyrics = {1: lyrics, 2: round_two_lyrics, 3: round_three_lyrics}[round_no]
        prompt = brief + "\nTAKE DIRECTION: " + variant["direction"] + "\n\nLyrics:\n\n" + take_lyrics
        (HERE / "prompts" / f"{take}.txt").write_text(prompt, encoding="utf-8")
        if take == "t7":
            (HERE / "prompt.txt").write_text(prompt, encoding="utf-8")
    (HERE / "lyrics.md").write_text(
        f"# {TITLE['ko']} · {TITLE['en']}\n\n{TITLE['id']}\n\n"
        "Cheol sings every line. Min does not answer. English and Indonesian translations follow each Korean line.\n\n"
        + "\n".join(lyric_text) + "\n", encoding="utf-8")
    (HERE / "suno-lyrics.txt").write_text("\n".join(suno_lines).strip() + "\n", encoding="utf-8")
    (HERE / "suno-style.txt").write_text(
        "Majestic, deeply melodic Korean orchestral ballad. One mature male baritone, warm low verses and a ringing, sustained upper register. "
        "A solitary older brother calls his missing younger brother across a river at dusk, decades after a war separated them. "
        "Grand piano, solo cello and oboe, divided symphonic strings, French horns, harp, restrained timpani and cymbal swells. "
        "An original recurring tragic theme, stated first on piano and cellos. A simple four-bar chorus hook, repeated recognizably. "
        "Minor-key harmony, descending lament bass, minor subdominant, half-diminished approaches and dominant flat-nine tension. "
        "Intimate melodic verses, late-resolving suspensions and a large, memorable refrain. "
        "Pull back for the memory of June rain, then build to an immense final chorus and return to a quiet, unanswered ending. "
        "Natural Korean diction, long legato lines, controlled vibrato, family love and regret. Same-key final chorus, a solitary ending. "
        "No second lead, spoken narration, marching snare or electronic beat.\n", encoding="utf-8")
    print(f"{len(lines)} sung lines, {len(VARIANTS)} audition prompts; no audio generated")


if __name__ == "__main__":
    main()
