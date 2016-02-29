/**
 * Created by haowang on 2/28/16.
 */
var Apple = function(game) {
    // Call the super class BABYLON.Mesh
    GameObject.call(this, "apple", game);

    var apple = game.assets['apple'].meshes[0].clone();

    apple.isVisible = true;
    apple.parent = this;

    apple.receiveShadows = false;

    // Move the sphere upward 1/2 its height
    //apple.position.y = 3;
    //apple.position.x = 5;

};
// Our object is a GameObject
Apple.prototype = Object.create(GameObject.prototype);
// And its constructor is the Key function described above.
Apple.prototype.constructor = Apple;
