/**
 * Created by haowang on 2/27/16.
 */

var GameObject = function(name, game) {
    // Call the super class BABYLON.Mesh
    BABYLON.Mesh.call(this, name, game.scene);

    this.game = game;
};

// Our object is a BABYLON.Mesh
GameObject.prototype = Object.create(BABYLON.Mesh.prototype);
// And its constructor is the GameObject function described above.
GameObject.prototype.constructor = GameObject;