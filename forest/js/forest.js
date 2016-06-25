var container;
var camera, scene, renderer, parentTransform, sphereInter;

var mouse = new THREE.Vector2();
var vert = 0;
var materialColour = Math.random() * 0xffffff;

init();
animate();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = -0.5;
    scene = new THREE.Scene();

    var geometry = new THREE.SphereGeometry( 5 );
    var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    sphereInter = new THREE.Mesh( geometry, material );
    sphereInter.visible = false;
    scene.add( sphereInter );

    var geometry = new THREE.Geometry();

    // Create a 'template' line. This line will be copied multiple times below.
    // The line should have 10 points which are randomly generated.

    //The point variable holds a new point along the line, and gets reset each iteration of the loop
    var point = new THREE.Vector3();
    var newPoint = new THREE.Vector3();
    //The direction object retains previous values on each iteration of the loop
    var direction = new THREE.Vector3();

    // The line should have 10 points
    for ( var i = 0; i < 1000; i ++ ) {

        //Each point should waver in a random direction from the last point
        direction.x += Math.random() - 0.5;
        direction.y += Math.random() - 0.5;
        direction.z += Math.random() - 0.5;
        //direction.normalize().multiplyScalar( 10 );

        //Reset the point
        point.add( direction );

        newPoint.add( direction);

        //Add this point to the line
        geometry.vertices.push( point.clone() );

    }

    parentTransform = new THREE.Object3D();
    parentTransform.position.x = 1;
    parentTransform.position.y = 1;
    parentTransform.position.z = 1;

    //Add a total of 50 lines
    for ( var i = 0; i < 1; i ++ ) {

        var material = new THREE.LineBasicMaterial({
            color: materialColour
        });

        //create a new geometry holder
        var object = new THREE.Line( geometry, material );
        parentTransform.add( object );

        //how many copies
        for(var j = 0; j < 20; j++){
            var clonedObject = object.clone();
            clonedObject.position.x = object.position.x + (j / 1.5);
            parentTransform.add(clonedObject);
        }
    }

    scene.add( parentTransform );



    //new tree only

   /* light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 0, 1 );
    scene.add( light );
*/

    light = new THREE.AmbientLight( 0xffffff );
    scene.add(light);

    //end new tree


    camera.lookAt(scene.children[1].children[7].geometry.vertices[10]);

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild(renderer.domElement);
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );

    //

    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

    event.preventDefault();

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

//

function animate() {
    requestAnimationFrame( animate );
    render();
}


var token = 1;
var steps = 100;

function render() {

    calculateNewCameraPosition();
    token++;
    if(token == steps){
        token = 1;
        vert++;
    }

    if(Math.floor(Math.random() * 60) == 5){
        //add a tree
        addTree(scene.children[1].children[0].geometry.vertices[vert].x,
            scene.children[1].children[0].geometry.vertices[vert].y,
            scene.children[1].children[0].geometry.vertices[vert].z);

    }


scene.updateMatrixWorld();
    //camera.lookAt(scene.children[1].children[7].geometry.vertices[Math.floor(vert / 100)]);
    camera.lookAt(new THREE.Vector3( 4, 4, 4 ));
    renderer.render( scene, camera );
}


function calculateNewCameraPosition(){

    var xDiff = scene.children[1].children[0].geometry.vertices[vert + 1].x - scene.children[1].children[0].geometry.vertices[vert].x;
    var rxDiff = xDiff / steps;
    camera.position.x = scene.children[1].children[0].geometry.vertices[vert].x + rxDiff * token;

    var yDiff = scene.children[1].children[0].geometry.vertices[vert + 1].y - scene.children[1].children[0].geometry.vertices[vert].y;
    var ryDiff = yDiff / steps;
    camera.position.y = scene.children[1].children[0].geometry.vertices[vert].y + ryDiff * token;

    var zDiff = scene.children[1].children[0].geometry.vertices[vert + 1].z - scene.children[1].children[0].geometry.vertices[vert].z;
    var rzDiff = zDiff / steps;
    camera.position.z = (scene.children[1].children[0].geometry.vertices[vert].z + (rzDiff * token)) - 5;
}

function addTree(posX, posY, posZ){


    var geometry = new THREE.BoxGeometry(0.3,1,0.3);
    var material = new THREE.MeshBasicMaterial( {color: materialColour} );
    var sphere = new THREE.Mesh( geometry, material );

    var seed = (Math.random() * 13.5);
    sphere.position.x = posX + seed;
    sphere.position.y = posY + 1;
    sphere.position.z = posZ + 1;
    //sphere.rotation.x = Math.PI / Math.random(2);
    scene.add( sphere );

    sphere.updateMatrixWorld();
    scene.updateMatrixWorld();
    var vector = new THREE.Vector3();
    vector.setFromMatrixPosition( sphere.matrixWorld );
    addTreeNew(vector.x, vector.y, vector.z);

}

function addTreeNew(posX, posY, posZ){

    var canvas = document.createElement( 'canvas' );
    canvas.width = 128;
    canvas.height = 128;
    var context = canvas.getContext( '2d' );
    var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
    gradient.addColorStop( 0.1, 'rgba(210,210,210,1)' );
    gradient.addColorStop( 1, 'rgba(255,255,255,1)' );
    context.fillStyle = gradient;
    context.fillRect( 0, 0, canvas.width, canvas.height );
    var shadowTexture = new THREE.Texture( canvas );
    shadowTexture.needsUpdate = true;

    var faceIndices = [ 'a', 'b', 'c' ];
    var color, f, f2, f3, p, vertexIndex,
        radius = Math.random() + 0.5,
        geometry  = new THREE.IcosahedronGeometry( radius, 1 ),
        geometry2 = new THREE.IcosahedronGeometry( radius, 1 ),
        geometry3 = new THREE.IcosahedronGeometry( radius, 1 );
    for ( var i = 0; i < geometry.faces.length; i ++ ) {
        f  = geometry.faces[ i ];
        f2 = geometry2.faces[ i ];
        f3 = geometry3.faces[ i ];
        for( var j = 0; j < 3; j++ ) {
            vertexIndex = f[ faceIndices[ j ] ];
            p = geometry.vertices[ vertexIndex ];
            color = new THREE.Color( 0xffffff );
            color.setHSL( ( p.y / radius + 1 ) / 2, 1.0, 0.5 );
            f.vertexColors[ j ] = color;
            color = new THREE.Color( 0xffffff );
            color.setHSL( 0.0, ( p.y / radius + 1 ) / 2, 0.5 );
            f2.vertexColors[ j ] = color;
            color = new THREE.Color( 0xffffff );
            color.setHSL( 0.125 * vertexIndex/geometry.vertices.length, 1.0, 0.5 );
            f3.vertexColors[ j ] = color;
        }
    }
    var materials = [
        new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors, shininess: 0 } ),
        new THREE.MeshBasicMaterial( { color: 0x000000, shading: THREE.FlatShading, wireframe: true, transparent: true } )
    ];

    group3 = THREE.SceneUtils.createMultiMaterialObject( geometry3, materials );
    group3.position.x = 0 + posX;
    group3.position.y = 1 + posY;
    group3.position.z = 0 + posZ;
    //console.log(group3.position);

    group3.rotation.x = 0;
    scene.add( group3 );


}