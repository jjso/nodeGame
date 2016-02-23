var Player = function() {
	this.id = 0;
	this.radius = 10;
	this.segments = 16;
	this.rings = 16;
	this.geometry = new THREE.SphereGeometry(
			this.radius,
			this.segments,
			this.rings);
	THREE.Mesh.call( this, this.geometry, this.material );
	//Set character properties
	this.type = 'Player';
	this.speed = 1;
	this.material = new THREE.MeshPhongMaterial(
	{
		color: 0xCC0000
	});
	//Rotating the character
	this.rotation.x += 0.1;
	this.rotation.y += 0.1;
	//Moving the character based on Keys.js
	this.move = function(keys){
		var updated = false;
		if(keys.up){
			this.position.z -= this.speed;
			updated = true;
		}
		if(keys.down){
			this.position.z += this.speed;
			updated = true;
		}
		if(keys.left){
			this.position.x -= this.speed;
			updated = true;
		}
		if(keys.right){
			this.position.x += this.speed;
			updated = true;
		}
		return updated;
	}
}
//change color 
//this.material.color.setHex(0x1dff00);

Player.prototype = Object.create( THREE.Mesh.prototype );
Player.prototype.constructor = Player;



