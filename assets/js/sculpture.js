/* Locally rendered living material, framed by the brand mark. A still is the fallback. */
const hero = document.querySelector('.studio-hero');
const stage = hero?.querySelector('.hero-art');
const controls = hero?.querySelector('.sculpture-controls');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const fine = matchMedia('(hover: hover) and (pointer: fine)');

async function createSculpture() {
    if (!stage) return;
    const canvas = document.createElement('canvas');
    canvas.className = 'sculpture-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    const gl = canvas.getContext('webgl2', {alpha:true,antialias:true,powerPreference:'low-power'});
    if (!gl) return;
    const THREE = await import('./vendor/three.module.min.js');
    const renderer = new THREE.WebGLRenderer({canvas,context:gl,alpha:true,antialias:true});
    renderer.setClearColor(0x000000,0);
    renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth < 768 ? 1.25 : 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = .85;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36,1,.1,50);
    camera.position.set(0,.45,8.6);
    camera.lookAt(0,-.1,0);

    // Broad light cards model the ivory surface against the crimson hero.
    const studio = new THREE.Scene();
    studio.add(new THREE.Mesh(new THREE.BoxGeometry(30,30,30),new THREE.MeshBasicMaterial({color:0x777777,side:THREE.BackSide})));
    const addCard = (x,y,z,w,h,intensity) => {
        const card = new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color:new THREE.Color(intensity,intensity,intensity)}));
        card.position.set(x,y,z); card.lookAt(0,0,0); studio.add(card);
    };
    addCard(-5,3,4,3,9,5); addCard(5,4,1,2,8,3); addCard(0,7,-3,6,3,4);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const environment = pmrem.fromScene(studio,.04);
    scene.environment = environment.texture;
    studio.traverse(object => {object.geometry?.dispose();object.material?.dispose();});
    pmrem.dispose();
    scene.add(new THREE.HemisphereLight(0xffffff,0x5b2424,.9));
    const key = new THREE.DirectionalLight(0xfff7f1,2.3); key.position.set(-3,5,5); scene.add(key);
    const rim = new THREE.DirectionalLight(0xffffff,2.2); rim.position.set(4,1,-3); scene.add(rim);

    // A broad half-twisted strip with a rounded triangular centreline.
    // The seam reverses width at 2π: the shape is continuous on both sides.
    const along = 224, across = 20, positions = [], indices = [];
    for (let i=0;i<=along;i++) {
        const u = i/along*Math.PI*2;
        const radius = 1.58+.2*Math.cos(3*u);
        const twist = u*.5+.32*Math.sin(u);
        for (let j=0;j<=across;j++) {
            const w = (j/across*2-1)*.72;
            const r = radius+w*Math.cos(twist);
            positions.push(r*Math.cos(u),r*Math.sin(u)*.94,w*Math.sin(twist)+.22*Math.sin(2*u));
            if (i<along && j<across) {
                const a=i*(across+1)+j,b=a+across+1;
                indices.push(a,b,a+1,b,b+1,a+1);
            }
        }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
    geometry.setIndex(indices); geometry.computeVertexNormals();
    const material = new THREE.MeshPhysicalMaterial({color:0xf4f0e8,metalness:.12,roughness:.28,clearcoat:.4,clearcoatRoughness:.3,side:THREE.DoubleSide,envMapIntensity:.5});
    const ribbon = new THREE.Mesh(geometry,material);
    const group = new THREE.Group(); group.add(ribbon); scene.add(group);

    // Soft contact shadow, generated locally; no external texture or model request.
    const shadowCanvas = document.createElement('canvas'); shadowCanvas.width=128;shadowCanvas.height=128;
    const context=shadowCanvas.getContext('2d');
    const gradient=context.createRadialGradient(64,64,5,64,64,64);
    gradient.addColorStop(0,'rgba(42,10,10,.34)');gradient.addColorStop(.5,'rgba(42,10,10,.13)');gradient.addColorStop(1,'rgba(42,10,10,0)');
    context.fillStyle=gradient;context.fillRect(0,0,128,128);
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(5,2),new THREE.MeshBasicMaterial({map:shadowTexture,transparent:true,depthWrite:false}));
    shadow.rotation.x=-Math.PI/2;shadow.position.y=-2.35;scene.add(shadow);

    let paused=reduced.matches, visible=true, lost=false, frame=0, last=0, elapsed=0;
    let aimX=0,aimY=0,followX=0,followY=0,dragAngle=0,dragTarget=0;
    let scroll=0,scrollTarget=0,dragging=false,dragStart=0,dragBase=0;
    const pauseButton=controls.querySelector('[data-sculpture-pause]');
    const rotateButton=controls.querySelector('[data-sculpture-rotate]');
    function state() {
        stage.dataset.motion=paused?'paused':'running';
        pauseButton.setAttribute('aria-pressed',String(paused));
        pauseButton.setAttribute('aria-label',paused?'Reprendre l’animation de l’objet':'Mettre l’animation de l’objet en pause');
        pauseButton.textContent=paused?'Reprendre ↗':'Pause Ⅱ';
    }
    function paint(now,once=false) {
        frame=0;
        if (lost || document.hidden || !visible) {last=0;return;}
        const dt=Math.min((now-(last||now))/1000,.05);last=now;
        if (!paused) elapsed+=dt;
        const smoothing=1-Math.exp(-dt*5);
        if (!paused) {followX+=(aimX-followX)*smoothing;followY+=(aimY-followY)*smoothing;scroll+=(scrollTarget-scroll)*smoothing;}
        dragAngle+=(dragTarget-dragAngle)*(reduced.matches?1:Math.max(smoothing,.07));
        const t=elapsed;
        group.rotation.set(-.18+Math.sin(t*.47)*.13+followY*.15, -.25+t*.18+followX*.32+dragAngle+scroll*.9, -.3+Math.sin(t*.38)*.08-scroll*.12);
        group.position.set(followX*.12,-.05+Math.sin(t*.85)*.12+scroll*.32,0);
        group.scale.setScalar(1-scroll*.1);
        shadow.scale.setScalar(1+Math.sin(t*.85)*.055);
        shadow.material.opacity=.8-Math.sin(t*.85)*.08;
        renderer.render(scene,camera);
        if (!paused && !once || Math.abs(dragTarget-dragAngle)>.002) frame=requestAnimationFrame(paint);
    }
    function start() {if(!frame&&!lost&&!document.hidden&&visible){last=0;frame=requestAnimationFrame(paint);}}
    function stop() {cancelAnimationFrame(frame);frame=0;last=0;}
    function resize() {
        const {width,height}=stage.getBoundingClientRect();
        renderer.setSize(width,height,false);camera.aspect=width/height;
        // Close framing turns the living material into the texture of our mark.
        camera.position.z=camera.aspect<1?6.8:7.8;
        camera.updateProjectionMatrix();start();
    }
    stage.append(canvas);
    resize();stop();paint(performance.now(),true);
    stage.classList.add('sculpture-ready');hero.classList.add('has-sculpture');controls.hidden=false;state();start();
    const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(stage);
    const visibilityObserver=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)start();else stop();},{threshold:0});visibilityObserver.observe(hero);
    document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else start();});
    const updateScroll=()=>{scrollTarget=Math.max(0,Math.min(1,-hero.getBoundingClientRect().top/hero.offsetHeight));if(!paused)start();};
    addEventListener('scroll',updateScroll,{passive:true});updateScroll();
    hero.addEventListener('pointermove',event=>{
        if(!fine.matches||paused)return;
        const r=hero.getBoundingClientRect();aimX=(event.clientX-r.left)/r.width*2-1;aimY=(event.clientY-r.top)/r.height*2-1;
    },{passive:true});
    hero.addEventListener('pointerleave',()=>{aimX=aimY=0;});
    canvas.addEventListener('pointerdown',event=>{
        if(!fine.matches||event.button!==0)return;
        dragging=true;dragStart=event.clientX;dragBase=dragTarget;canvas.setPointerCapture(event.pointerId);canvas.classList.add('is-dragging');
    });
    canvas.addEventListener('pointermove',event=>{if(dragging){dragTarget=dragBase+(event.clientX-dragStart)*.009;start();}});
    const endDrag=()=>{dragging=false;canvas.classList.remove('is-dragging');};
    canvas.addEventListener('pointerup',endDrag);canvas.addEventListener('pointercancel',endDrag);canvas.addEventListener('lostpointercapture',endDrag);
    pauseButton.addEventListener('click',()=>{paused=!paused;state();if(paused)stop();else start();});
    rotateButton.addEventListener('click',()=>{dragTarget+=Math.PI/2;start();});
    reduced.addEventListener('change',()=>{paused=reduced.matches;aimX=aimY=0;state();stop();start();});
    canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();lost=true;stop();stage.classList.remove('sculpture-ready');controls.hidden=true;});
    canvas.addEventListener('webglcontextrestored',()=>{lost=false;stage.classList.add('sculpture-ready');controls.hidden=false;resize();});
    addEventListener('pagehide',stop);
    addEventListener('pageshow',start);
}
createSculpture().catch(()=>{stage?.classList.remove('sculpture-ready');if(controls)controls.hidden=true;});
