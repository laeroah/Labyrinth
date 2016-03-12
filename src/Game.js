/**
 * Created by haowang on 2/28/16.
 */
$( document ).ready(function() {
    new Game("gameCanvas");
}, false);

var orientationGamma = 0;
var orientationBeta = 0;
var initialOrientationGamma = 0;
var initialOrientationBeta = 0;
var direction = new BABYLON.Vector3(0, 0, 0);
var speed = 0.01;
var scale = 1;

// textures
var groundMat;

// The player's ball
var player;

var Game = function(canvasId) {
    var canvas  = document.getElementById(canvasId);
    this.engine = new BABYLON.Engine(canvas, true);

    // BABYLON Scene creation
    this.scene  = this._initScene(this.engine);

    // Contains all 3D models
    this.assets = [];

    // Creates a loader
    var loader =  new BABYLON.AssetsManager(this.scene);
    loader.loadingUIBackgroundColor = "#2c2b29";

    var _this = this;

    // All models to load
    var toLoad = [
        {
            name:"Football",
            folder:"assets/balls/",
            filename:"soccer_ball.babylon",
            anims : []
        },
        {
            name:"apple",
            folder:"assets/apple/",
            filename:"apple.babylon",
            anims : []
        }
    ];

    // For each object to load
    toLoad.forEach(function(tl) {

        var task = loader.addMeshTask(tl.name, "", tl.folder, tl.filename);
        task.onSuccess = function(t) {
            // Set all mesh invisible
            t.loadedMeshes.forEach(function(mesh) {
                mesh.isVisible = false;
            });
            // Save it in the asset array
            _this.assets[t.name] = {meshes:t.loadedMeshes, anims:tl.anims};
        };
    });

    loader.onFinish = function () {
        // Init the game
        _this._initGame();

        _this.engine.runRenderLoop(function () {
            _this.scene.render();

            _this.moveBall();
        });
    };
    loader.load();

    //this.scene.debugLayer.show();
};

Game.prototype._initScene = function(engine) {
    // BABYLON Scene creation
    var scene  = new BABYLON.Scene(engine);
    // The camera, necessary see the world
    // Follow camera
    var camera = new BABYLON.FreeCamera("mainCamera", new BABYLON.Vector3(0,25,0), scene);
    camera.setTarget(BABYLON.Vector3.Zero());

    // The ambient light
    var light  = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0,1,0), scene);
    light.intensity = 0.7;

    //var dl = new BABYLON.DirectionalLight("dir", new BABYLON.Vector3(1,-1,-0.5), scene);
    //dl.position = new BABYLON.Vector3(0, 40, 0);

    scene.enablePhysics(new BABYLON.Vector3(0, -0.8, 0), new BABYLON.OimoJSPlugin());

    // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
    var ground = BABYLON.Mesh.CreateBox("ground", 100, scene);
    ground.scaling.y = 0.01;
    ground.position.y = 0;
    var groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
    groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    groundMaterial.diffuseTexture = new BABYLON.Texture("assets/textures/wood.png", scene);
    groundMaterial.diffuseTexture.uScale = 2;
    groundMaterial.diffuseTexture.vScale = 2;
    ground.material = groundMaterial;
    ground.receiveShadows = true;
    //ground.renderingGroupId = 1;
    ground.position.y = 0;
    ground.setPhysicsState({ impostor: BABYLON.PhysicsEngine.BoxImpostor, mass: 0, friction: 0.5, restitution: 0.7 });

    var _this = this;

    gyro.frequency = 10;
    // start gyroscope detection
    gyro.startTracking(function(evt) {
        // updating player velocity
        _this.updateMomentum(evt);
    });

    return scene;
};

Game.prototype._initGame = function() {

    groundMat = new BABYLON.StandardMaterial("wall", this.scene);
    groundMat.diffuseTexture = new BABYLON.Texture("assets/textures/wall.jpg", this.scene);

    player = new Player(this);
    player.setPhysicsState({ impostor: BABYLON.PhysicsEngine.SphereImpostor, mass: 1, friction: 0.5, restitution: 0.7 });
    //var a = new Apple(this);

    //// Debug Layer
    //this.scene.debugLayer.show();

    this.showLevel();
};

Game.prototype.updateMomentum = function(evt) {
    //if (!started) {
    //    return;
    //}

    if (!initialOrientationGamma) {
        initialOrientationGamma = evt.gamma;
        initialOrientationBeta = evt.beta;
    }

    orientationGamma = evt.gamma;
    //if (orientationGamma > 5) {
    //    orientationGamma = 5;
    //}
    //if (orientationGamma < -5) {
    //    orientationGamma = -5;
    //}

    orientationBeta = evt.beta;
    //if (orientationBeta > 5) {
    //    orientationBeta = 5;
    //}
    //if (orientationBeta < -5) {
    //    orientationBeta = -5;
    //}
};

Game.prototype.moveBall = function () {

    // Compute direction
    if (orientationGamma) {
        var z = (initialOrientationBeta - orientationBeta) * 0.05;
        var x = (initialOrientationGamma - orientationGamma) * -0.05;
        direction.addInPlace(new BABYLON.Vector3(0, 0, z * speed * scale));
        direction.addInPlace(new BABYLON.Vector3(x * speed * scale, 0, 0));
    }

    if (player == undefined) { alert("undefined player"); }

    var force = direction;
    player.applyImpulse(force, player.position);
    var rotationToApply = BABYLON.Quaternion.RotationYawPitchRoll(0, direction.z * 1.5, -direction.x * 1.5);
    player.rotationQuaternion = rotationToApply.multiply(player.rotationQuaternion);

    var position = player.position.clone();
    position.y = 1;
    player.position = position;

    direction.scaleInPlace(0.95);
};

Game.prototype.showLevel = function () {

    for (var i=-6.5; i<7; i++) {
        var cone = new Cone(this);
        cone.position = new BABYLON.Vector3(i, 1, 9.5);
        cone.material = groundMat;
        cone.setPhysicsState({ impostor: BABYLON.PhysicsEngine.BoxImpostor, mass: 0, friction: 0.5, restitution: 0.7 });
    }

    for (var i=-6.5; i<7; i++) {
        var cone = new Cone(this);
        cone.position = new BABYLON.Vector3(i, 1, -9.3);
        cone.material = groundMat;
        cone.setPhysicsState({ impostor: BABYLON.PhysicsEngine.BoxImpostor, mass: 0, friction: 0.5, restitution: 0.7 });
    }

    for (var i=-8.5; i<9.5; i++) {
        var cone = new Cone(this);
        cone.position = new BABYLON.Vector3(-6.5, 1, i);
        cone.material = groundMat;
        cone.setPhysicsState({ impostor: BABYLON.PhysicsEngine.BoxImpostor, mass: 0, friction: 0.5, restitution: 0.7 });
    }

    for (var i=-8.5; i<9.5; i++) {
        var cone = new Cone(this);
        cone.position = new BABYLON.Vector3(6.5, 1, i);
        cone.material = groundMat;
        cone.setPhysicsState({ impostor: BABYLON.PhysicsEngine.BoxImpostor, mass: 0, friction: 0.5, restitution: 0.7 });
    }

};