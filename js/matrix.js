    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff); // White background
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: document.getElementById('matrixCanvas') });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const fontLoader = new THREE.FontLoader();
    const matrixGroup = new THREE.Group();
    scene.add(matrixGroup);

    // Load font for 3D characters
    fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
      for (let i = 0; i < 1000; i++) {
        const textGeometry = new THREE.TextGeometry((Math.random() > 0.5 ? '1' : '0'), {
          font: font,
          size: 0.5,
          height: 0.1,
        });

        const textMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);

        // Randomize positions
        textMesh.position.set(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        );

        textMesh.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        );

        matrixGroup.add(textMesh);
      }

      const light = new THREE.PointLight(0xffffff, 1, 100);
      light.position.set(10, 10, 10);
      scene.add(light);

      // Track mouse movement
      const mouse = { x: 0, y: 0 };
      let gyroEnabled = false;
      let gyroX = 0, gyroY = 0;

      document.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      });

      if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        window.addEventListener('deviceorientation', (event) => {
          gyroEnabled = true;
          gyroX = event.gamma || 0;
          gyroY = event.beta || 0;
        });
      }

      // Animate and interact
      const animate = () => {
        requestAnimationFrame(animate);

        // Interaction: Move the group based on input
        const targetX = gyroEnabled ? gyroX * 0.1 : -mouse.x * 2;
        const targetY = gyroEnabled ? gyroY * 0.1 : -mouse.y * 2;

        matrixGroup.position.x += (targetX - matrixGroup.position.x) * 0.05;
        matrixGroup.position.y += (targetY - matrixGroup.position.y) * 0.05;

        // Swirling effect
        matrixGroup.rotation.y += 0.0005; // Slower rotation

        renderer.render(scene, camera);
      };

      animate();
    });

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });