var gl = document.getElementById('gl')
.getContext('webgl');

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

function CreateGeometryBuffers(program) {
    const vertices = [
        0.0,  0.5,  0.0, 1.0, 0.0, 0.0,
       -0.5, -0.5,  0.0, 0.0, 1.0, 0.0,
        0.5, -0.5,  0.0, 0.0, 0.0, 1.0
    ];

    createVBO(program, new Float32Array(vertices));

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
    gl.drawArrays(gl.TRIANGLES,0,3); 
}