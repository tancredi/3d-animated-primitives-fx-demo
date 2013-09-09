/* global app, THREE, jQuery */

(function ($) {

    'use strict';

    var environment,
        controls,
        start = new Date().getTime(),
        lights = [],
        toruses = [],
        floor,
        DEBUG = false;

    function init () {
        environment = new app.Environment($('#stage'));
        environment.addStats();
        environment.init();

        environment.camera.position.z = 6;
        environment.camera.position.y = -8;
        environment.camera.rotation.x = 0.9;

        environment.onUpdate(function () {
            update();
        });
    }

    function update () {
        var elapsed = start - new Date().getTime(),
            lightsDist = 20,
            i, deg, rad, a, b;

        for(i = 0; i < lights.length; i += 1) {
            deg = 360 / lights.length * i;
            rad = app.helpers.math.degToRad(deg);

            lights[i].position.x = Math.sin(rad + elapsed / 500) * lightsDist;
            lights[i].position.y = Math.cos(rad + elapsed / 500) * lightsDist;
        }

        for(i = 0; i < toruses.length; i += 1) {
            a = Math.sin(elapsed / 300000);
            b = Math.cos(elapsed / 1000);
            if (i % 3 === 0) {
                a *= -1;
            }
            if (i % 2 === 0) {
                b *= -1;
            }
            toruses[i].rotation.z = a * 100;
            toruses[i].position.z = 0 + b / 2 * i;
        }

        floor.rotation.z += 0.01;
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
            geometry.vertices[i].z =  - Math.random() * 10;
        }

        geometry.computeCentroids();
        geometry.computeFaceNormals();
        geometry.computeVertexNormals();

        compound.position.z = -5;

        compound.castShadow = true;
        compound.receiveShadow = true;

        environment.scene.add(compound);
        floor = compound;
    }

    function addToruses () {
        var r = 4,
            materials = [ app.materials.fillingMaterialDark, app.materials.wireframeMaterial ],
            compound, i, geometry;

        for (i = 0; i < 8; i += 1) {
            geometry = new THREE.TorusGeometry(r, 0.2, 6, 25, 0);
            compound = THREE.SceneUtils.createMultiMaterialObject(geometry, materials);
            compound.castShadow = true;
            compound.receiveShadow = true;
            environment.scene.add(compound);
            toruses.push(compound);
            r -= 0.5;
        }
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
    addToruses();
    addLights();
    addSunLight();

    addControls();

    if (DEBUG) {
        addAxes();
    }

}(jQuery));