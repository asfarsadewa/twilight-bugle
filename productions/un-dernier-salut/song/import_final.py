"""Import the producer's supplied French recording. No music generation or listening model."""
from pathlib import Path
import argparse, hashlib, json, re, shutil, subprocess, unicodedata

SONG=Path(__file__).resolve().parent
EN='''Tonight, the light belongs to me
Tomorrow, they will fold away the roof
I want my final bow to be perfect
Not your broom, not your pirouettes
I make the dust dance
Dreaming of a little light
My foot catches in the old curtain
And here I am, inside your solo
One, two, three, keep the rhythm
One, two, three, keep your distance
One, two, three, I do my best
But your stool is dancing for two
One step for you, one step for me
Each in our place, each by our rules
Turn, turn, one more turn
Move aside now, it is my turn
As long as a piece of floor remains
There is still a world to set dancing
One last turn, one last bow
For this theatre that will never open again
The wind rushes beneath the canvas
Our scenery sails away
The ladder slips, the bench rolls off
I run after it—come back here
The great support is falling towards you
Take my hand, jump towards me
The step breaks beneath my feet
There is nothing left to hold me up
Catch the end of your ribbon
I am holding you; take your time
If I lean, you slip as well
So we count, and follow each other
One step towards you, one towards me
Keep your balance, listen to my voice
Turn, turn, one more turn
Lean with me, each in our turn
As long as a piece of floor remains
There is still a world to set dancing
One last turn, one last bow
For this theatre that will never open again
I knew how to bow before crowds
To turn without ever missing a step
But when the whole theatre falls apart
My finest steps lead me back to you
I spent my life in the wings
Picking up the flowers for you
I am afraid too, but when you slip
My two hands know how to be there
One step towards you, one towards me
Turn with me, stay with me
Turn, turn, one more turn
The day can wait its turn
As long as a piece of floor remains
There is still a world to set dancing
One last turn, one last bow
For this theatre that will never open again
I will return to the wings
With my broom, without a sound
Put it down. Stay beside me
Tonight, the bow will be for you
One last turn, one last bow…'''.splitlines()
ID='''Malam ini, cahaya itu milikku
Besok, atap ini akan dilipat
Kuingin salam terakhirku sempurna
Bukan sapumu, bukan putaranmu
Aku membuat debu menari
Sambil bermimpi mendapat sedikit cahaya
Kakiku tersangkut tirai tua
Dan kini aku masuk ke tarian solomu
Satu, dua, tiga, ikuti irama
Satu, dua, tiga, jaga jarakmu
Satu, dua, tiga, aku berusaha
Tapi bangkumu menari untuk berdua
Selangkah untukmu, selangkah untukku
Masing-masing tempat, masing-masing aturan
Berputar, berputar, sekali lagi
Minggirlah, kini giliranku
Selama masih tersisa sepotong lantai
Masih ada dunia yang bisa kita ajak menari
Satu putaran terakhir, satu salam terakhir
Untuk teater yang tak akan dibuka lagi
Angin menerobos ke bawah kanvas
Dekorasi kita berlayar entah ke mana
Tangga tergelincir, bangku meluncur pergi
Kukejar semuanya—kembalilah
Penyangga besar itu jatuh ke arahmu
Raih tanganku, lompatlah ke arahku
Anak tangga patah di bawah kakiku
Tak ada lagi tempatku bertumpu
Tangkap ujung pitamu
Kutahan dirimu, pelan-pelan saja
Jika aku condong, kau juga tergelincir
Maka kita berhitung dan saling mengikuti
Selangkah ke arahmu, selangkah ke arahku
Jaga keseimbangan, dengarkan suaraku
Berputar, berputar, sekali lagi
Condonglah bersamaku, bergantian
Selama masih tersisa sepotong lantai
Masih ada dunia yang bisa kita ajak menari
Satu putaran terakhir, satu salam terakhir
Untuk teater yang tak akan dibuka lagi
Aku pandai memberi salam pada penonton
Berputar tanpa pernah salah langkah
Namun saat seluruh teater ini runtuh
Langkah terbaikku membawaku kembali padamu
Seumur hidup aku di balik panggung
Memunguti bunga-bunga untukmu
Aku juga takut, tapi saat kau tergelincir
Kedua tanganku tahu harus ada di sana
Selangkah ke arahmu, selangkah ke arahku
Berputarlah bersamaku, tetap di sisiku
Berputar, berputar, sekali lagi
Biarlah esok menunggu gilirannya
Selama masih tersisa sepotong lantai
Masih ada dunia yang bisa kita ajak menari
Satu putaran terakhir, satu salam terakhir
Untuk teater yang tak akan dibuka lagi
Aku akan kembali ke balik panggung
Bersama sapuku, tanpa suara
Taruh di sana. Tetaplah bersamaku
Malam ini, salam itu untukmu
Satu putaran terakhir, satu salam terakhir…'''.splitlines()
IDS=['intro','v1f','v1m','pre1f','pre1m','ch1','dance','v2m','v2f','pre2m','pre2f','ch2','rescue','bridgef','bridgem','ch3','farewell','outrom','outrof','outro','curtain']

def write(p,x):
 if p.name=='master-source.json' and p.exists():
  old=json.loads(p.read_text(encoding='utf-8'))
  if old.get('sha256')==x.get('sha256') and 'producer_source_confirmation' in old:x['producer_source_confirmation']=old['producer_source_confirmation']
 p.write_text(json.dumps(x,ensure_ascii=False,indent=1)+'\n',encoding='utf-8')
def norm(s):return ''.join(c for c in unicodedata.normalize('NFKD',s.lower()) if c.isalpha())

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--source',type=Path,default=Path('C:/Users/asfar/Downloads/Un dernier salut.mp3'));a=ap.parse_args()
 info=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_format','-of','json',str(a.source)],encoding='utf-8'))
 tags=info['format']['tags'];embedded=tags.get('lyrics-eng','')
 canonical=(SONG/'suno-lyrics.txt').read_text(encoding='utf-8')
 clean=lambda t:[norm(s) for s in t.splitlines() if s.strip() and not s.startswith('[')]
 assert clean(embedded)==clean(canonical),'Supplied recording lyrics differ; inspect before importing'
 sections=[];rows=[]
 for raw in canonical.splitlines():
  s=raw.strip()
  if not s:continue
  if s.startswith('['):
   sid=IDS[len(sections)];who='dancer' if 'Female' in s else 'clown' if 'Male' in s else 'both'
   sections.append({'id':sid,'label':s[1:-1],'lines':[]})
  else:
   i=len(rows);row={'section':sid,'who':who,'sung':s,'fr':s,'en':EN[i],'id':ID[i]}
   rows.append(row);sections[-1]['lines'].append(row)
 assert len(rows)==len(EN)==len(ID)==61
 take=SONG/'takes/suno-final';take.mkdir(parents=True,exist_ok=True)
 digest=hashlib.sha256(a.source.read_bytes()).hexdigest()
 if (take/'take.mp3').exists():assert hashlib.sha256((take/'take.mp3').read_bytes()).hexdigest()==digest,'Take already owns another source'
 for name in ['take.mp3','original.mp3']:shutil.copy2(a.source,take/name)
 if not (take/'original.wav').exists():subprocess.run(['ffmpeg','-v','error','-i',str(a.source),'-map','0:a:0','-ar','48000',str(take/'original.wav')],check=True)
 voices={'dancer':{'name':'La danseuse','voice':'adult female mezzo-soprano'},'clown':{'name':'Le clown','voice':'adult male baritone'},'both':{'name':'Ensemble','voice':'duet'}}
 write(SONG/'lyrics.json',{'title':{'fr':'Un dernier salut','en':'One Last Bow','zh':'最后的谢幕','id':'Salam Terakhir'},'sung':'fr','voices':voices,'sections':sections})
 for p in [SONG/'lines.json',take/'lines.json']:write(p,rows)
 write(take/'request.json',{'duration_seconds':float(info['format']['duration']),'source':'producer-supplied Suno recording','model':None,'musical_earcheck':'human producer'})
 write(SONG/'master-source.json',{'take':'suno-final','source_path':str(a.source),'sha256':digest,'bytes':a.source.stat().st_size,'duration_seconds':float(info['format']['duration']),'suno_comment':tags.get('comment'),'embedded_lyrics':embedded,'section_tag_note':'Supplied file embeds the older instrumental tags. Sung words match the revised handoff. Tags do not establish the actual musical mood. Human producer gives the final earcheck.','voice_assignment':'Intended roles from lyric sheet; not an automatic voice audit.'})
 (SONG/'lyrics.md').write_text('# Un dernier salut\n\nFrench source lyrics; Indonesian and English translations in lines.json.\n\n'+canonical,encoding='utf-8')
 print(json.dumps({'source':str(a.source),'sha256':digest,'seconds':info['format']['duration'],'lines':len(rows)},ensure_ascii=False))
if __name__=='__main__':main()
