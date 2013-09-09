/* global app, Stats, THREE, jQuery */

(function ($) {

    'use strict';

    var Environment,
        defaults = {
            antialias: true
        },
        cameraDefaults = {
            angle: 60,
            near: 0.1,
            far: 10000
        },
        dpr = 1;

    if (typeof window.devicePixelRatio !== undefined) {
        dpr = window.devicePixelRatio;
    }

    Environment = function (el, options, cameraOptions) {
        var cameraConf = $.extend(true, {}, cameraDefaults, cameraOptions),
            conf = $.extend(true, {}, defaults, options);

        this.el = el;
        this.stage = new app.Stage(this.el);
        this.aspect = this.stage.width / this.stage.height;
        this.renderer = new THREE.WebGLRenderer({ antialias: conf.antialias });
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(cameraConf.angle, this.aspect, cameraConf.near, cameraConf.far);
        this.materialDepth = new THREE.MeshDepthMaterial();

        this.updateCallbacks = [];
    };

    Environment.prototype.init = function () {
        var effect, renderPass, copyPass;


        this.scene.add(this.camera);
        this.stage.setRenderer(this.renderer);
        this.renderer.setSize(this.stage.width, this.stage.height);

        this.composer = new THREE.EffectComposer(this.renderer);
        this.composer.setSize(this.stage.width * dpr, this.stage.height * dpr);

        renderPass = new THREE.RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);

        effect = new THREE.ShaderPass(THREE.RGBShiftShader);
        effect.uniforms.amount.value = 0.001;
        this.composer.addPass(effect);

        effect = new THREE.ShaderPass(THREE.HorizontalTiltShiftShader);
        effect.uniforms.r.value = 0.5;
        effect.uniforms.h.value = 0.005;
        this.composer.addPass(effect);

        effect = new THREE.FilmPass(0.0003, 1000, 1400, false);
        this.composer.addPass(effect);

        copyPass = new THREE.ShaderPass(THREE.CopyShader);
        copyPass.renderToScreen = true;
        this.composer.addPass(copyPass);


        this.animate();
    };

    Environment.prototype.animate = function () {
        var self = this;

        this.composer.render(this.scene, this.camera);

        this.update();

        window.requestAnimationFrame(function () {
            self.animate();
        });
    };

    Environment.prototype.update = function () {
        var i;

        if (this.stats) {
            this.stats.update();
        }

        for (i = 0; i < this.updateCallbacks.length; i += 1) {
            this.updateCallbacks[i](this);
        }
    };

    Environment.prototype.addStats = function () {
        this.stats = new Stats();
        $('body').append(this.stats.domElement);
    };

    Environment.prototype.onUpdate = function (cb) {
        if (typeof cb === 'function') {
            this.updateCallbacks.push(cb);
        }
    };

    app.Environment = Environment;

}(jQuery));