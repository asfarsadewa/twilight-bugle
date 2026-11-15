"""Import the chosen Suno recording and build lyric/translation sources. No model calls."""
from pathlib import Path
import argparse, hashlib, json, re, shutil, subprocess
from pypinyin import lazy_pinyin, Style

SONG=Path(__file__).resolve().parent
TITLE={'zh':'你给我的星空','en':'The Sky You Gave Me','id':'Langit yang Kauberikan'}

EN=[
'When you came home, the sky was already dark',
'Coal dust still clung between your fingers',
'You gently opened my little hand',
'Stroke by stroke, you drew a sky full of stars',
'You said every star had a story of its own',
'I listened until I drifted into dreams',
'You said, Dad’s road runs deep into the mountain',
'Yours must lead towards the light',
'The starry sky you gave me',
'Shines through every dream I have',
'In a place without starlight',
'You held up the heavens above my head',
'Dad, hold my hand tightly',
'As you held mine back then',
'The sky you once drew for me',
'Let me tell you about it, slowly',
'After the mine collapsed, the light was still on',
'But you could no longer see my face',
'I said, Dad, I’m not going away to study',
'You put my acceptance letter back beside my hand',
'Later, I had my first telescope',
'You learned to cross the long street with a cane',
'On graduation day, I placed my certificate in your hands',
'You felt its embossed seal again and again',
'I learned more and more of the stars above',
'You listened and remembered them, one by one',
]
EN+=EN[8:16]
EN += [
'Tonight, the stars slowly light up',
'The best seat is reserved for you',
'People applaud this sky full of stars',
'You ask me how brightly they shine',
'The applause fades; every other seat is empty',
'I switch off the stars and sit beside you again',
]
EN+=EN[8:13]+['This time, let me lead you',EN[14],'Tonight, that sky is in your hands again']
EN += ['I open your two aged hands','Star by star, I draw for you','Dad, the story of this star—','We can tell it slowly']

ID=[
'Saat Ayah pulang, langit sudah gelap',
'Debu batu bara masih melekat di sela jarimu',
'Kaubuka tangan kecilku dengan lembut',
'Gores demi gores, kaulukis langit penuh bintang',
'Katamu, tiap bintang punya kisahnya sendiri',
'Aku mendengarkan hingga terlelap dalam mimpi',
'Katamu, jalan Ayah jauh di dalam gunung',
'Jalanmu harus menuju tempat yang terang',
'Langit penuh bintang pemberianmu',
'Bersinar dalam setiap mimpiku',
'Di tempat tanpa cahaya bintang',
'Kautopang langit di atas kepalaku',
'Ayah, genggam erat tanganku',
'Seperti saat kaugenggam tanganku dulu',
'Langit yang pernah kaulukiskan untukku',
'Biar kuceritakan perlahan kepadamu',
'Setelah tambang runtuh, lampunya masih menyala',
'Namun Ayah tak lagi dapat melihat wajahku',
'Kataku, Ayah, aku tak jadi pergi kuliah',
'Kauletakkan lagi surat penerimaan itu di sisi tanganku',
'Kemudian aku memiliki teleskop pertamaku',
'Ayah belajar menyusuri jalan dengan tongkat',
'Saat wisuda, kuserahkan ijazahku ke tanganmu',
'Segel timbulnya kauraba berkali-kali',
'Makin banyak bintang di langit yang kukenal',
'Kaudengarkan dan kauingat satu per satu',
]
ID+=ID[8:16]
ID += [
'Malam ini, bintang-bintang perlahan menyala',
'Tempat duduk terbaik kusediakan untukmu',
'Orang-orang bertepuk tangan untuk langit ini',
'Kautanya kepadaku, seberapa terang bintang-bintang itu',
'Tepuk tangan reda, kursi-kursi lainnya telah kosong',
'Kumatikan bintang-bintang, lalu duduk lagi di sisimu',
]
ID+=ID[8:13]+['Kali ini, biarkan aku yang menuntunmu',ID[14],'Malam ini, langit itu kembali di tanganmu']
ID += ['Kubuka kedua tanganmu yang telah menua','Satu per satu, kulukiskan bintang untukmu','Ayah, kisah bintang yang ini—','Kita ceritakan perlahan saja']

LABELS=[('intro','Intro'),('v1','Verse 1'),('pre1','Pre-Chorus'),('ch1','Chorus'),('v2','Verse 2'),('pre2','Pre-Chorus'),('ch2','Chorus'),('bridge','Bridge'),('lift','Orchestral Interlude'),('ch3','Final Chorus'),('outro','Outro')]

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--source',type=Path,default=Path('C:/Users/asfar/Downloads/你给我的星空 (1).mp3'));ap.add_argument('--take',default='suno-final-corrected');a=ap.parse_args()
 SOURCE=a.source;TAKE=SONG/'takes'/a.take
 info=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_format','-show_streams','-of','json',str(SOURCE)],encoding='utf-8'))
 tags=info['format'].get('tags',{})
 embedded=tags.get('lyrics-eng','')
 canonical=(SONG/'suno-lyrics.txt').read_text(encoding='utf-8')
 clean=lambda x:[re.sub(r'[^㐀-鿿]','',s) for s in x.splitlines() if s.strip() and not s.startswith('[')]
 assert clean(embedded)==clean(canonical),'Embedded lyrics differ from the handoff; inspect before importing.'
 digest=hashlib.sha256(SOURCE.read_bytes()).hexdigest()
 TAKE.mkdir(parents=True,exist_ok=True)
 for name in ['original.mp3','take.mp3']:
  dest=TAKE/name
  if dest.exists() and hashlib.sha256(dest.read_bytes()).hexdigest()!=digest:raise ValueError('Preserve the existing take before importing a different source.')
  shutil.copyfile(SOURCE,dest)
 if not (TAKE/'original.wav').exists():
  subprocess.run(['ffmpeg','-v','error','-n','-i',str(SOURCE),'-map','0:a:0','-c:a','pcm_s16le',str(TAKE/'original.wav')],check=True)
 receipt={'take':a.take,'provider':'Suno','source_name':SOURCE.name,'title':TITLE,'duration_seconds':float(info['format']['duration']),'sha256':digest,'selected_by':'user','musical_earcheck':'human producer','source_suno_id':re.search(r'id=([0-9a-f-]+)',tags.get('comment','')).group(1),'embedded_lyric_match':True}
 for path in [TAKE/'request.json',SONG/'master-source.json']:path.write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
 (TAKE/'embedded-lyrics.txt').write_text(embedded,encoding='utf-8')
 sections=[]; current=None; tag_index=0; rows=[]
 for text in canonical.splitlines():
  if not text.strip():continue
  if text.startswith('[Instrumental:'):continue
  if text.startswith('['):
   sid,label=LABELS[tag_index];tag_index+=1;current={'id':sid,'label':label,'lines':[]};sections.append(current);continue
  n=len(rows);py=' '.join(lazy_pinyin(text,style=Style.TONE));py=re.sub(r'\s+([，。！？、])',r'\1',py)
  row={'section':current['id'],'who':'daughter','zh':text,'py':py,'en':EN[n],'id':ID[n],'sung':text}
  rows.append(row);current['lines'].append({k:v for k,v in row.items() if k not in ['section','sung']})
 assert len(rows)==len(EN)==len(ID)==52
 sheet={'title':TITLE,'sung':'zh','subs':['id','en'],'voices':{'daughter':{'name':'Daughter','heard':'female','voice':'one adult female Mandarin lead','part':'the miner’s daughter, now an astronomer'}},'about':'A miner’s daughter becomes an astronomer. After his loss of sight, she brings the stars back to his palm.','sections':sections}
 for path,value in [(SONG/'lyrics.json',sheet),(SONG/'lines.json',rows),(TAKE/'lines.json',rows)]:path.write_text(json.dumps(value,ensure_ascii=False,indent=1)+'\n',encoding='utf-8')
 (SONG/'lyrics.md').write_text('# 你给我的星空\n\n'+ '\n\n'.join(f"**{r['zh']}**\n\n{r['py']}\n\n{r['en']}\n\n{r['id']}" for r in rows)+'\n',encoding='utf-8')
 print(f"Imported {SOURCE.name}, {receipt['duration_seconds']:.3f}s; 52 embedded lyric lines match. SHA256 {digest}")

if __name__=='__main__':main()
