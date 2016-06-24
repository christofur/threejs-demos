var container, stats;
var camera, scene, renderer, parentTransform, sphereInter;

var mouse = new THREE.Vector2();
var radius = 100, theta = 0, vert = 0;

var currentIntersected;

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
    parentTransform.position.x = 1;//Math.random() * 40 - 20;
    parentTransform.position.y = 1;//Math.random() * 40 - 20;
    parentTransform.position.z = 1;//Math.random() * 40 - 20;

    parentTransform.rotation.x = 0;//Math.random() * 2 * Math.PI;
    parentTransform.rotation.y = 0;//Math.random() * 2 * Math.PI;
    parentTransform.rotation.z = 0;//Math.random() * 2 * Math.PI;

    parentTransform.scale.x = 1;//Math.random() + 0.5;
    parentTransform.scale.y = 1;//Math.random() + 0.5;
    parentTransform.scale.z = 1;//Math.random() + 0.5;

    //Add a total of 50 lines
    for ( var i = 0; i < 1; i ++ ) {

        //create a new geometry holder
        var object;

        //half the time, make this geometry a Line, the other half, a LineSegments
        if ( Math.random() > 0.5 ) {

            object = new THREE.Line( geometry );

        } else {

            object = new THREE.Line( geometry );
            //object = new THREE.LineSegments( geometry );

        }

        object.position.x = 0;//Math.random() * 400 - 200;
        object.position.y = 0;//Math.random() * 400 - 200;
        object.position.z = 0;//Math.random() * 400 - 200;

        //object.rotation.x = Math.random() * 2 * Math.PI;
        //object.rotation.y = Math.random() * 2 * Math.PI;
        //object.rotation.z = Math.random() * 2 * Math.PI;

        object.scale.x = 1;//Math.random() + 0.5;
        object.scale.y = 1;//Math.random() + 0.5;
        object.scale.z = 1;//Math.random() + 0.5;

        parentTransform.add( object );

        //how many copies
        for(var j = 0; j < 20; j++){
            var clonedObject = object.clone();
            clonedObject.position.x = object.position.x + (j / 1.5);
            parentTransform.add(clonedObject);
        }


    }

    scene.add( parentTransform );

    camera.lookAt(scene.children[1].children[7].geometry.vertices[10]);

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    //renderer.setClearColor( 0xf0f0f0 );
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
var child = 0;

function render() {

    //theta += 0.01;

    //camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
    //camera.position.y = radius * Math.sin( THREE.Math.degToRad( theta ) );
    //camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );

    //camera.position.x = scene.children[1].children[0].position.x;
    //camera.position.x = camera.position.x - 0.01;


/*    if(token == 1){
        camera.position.x = scene.children[1].children[0].geometry.vertices[vert].x;
        camera.position.y = scene.children[1].children[0].geometry.vertices[vert].y;
        camera.position.z = scene.children[1].children[0].geometry.vertices[vert].z - 5;

    }
    else{*/
        var xDiff = scene.children[1].children[0].geometry.vertices[vert + 1].x - scene.children[1].children[0].geometry.vertices[vert].x;
        var rxDiff = xDiff / steps;
        camera.position.x = scene.children[1].children[0].geometry.vertices[vert].x + rxDiff * token;



        var yDiff = scene.children[1].children[0].geometry.vertices[vert + 1].y - scene.children[1].children[0].geometry.vertices[vert].y;
        var ryDiff = yDiff / steps;
        camera.position.y = scene.children[1].children[0].geometry.vertices[vert].y + ryDiff * token;



        var zDiff = scene.children[1].children[0].geometry.vertices[vert + 1].z - scene.children[1].children[0].geometry.vertices[vert].z;
        var rzDiff = zDiff / steps;
        camera.position.z = (scene.children[1].children[0].geometry.vertices[vert].z + (rzDiff * token)) - 5;
    //}


    //camera.rotation.x = camera.rotation.x + 0.001;

    token++;
    if(token == steps){
        token = 1;
        vert++;
    }


    camera.lookAt(scene.children[1].children[7].geometry.vertices[Math.floor(vert / 100)]);

    //camera.position.x = scene.children[1].children[0].geometry.vertices[vert].x;
    //camera.position.y = scene.children[1].children[0].geometry.vertices[vert].y;
    //camera.position.z = scene.children[1].children[0].geometry.vertices[vert].z - 5;

    //vert++

    //camera.position.z = camera.position.z + 0.01;

    //camera.rotation.y = camera.rotation.y + 1;
    //camera.rotation.x = camera.rotation.x + 1;

    //camera.lookAt(scene.children[1].position)
    //camera.lookAt( scene.position );``

    //camera.updateMatrixWorld();
    renderer.render( scene, camera );

}