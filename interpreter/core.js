var code = document.getElementById("code");
var dbgr = document.getElementById("debugger");
var input = document.getElementById("input");
var output = document.getElementById("output");
var exampls = document.getElementById("examples");

var mousedown;
var resize = () => dbgr.style.height = code.style.height;
document.addEventListener('mousemove', resize);

dbgr.update = function(inp = new Interpreter(code.value)) {
    try   { dbgr.value = inp.cmds().join('\n'); }
    catch { dbgr.value = ''; }
}

function run() {
    var inp = new Interpreter(code.value, input.value);
    try {
        var out = inp.run();
        output.innerHTML += '$ ' + out.replace(/\n/g,'<br>&nbsp;&nbsp;') + '<br>';
        dbgr.update(inp);
    } catch(err) {
        output.innerHTML += `<span style="color:tomato;">${err}<br>`;
    }
}

function setexample(example = examples[exampls.options[exampls.selectedIndex].value]) {
    code.value = example || '';
    dbgr.update();
}
setexample();