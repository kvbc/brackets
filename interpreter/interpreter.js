function Interpreter(code, input = '') {
    var ip = 0, ln = 0;
    var tk = [];
    var stack = [], loops = {};
    input = [...input];

    var err = msg => `Error:${ln}: ${msg}`;
    Array.prototype._pop = function(cmd) { if(this.length) return this.pop(); else throw err(`Stack is empty, for command '${cmd}'`); }
	
    function skipbd() {
        var bal = 1, t;
        if(next() != '{') throw err("Expected the body to start with an '{'");
        while(bal && ip<tk.length && (t=next())) if(t=='{') bal++; else if(t=='}') bal--;
        if(bal) throw err("Unmatched parasyntheses, expected an matching '}'");
        return ip;
    }

    function readn() {
        var bin = '';
        while(tk[ip] != '<')
            if(ip < tk.length) bin += next();
            else throw err("Expected an number to end with an '<'");
        next(); ip--;
        bin = bin.replace(/\(\)/g,'0').replace(/\{\}/g,'1').slice(0,-1);
        if(bin[0]!='0' && bin[0]!='1') throw err(`Expected the first bit to be either () or {}, got: ${bin[0]+bin[1]}`);
        if(bin.replace(/0|1/g,'').length) throw err(`Malformed number: ${bin}`);
        var n = parseInt(bin.substr(1), 2);
        return bin[0]=='0' ? n : -n;
    }
    
    function next() {
        return tk[ip = nextip()];
    }

    function nextip() {
        var i = ip;
        while(tk[++i]=='\n') ln++;
        return i;
    }

    this.cmds = function() {
        var cmds = [], s='';
        tk = [...code.replace(/[^(){}[\]<>]/g,'')];
        for(ip = 0; ip < tk.length; ip++)
            if(tk[ip]=='}') s = s.substr(0, s.length - 3);
            else switch(tk[ip] + tk[++ip] + tk[++ip] + tk[++ip]) {
                case '()()': cmds.push(s+`push ${readn()}`); break;
                case '(){}': cmds.push(s+'dup');             break;
                case '()[]': cmds.push(s+'swap');            break;
                case '()<>': cmds.push(s+'disc');            break;
                case '{}()': cmds.push(s+'add');             break;
                case '{}{}': cmds.push(s+'mul');             break;
                case '{}[]': cmds.push(s+'div');             break;
                case '{}<>': cmds.push(s+'mod');             break;
                case '[]()': cmds.push(s+'if eq:');          ip++; s+='   '; break;
                case '[]{}': cmds.push(s+'if not eq:');      ip++; s+='   '; break;
                case '[][]': cmds.push(s+'while not eq:');   ip++; s+='   '; break;
                case '[]<>': cmds.push(s+'exit');            break;
                case '<>()': cmds.push(s+'printc');          break;
                case '<>{}': cmds.push(s+'printn');          break;
                case '<>[]': cmds.push(s+'readc');           break;
                case '<><>': cmds.push(s+'readn');           break;
            }
        return cmds;
    }

    this.run = function() {
        var out = '', t;
        stack = [], loops = {};
        tk = [...code.replace(/[^(){}[\]<>\n]/g,'')];
        for(ip = 0; ip < tk.length; next())
            if(t=loops[ip]) { if(stack[stack.length-1] != t[1]) ip=t[0]; }
            else if(tk[ip]!='}') switch(tk[ip] + next() + next() + next()) {
                case '()()': stack.push(t=readn()); break;
                case '(){}': stack.push(stack[stack.length-1]); break;
                case '()[]': stack[stack.length-1] = [stack[stack.length-2], stack[stack.length-2]=stack[stack.length-1]][0]; break;
                case '()<>': stack._pop('disc'); break;
                case '{}()': stack.push(stack._pop('add') + stack._pop('add')); break;
                case '{}{}': stack.push(stack._pop('mul') * stack.pop('mul')); break;
                case '{}[]': stack.push((t=[stack._pop('div'),stack.pop('div')])[1] / t[0] | 0); break;
                case '{}<>': stack.push((t=[stack._pop('mod'),stack._pop('mod')])[1] % t[0]); break;
                case '[]()': if(stack._pop('if eq')==stack[stack.length-1]) ip++; else skipbd(); break;
                case '[]{}': if(stack._pop('if not eq')!=stack[stack.length-1]) ip++; else skipbd(); break;
                case '[][]': let s = nextip();
                             let e = skipbd();
                             let a = stack._pop('while not eq');
                             if(stack[stack.length-1]!=a) loops[e]=[s,a], ip=s;
                             else ip++; break;
                case '[]<>': ip = tk.length; break;
                case '<>()': out += String.fromCharCode(stack._pop('printc')); break;
                case '<>{}': out += stack._pop('printn'); break;
                case '<>[]': stack.push((input.shift()||'\0').charCodeAt()); break;
                case '<><>': stack.push(+input.shift()||0); break;
            }
        var sep = out ? '\n' : '';
        return out + `<span style="color:gold;">${sep}stack: [${stack.join(', ')}]${sep}</span>`;
    }
}
