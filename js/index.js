/* global app, THREE, jQuery */

(function ($) {

    'use strict';

    var environment,
        controls,
        origin = new THREE.Vector3(0, 0, 0),
        dist = 8,
        start = new Date().getTime(),
        lights = [],
        DEBUG = true;

    function init () {
        environment = new app.Environment($('#stage'));
        environment.addStats();
        environment.init();

        environment.camera.position.z = 1.9;
        environment.camera.position.y = -6;
        environment.camera.rotation.x = 1.1;

        environment.onUpdate(function () {
            update();
        });
    }

    function update () {
        var elapsed = start - new Date().getTime(),
            lightsDist = 20,
            i, deg, rad;

        for(i = 0; i < lights.length; i += 1) {
            deg = 360 / lights.length * i;
            rad = app.helpers.math.degToRad(deg);

            lights[i].position.x = Math.sin(rad + elapsed / 500) * lightsDist;
            lights[i].position.y = Math.cos(rad + elapsed / 500) * lightsDist;
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
        var geometry = new THREE.PlaneGeometry(100, 100, 50, 50),
            materials = [ app.materials.fillingMaterialDark, app.materials.wireframeMaterial ],
            compound = THREE.SceneUtils.createMultiMaterialObject(geometry, materials),
            i;

        for (i = 0; i < geometry.vertices.length; i += 1) {
            geometry.vertices[i].z =  - Math.random() * 0.5;
        }

        geometry.computeCentroids();
        geometry.computeFaceNormals();
        geometry.computeVertexNormals();

        compound.position.z = -2;

        environment.scene.add(compound);
    }

    function addArena () {
        var geometry = new THREE.TorusGeometry(3.8, 0.2, 6, 25, 0),
            materials = [ app.materials.fillingMaterialDark, app.materials.wireframeMaterial ],
            compound = THREE.SceneUtils.createMultiMaterialObject(geometry, materials);

        environment.scene.add(compound);
    }

    function addLights () {
        var light,
            str = 2,
            spr = 40,
            count = 3,
            col = new THREE.Color(),
            hsl = { l: 0.8, s: 1, h: 0 },
            distV = 0,
            i, centralLight;

        for(i = 0; i < count; i += 1) {
            hsl.h = 1 / count * i;
            col.setHSL(hsl.h, hsl.s, hsl.l);
            light = new THREE.PointLight(col, str, spr);
            light.position.z = distV;
            lights.push(light);
            environment.scene.add(light);
        }

        centralLight = new THREE.PointLight(0xffffff, 10, 10);
        centralLight.position.z = 7;
        environment.scene.add(centralLight);
    }

    function addSunLight () {
        var a = new THREE.DirectionalLight(0xff3300),
            b = new THREE.DirectionalLight(0x0033ff),
            c = new THREE.DirectionalLight(0x227722);

        a.position.set(-2, 10, 1).normalize();
        b.position.set(2, 10, 1).normalize();
        c.position.set(2, 10, 2).normalize();

        a.intensity = b.intensity = c.intensity = 2;

        environment.scene.add(a);
        environment.scene.add(b);
        environment.scene.add(c);
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