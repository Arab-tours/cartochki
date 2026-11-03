import numpy as np, json, math
from PIL import Image
from skimage.morphology import skeletonize
from scipy import ndimage as ndi
im=np.array(Image.open('/tmp/claude-0/sk/rqx.webp'))[:,:,3].astype(float)/255
R="ابتثجحخدذرزسشصضطظعغفقكلمنهوي"
X=[.134,.343,.539,.726,.913]
W,H=192.6,168
def rdp(pts,eps):
    if len(pts)<3:return pts
    a=np.array(pts[0]);b=np.array(pts[-1]);d=b-a;n=np.hypot(*d)
    best,bi=0,0
    for i in range(1,len(pts)-1):
        p=np.array(pts[i])
        dist=abs(d[0]*(a[1]-p[1])-d[1]*(a[0]-p[0]))/n if n else np.hypot(*(p-a))
        if dist>best:best,bi=dist,i
    if best>eps:return rdp(pts[:bi+1],eps)[:-1]+rdp(pts[bi:],eps)
    return [pts[0],pts[-1]]
N8=[(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)]
def trace_comp(sk,mask):
    pix=set(zip(*np.nonzero(sk&mask)))
    if not pix:return []
    def nb(p):return [(p[0]+dy,p[1]+dx) for dy,dx in N8 if (p[0]+dy,p[1]+dx) in pix]
    edges=set()
    strokes=[]
    unvis=set(pix)
    def deg(p):return len(nb(p))
    while unvis:
        ends=[p for p in unvis if deg(p)<=1] or list(unvis)
        # start: rightmost-top endpoint (Arabic: right to left)
        st=max(ends,key=lambda p:(p[1]-0.6*p[0]))
        path=[st];unvis.discard(st);cur=st;prev=None
        while True:
            cand=[q for q in nb(cur) if q in unvis]
            if not cand:break
            if prev is not None:
                dv=(cur[0]-prev[0],cur[1]-prev[1])
                cand.sort(key=lambda q:-((q[0]-cur[0])*dv[0]+(q[1]-cur[1])*dv[1]))
            else:
                cand.sort(key=lambda q:-(q[1]-cur[1]))
            nx=cand[0]
            # mark 4-neighbors adjacent to avoid parallel duplicates
            unvis.discard(nx);prev,cur=cur,nx;path.append(cur)
        if len(path)>=4 or not strokes: strokes.append(path)
        # drop tiny leftovers
        unvis={p for p in unvis if p not in set(path)}
    return strokes
def cell(i,k):
    x0=int(round(X[k]*963-W/2));y0=168*i
    c=im[y0:y0+168,max(0,x0):x0+193]
    return c,x0
out={}
for i,ch in enumerate(R):
    out[ch]={}
    for k in range(5):
        c,x0=cell(i,k)
        b=c>0.45
        if b.sum()<30: continue
        b=ndi.binary_closing(b,iterations=1)
        lab,n=ndi.label(b)
        dt=ndi.distance_transform_edt(b)
        sk=skeletonize(b)
        comps=[]
        for j in range(1,n+1):
            m=lab==j
            if m.sum()<12:continue
            ys,xs=np.nonzero(m)
            comps.append((m.sum(),xs.max(),ys.min(),m))
        big=max(cc[0] for cc in comps)
        main=[cc for cc in comps if cc[0]>=0.25*big]; small=[cc for cc in comps if cc[0]<0.25*big]
        main.sort(key=lambda cc:-cc[1]); small.sort(key=lambda cc:(-cc[1]))
        paths=[]
        for cc in main+small:
            m=cc[3]
            if cc[0]<0.25*big and cc[0]<160:
                ys,xs=np.nonzero(m);cx,cy=xs.mean(),ys.mean();w=2*dt[m].max()+0.5
                ext=max(xs.max()-xs.min(),ys.max()-ys.min())
                if ext<w*1.6:
                    paths.append([round(w,1),f"M{cx:.0f} {cy:.0f} L{cx+0.5:.1f} {cy:.0f}"]);continue
            for p in trace_comp(sk,m):
                w=float(np.median([dt[y,x] for y,x in p]))*2+0.6
                pts=[(x,y) for y,x in p]
                if len(pts)==1: pts=pts*2
                pts=rdp(pts,0.9)
                paths.append([round(w,1),"M"+" L".join(f"{x:.0f} {y:.0f}" for x,y in pts)])
        out[ch][k]=paths
json.dump(out,open('/tmp/claude-0/sk/strokes.json','w'),ensure_ascii=False)
s=json.dumps(out,ensure_ascii=False,separators=(',',':'));print(len(s))
