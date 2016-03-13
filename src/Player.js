/**
 * Created by haowang on 2/28/16.
 */
var Player = function (game) {
    GameObject.call(this, "player", game);

    //var _player = game.assets['apple'].meshes[0];
    //var _player = BABYLON.Mesh.CreateSphere("player", 16, 1.0, game.scene, false);

    var _player = game.assets['Football'].meshes[0].clone();

    _player.isVisible = true;
    _player.parent = this;
    // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
    //var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 1, this.scene);

     //Move the sphere upward 1/2 its height
    _player.position.y = 2;
    _player.checkCollisions = true;
    _player.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(0, 0, 1);
    _player.setPhysicsState({ impostor: BABYLON.PhysicsEngine.SphereImpostor, mass: 3, friction: 0.5, restitution: 0.3 });
    _player.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
    _player.material.emissiveColor = new BABYLON.Color3(1, 1, 1);

    //var playerMaterial = new BABYLON.StandardMaterial("playerMaterial", game.scene);
    //playerMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    //playerMaterial.diffuseTexture = new BABYLON.Texture("assets/balls/PlatonicSurface_Color.jpg", game.scene);
    //playerMaterial.diffuseTexture.uScale = 1;
    //playerMaterial.diffuseTexture.vScale = 1;
    //_player.material = playerMaterial;

    return _player;
};

// Our object is a GameObject
Player.prototype = Object.create(GameObject.prototype);
Player.prototype.constructor = Player;