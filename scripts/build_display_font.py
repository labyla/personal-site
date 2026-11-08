"""Build original Labyla Wide outlines; no third-party font is used.

Docker: python:3.13-slim with fonttools==4.61.1, brotli==1.2.0,
shapely==2.1.2 and pillow==12.0.0. See assets/fonts/README.md.
"""
from pathlib import Path
from string import ascii_uppercase, ascii_lowercase, digits
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen
from shapely.geometry import box, Polygon, LineString
from shapely.geometry.polygon import orient
from shapely.ops import unary_union
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public/fonts'
ASSETS = ROOT / 'assets/fonts'


def rect(x, y, w, h, r=0):
    b = box(x + r, y + r, x + w - r, y + h - r)
    return b.buffer(r, quad_segs=10) if r else b


def poly(*pts):
    return Polygon(pts)


def stroke(points, width=230):
    return LineString(points).buffer(width / 2, cap_style=2, join_style=2)


def union(*shapes):
    return unary_union(shapes)


# Cap height 700, broad 980-unit bodies, 230-unit stems, narrow counters.
L = rect(60, 0, 240, 700)
TOP = rect(60, 510, 980, 190)
BOT = rect(60, 0, 980, 190)
MID = rect(60, 255, 900, 190)
O = rect(60, 0, 980, 700, 160).difference(rect(330, 240, 440, 220, 44))
P = union(L, rect(60, 215, 980, 485, 145)).difference(rect(330, 420, 440, 100, 28))
C = O.difference(box(640, 240, 1100, 460))
G = union(C, rect(600, 0, 440, 355), rect(550, 245, 490, 110))
D = rect(60, 0, 980, 700, 160).union(L).difference(rect(330, 230, 420, 240, 55))
A = poly((45, 0), (340, 700), (760, 700), (1055, 0)).difference(poly((445, 265), (550, 495), (655, 265))).difference(box(340, -30, 760, 135))
S = rect(60, 0, 980, 700, 130).difference(rect(325, 445, 800, 75, 25)).difference(rect(-20, 180, 795, 75, 25))
U = rect(60, 0, 980, 700, 160).difference(rect(310, 240, 480, 650, 55))
V = poly((40,700),(325,700),(550,220),(775,700),(1060,700),(755,0),(345,0))
W = poly((35,700),(295,700),(390,260),(530,700),(790,700),(930,260),(1025,700),(1285,700),(1100,0),(800,0),(660,365),(520,0),(220,0))
N = union(L, rect(800,0,240,700), poly((200,700),(440,700),(900,0),(660,0)))
M = union(L, rect(1000,0,240,700), poly((240,700),(490,700),(650,385),(810,700),(1060,700),(780,120),(520,120)))
X = union(poly((40,700),(345,700),(1060,0),(755,0)), poly((755,700),(1060,700),(345,0),(40,0)))
Z = union(TOP, BOT, poly((720,520),(1040,520),(380,180),(60,180)))
upper = {
    'A': A, 'B': union(P, rect(60,0,980,430,130)).difference(rect(330,165,440,95,28)),
    'C': C, 'D': D, 'E': union(L,TOP,BOT,MID), 'F': union(L,TOP,MID), 'G': G,
    'H': union(L, rect(800,0,240,700), MID), 'I': rect(60,0,260,700),
    'J': U.difference(box(0,300,790,800)), 'K': union(L,poly((250,350),(735,700),(1050,700),(620,350),(1070,0),(735,0))),
    'L': union(L,BOT), 'M': M, 'N': N, 'O': O, 'P': P,
    'Q': union(O,poly((650,230),(860,230),(1080,-80),(815,-80))),
    'R': union(P,poly((520,300),(810,300),(1070,0),(750,0))),
    'S': S, 'T': union(TOP,rect(430,0,240,700)), 'U': U, 'V': V, 'W': W, 'X': X,
    'Y': union(poly((30,700),(325,700),(550,445),(775,700),(1070,700),(670,240),(430,240)),rect(430,0,240,355)), 'Z': Z,
}

# True lowercase, 520-unit x-height, with ascenders and descenders.
o = rect(60,0,840,520,130).difference(rect(290,190,380,140,32))
stem = rect(60,0,230,700)
n = rect(60,0,840,520,130).union(rect(60,0,230,520)).difference(rect(290,-30,380,355,35))
u = rect(60,0,840,520,130).union(rect(670,0,230,520)).difference(rect(290,195,380,400,35))
c = o.difference(box(570,190,950,330))
b = union(o,stem)
d = union(o,rect(670,0,230,700))
p = union(o,rect(60,-190,230,710))
q = union(o,rect(670,-190,230,710))
s = rect(60,0,840,520,100).difference(rect(290,335,700,40,15)).difference(rect(-20,145,690,40,15))
lower = {
    'a': union(o,rect(670,0,230,520)), 'b': b, 'c': c, 'd': d,
    'e': union(c,rect(230,230,670,60)),
    'f': union(rect(200,0,230,570),rect(200,470,520,230,100),rect(60,300,630,170)),
    'g': union(q,rect(60,-190,840,120,50)),
    'h': union(n,stem), 'i': union(rect(60,0,230,520),rect(60,590,230,110,20)),
    'j': union(rect(290,-30,230,550),rect(290,590,230,110,20),rect(60,-190,460,220,75)),
    'k': union(stem,poly((240,260),(565,520),(895,520),(580,260),(920,0),(570,0))),
    'l': rect(60,0,230,700),
    'm': union(n,rect(670,0,840,520,130).difference(rect(900,-30,380,355,35))),
    'n': n, 'o': o, 'p': p, 'q': q,
    'r': rect(60,0,680,520,110).union(rect(60,0,230,520)).difference(box(290,-30,780,325)),
    's': s, 't': union(rect(200,120,230,580),rect(60,300,630,170),rect(200,0,520,220,75)),
    'u': u,
    'v': poly((35,520),(290,520),(480,185),(670,520),(925,520),(650,0),(310,0)),
    'w': poly((35,520),(280,520),(365,180),(490,520),(730,520),(855,180),(940,520),(1185,520),(1005,0),(730,0),(610,290),(490,0),(215,0)),
    'x': union(poly((35,520),(325,520),(925,0),(635,0)),poly((635,520),(925,520),(325,0),(35,0))),
    'y': union(u,rect(670,-30,230,355),rect(60,-190,840,120,50)),
    'z': union(rect(60,345,840,175),rect(60,0,840,175),poly((600,390),(900,390),(360,130),(60,130))),
}
nums = {
    '0': O, '1': union(rect(440,0,260,700),BOT,poly((100,470),(440,700),(700,700),(700,470))),
    '2': poly((60,700),(1040,700),(1040,340),(400,190),(1040,190),(1040,0),(60,0),(60,260),(770,470),(770,510),(60,510)),
    '3': union(TOP,MID,BOT,rect(800,0,240,700)),
    '4': union(rect(800,0,240,700),rect(60,225,980,210),rect(60,225,240,475)),
    '5': S.union(rect(60,360,230,340)),
    '6': rect(60,0,980,700,130).difference(rect(330,170,440,110,28)).difference(rect(330,440,800,80,25)),
    '7': union(TOP,poly((745,500),(1040,500),(535,0),(225,0))),
    '8': rect(60,0,980,700,130).difference(rect(330,440,440,85,25)).difference(rect(330,175,440,85,25)),
    '9': rect(60,0,980,700,130).difference(rect(330,420,440,110,28)).difference(rect(-20,180,790,80,25)),
}
dot = rect(60,0,190,160,22)
comma = union(dot,poly((60,40),(250,40),(145,-150),(60,-150)))
punct = {
    '.':dot, ',':comma, ':':union(dot,rect(60,360,190,160,22)),
    ';':union(comma,rect(60,360,190,160,22)),
    '!':union(dot,rect(60,240,190,460,20)),
    '?':union(rect(60,300,800,400,110).difference(rect(-20,440,650,80,20)),rect(350,240,230,180),rect(370,0,190,160,22)),
    '-':rect(60,250,450,160,18), '_':rect(60,-150,840,150,18),
    '+':union(rect(60,250,640,160,18),rect(300,10,160,640,18)),
    '=':union(rect(60,130,640,150,18),rect(60,380,640,150,18)),
    '/':poly((60,-40),(270,-40),(680,740),(470,740)),
    '\\':poly((60,740),(270,740),(680,-40),(470,-40)),
    "'":rect(60,470,150,230,20), '"':union(rect(60,470,150,230,20),rect(300,470,150,230,20)),
    '(':rect(60,-120,400,920,130).difference(box(300,-200,600,900)),
    ')':rect(60,-120,400,920,130).difference(box(-100,-200,220,900)),
    '[':rect(60,-120,380,920).difference(box(250,70,600,610)),
    ']':rect(60,-120,380,920).difference(box(-100,70,250,610)),
    '<':stroke([(600,620),(160,340),(600,60)],150),
    '>':stroke([(100,620),(540,340),(100,60)],150),
    '#':union(rect(60,150,840,140),rect(60,410,840,140),stroke([(260,0),(380,700)],150),stroke([(580,0),(700,700)],150)),
    '*':union(stroke([(300,700),(300,230)],120),stroke([(70,590),(530,340)],120),stroke([(70,340),(530,590)],120)),
    '&':union(O,poly((60,700),(300,700),(1040,0),(780,0))).difference(box(820,340,1100,470)),
    '@':union(O,rect(500,220,500,250)).difference(rect(400,270,190,160,30)),
    '%':union(stroke([(200,0),(900,700)],130),rect(60,400,360,300,90).difference(rect(190,500,100,100,20)),rect(680,0,360,300,90).difference(rect(810,100,100,100,20))),
}
punct.update({
    '$': union(S,rect(470,-90,160,880)),
    '^': stroke([(80,420),(350,700),(620,420)],130),
    '`': poly((60,740),(220,740),(340,540),(180,540)),
    '{': union(rect(170,-120,350,920,100).difference(box(360,-200,650,900)),rect(60,260,300,150)),
    '}': union(rect(60,-120,350,920,100).difference(box(-100,-200,220,900)),rect(220,260,300,150)),
    '|': rect(60,-120,160,920,15),
    '~': stroke([(60,300),(220,400),(420,250),(580,350)],110),
})
shapes = {**upper, **lower, **nums, **punct}
# A light geometric corner treatment is shared by all drawn outlines.
shapes = {c: g.buffer(-8,quad_segs=3).buffer(8,quad_segs=3).simplify(.5,preserve_topology=True) for c,g in shapes.items()}


def glyph(geometry):
    pen = TTGlyphPen(None)
    if geometry is not None:
        polygons = [geometry] if geometry.geom_type == 'Polygon' else geometry.geoms
        for polygon in polygons:
            polygon = orient(polygon, sign=-1)  # TrueType outer clockwise, holes CCW.
            for ring in [polygon.exterior, *polygon.interiors]:
                points = [(round(x),round(y)) for x,y in ring.coords[:-1]]
                pen.moveTo(points[0])
                for pt in points[1:]:
                    pen.lineTo(pt)
                pen.closePath()
    return pen.glyph()


names = {c: f'uni{ord(c):04X}' for c in shapes}
order = ['.notdef','space',*names.values()]
fb = FontBuilder(1000,isTTF=True)
fb.setupGlyphOrder(order)
fb.setupCharacterMap({32:'space',**{ord(c):n for c,n in names.items()}})
notdef = rect(60,0,700,700).difference(rect(180,120,460,460))
fb.setupGlyf({'.notdef':glyph(notdef),'space':glyph(None),**{names[c]:glyph(g) for c,g in shapes.items()}})
metrics = {'.notdef':(820,60),'space':(350,0)}
for c,g in shapes.items():
    metrics[names[c]] = (round(g.bounds[2])+60, round(g.bounds[0]))
fb.setupHorizontalMetrics(metrics)
fb.setupHorizontalHeader(ascent=820,descent=-220)
fb.setupNameTable({'familyName':'Labyla Wide','styleName':'Black','uniqueFontIdentifier':'Labyla Wide Black 1.000','fullName':'Labyla Wide Black','psName':'LabylaWide-Black','version':'Version 1.000','description':'Original geometric display typeface created for labyla.','copyright':'Created for labyla, 2026.'})
fb.setupOS2(sTypoAscender=820,sTypoDescender=-220,sTypoLineGap=0,usWinAscent=820,usWinDescent=220,sCapHeight=700,sxHeight=520,usWeightClass=900,usWidthClass=7,fsType=0)
fb.setupPost()
fb.setupMaxp()
fb.font['head'].created = fb.font['head'].modified = 3876854400
OUT.mkdir(parents=True,exist_ok=True)
ASSETS.mkdir(parents=True,exist_ok=True)
fb.save(OUT/'labyla-wide-black.ttf')
fb.font.flavor = 'woff2'
fb.save(OUT/'labyla-wide-black.woff2')

# Export inspectable vector masters and a raster proof using the actual TTF.
paths = []
for i,c in enumerate(ascii_uppercase+ascii_lowercase+digits):
    x,y = 40+(i%7)*165, 70+(i//7)*150
    paths.append(f'<g transform="translate({x},{y+100}) scale(.13,-.13)">{shapes[c].svg(fill_color="#111111")}</g>')
(ASSETS/'glyphs.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" width="1220" height="1450">'+''.join(paths)+'</svg>')
image = Image.new('RGB',(1800,1750),'#101415')
draw = ImageDraw.Draw(image)
label = ImageFont.load_default(size=23)
fontpath = str(OUT/'labyla-wide-black.ttf')
draw.text((70,45),'LABYLA WIDE / BLACK / v1.000',font=label,fill='#8ca6a8')
y = 115
for text,size in [('ENTER',210),('PRO',165),('ABCDEFG',105),('HIJKLMN',105),('OPQRSTU',105),('VWXYZ',105),('abcdefg',105),('hijklmn',105),('opqrstu',105),('vwxyz',105),('0123456789',100),('.,:;!?  +-=  () /',75)]:
    font = ImageFont.truetype(fontpath,size)
    draw.text((70,y),text,font=font,fill='#b2f5f4',anchor='lt')
    y += round(size*.82)+30
image.save(ASSETS/'specimen.png')
# Reopen both deliverables and validate the entire printable ASCII repertoire.
from fontTools.ttLib import TTFont
for extension in ('ttf', 'woff2'):
    font = TTFont(OUT / f'labyla-wide-black.{extension}')
    cmap = font.getBestCmap()
    assert set(range(32, 127)) <= set(cmap), 'Missing printable ASCII'
    for code in range(33, 127):
        shape = font['glyf'][cmap[code]]
        assert shape.numberOfContours > 0 and shape.xMax > shape.xMin
        assert font['hmtx'][cmap[code]][0] > 0
    font.close()
assert all(g.is_valid and not g.is_empty for g in shapes.values())
print(f'Validated {len(shapes)+1} encoded characters in TTF and WOFF2; specimen.png')
