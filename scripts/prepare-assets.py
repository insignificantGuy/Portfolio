from pathlib import Path
import json, shutil
from PIL import Image, ImageDraw, ImageFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, ListFlowable, ListItem
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from pypdf import PdfReader

root=Path(__file__).resolve().parents[1]
source=Path('/Users/rahul.negi/Personal/Flowguard/docs/evidence')
for name in ['backpressure-enabled','breaker-enabled']:
    with Image.open(source/f'{name}.png') as im:
        im.thumbnail((1440,1440))
        im.convert('RGB').save(root/'public/evidence'/f'{name}.webp','WEBP',quality=87)
        print(name,im.size)
shutil.copyfile(source/'results.json',root/'public/evidence/results.json')
shutil.copyfile(source/'breaker-enabled.log',root/'public/evidence/breaker-transitions.txt')
results=json.loads((source/'results.json').read_text())
a,b,c,d=[r['after'] for r in results]
assert round((1-a['peak_outstanding']/b['peak_outstanding'])*100,1)==93.8
assert round((1-c['downstream_failures']/d['downstream_failures'])*100,1)==99.5
for r in results:
    v=r['after']; assert v['metrics']['published']==v['metrics']['consumed']==v['succeeded']+v['dead_lettered']

im=Image.new('RGB',(1200,630),'#101315'); draw=ImageDraw.Draw(im)
font='/System/Library/Fonts/Supplemental/Arial.ttf'
regular=ImageFont.truetype(font,25); big=ImageFont.truetype(font,69); small=ImageFont.truetype(font,18)
draw.line((70,72,1130,72),fill='#34443e',width=2)
draw.text((72,104),'RAHUL NEGI / SOFTWARE ENGINEER',font=small,fill='#9ce6d4')
draw.text((68,190),'Reliable systems.',font=big,fill='#edf0ec')
draw.text((68,278),'Thoughtful engineering.',font=big,fill='#93a5a0')
draw.text((72,435),'Backend · Payments · Distributed systems · Web',font=regular,fill='#b4c1b9')
draw.rounded_rectangle((72,523,321,567),radius=5,fill='#9ce6d4'); draw.text((90,535),'rahul negi / portfolio',font=small,fill='#14221e')
im.save(root/'public/images/social.png',optimize=True)

styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name='NameCustom',fontName='Helvetica-Bold',fontSize=24,leading=29,textColor=HexColor('#152c27'),spaceAfter=9))
styles.add(ParagraphStyle(name='SectionCustom',fontName='Helvetica-Bold',fontSize=11,leading=15,textColor=HexColor('#176153'),spaceBefore=13,spaceAfter=7))
styles.add(ParagraphStyle(name='BodyCustom',fontName='Helvetica',fontSize=9,leading=13,spaceAfter=6))
styles.add(ParagraphStyle(name='JobCustom',fontName='Helvetica-Bold',fontSize=10,leading=14,spaceAfter=5))
story=[]
def para(text,style='BodyCustom'): story.append(Paragraph(text,styles[style]))
def section(text): para(text,'SectionCustom')
def bullets(items):
    for t in items: para('• '+t)
para('Rahul Negi','NameCustom')
para('Senior Software Engineer | Backend, Payments &amp; Distributed Systems')
para('<link href="mailto:manu.rahul28@gmail.com">manu.rahul28@gmail.com</link> | <link href="https://github.com/insignificantGuy">github.com/insignificantGuy</link> | <link href="https://www.linkedin.com/in/rrahul-negi/">LinkedIn: rrahul-negi</link>')
section('PROFILE')
para('Software engineer with experience at Razorpay and Amazon, focused on reliable APIs, payment flows, distributed systems, observability, and safe delivery. Works across backend services, React/TypeScript applications, and cloud infrastructure.')
section('EXPERIENCE')
para('Razorpay | Software Developer | Joined July 2024 | Bengaluru, India','JobCustom')
bullets(['Designed direct-to-core payment routing paths and backward-compatible merchant migrations.', 'Built fallback and rollback mechanisms for critical payment flows, including authentication and fee handling.', 'Worked on tokenisation service boundaries and payment notification reliability.', 'Mentored two SDE interns and participated in engineering design and code reviews.'])
para('Amazon | Software Developer | August 2022 - May 2024 | Gurugram, India','JobCustom')
bullets(['Built bulk CSV export functionality supporting up to 50,000 entries.', 'Developed tooling to extract information from support request emails and documents.', 'Addressed recurring support issues through long-term engineering fixes.', 'Owned incident investigation, root-cause analysis, and safe production fixes.'])
section('TECHNICAL SKILLS')
para('<b>Languages &amp; web:</b> Go, Java, Node.js, Python, C++, React, TypeScript.')
para('<b>Backend:</b> REST APIs, authentication and authorization, payment routing, tokenisation, idempotency, feature flags, backward compatibility.')
para('<b>Systems &amp; data:</b> Kafka, MySQL, PostgreSQL, DynamoDB, MongoDB, fault tolerance, rate limiting, rollback strategies, schema migrations.')
para('<b>Operations &amp; delivery:</b> AWS, GCP, CI/CD, Prometheus, Grafana, testing, production debugging, incident response, Git, Linux.')
section('SELECTED INDEPENDENT PROJECTS')
para('<b>fastPay - Go payment routing:</b> mock-provider routing, client-supplied idempotency keys, bounded retries, asynchronous webhooks, and ledger reconciliation. PostgreSQL, Gin, GORM. Demonstration project; no real payment gateways.')
para('<b>Flowguard - Go/Kafka pipeline:</b> bounded workers, hysteresis-based backpressure, circuit breaking, in-memory fallback DLQ, and Prometheus/Grafana monitoring. Controlled local experiment evidence; not production scale claims.')
para('<b>Slotly - Go booking API:</b> company-scoped permissions, JWT sessions, slot overlap checks, and transactional booking with row locks. MySQL, Gin, GORM. Local implementation; public documentation may differ.')
section('EDUCATION')
para('<b>ADGITM (NIEC), Delhi</b> | B.Tech in Computer Science | August 2018 - July 2022 | GPA 9.2/10')
para('Foundations: operating systems, data structures, algorithms, networking, databases.')
out=root/'public/resume.pdf'
SimpleDocTemplate(str(out),pagesize=(595.28,841.89),rightMargin=42,leftMargin=42,topMargin=35,bottomMargin=35,title='Rahul Negi - Professional Resume',author='Rahul Negi',subject='Public professional resume; phone omitted').build(story)
r=PdfReader(out); text='\n'.join(p.extract_text() for p in r.pages)
assert '7982170123' not in text and 'Mobile' not in text
assert 'manu.rahul28@gmail.com' in text and 'Razorpay' in text and 'Amazon' in text
print('Sanitized resume pages:',len(r.pages),'metadata:',r.metadata)
