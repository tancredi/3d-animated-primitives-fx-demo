/* global app, THREE */

(function () {

    'use strict';

    app.materials = {

      wireframeMaterialDark: new THREE.MeshLambertMaterial({
          color: 0x151515,
          wireframe: true,
          transparent: true,
          overdraw: true
      }),

      fillingMaterialDark: new THREE.MeshLambertMaterial({
          shading: THREE.FlatShading,
          color: 0x333333
      }),

      wireframeMaterialLight: new THREE.MeshLambertMaterial({
          color: 0xaaaaaa,
          wireframe: true,
          transparent: true,
          overdraw: true
      }),

      fillingMaterialLight: new THREE.MeshLambertMaterial({
          shading: THREE.FlatShading,
          color: 0xdddddd
      })

    };

}());