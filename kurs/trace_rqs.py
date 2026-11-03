# Штрихи рука'а из маски-спрайта: одна непрерывная линия на каждую связную часть (без отрыва пера), точки — отдельно.
import numpy as np, json, sys
from PIL import Image
from skimage.morphology import skeletonize
from scipy import ndimage as ndi
sys.setrecursionlimit(20000)
im=np.array(Image.open(sys.argv[1]))[:,:,3].astype(float)/255
R="ابتثجحخدذرزسشصضطظعغفقكلمنهوي";X=[.134,.343,.539,.726,.913];W=192.6
N8=[(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)]
def rdp(pts,eps):
    if len(pts)<3:return pts
    a=np.array(pts[0],float);b=np.array(pts[-1],float);d=b-a;n=np.hypot(*d)
    best,bi=-1,0
    for i in range(1,len(pts)-1):
        p=np.array(pts[i],float)
        dist=abs(d[0]*(a[1]-p[1])-d[1]*(a[0]-p[0]))/n if n>1e-9 else np.hypot(*(p-a))
        if dist>best:best,bi=dist,i
    if best>eps:return rdp(pts[:bi+1],eps)[:-1]+rdp(pts[bi:],eps)
    return [pts[0],pts[-1]]
def walk(pix):
    nb=lambda p:[(p[0]+dy,p[1]+dx) for dy,dx in N8 if (p[0]+dy,p[1]+dx) in pix]
    ends=[p for p in pix if len(nb(p))<=1] or list(pix)
    root=max(ends,key=lambda p:(p[1]-0.5*p[0]))
    # дерево DFS (итеративно)
    par={root:None};order=[root];st=[root];ch={root:[]}
    while st:
        u=st.pop()
        for v in sorted(nb(u),key=lambda q:abs(q[0]-u[0])+abs(q[1]-u[1])):
            if v not in par:par[v]=u;ch[v]=[];ch[u].append(v);st.append(v);order.append(v)
    dep={}
    for u in reversed(order):dep[u]=1+max([dep[c] for c in ch[u]],default=0)
    out=[]
    def go(u):
        out.append(u)
        cs=sorted(ch[u],key=lambda c:dep[c])
        for i,c in enumerate(cs):
            go(c)
            if i<len(cs)-1:out.append(u)
    go(root);return out
out={}
for i,ch_ in enumerate(R):
    out[ch_]={}
    for k in range(5):
        x0=int(round(X[k]*963-W/2));c=im[168*i:168*i+168,max(0,x0):x0+193]
        b=c>0.45
        if b.sum()<30:continue
        lab,n=ndi.label(ndi.binary_closing(b,iterations=1));dt=ndi.distance_transform_edt(lab>0);sk=skeletonize(lab>0)
        comps=[]
        for j in range(1,n+1):
            m=lab==j
            if m.sum()<10:continue
            ys,xs=np.nonzero(m);comps.append((m.sum(),xs.max(),m))
        big=max(cc[0] for cc in comps)
        main=sorted([cc for cc in comps if cc[0]>=0.25*big],key=lambda cc:-cc[1]);small=sorted([cc for cc in comps if cc[0]<0.25*big],key=lambda cc:-cc[1])
        paths=[]
        for cc in main+small:
            m=cc[2];w=round(2*float(dt[m].max())+3,1)
            pix=set(zip(*np.nonzero(sk&m)))
            if len(pix)<3:
                ys,xs=np.nonzero(m);paths.append([w,f"M{xs.mean():.0f} {ys.mean():.0f} L{xs.mean()+.5:.1f} {ys.mean():.0f}"]);continue
            p=walk(pix);pts=rdp([(x,y) for y,x in p],0.7)
            paths.append([w,"M"+" L".join(f"{x:.0f} {y:.0f}" for x,y in pts)])
        out[ch_][k]=paths
json.dump(out,open(sys.argv[2],'w'),ensure_ascii=False,separators=(',',':'))
print(len(json.dumps(out,ensure_ascii=False,separators=(',',':'))))
