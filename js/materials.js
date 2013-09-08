/* global app, THREE */

(function () {

    'use strict';

    app.materials = {

      wireframeMaterial: new THREE.MeshPhongMaterial({
          color: 0x444444,
          wireframe: true,
          transparent: true,
          overdraw: true
      }),

      fillingMaterialDark: new THREE.MeshPhongMaterial({
          shading: THREE.FlatShading,
          color: 0x222222
      })

    };

}());