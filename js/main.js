
  console.clear();
      var camera,scene,effect,controls,element,container,spotlight,rotationPoint;
      var plant;
      const plantGroup = new THREE.Group();
      var clock;
      var time;
        
      var stats;
      var floorTerrain;
      var globe;
      var date = new Date();

      var terrainGeo = new THREE.PlaneGeometry( 400, 400, 12, 12 );
     const canvas = document.querySelector('#canvas-container');

      const renderer = new THREE.WebGLRenderer({canvas, alpha: true});


    const patternA = "http://i6.cims.nyu.edu/~mmw480/drawing/hw8/textures/greenpattern.jpg";
    const patternB = "http://i6.cims.nyu.edu/~mmw480/drawing/hw8/textures/patternCarpet.jpg";
    const patternC = "http://i6.cims.nyu.edu/~mmw480/drawing/hw8/textures/bluecarpet.jpg";


    function myFunction() {
        var pat =document.getElementById("selection").value;
        if(pat=="a") {
          init(patternA);
        }
        else if (pat=="b") {
          init(patternB);
        }
        else {       
        init(patternC);
        }


      }

  
      function usePatternA() {
        init(patternA);

      }
      function usePatternB() {
        init(patternB);

      }
      function usePatternC() {
        init(patternC);

      }



      
      function init(pattern) {
      // container.addEventListener('click', onDocumentMouseDown, false);
      var WIDTH = 700;
      var HEIGHT = 500;
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera( 60, WIDTH / HEIGHT, 1, 80000 );
      // camera.position.y = 30;
      // camera.position.z = 80;
      camera.position.y = 80;
      camera.position.z = 325;
      // camera.position.x = 0;
      // camera.position.set(0, 300, 700);
      renderer.setClearColor(0xDDDDDD, 1);
      renderer.setSize( WIDTH, HEIGHT);
      renderer.shadowMapEnabled = true;
      renderer.shadowMapType = THREE.PCFSoftShadowMap;
    //   canvas.appendChild( renderer.domElement );

      stats = new Stats();
    stats.setMode(0); // 0: fps, 1: ms
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.right = '0px';
    canvas.appendChild(stats.domElement); //*/
    
    clock = new THREE.Clock();

      var shadowMaterial = new THREE.ShadowMaterial( { color: 0xeeeeee } );
      shadowMaterial.opacity = 0.5;
      // Lights
      var light = new THREE.HemisphereLight(0x333333, 0x000000, 1);
      scene.add(light);
      // Build the controls.
      controls = new THREE.OrbitControls( camera, element );
      controls.enablePan = true;
      controls.enableZoom = true;
      controls.maxDistance = 1;
      controls.minDistance = 1;
      controls.maxPolarAngle = Math.PI / 2;
      controls.target.copy( new THREE.Vector3( 0, 0, 0 ) );
      var ambient = new THREE.AmbientLight( 0x555555);
      scene.add( ambient );
        // create all objects - functions
        // createFloor();
        createWalls(pattern);
        createCeiling(pattern);
        createChair();
        createChair2();
        // createSnakePlant()
        createGlobe(pattern);
        terrain2(pattern);
        // createTable();
        // createPlant();

        spotLight = new THREE.SpotLight( 0xcc0000, 0.7 );
        spotLight.position.set( 145, 55, 175 );
        spotLight.castShadow = true;
        spotLight.shadowCameraVisible = true;
        spotLight.shadow.mapSize.width = 1000;
        spotLight.shadow.mapSize.height = 1000;
        spotLight.shadow.camera.near = 50;
        spotLight.shadow.camera.far = 400;
        spotLight.shadow.camera.fov = 30;
        scene.add( spotLight );
        // cast shadows
        var pointLight = new THREE.PointLight(0x995500, 1, 200);
        pointLight.position.set(-50, 55, -100);
        pointLight.castShadow = true;
        pointLight.shadow.mapSize.width = 1024;
        pointLight.shadow.mapSize.height = 1024;
        scene.add(pointLight);
          canvas.addEventListener('resize', onWindowResize, false);
      }
        function onWindowResize() {
          camera.aspect = canvas.innerWidth / canvas.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(canvas.innerWidth, canvas.innerHeight);
        }
      
        // create plant object
        function createSnakePlant() {
          var mtlLoader = new THREE.MTLLoader();
          mtlLoader.load('http://i6.cims.nyu.edu/~mmw480/drawing/hw8/snakeplant2.mtl', function (materials) {
              materials.preload();
              var objLoader = new THREE.OBJLoader();
              objLoader.setMaterials(materials);
              objLoader.load('http://i6.cims.nyu.edu/~mmw480/drawing/hw8/snakeplant2.obj', function (snakePlant) {
                  snakePlant.scale.x = 15;
                  snakePlant.scale.y=15;
                  snakePlant.scale.z=15;
                  snakePlant.position.y=-90;
                  snakePlant.position.x=100;
                  snakePlant.position.z=20;

                  // snakePlant.position.set(-60, 60, 60);
                  snakePlant.castShadow=true;
                  snakePlant.receiveShadow=true;

                  scene.add(snakePlant);
              });
          });
        }


        function createPlant(pattern) {
          scene.add(plantGroup);
          var loader = new THREE.TextureLoader();
          loader.crossOrigin = "";
          // create pot of plant
          loader.load(pattern, function( texture ) {
              texture.anisotropy = renderer.getMaxAnisotropy();
              texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
              texture.repeat.set(2, 2);

              var potMat = new THREE.MeshPhongMaterial({map: texture });
              var potGeo = new THREE.CylinderGeometry( 10, 8, 18, 12 );
              var pot = new THREE.Mesh(potGeo, potMat);
              pot.position.set(0, -25, 60);
              // potGeo.rotation.x = -Math.PI/2;
              pot.receiveShadow = true;
              plantGroup.add(pot);
          });
          // create shrub for plant
          loader.load( pattern, function( texture ) {
              texture.anisotropy = renderer.getMaxAnisotropy();
              texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            //   texture.repeat.set(2, 2);

              var shrubMat = new THREE.MeshPhongMaterial({map: texture });
              var shrubGeo = new THREE.IcosahedronGeometry( 18, 1 );
              var shrub = new THREE.Mesh(shrubGeo, shrubMat);
              shrub.position.set(0, -5, 60);
              // shrubGeo.rotation.x = -Math.PI/2;
              shrub.receiveShadow = true;
              plantGroup.add(shrub);
          });
        }
        function createGlobe(pattern) {
          var loader = new THREE.TextureLoader();
          loader.crossOrigin = "";
          loader.load( pattern, function( texture ) {
            texture.anisotropy = renderer.getMaxAnisotropy();
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            var material = new THREE.MeshPhongMaterial({map: texture, flatShading: true });
            var geometry = new THREE.SphereGeometry(30, 20, 20, 0, Math.PI * 2, 0, Math.PI * 2);
             globe = new THREE.Mesh(geometry, material);
            globe.position.set(0, 100, -70);
            globe.receiveShadow = true;
            globe.castShadow = true;

            scene.add(globe);
          });
        }
        function createChair() {
          var mtlLoader = new THREE.MTLLoader();
          mtlLoader.load('http://i6.cims.nyu.edu/~mmw480/drawing/hw8/chair2.mtl', function (materials) {
              materials.preload();
              var objLoader = new THREE.OBJLoader();
              objLoader.setMaterials(materials);
              objLoader.load('http://i6.cims.nyu.edu/~mmw480/drawing/hw8/chair2.obj', function (chair) {
                  chair.scale.x = 15;
                  chair.scale.y=15;
                  chair.scale.z=15;
                  chair.rotation.y=90;
                  chair.position.z=-40;
                  chair.position.y=-70;
                  chair.position.x=-50;

                  // chair.position.set(-60, 60, 60);
                  chair.castShadow=true;
                  chair.receiveShadow=true;

                  scene.add(chair);
              });
          });
        }

        function createChair2() {
          var mtlLoader = new THREE.MTLLoader();
          mtlLoader.load('http://i6.cims.nyu.edu/~mmw480/drawing/hw8/chair2.mtl', function (materials) {
              materials.preload();
              var objLoader = new THREE.OBJLoader();
              objLoader.setMaterials(materials);
              objLoader.load('http://i6.cims.nyu.edu/~mmw480/drawing/hw8/chair2.obj', function (chair) {
                  chair.scale.x = 15;
                  chair.scale.y=15;
                  chair.scale.z=15;
                  chair.rotation.y=89.2;
                  chair.position.z=-10;
                  chair.position.y=-70;
                  chair.position.x=130;

                  // chair.position.set(-60, 60, 60);
                  chair.castShadow=true;
                  chair.receiveShadow=true;

                  scene.add(chair);
              });
          });
        }

        // create table function
        function createTable() {
          var mtlLoader = new THREE.MTLLoader();
          mtlLoader.load('http://i6.cims.nyu.edu/~mmw480/drawing/hw8/table5.mtl', function (materials) {
            materials.preload();
            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load('http://i6.cims.nyu.edu/~mmw480/drawing/hw8/table5.obj', function (boxObj) {
                boxObj.scale.x = 10;
                boxObj.scale.y=10;
                // boxObj.rotation.x=170;
                boxObj.position.y=-50;
                boxObj.position.z=100;
                boxObj.scale.z=10;
                boxObj.castShadow = true;
                boxObj.receiveShadow = true;
                scene.add(boxObj);
            });
        });
        }
      
        // create walls function
        function createWalls(pattern) {
          var loader = new THREE.TextureLoader();
          var material;
          loader.load( pattern, function( texture ) {
            texture.anisotropy = renderer.getMaxAnisotropy();
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(2, 2);
            var material = new THREE.MeshPhongMaterial({ map: texture });

            for (var i = 0; i <= 3; i++) {
              var wallGeo = new THREE.PlaneGeometry( 400, 900 );
              var wall = new THREE.Mesh(wallGeo, material);
              if (i == 0) {
                wall.position.set(200, 100, 0);
                wall.rotation.y = -Math.PI/2;
              } else if (i == 1) {
                wall.position.set(-200, 100, 0);
                wall.rotation.y = Math.PI/2;
              } else if (i == 2) {
                wall.position.set(0, 100, 200);
                wall.rotation.y = Math.PI;
              } else {
                wall.position.set(0, 100, -200);
              }
              wall.receiveShadow = true;
              scene.add(wall);
            }
          });
        }
     
       
    function createCeiling(pattern) {
      // Create the ceiling.
      var loader = new THREE.TextureLoader();
      loader.crossOrigin = "";
      loader.load(pattern, function( texture ) {
        texture.anisotropy = renderer.getMaxAnisotropy();
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(2, 2);
        var normal = loader.load( pattern);
        normal.anisotropy = renderer.getMaxAnisotropy();
        normal.wrapS = normal.wrapT = THREE.RepeatWrapping;
        normal.repeat.set(2, 2);
        var material = new THREE.MeshPhongMaterial({
          color: 0xffffff,
          specular: 0xffffff,
          map: texture,
          normalMap: normal,
        });
        var geometry = new THREE.PlaneGeometry( 400, 400 );
        var ceiling = new THREE.Mesh(geometry, material);
        ceiling.position.set(0, 175, 0);
        ceiling.rotation.x = Math.PI/2;
        scene.add(ceiling);
      });
    }


    function terrain() {
      let material = new THREE.MeshLambertMaterial({wireframe: true, color: 0xffffff, side: THREE.DoubleSide});
      var geometry = new THREE.PlaneGeometry( 400, 400 , 20, 20);
      mesh = new THREE.Mesh(geometry, material);
      console.log(mesh.geometry.vertices.length);
      for (let i = 0; i < mesh.geometry.vertices.length; i++) {
          mesh.geometry.vertices[i].z = Math.floor(Math.random() * 100);
      }
      mesh.rotation.x = -Math.PI / 2; 
      // mesh.rotation.y=180;
      mesh.position.y=-100;
      geometry.computeVertexNormals();
      scene.add(mesh);
      // animate();
    }

    function terrain2(pattern) {

var loader = new THREE.TextureLoader();
    loader.crossOrigin = "";
    // create pot of plant
    loader.load( pattern, function( texture ) {
        texture.anisotropy = renderer.getMaxAnisotropy();
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(2, 2);
        var material = new THREE.MeshPhongMaterial({map: texture });
        floorTerrain = new THREE.Mesh(terrainGeo, material);
        floorTerrain.geometry.verticesNeedUpdate = true
        floorTerrain.geometry.computeFaceNormals();
        floorTerrain.geometry.computeVertexNormals();
        floorTerrain.geometry.dynamic = true;
        floorTerrain.geometry.normalsNeedUpdate = true;

        // console.log(terrainGeo.vertices.length);
        for (let i = 0; i < floorTerrain.geometry.vertices.length; i++) {
            floorTerrain.geometry.vertices[i].z = Math.floor(Math.random() * 10);
        }

        floorTerrain.rotation.x = -Math.PI / 2; 
        floorTerrain.position.y=-120;

        scene.add(floorTerrain);
        animate();
               
    });

    }

    canvas.addEventListener('resize', onWindowResize, false);

        function onWindowResize() {
            camera.aspect = canvas.innerWidth / canvas.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvas.innerWidth, canvas.innerHeight);
        }

        function windowResize() {
          camera.aspect = canvas.innerWidth / canvas.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(canvas.innerWidth, canvas.innerHeight);
        }
        
        function animate() {
            var t0 = performance.now() * 0.005;
            var t1 = t0 * 0.7;
            requestAnimationFrame( animate );
            camera.updateProjectionMatrix();
            spotLight.rotation.y += 0.005;
            globe.rotation.y += 0.01;

            var sinm = (v, m) => {
            return Math.sin(v) * m;
            }
            var noisefn = (x, y) => {
            return sinm((x * 4) + (y * 10) + t0, 1) + sinm((x * 11) + (y * 3) + t1, 3) + sinm((x * -9) + (y * 2) + t1, 4);
            }
            for(var i=0; i<floorTerrain.geometry.vertices.length; i++) {
            var vertex = floorTerrain.geometry.vertices[i];
            vertex.z = noisefn(vertex.x, vertex.y);
            if(vertex.z>50) vertex.z-=30;  
            floorTerrain.geometry.verticesNeedUpdate = true;
            floorTerrain.geometry.computeFaceNormals();
            floorTerrain.geometry.computeVertexNormals();
            }
            render();
            stats.update();

        }

        function render() {
          renderer.autoClearColor = true;
          renderer.render(scene, camera);

        

      }
