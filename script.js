var vertices = [];

var gl = document.getElementById('gl')
.getContext('webgl');

var mouseX = 0, mouseY = 0;
var angle = [0.0, 0.0, 0.0, 1.0];
var angleGL = 0;

var textureGL = 0;
var display = [1.0, 1.0, 1.0, 1.0];
var displayGL = 0;

var bendFactor = 0.0;
var bendFactorGL = 0;

document.getElementById('gl').addEventListener(
    'mousemove', function(e){
        if (e.buttons == 1){
            angle[0] -= (mouseY -e.y) * 0.1;
            angle[1] += (mouseX -e.x) * 0.1;
            gl.uniform4fv(angleGL, new Float32Array(angle));
            Render();
        }
        mouseX = e.x;
        mouseY = e.y;
    }
)

function initWebGl(){
    if(!gl){
        alert('WebGl is no supported');
        return;
    }
    let canvas = document.getElementById('gl');
    if (canvas.width != canvas.clientWidth || 
        canvas.height != canvas.clientHeight
    )
    {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }
    initViewport();
}

function AddVertex(x,y,z,r,g,b,u,v,nx,ny,nz){
    const index = vertices.length;
    vertices.length += 11;
    vertices[index + 0] = x;
    vertices[index + 1] = y;
    vertices[index + 2] = z;
    vertices[index + 3] = r;
    vertices[index + 4] = g;
    vertices[index + 5] = b;
    vertices[index + 6] = u;
    vertices[index + 7] = v;
    vertices[index + 8] = nx;
    vertices[index + 9] = ny;
    vertices[index +10] = nz;
}

function AddTriangle(x1,y1,z1,r1,g1,b1,u1,v1,nx1,ny1,nz1,
                     x2,y2,z2,r2,g2,b2,u2,v2,nx2,ny2,nz2,
                     x3,y3,z3,r3,g3,b3,u3,v3,nx3,ny3,nz3){

    AddVertex(x1,y1,z1,r1,g1,b1,u1,v1,nx1,ny1,nz1);
    AddVertex(x2,y2,z2,r2,g2,b2,u2,v2,nx2,ny2,nz2);
    AddVertex(x3,y3,z3,r3,g3,b3,u3,v3,nx3,ny3,nz3);
}

function CreateTriangle(width, height){
    vertices.length = 0;
    const w = width * 0.5;
    const h = height * 0.5;
    AddTriangle(0.0, h, 0.0, 1.0, 0.0, 0.0, 0.5, 1.0, 0.0, 0.0, 1.0,
                -w, -h, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0,
                 w, -h, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 1.0);
}

function AddQuad(x1,y1,z1,r1,g1,b1,u1,v1,nx1,ny1,nz1,
                 x2,y2,z2,r2,g2,b2,u2,v2,nx2,ny2,nz2,
                 x3,y3,z3,r3,g3,b3,u3,v3,nx3,ny3,nz3,
                 x4,y4,z4,r4,g4,b4,u4,v4,nx4,ny4,nz4){

    AddTriangle(x1,y1,z1,r1,g1,b1,u1,v1,nx1,ny1,nz1,
                x2,y2,z2,r2,g2,b2,u2,v2,nx2,ny2,nz2,
                x3,y3,z3,r3,g3,b3,u3,v3,nx3,ny3,nz3);

    AddTriangle(x3,y3,z3,r3,g3,b3,u3,v3,nx3,ny3,nz3,
                x4,y4,z4,r4,g4,b4,u4,v4,nx4,ny4,nz4,
                x1,y1,z1,r1,g1,b1,u1,v1,nx1,ny1,nz1);
}

function createQuad(width,height){
    vertices.length = 0;
    const w = width * 0.5;
    const h = height * 0.5;
        AddQuad(-w, h, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
                -w,-h, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0,
                 w,-h, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 1.0,
                 w, h, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0);
}



function Create3DCube(width, height, depth) {
    vertices.length = 0;
    const w = width * 0.5;
    const h = height * 0.5;
    const d = depth * 0.5;

    // Front face
    AddQuad(-w, -h, d, 1, 0, 0, 0.0, 0.0, 0, 0, 1,
             w, -h, d, 1, 0, 0, 1.0, 0.0, 0, 0, 1,
             w,  h, d, 1, 0, 0, 1.0, 1.0, 0, 0, 1,
            -w,  h, d, 1, 0, 0, 0.0, 1.0, 0, 0, 1);

    // Back face
    AddQuad(w, -h, -d, 0, 1, 0, 0.0, 0.0, 0, 0, -1,
            -w, -h, -d, 0, 1, 0, 1.0, 0.0, 0, 0, -1,
            -w,  h, -d, 0, 1, 0, 1.0, 1.0, 0, 0, -1,
             w,  h, -d, 0, 1, 0, 0.0, 1.0, 0, 0, -1);

    // Top face
    AddQuad(-w, h, d, 0, 0, 1, 0.0, 0.0, 0, 1, 0,
             w, h, d, 0, 0, 1, 1.0, 0.0, 0, 1, 0,
             w, h, -d, 0, 0, 1, 1.0, 1.0, 0, 1, 0,
            -w, h, -d, 0, 0, 1, 0.0, 1.0, 0, 1, 0);

    // Bottom face
    AddQuad(-w, -h, -d, 1, 1, 0, 0.0, 0.0, 0, -1, 0,
             w, -h, -d, 1, 1, 0, 1.0, 0.0, 0, -1, 0,
             w, -h, d, 1, 1, 0, 1.0, 1.0, 0, -1, 0,
            -w, -h, d, 1, 1, 0, 0.0, 1.0, 0, -1, 0);

    // Left face
    AddQuad(-w, -h, -d, 0, 1, 1, 0.0, 0.0, -1, 0, 0,
            -w, -h, d, 0, 1, 1, 1.0, 0.0, -1, 0, 0,
            -w, h, d, 0, 1, 1, 1.0, 1.0, -1, 0, 0,
            -w, h, -d, 0, 1, 1, 0.0, 1.0, -1, 0, 0);

    // Right face
    AddQuad(w, -h, d, 1, 0, 1, 0.0, 0.0, 1, 0, 0,
             w, -h, -d, 1, 0, 1, 1.0, 0.0, 1, 0, 0,
             w, h, -d, 1, 0, 1, 1.0, 1.0, 1, 0, 0,
             w, h, d, 1, 0, 1, 0.0, 1.0, 1, 0, 0);
}

function addSubdividedQuad(x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4, i, j, color1, color2, u1, v1, u2, v2, u3, v3, u4, v4, nx, ny, nz) {
    const color = (i + j) % 2 === 0 ? color1 : color2;

    AddQuad(x1, y1, z1, color[0], color[1], color[2], u1, v1, nx, ny, nz,
            x4, y4, z4, color[0], color[1], color[2], u4, v4, nx, ny, nz,
            x3, y3, z3, color[0], color[1], color[2], u3, v3, nx, ny, nz,
            x2, y2, z2, color[0], color[1], color[2], u2, v2, nx, ny, nz);
}

function CreateSub3DCube(width, height, depth, subdivideX, subdivideY, subdivideZ) {
    vertices.length = 0;
    const w = width * 0.5;
    const h = height * 0.5;
    const d = depth * 0.5;

    const black = [0, 0, 0];
    const white = [1, 1, 1];

    // Front face
    for (let i = 0; i < subdivideY; i++) {
        for (let j = 0; j < subdivideX; j++) {
            const x1 = -w + j * (w * 2 / subdivideX);
            const x2 = -w + (j + 1) * (w * 2 / subdivideX);
            const y1 = h - i * (h * 2 / subdivideY);
            const y2 = h - (i + 1) * (h * 2 / subdivideY);
            addSubdividedQuad(x1, y1, d, x2, y1, d, x2, y2, d, x1, y2, d, i, j, black, white, 0, 0, 1, 1, 1, 0, 0, 1);
        }
    }

    // Back face
    for (let i = 0; i < subdivideY; i++) {
        for (let j = 0; j < subdivideX; j++) {
            const x1 = w - j * (w * 2 / subdivideX);
            const x2 = w - (j + 1) * (w * 2 / subdivideX);
            const y1 = h - i * (h * 2 / subdivideY);
            const y2 = h - (i + 1) * (h * 2 / subdivideY);
            addSubdividedQuad(x1, y1, -d, x2, y1, -d, x2, y2, -d, x1, y2, -d, i, j, black, white, 0, 0, 1, 1, 1, 0, 0, -1);
        }
    }

    // Top face
    for (let i = 0; i < subdivideX; i++) {
        for (let j = 0; j < subdivideZ; j++) {
            const x1 = -w + i * (w * 2 / subdivideX);
            const x2 = -w + (i + 1) * (w * 2 / subdivideX);
            const z1 = -d + j * (d * 2 / subdivideZ);
            const z2 = -d + (j + 1) * (d * 2 / subdivideZ);
            addSubdividedQuad(x1, h, z1, x2, h, z1, x2, h, z2, x1, h, z2, i, j, black, white, 0, 0, 1, 1, 1, 0, 0, 1);
        }
    }

    // Bottom face
    for (let i = 0; i < subdivideX; i++) {
        for (let j = 0; j < subdivideZ; j++) {
            const x1 = -w + i * (w * 2 / subdivideX);
            const x2 = -w + (i + 1) * (w * 2 / subdivideX);
            const z1 = -d + j * (d * 2 / subdivideZ);
            const z2 = -d + (j + 1) * (d * 2 / subdivideZ);
            addSubdividedQuad(x1, -h, z1, x1, -h, z2, x2, -h, z2, x2, -h, z1, i, j, black, white, 0, 0, 1, 1, 1, 0, 0, -1);
        }
    }

    // Left face
    for (let i = 0; i < subdivideY; i++) {
        for (let j = 0; j < subdivideZ; j++) {
            const y1 = h - i * (h * 2 / subdivideY);
            const y2 = h - (i + 1) * (h * 2 / subdivideY);
            const z1 = -d + j * (d * 2 / subdivideZ);
            const z2 = -d + (j + 1) * (d * 2 / subdivideZ);
            addSubdividedQuad(-w, y1, z1, -w, y1, z2, -w, y2, z2, -w, y2, z1, i, j, black, white, 0, 0, 1, 1, 1, 0, -1, 0);
        }
    }

    // Right face
    for (let i = 0; i < subdivideY; i++) {
        for (let j = 0; j < subdivideZ; j++) {
            const y1 = h - i * (h * 2 / subdivideY);
            const y2 = h - (i + 1) * (h * 2 / subdivideY);
            const z1 = -d + j * (d * 2 / subdivideZ);
            const z2 = -d + (j + 1) * (d * 2 / subdivideZ);
            addSubdividedQuad(w, y1, z1, w, y2, z1, w, y2, z2, w, y1, z2, i, j, black, white, 0, 0, 1, 1, 1, 0, 1, 0);
        }
    }
}

function CreateCylinder(radius, height, segments) {
    vertices.length = 0;
    const halfHeight = height * 0.5;
    const angleStep = (Math.PI * 2) / segments;


    for (let i = 0; i < segments; i++) {
        const theta = i * angleStep;
        const nextTheta = (i + 1) * angleStep;

        const x1 = radius * Math.cos(theta);
        const z1 = radius * Math.sin(theta);
        const x2 = radius * Math.cos(nextTheta);
        const z2 = radius * Math.sin(nextTheta);

        
        AddTriangle(
            x1, halfHeight, z1, 1, 0, 0, i / segments, 1, 0, 1, 0,
            x2, halfHeight, z2, 1, 0, 0, (i + 1) / segments, 1, 0, 1, 0,
            x2, -halfHeight, z2, 1, 0, 0, (i + 1) / segments, 0, 0, 1, 0
        );

    
        AddTriangle(
            x1, halfHeight, z1, 1, 0, 0, i / segments, 1, 0, 1, 0,
            x2, -halfHeight, z2, 1, 0, 0, (i + 1) / segments, 0, 0, 1, 0,
            x1, -halfHeight, z1, 1, 0, 0, i / segments, 0, 0, 1, 0
        );
    }

   
    for (let i = 0; i < segments; i++) {
        const theta = i * angleStep;
        const nextTheta = (i + 1) * angleStep;

        const x1 = radius * Math.cos(theta);
        const z1 = radius * Math.sin(theta);
        const x2 = radius * Math.cos(nextTheta);
        const z2 = radius * Math.sin(nextTheta);

        
        AddTriangle(
            0, halfHeight, 0, 0, 1, 0, 0.5, 0.5, 0, 1, 0,
            x2, halfHeight, z2, 0, 1, 0, (Math.cos(nextTheta) * 0.5 + 0.5), (Math.sin(nextTheta) * 0.5 + 0.5), 0, 1, 0,
            x1, halfHeight, z1, 0, 1, 0, (Math.cos(theta) * 0.5 + 0.5), (Math.sin(theta) * 0.5 + 0.5), 0, 1, 0
        );

        
        AddTriangle(
            0, -halfHeight, 0, 0, 0, 1, 0.5, 0.5, 0, -1, 0,
            x1, -halfHeight, z1, 0, 0, 1, (Math.cos(theta) * 0.5 + 0.5), (Math.sin(theta) * 0.5 + 0.5), 0, -1, 0,
            x2, -halfHeight, z2, 0, 0, 1, (Math.cos(nextTheta) * 0.5 + 0.5), (Math.sin(nextTheta) * 0.5 + 0.5), 0, -1, 0
        );
    }
}

function initViewport(){
    gl.viewport(0,
                0,
                gl.canvas.width,
                gl.canvas.height);

    gl.clearColor(0.0,0.4,0.6,1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    initShaders();
}

function initShaders(){
    const vertex = InitVertexShader();
    const fregment = InitFregmentShader();

    let program = InitShaderProgram(vertex,fregment);

    if(!ValidateShaderProgram(program)){
        return false;
    }
    return CreateGeometryBuffers(program)
}

function InitVertexShader() {
    let e = document.getElementById('vs');
    let vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, e.value.trim());
    gl.compileShader(vs);

    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
        console.error('Failed init vertex shader:', gl.getShaderInfoLog(vs));
        return null;
    }
    return vs;
}

function InitFregmentShader() {
    let e = document.getElementById('fs');
    let fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, e.value.trim());
    gl.compileShader(fs);

    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
        console.error('Failed to init fragment shader:', gl.getShaderInfoLog(fs));
        return null;
    }
    return fs;
}

function InitShaderProgram(vs, fs) {
    let program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Failed to link shader program:', gl.getProgramInfoLog(program));
        return null;
    }
    return program;
}

function ValidateShaderProgram(p){
    gl.validateProgram(p);
    if(!gl.getProgramParameter(p,gl.VALIDATE_STATUS)){
        console.error(gl.getProgramInfoLog(p));
        alert('Errors found validating shader program');
        return false;
    }
    return true;
}

function CreateGeometryUI(){
    const ew = document.getElementById('w');
    const w = ew ? ew.value : 1.0;
    const eh = document.getElementById('h');
    const h = eh ? eh.value : 1.0;
    const ed = document.getElementById('d');
    const d = ed ? ed.value : 1.0;
    const er = document.getElementById('r');
    const r  = er ? parseFloat(er.value) : 0.1;
    
    const sxi = document.getElementById('sx');
    const x = sxi ? Math.floor(sxi.value) : 1.0;
    const syi = document.getElementById('sy');
    const y = syi ? Math.floor(syi.value) : 1.0;
    const zyi = document.getElementById('sz');
    const z = zyi ? Math.floor(zyi.value) : 1.0;
    

    document.getElementById('ui').innerHTML =
        'Width: <input type="number" id="w" value="'+ w +'" onchange="initShaders();"><br>' +
        'Height: <input type="number" id="h" value="'+ h +'" onchange="initShaders();"><br>' +
        'Depth: <input type="number" id="d" value="'+ d +'" onchange="initShaders();"><br>' +
        'Radius: <input type="number" id="r" value="'+ r +'" onchange="initShaders();"><br>' +
        'Subdivide X: <input type="number" step="1" id="sx" value="' + x + '" onchange="initShaders();"><br>' +
        'Subdivide Y: <input type="number" step="1" id="sy" value="' + y + '" onchange="initShaders();"><br>' +
        'Subdivide Z: <input type="number" id="sz" value="' + z + '" onchange="initShaders();"><br>' +
        'Bend Factor: <input type="range" id="bendSlider" min="0" max="1" step="0.01" value="' + bendFactor + '" oninput="UpdateBend();"><br>';

    let e = document.getElementById('shape');
    switch (e.selectedIndex) {
        case 0: CreateTriangle(w, h); break;
        case 1: createQuad(w ,h); break;
        case 2: 
            if (x == 1 && y == 1 && z == 1) {
                Create3DCube(w, h, d); 
            } else {
                CreateSub3DCube(w, h, d, x, y, z);
            }
            break;
        case 3: CreateCylinder(r, h, 32); break;
    }
}

function UpdateBend() {
    bendFactor = parseFloat(document.getElementById('bendSlider').value);
    gl.uniform1f(bendFactorGL, bendFactor);
    Render();
}

function CreateGeometryBuffers(program) {

    CreateGeometryUI();

    createVBO(program, new Float32Array(vertices));

    angleGL = gl.getUniformLocation(program, 'angle');
    proGL=gl.getUniformLocation(program,'projection');
    modGL= gl.getUniformLocation(program,'modelView');
    bendFactorGL = gl.getUniformLocation(program, 'bendFactor'); 

    CreateTexture(program, 'img/tekstur.jpg');

    gl.useProgram(program);

    gl.uniform4fv(angleGL, new Float32Array(angle));

    gl.uniform4fv(displayGL, new Float32Array(display));

    gl.uniform1i(textureGL, 0);
    gl.uniform1f(bendFactorGL, bendFactor); 

    Render();
}

function createVBO(program, vert) {
    let vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vert, gl.STATIC_DRAW);

    const stride = 11 * Float32Array.BYTES_PER_ELEMENT;

    let posAttrib = gl.getAttribLocation(program, 'Pos');
    if (posAttrib === -1) {
        console.error("Attrib location not found for Pos");
        return;
    }
    gl.vertexAttribPointer(posAttrib, 3, gl.FLOAT, false, stride, 0);
    gl.enableVertexAttribArray(posAttrib);

    const offset = 3 * Float32Array.BYTES_PER_ELEMENT;
    let colorAttrib = gl.getAttribLocation(program, 'Color');
    if (colorAttrib === -1) {
        console.error("Attrib location not found for Color");
        return;
    }
    gl.vertexAttribPointer(colorAttrib, 3, gl.FLOAT, false, stride, offset);
    gl.enableVertexAttribArray(colorAttrib);

    const o2 = offset*2;
    let u = gl.getAttribLocation(program, 'UV');
    gl.vertexAttribPointer(u , 2, gl.FLOAT, gl.FALSE, stride, o2);
    gl.enableVertexAttribArray(u);
}

var proGL = 0;
var projection = [ 0.0, 0.0, 0.0, 0.0,
                  0.0, 0.0, 0.0, 0.0,
                   0.0, 0.0, 0.0, 0.0,
                   0.0, 0.0, 0.0, 0.0];

var modGL = 0;
var modelView = [ 1.0, 0.0, 0.0, 0.0,
                  0.0, 1.0, 0.0, 0.0,
                  0.0, 0.0, 1.0, 0.0,
                  0.0, 0.0,-1.2, 1.0 ];

function Render(){
    gl.clearColor(0.0, 0.4, 0.6, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const zoom = document.getElementById('zoom').value;
    modelView[14] = -zoom;

    const fov= document.getElementById('fov').value;
    const aspect = gl.canvas.width/ gl.canvas.height;
    Perspective(fov, aspect, 1.0, 2000.0, projection);


    gl.drawArrays(gl.TRIANGLES,0,vertices.length / 11); 

    if (userTexture) {
        gl.bindTexture(gl.TEXTURE_2D, userTexture);
    } else {
        gl.bindTexture(gl.TEXTURE_2D, defaultTexture);
    }
}

function CreateTexture(prog, url){

    const texture = LoadTexture(url);
    defaultTexture = LoadTexture(url);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D,texture);
    textureGL =gl.getUniformLocation(prog, 'Texture');
    displayGL = gl.getUniformLocation(prog, 'Display');
}

function LoadTexture(url) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    const pixel = new Uint8Array([0, 0, 255]);
    gl.texImage2D(gl.TEXTURE_2D,
                  0,
                  gl.RGB, 
                  1, 
                  1, 
                  0, 
                  gl.RGB,
                  gl.UNSIGNED_BYTE,
                  pixel);

    const image = new Image();
    image.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
            gl.TEXTURE_2D,      
            0,                  
            gl.RGB,            
            gl.RGB,            
            gl.UNSIGNED_BYTE,   
            image);
            SetTextureFilteres(image);
            Render();
    };

    image.src = url;
    return texture;
}

function SetTextureFilteres(image){

    if (IsPow2(image.width) && IsPow2(image.height)){

        gl.generateMipmap(gl.TEXTURE_2D);
    }
    else{

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
}

function IsPow2(value){

    return(value & (value - 1)) === 0;
}

function Update(){

    const t = document.getElementById('texture');
    display[3]=t.checked ? 1.0:0.0;

    const l = document.getElementById('light').value;
    display[0] = parseInt(l.substring(1,3),16) / 255.0;
    display[1] = parseInt(l.substring(3,5),16) / 255.0;
    display[2] = parseInt(l.substring(5,7),16) / 255.0;

    gl.uniform4fv(displayGL,new Float32Array(display));
    Render();
}

function Perspective(fovy, aspect, near, far, matrix)
{
    matrix.fill(0);
    
    const f = Math.tan(fovy * Math.PI/360.0);

    matrix[0] = f/aspect;
    matrix[5] = f;
    matrix[10] = (far + near) / (near - far);
    matrix[11] = (2*far*near)/(near-far);
    matrix[14] = -1;

    gl.uniformMatrix4fv(proGL, false, new Float32Array( projection));
    gl.uniformMatrix4fv(modGL, false, new Float32Array( modelView));
}

let userTexture = null;
let defaultTexture = null;

document.getElementById('imageUpload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const img = new Image();
    img.onload = function() {
        userTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, userTexture);

        
        gl.texImage2D(
          gl.TEXTURE_2D, 0, gl.RGBA,
          gl.RGBA, gl.UNSIGNED_BYTE,
          img
        );

        if (IsPow2(img.width) && IsPow2(img.height)) {
            
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        } else {
            
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
       
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        Render(); 
    };
    img.src = URL.createObjectURL(file);
});