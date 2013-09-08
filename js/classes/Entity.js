/* global app, THREE */

(function () {

    'use strict';

    var Entity,
        defaults = {
          color = 0xcccccc
        };

    Entity = function (scene, geometry, options) {
        var conf = $.extend(true, {}, defaults, options);

        this.scene = scene;
        this.geometry = geometry;

        this.init();
    };

    Entity.prototype.init = function () {
    };

    Entity.prototype.update = function () {
    };

    app.Entity = Entity;

}());