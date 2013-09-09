/* global app, THREE, jQuery */

(function ($) {

    'use strict';

    var environment,
        controls,
        // origin = new THREE.Vector3(0, 0, 0),
        start = new Date().getTime(),
        lights = [],
        DEBUG = false;

    function init () {
        environment = new app.Environment($('#stage'));
        environment.addStats();
        environment.init();

        environment.camera.position.y = 5;
        environment.camera.position.z = 3.2;
        environment.camera.rotation.x = app.helpers.math.degToRad(-65);

        environment.onUpdate(function () {
            update();
        });
    }

    function update () {
        var elapsed = start - new Date().getTime(),
            lightsDist = 5,
            i, deg, rad;

        for(i = 0; i < lights.length; i += 1) {
            deg = 360 / lights.length * i;
            rad = app.helpers.math.degToRad(deg);

            lights[i].position.x = Math.sin(rad + elapsed / 3000) * lightsDist;
            lights[i].position.z = Math.cos(rad + elapsed / 3000) * lightsDist;
        }
    }

    function addAxes () {
        var axes = new THREE.AxisHelper(100);
        environment.scene.add(axes);
    }

    function addControls () {
        controls = new THREE.OrbitControls(environment.camera, environment.renderer.domElement);
    }

    function addFloor() {
        var geometry = new THREE.PlaneGeometry(10, 10, 5, 5),
            materials = [ app.materials.fillingMaterialDark, app.materials.wireframeMaterialDark ],
            floor = THREE.SceneUtils.createMultiMaterialObject(geometry, materials),
            i;

        for (i = 0; i < geometry.vertices.length; i += 1) {
            geometry.vertices[i].z = -Math.random() * 0.6;
            geometry.vertices[i].x += Math.random() * 0.2;
            geometry.vertices[i].y += Math.random() * 0.2;
        }

        geometry.computeCentroids();
        geometry.computeFaceNormals();
        geometry.computeVertexNormals();

        floor.position.y = 0.15;
        floor.rotation.x = app.helpers.math.degToRad(-90);

        environment.scene.add(floor);
    }

    function addArena () {
        var rotateX = app.helpers.math.degToRad(-90),
            batAngle = app.helpers.math.degToRad(120),
            arenaGeometry = new THREE.TorusGeometry(5, 2, 10, 25, 0),
            playerBatGeometry = new THREE.TorusGeometry(2.5, 0.2, 6, 10, batAngle),
            materialsDark = [ app.materials.fillingMaterialDark, app.materials.wireframeMaterialDark ],
            materialsLight = [ app.materials.fillingMaterialLight, app.materials.wireframeMaterialDark ],
            arena = THREE.SceneUtils.createMultiMaterialObject(arenaGeometry, materialsDark),
            playerBat = THREE.SceneUtils.createMultiMaterialObject(playerBatGeometry, materialsLight);

        environment.scene.add(arena);
        arena.rotation.x = rotateX;

        environment.scene.add(playerBat);
        playerBat.position.y += 0.5;
        playerBat.rotation.x = rotateX;
    }

    function addLights () {
        var light,
            str = 1,
            spr = 8,
            count = 6,
            col = new THREE.Color(),
            hsl = { l: 0.8, s: 1, h: 0 },
            distV = 5,
            i, centralLight;

        for(i = 0; i < count; i += 1) {
            hsl.h = 1 / count * i;
            col.setHSL(hsl.h, hsl.s, hsl.l);
            light = new THREE.PointLight(col, str, spr);
            light.position.y = distV;
            lights.push(light);
            environment.scene.add(light);
        }

        centralLight = new THREE.PointLight(0xffffff, 3, 6);
        centralLight.position.y = 0;
        environment.scene.add(centralLight);
    }

    function addSunLight () {
        var a = new THREE.DirectionalLight(0xfe9111),
            b = new THREE.DirectionalLight(0x1191fe);

        a.position.set(-20, 0, 0).normalize();
        b.position.set(200, 0, 0).normalize();

        a.intensity = b.intensity = 0.2;

        environment.scene.add(a);
        environment.scene.add(b);
    }

    init();

    addFloor();
    addArena();
    addLights();
    addSunLight();

    addControls();

    if (DEBUG) {
        addAxes();
    }

}(jQuery));