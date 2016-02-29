/**
 * Created by haowang on 2/28/16.
 */
var Cone = function (game) {
    GameObject.call(this, "Cone", game);
    var _cone = BABYLON.Mesh.CreateBox("cone", 1, game.scene, false);;
    _cone.scaling.x = 1;
    _cone.scaling.y = 1;
    _cone.isVisible = true;
    _cone.parent = this;
    _cone.receiveShadows = true;

    return _cone;
};

// Our object is a GameObject
Cone.prototype = Object.create(GameObject.prototype);
Cone.prototype.constructor = Cone;