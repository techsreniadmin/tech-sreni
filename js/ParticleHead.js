
// Detect screen size
var isMobile = window.innerWidth < 768;
site.Width = isMobile ? window.innerWidth : $(window).width();
site.Height = isMobile ? window.innerHeight : $(window).height();

Background.headparticle = function () {
   if (!Modernizr.webgl) {
      alert('Your browser doesn’t support WebGL');
   }

   var camera, scene, renderer;
   var mouseX = 0, mouseY = 0;
   var p;
   var windowHalfX = site.Width / 2;
   var windowHalfY = site.Height / 2;

   Background.camera = new THREE.PerspectiveCamera(35, site.Width / site.Height, 1, 2000);
   Background.camera.position.z = 300;

   Background.scene = new THREE.Scene();

   var manager = new THREE.LoadingManager();

   var p_geom = new THREE.Geometry();
   var p_material = new THREE.ParticleBasicMaterial({
      color: 0xFFFFFF,
      size: isMobile ? 1.2 : 1.9
   });

   var loader = new THREE.OBJLoader(manager);
   loader.load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/40480/head.obj', function (object) {
      object.traverse(function (child) {
         if (child instanceof THREE.Mesh) {
            var scale = 8;
            let count = 0;

            $(child.geometry.vertices).each(function () {
               // On mobile, skip some vertices to reduce particle count
               if (!isMobile || count % 3 === 0) {
                  p_geom.vertices.push(new THREE.Vector3(this.x * scale, this.y * scale, this.z * scale));
               }
               count++;
            });
         }
      });

      p = new THREE.ParticleSystem(p_geom, p_material);
      Background.scene.add(p);
   });

   Background.renderer = new THREE.WebGLRenderer({ alpha: true });
   Background.renderer.setSize(site.Width, site.Height);
   Background.renderer.setClearColor(0x000000, 0);

   $('.particlehead').append(Background.renderer.domElement);
   $('.particlehead').on('mousemove', onDocumentMouseMove);
   $('.particlehead').on('touchmove', onDocumentTouchMove);
   site.window.on('resize', onWindowResize);

   function onWindowResize() {
      site.Width = isMobile ? window.innerWidth : $(window).width();
      site.Height = isMobile ? window.innerHeight : $(window).height();
      windowHalfX = site.Width / 2;
      windowHalfY = site.Height / 2;

      Background.camera.aspect = site.Width / site.Height;
      Background.camera.updateProjectionMatrix();

      Background.renderer.setSize(site.Width, site.Height);
   }

   function onDocumentMouseMove(event) {
      mouseX = (event.clientX - windowHalfX) / 2;
      mouseY = (event.clientY - windowHalfY) / 2;
   }

   function onDocumentTouchMove(event) {
      if (event.touches.length === 1) {
         const touch = event.touches[0];
         mouseX = (touch.clientX - windowHalfX) / 2;
         mouseY = (touch.clientY - windowHalfY) / 2;
      }
   }

   Background.animate = function () {
      Background.ticker = TweenMax.ticker;
      Background.ticker.addEventListener("tick", Background.animate);
      render();
   }

   function render() {
      Background.camera.position.x += ((mouseX * 0.5) - Background.camera.position.x) * 0.05;
      Background.camera.position.y += ((-mouseY * 0.5) - Background.camera.position.y) * 0.05;
      Background.camera.lookAt(Background.scene.position);
      Background.renderer.render(Background.scene, Background.camera);
   }

   render();
   Background.animate();
};
