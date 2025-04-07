var vertices = [];

var gl = document.getElementById('gl')
.getContext('webgl');

var mouseX = 0, mouseY = 0;
var angle = [0.0, 0.0, 0.0, 1.0];
var angleGL = 0;

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

function AddVertex(x,y,z,r,g,b){
    const index = vertices.length;
    vertices.length +=6
    vertices[index + 0] = x;
    vertices[index + 1] = y;
    vertices[index + 2] = z;
    vertices[index + 3] = r;
    vertices[index + 4] = g;
    vertices[index + 5] = b;
}

function AddTriangle(x1,y1,z1,r1,g1,b1,
                     x2,y2,z2,r2,g2,b2,
                     x3,y3,z3,r3,g3,b3){

    AddVertex(x1,y1,z1,r1,g1,b1);
    AddVertex(x2,y2,z2,r2,g2,b2);
    AddVertex(x3,y3,z3,r3,g3,b3);
}

function CreateTriangle(width, height){
    vertices.length = 0;
    const w = width * 0.5;
    const h = height * 0.5;
    AddTriangle(0.0, h, 0.0, 1.0, 0.0, 0.0,
                -w, -h, 0.0, 0.0, 1.0, 0.0,
                 w, -h, 0.0, 0.0, 0.0, 1.0);
}

function AddQuad(x1,y1,z1,r1,g1,b1,
                 x2,y2,z2,r2,g2,b2,
                 x3,y3,z3,r3,g3,b3,
                 x4,y4,z4,r4,g4,b4){

    AddTriangle(x1,y1,z1,r1,g1,b1,
                x2,y2,z2,r2,g2,b2,
                x3,y3,z3,r3,g3,b3);

    AddTriangle(x3,y3,z3,r3,g3,b3,
                x4,y4,z4,r4,g4,b4,
                x1,y1,z1,r1,g1,b1);
}

function createQuad(width,height){
    vertices.length = 0;
    const w = width * 0.5;
    const h = height * 0.5;
        AddQuad(-w, h, 0.0, 1.0, 0.0, 0.0,
                -w,-h, 0.0, 0.0, 1.0, 0.0,
                 w,-h, 0.0, 0.0, 0.0, 1.0,
                 w, h, 0.0, 1.0, 1.0, 0.0);
}

function Create3DCube(width, height, depth){
    vertices.length = 0;
    const w = width * 0.5;
    const h = height * 0.5;
    const d = depth * 0.5;

    // Forside (rød)
    AddQuad(-w, -h,  d, 1, 0, 0,
             w, -h,  d, 1, 0, 0,
             w,  h,  d, 1, 0, 0,
            -w,  h,  d, 1, 0, 0);

    // Bagside (grøn)
    AddQuad( w, -h, -d, 0, 1, 0,
            -w, -h, -d, 0, 1, 0,
            -w,  h, -d, 0, 1, 0,
             w,  h, -d, 0, 1, 0);

    // Top (blå)
    AddQuad(-w,  h,  d, 0, 0, 1,
             w,  h,  d, 0, 0, 1,
             w,  h, -d, 0, 0, 1,
            -w,  h, -d, 0, 0, 1);

    // Bund (gul)
    AddQuad(-w, -h, -d, 1, 1, 0,
             w, -h, -d, 1, 1, 0,
             w, -h,  d, 1, 1, 0,
            -w, -h,  d, 1, 1, 0);

    // Venstre (cyan)
    AddQuad(-w, -h, -d, 0, 1, 1,
            -w, -h,  d, 0, 1, 1,
            -w,  h,  d, 0, 1, 1,
            -w,  h, -d, 0, 1, 1);

    // Højre (magenta)
    AddQuad( w, -h,  d, 1, 0, 1,
             w, -h, -d, 1, 0, 1,
             w,  h, -d, 1, 0, 1,
             w,  h,  d, 1, 0, 1);
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

    document.getElementById('ui').innerHTML =
        'Width: <input type="number" id="w" value="'+ w +'" onchange="initShaders();"><br>' +
        'Height: <input type="number" id="h" value="'+ h +'" onchange="initShaders();"><br>' +
        'Depth: <input type="number" id="d" value="'+ d +'" onchange="initShaders();"><br>';

     let e = document.getElementById('shape');
switch (e.selectedIndex)
{
  case 0: CreateTriangle(w, h); break;
  case 1: createQuad(w ,h); break;
  case 2: Create3DCube(w, h, d); break;
}
}

function CreateGeometryBuffers(program) {

    CreateGeometryUI();

    createVBO(program, new Float32Array(vertices));

    angleGL = gl.getUniformLocation(program, 'angle');

    gl.useProgram(program);
    Render();
}

function createVBO(program, vert) {
    let vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vert, gl.STATIC_DRAW);

    const stride = 6 * Float32Array.BYTES_PER_ELEMENT;

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
}

function Render(){
    gl.clearColor(0.0, 0.4, 0.6, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES,0,vertices.length / 6); 
}

