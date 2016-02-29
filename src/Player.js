/**
 * Created by haowang on 2/28/16.
 */
var Player = function (game) {
    GameObject.call(this, "player", game);

    //var _player = game.assets['apple'].meshes[0];
    var _player = BABYLON.Mesh.CreateSphere("player", 16, 1.0, game.scene, false);

    _player.isVisible = true;
    _player.parent = this;
    // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
    //var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 1, this.scene);

     //Move the sphere upward 1/2 its height
    _player.position.y = 1;
    _player.checkCollisions = true;
    _player.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(0, 0, 0);

    return _player;
};

// Our object is a GameObject
Player.prototype = Object.create(GameObject.prototype);
Player.prototype.constructor = Player;