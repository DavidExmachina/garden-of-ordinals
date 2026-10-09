// =================================================================================================
// BASIC FUNCTIONS
// =================================================================================================
// USE STRICT
"use strict";
// =================================================================================================
// CANTOR NORMAL FORM
// =================================================================================================
const Cantor = {
    // ---------------------------------------------------------------------------------------------
    // NAME *
    // ---------------------------------------------------------------------------------------------
    name: "Cantor",
    // ---------------------------------------------------------------------------------------------
    // NORMAL FORM *
    // ---------------------------------------------------------------------------------------------
    // VALIDITY
    validity: function (str){
        // CONSTANT
        if (["", "A"].includes(str)) return 3;
        // CHECK SYMBOLS
        for (let i = 0; i < str.length; i++) if (!"()".includes(str[i])) return 0;
        // CHECK BRACKETS
        let depth = 0;
        for (let i = 0; i < str.length; i++){
            if (str[i] === "(") depth++;
            if (str[i] === ")") depth--;
        }
        if (depth) return 1;
        // CHECK NORMAL
        if (!this.isnormal(str)) return 2;
        // ALL CLEAR
        return 3;
    },
    // IS NORMAL
    isnormal: function (str){
        // CONSTANT
        if (["", "A"].includes(str)) return true;
        // SINGLE
        if (this.single(str)) return this.isnormal(this.vsp(str)[0]);
        // ADDITION
        let str1 = this.asp(str);
        if (!this.isnormal(str1[0])) return false;
        if (!this.isnormal(str1[1])) return false;
        if (this.single(str1[1])) return !this.lt(str1[0], str1[1]);
        return !this.lt(str1[0], this.asp(str1[1])[0]);
    },
    // ---------------------------------------------------------------------------------------------
    // SPLIT
    // ---------------------------------------------------------------------------------------------
    // ADDITION SPLIT
    asp: function (str){
        if (!str) return ["", ""];
        let depth = 0;
        for (let i = 0; i < str.length; i++){
            if (str[i] === "(") depth++;
            if (str[i] === ")") depth--;
            if (!depth) return [str.slice(0, i + 1), str.slice(i + 1)];
        }
    },
    // INSIDE
    vsp: function (str){return [str.slice(1, -1)];},
    // SINGLE
    single: function (str){return !this.asp(str)[1];},
    // ---------------------------------------------------------------------------------------------
    // ORDERING *
    // ---------------------------------------------------------------------------------------------
    // LESS THAN
    lt: function (a, b, cac = true){
        // CACHE
        if (cac){
            try {cache;} catch {return this.lt(a, b, false);}
            let key = `${this.name}-LT-${a}-${b}`;
            if (!(key in cache)) cache[key] = this.lt(a, b, false);
            return cache[key];
        }
        // CONSTANT
        if (!b) return false;
        if (a === "A") return false;
        if (b === "A") return true;
        if (!a) return true;
        // ADDITION
        if (!this.single(a) && !this.single(b)){
            let a1 = this.asp(a), b1 = this.asp(b);
            return this.lt(a1[0], b1[0]) || (!this.lt(b1[0], a1[0]) && this.lt(a1[1], b1[1]));
        }
        if (!this.single(a) && this.single(b)) return this.lt(this.asp(a)[0], b);
        if (this.single(a) && !this.single(b)) return !this.lt(this.asp(b)[0], a);
        // SINGLE
        return this.lt(this.vsp(a)[0], this.vsp(b)[0]);
    },
    // GREATER THAN
    gt: function (a, b){return this.lt(b, a);},
    // LESS THAN OR EQUAL
    le: function (a, b){return !this.lt(b, a);},
    // GREATER THAN OR EQUAL
    ge: function (a, b){return !this.lt(a, b);},
    // EQUAL
    eq: function (a, b){return !this.lt(a, b) && !this.lt(b, a);},
    // NOT EQUAL
    ne: function (a, b){return this.lt(a, b) || this.lt(b, a);},
    // ---------------------------------------------------------------------------------------------
    // OPERATIONS *
    // ---------------------------------------------------------------------------------------------
    // SUCCESSOR
    s: function (str){return str + "()";},
    // TO STRING
    to_str: function (n){return "()".repeat(n);},
    // TO NUMBER
    to_num: function (str){return this.cof(str) === "()" ? this.to_num(str.slice(0, -2)) + 1 : 0;},
    // LEAST UNCOUNTABLE CRDINAL
    uc: function (){return null;},
    // ---------------------------------------------------------------------------------------------
    // COFINALITY *
    // ---------------------------------------------------------------------------------------------
    // COFINALITY
    cof: function (str, cac = true){
        // CACHE
        if (cac){
            try {cache;} catch {return this.cof(str, false);}
            let key = `${this.name}-COF-${str}`;
            if (!(key in cache)) cache[key] = this.cof(str, false);
            return cache[key];
        }
        // CONSTANT
        if (!str) return "";
        if (str === "A") return "(())";
        // SUCCESSOR
        if (str.slice(-2) === "()") return "()";
        // LIMIT
        return "(())";
    },
    // TYPE (0: ZERO / 1: SUC / 2: COUNTABLE LIM / 3: UNCOUNTABLE LIM)
    type: function (str){
        if (!this.cof(str)) return 0;
        if (this.cof(str) === "()") return 1;
        return 2;
    },
    // ---------------------------------------------------------------------------------------------
    // FUNDAMENTAL SEQUENCE *
    // ---------------------------------------------------------------------------------------------
    fs: function (a, n = "", strong = false, cac = true){
        // CACHE
        if (cac){
            try {cache;} catch {return this.fs(a, n, strong, false);}
            let key = `${this.name}-FS-${a}-${n}-${strong}`;
            if (!(key in cache)) cache[key] = this.fs(a, n, strong, false);
            return cache[key];
        }
        // ZERO
        if (!a) return "";
        // LIMIT
        if (a === "A") return n ? `(${this.fs(a, this.fs(n))})` : "";
        // ADDITION
        if (!this.single(a)){
            let a1 = this.asp(a);
            return a1[0] + this.fs(a1[1], n);
        }
        // SINGLE
        if (!this.vsp(a)[0]) return "";
        if (this.cof(this.vsp(a)[0]) === "()"){
            return n ? `${this.fs(a, this.fs(n))}(${this.fs(this.vsp(a)[0])})` : "";
        }
        if (this.cof(this.vsp(a)[0]) === "(())") return `(${this.fs(this.vsp(a)[0], n)})`;
    },
    // ---------------------------------------------------------------------------------------------
    // MATH FORM *
    // ---------------------------------------------------------------------------------------------
    math: function (str){
        // ZERO
        if (!str) return ["0"];
        // LIMIT
        if (str === "A") return [["e", ["0"]]];
        // ADDITION
        if (!this.single(str)){
            let str1 = this.asp(str);
            return [].concat(this.math(str1[0]), ["+"], this.math(str1[1]));
        }
        // SINGLE
        return [[0, ["\\omega"], this.math(this.vsp(str)[0])]];
    },
};
// =================================================================================================
// VEBLEN FUNCTION
// =================================================================================================
const Veblen = {
    // ---------------------------------------------------------------------------------------------
    // NAME *
    // ---------------------------------------------------------------------------------------------
    name: "Veblen",
    // ---------------------------------------------------------------------------------------------
    // NORMAL FORM *
    // ---------------------------------------------------------------------------------------------
    // VALIDITY
    validity: function (str){
        // CONSTANT
        if (["", "A"].includes(str)) return 3;
        // CHECK SYMBOLS
        for (let i = 0; i < str.length; i++) if (!"(,)".includes(str[i])) return 0;
        // CHECK BRACKETS
        let depth = [];
        for (let i = 0; i < str.length; i++){
            if (str[i] === "(") depth.push(1);
            if (str[i] === ",") depth[depth.length - 1]--;
            if (str[i] === ")"){
                if (!depth.length || depth[depth.length - 1]) return 1;
                depth.pop();
            }
        }
        if (depth.length) return 1;
        // CHECK NORMAL
        if (!this.isnormal(str)) return 2;
        // ALL CLEAR
        return 3;
    },
    // IS NORMAL
    isnormal: function (str){
        // CONSTANT
        if (["", "A"].includes(str)) return true;
        // SINGLE
        if (this.single(str)){
            let str1 = this.vsp(str);
            if (!this.isnormal(str1[0])) return false;
            if (!this.isnormal(str1[1])) return false;
            return this.lt(str1[1], str);
        }
        // ADDITION
        let str2 = this.asp(str);
        if (!this.isnormal(str2[0])) return false;
        if (!this.isnormal(str2[1])) return false;
        if (this.single(str2[1])) return !this.lt(str2[0], str2[1]);
        return !this.lt(str2[0], this.asp(str2[1])[0]);
    },
    // ---------------------------------------------------------------------------------------------
    // SPLIT
    // ---------------------------------------------------------------------------------------------
    // ADDITION SPLIT
    asp: function (str){
        if (!str) return ["", ""];
        let depth = 0;
        for (let i = 0; i < str.length; i++){
            if (str[i] === "(") depth++;
            if (str[i] === ")") depth--;
            if (!depth) return [str.slice(0, i + 1), str.slice(i + 1)];
        }
    },
    // VARIABLE SPLIT
    vsp: function (str){
        let depth = 0;
        for (let i = 1; i < str.length - 1; i++){
            if (str[i] === "(") depth++;
            if (str[i] === ")") depth--;
            if (!depth && str[i] === ",") return [str.slice(1, i), str.slice(i + 1, -1)];
        }
    },
    // SINGLE
    single: function (str){return !this.asp(str)[1];},
    // ---------------------------------------------------------------------------------------------
    // ORDERING *
    // ---------------------------------------------------------------------------------------------
    // LESS THAN
    lt: function (a, b, cac = true){
        // CACHE
        if (cac){
            try {cache;} catch {return this.lt(a, b, false);}
            let key = `${this.name}-LT-${a}-${b}`;
            if (!(key in cache)) cache[key] = this.lt(a, b, false);
            return cache[key];
        }
        // CONSTANT
        if (!b) return false;
        if (a === "A") return false;
        if (b === "A") return true;
        if (!a) return true;
        // ADDITION
        if (!this.single(a) && !this.single(b)){
            let a1 = this.asp(a), b1 = this.asp(b);
            return this.lt(a1[0], b1[0]) || (!this.lt(b1[0], a1[0]) && this.lt(a1[1], b1[1]));
        }
        if (!this.single(a) && this.single(b)) return this.lt(this.asp(a)[0], b);
        if (this.single(a) && !this.single(b)) return !this.lt(this.asp(b)[0], a);
        // SINGLE
        let a2 = this.vsp(a), b2 = this.vsp(b);
        if (this.lt(a2[0], b2[0])) return this.lt(a2[1], b);
        if (this.lt(b2[0], a2[0])) return this.lt(a, b2[1]);
        return this.lt(a2[1], b2[1]);
    },
    // GREATER THAN
    gt: function (a, b){return this.lt(b, a);},
    // LESS THAN OR EQUAL
    le: function (a, b){return !this.lt(b, a);},
    // GREATER THAN OR EQUAL
    ge: function (a, b){return !this.lt(a, b);},
    // EQUAL
    eq: function (a, b){return !this.lt(a, b) && !this.lt(b, a);},
    // NOT EQUAL
    ne: function (a, b){return this.lt(a, b) || this.lt(b, a);},
    // ---------------------------------------------------------------------------------------------
    // OPERATIONS *
    // ---------------------------------------------------------------------------------------------
    // SUCCESSOR
    s: function (str){return str + "(,)";},
    // TO STRING
    to_str: function (n){return "(,)".repeat(n);},
    // TO NUMBER
    to_num: function (str){return this.cof(str) === "(,)" ? this.to_num(str.slice(0, -3)) + 1 : 0;},
    // LEAST UNCOUNTABLE CRDINAL
    uc: function (){return null;},
    // NORMALIZE
    norm: function (str){return this.isnormal(str) ? str : this.vsp(str)[1];},
    // ---------------------------------------------------------------------------------------------
    // COFINALITY *
    // ---------------------------------------------------------------------------------------------
    // COFINALITY
    cof: function (str, cac = true){
        // CACHE
        if (cac){
            try {cache;} catch {return this.cof(str, false);}
            let key = `${this.name}-COF-${str}`;
            if (!(key in cache)) cache[key] = this.cof(str, false);
            return cache[key];
        }
        // CONSTANT
        if (!str) return "";
        if (str === "A") return "(,(,))";
        // SUCCESSOR
        if (str.slice(-3) === "(,)") return "(,)";
        // LIMIT
        return "(,(,))";
    },
    // TYPE (0: ZERO / 1: SUC / 2: COUNTABLE LIM / 3: UNCOUNTABLE LIM)
    type: function (str){
        if (!this.cof(str)) return 0;
        if (this.cof(str) === "(,)") return 1;
        return 2;
    },
    // ---------------------------------------------------------------------------------------------
    // FUNDAMENTAL SEQUENCE *
    // ---------------------------------------------------------------------------------------------
    fs: function (a, n = "", strong = false, cac = true){
        // CACHE
        if (cac){
            try {cache;} catch {return this.fs(a, n, strong, false);}
            let key = `${this.name}-FS-${a}-${n}-${strong}`;
            if (!(key in cache)) cache[key] = this.fs(a, n, strong, false);
            return cache[key];
        }
        // ZERO
        if (!a) return "";
        // LIMIT
        if (a === "A") return n ? `(${this.fs(a, this.fs(n))},)` : "";
        // ADDITION
        if (!this.single(a)){
            let a1 = this.asp(a);
            return a1[0] + this.fs(a1[1], n);
        }
        // SINGLE
        let a2 = this.vsp(a);
        // BETA IS LIMIT
        if (this.cof(a2[1]) === "(,(,))") return this.norm(`(${a2[0]},${this.fs(a2[1], n)})`);
        // ALPHA IS ZERO
        if (!a2[0]){
            if (!a2[1]) return "";
            return n ? `${this.fs(a, this.fs(n))}${this.norm(`(,${this.fs(a2[1])})`)}` : "";
        }
        // ALPHA IS SUC
        if (this.cof(a2[0]) === "(,)"){
            // BETA IS ZERO
            if (!a2[1]) return n ? this.norm(`(${this.fs(a2[0])},${this.fs(a, this.fs(n))})`) : "";
            // BETA IS SUC
            if (!n) return this.norm(`(${a2[0]},${this.fs(a2[1])})`);
            return `(${this.fs(a2[0])},${this.fs(a, this.fs(n))}${this.fs(n) ? "" : "(,)"})`;
        }
        // BETA IS ZERO
        if (!a2[1]) return `(${this.fs(a2[0], n)},)`;
        // BETA IS SUC
        return `(${this.fs(a2[0], n)},${this.norm(`(${a2[0]},${this.fs(a2[1])})`)}(,))`;
    },
    // ---------------------------------------------------------------------------------------------
    // MATH FORM *
    // ---------------------------------------------------------------------------------------------
    math: function (str){
        // ZERO
        if (!str) return ["0"];
        // LIMIT
        if (str === "A") return [["G", ["0"]]];
        // ADDITION
        if (!this.single(str)){
            let str1 = this.asp(str);
            return [].concat(this.math(str1[0]), ["+"], this.math(str1[1]));
        }
        // SINGLE
        let str2 = this.vsp(str);
        return [["v", this.math(str2[0]), this.math(str2[1])]];
    },
};
// =================================================================================================
// BUCHHOLZ'S PSI
// =================================================================================================
const Buchholz = {
    // ---------------------------------------------------------------------------------------------
    // NAME *
    // ---------------------------------------------------------------------------------------------
    name: "Buchholz",
    // ---------------------------------------------------------------------------------------------
    // NORMAL FORM *
    // ---------------------------------------------------------------------------------------------
    // VALIDITY
    validity: function (str){
        // CONSTANT
        if (["", "A"].includes(str)) return 3;
        // CHECK SYMBOLS
        for (let i = 0; i < str.length; i++) if (!"(,)".includes(str[i])) return 0;
        // CHECK BRACKETS
        let depth = [];
        for (let i = 0; i < str.length; i++){
            if (str[i] === "(") depth.push(1);
            if (str[i] === ",") depth[depth.length - 1]--;
            if (str[i] === ")"){
                if (!depth.length || depth[depth.length - 1]) return 1;
                depth.pop();
            }
        }
        if (depth.length) return 1;
        // CHECK NORMAL
        if (!this.isnormal(str)) return 2;
        // ALL CLEAR
        return 3;
    },
    // IN C SET
    inc: function (c, a, b){
        if (c === "A") return true;
        if (this.lt(c, `(${a},)`)) return true;
        if (this.single(c)){
            let c1 = this.vsp(c);
            return this.lt(c1[0], "(,(,))(,)") && this.inc(c1[1], a, b) && this.lt(c1[1], b);
        }
        let c2 = this.asp(c);
        return this.inc(c2[0], a, b) && this.inc(c2[1], a, b);
    },
    // IS NORMAL
    isnormal: function (str){
        // CONSTANT
        if (["", "A"].includes(str)) return true;
        // SINGLE
        if (this.single(str)){
            let str1 = this.vsp(str);
            if (!this.isnormal(str1[0])) return false;
            if (!this.isnormal(str1[1])) return false;
            return this.inc(str1[1], str1[0], str1[1]);
        }
        // ADDITION
        let str2 = this.asp(str);
        if (!this.isnormal(str2[0])) return false;
        if (!this.isnormal(str2[1])) return false;
        if (this.single(str2[1])) return !this.lt(str2[0], str2[1]);
        return !this.lt(str2[0], this.asp(str2[1])[0]);
    },
    // ---------------------------------------------------------------------------------------------
    // SPLIT
    // ---------------------------------------------------------------------------------------------
    // ADDITION SPLIT
    asp: function (str){
        if (!str) return ["", ""];
        let depth = 0;
        for (let i = 0; i < str.length; i++){
            if (str[i] === "(") depth++;
            if (str[i] === ")") depth--;
            if (!depth) return [str.slice(0, i + 1), str.slice(i + 1)];
        }
    },
    // VARIABLE SPLIT
    vsp: function (str){
        let depth = 0;
        for (let i = 1; i < str.length - 1; i++){
            if (str[i] === "(") depth++;
            if (str[i] === ")") depth--;
            if (!depth && str[i] === ",") return [str.slice(1, i), str.slice(i + 1, -1)];
        }
    },
    // SINGLE
    single: function (str){return !this.asp(str)[1];},
    // ---------------------------------------------------------------------------------------------
    // ORDERING *
    // ---------------------------------------------------------------------------------------------
    // LESS THAN
    lt: function (a, b, cac = true){
        // CACHE
        if (cac){
            try {cache;} catch {return this.lt(a, b, false);}
            let key = `${this.name}-LT-${a}-${b}`;
            if (!(key in cache)) cache[key] = this.lt(a, b, false);
            return cache[key];
        }
        // CONSTANT
        if (!b) return false;
        if (a === "A") return false;
        if (b === "A") return true;
        if (!a) return true;
        // ADDITION
        if (!this.single(a) && !this.single(b)){
            let a1 = this.asp(a), b1 = this.asp(b);
            return this.lt(a1[0], b1[0]) || (!this.lt(b1[0], a1[0]) && this.lt(a1[1], b1[1]));
        }
        if (!this.single(a) && this.single(b)) return this.lt(this.asp(a)[0], b);
        if (this.single(a) && !this.single(b)) return !this.lt(this.asp(b)[0], a);
        // SINGLE
        let a2 = this.vsp(a), b2 = this.vsp(b);
        return this.lt(a2[0], b2[0]) || (!this.lt(b2[0], a2[0]) && this.lt(a2[1], b2[1]));
    },
    // GREATER THAN
    gt: function (a, b){return this.lt(b, a);},
    // LESS THAN OR EQUAL
    le: function (a, b){return !this.lt(b, a);},
    // GREATER THAN OR EQUAL
    ge: function (a, b){return !this.lt(a, b);},
    // EQUAL
    eq: function (a, b){return !this.lt(a, b) && !this.lt(b, a);},
    // NOT EQUAL
    ne: function (a, b){return this.lt(a, b) || this.lt(b, a);},
    // ---------------------------------------------------------------------------------------------
    // OPERATIONS *
    // ---------------------------------------------------------------------------------------------
    // SUCCESSOR
    s: function (str){return str + "(,)";},
    // TO STRING
    to_str: function (n){return "(,)".repeat(n);},
    // TO NUMBER
    to_num: function (str){return this.cof(str) === "(,)" ? this.to_num(str.slice(0, -3)) + 1 : 0;},
    // LEAST UNCOUNTABLE CRDINAL
    uc: function (){return "((,),)";},
    // ---------------------------------------------------------------------------------------------
    // COFINALITY *
    // ---------------------------------------------------------------------------------------------
    // COFINALITY
    cof: function (str, cac = true){
        // CACHE
        if (cac){
            try {cache;} catch {return this.cof(str, false);}
            let key = `${this.name}-COF-${str}`;
            if (!(key in cache)) cache[key] = this.cof(str, false);
            return cache[key];
        }
        // CONSTANT
        if (!str) return "";
        if (str === "A") return "(,(,))";
        // ADDITION
        if (!this.single(str)) return this.cof(this.asp(str)[1]);
        // SINGLE
        let str1 = this.vsp(str), c0 = this.cof(str1[0]), c1 = this.cof(str1[1]);
        // SINGLE ZERO
        if (!str1[1]) return this.lt("(,)", c0) ? c0 : str;
        // SINGLE SUCCESSOR
        if (c1 === "(,)") return "(,(,))";
        // SINGLE LIMIT
        if (this.lt(c1, str)) return c1;
        return "(,(,))";
    },
    // TYPE (0: ZERO / 1: SUC / 2: COUNTABLE LIM / 3: UNCOUNTABLE LIM)
    type: function (str){
        if (!this.cof(str)) return 0;
        if (this.cof(str) === "(,)") return 1;
        if (this.cof(str) === "(,(,))") return 2;
        return 3;
    },
    // ---------------------------------------------------------------------------------------------
    // FUNDAMENTAL SEQUENCE *
    // ---------------------------------------------------------------------------------------------
    fs: function (a, n = "", strong = false, cac = true){
        // CACHE
        if (cac){
            try {cache;} catch {return this.fs(a, n, strong, false);}
            let key = `${this.name}-FS-${a}-${n}-${strong}`;
            if (!(key in cache)) cache[key] = this.fs(a, n, strong, false);
            return cache[key];
        }
        // ZERO
        if (!a) return "";
        // LIMIT
        if (a === "A") return n ? `((,(,)),${this.fs(a, this.fs(n))})` : "";
        // ADDITION
        if (!this.single(a)){
            let a1 = this.asp(a);
            return a1[0] + this.fs(a1[1], n, strong);
        }
        // SINGLE
        let a2 = this.vsp(a), c0 = this.cof(a2[0]), c1 = this.cof(a2[1]);
        // SINGLE ZERO
        if (!a2[1]){
            if (!c0) return "";
            if (c0 === "(,)"){
                if (!strong) return n;
                if (n === "A") return `(${this.fs(a2[0])},A)`;
                return `(${this.fs(a2[0])},${this.fs("A", n)})`;
            }
            return `(${this.fs(a2[0], n, strong)},)`;
        }
        // SINGLE SUCCESSOR
        if (c1 === "(,)") return n ? `${this.fs(a, this.fs(n))}(${a2[0]},${this.fs(a2[1])})` : "";
        // SINGLE LIMIT
        if (this.lt(c1, a)) return `(${a2[0]},${this.fs(a2[1], n, strong)})`;
        return n ? `(${a2[0]},${this.re(a2[1], this.fs(n))})` : "";
    },
    re: function (a, n){
        let c = this.fs(this.vsp(this.cof(a))[0]);
        return this.fs(a, n ? `(${c},${this.re(a, this.fs(n))})` : "");
    },
    // ---------------------------------------------------------------------------------------------
    // MATH FORM *
    // ---------------------------------------------------------------------------------------------
    math: function (str){
        // ZERO
        if (!str) return ["0"];
        // LIMIT
        if (str === "A") return [["e", [["W", ["\\omega"]], "+", "1"]]];
        // ADDITION
        if (!this.single(str)){
            let str1 = this.asp(str);
            return [].concat(this.math(str1[0]), ["+"], this.math(str1[1]));
        }
        // SINGLE
        let str2 = this.vsp(str);
        return [["b", this.math(str2[0]), this.math(str2[1])]];
    },
};
// =================================================================================================
// EXTENEDED BUCHHOLZ'S PSI
// =================================================================================================
const ExBuchholz = {
    // ---------------------------------------------------------------------------------------------
    // NAME *
    // ---------------------------------------------------------------------------------------------
    name: "ExBuchholz",
    // ---------------------------------------------------------------------------------------------
    // NORMAL FORM *
    // ---------------------------------------------------------------------------------------------
    // VALIDITY
    validity: function (str){
        // CONSTANT
        if (["", "A"].includes(str)) return 3;
        // CHECK SYMBOLS
        for (let i = 0; i < str.length; i++) if (!"(,)".includes(str[i])) return 0;
        // CHECK BRACKETS
        let depth = [];
        for (let i = 0; i < str.length; i++){
            if (str[i] === "(") depth.push(1);
            if (str[i] === ",") depth[depth.length - 1]--;
            if (str[i] === ")"){
                if (!depth.length || depth[depth.length - 1]) return 1;
                depth.pop();
            }
        }
        if (depth.length) return 1;
        // CHECK NORMAL
        if (!this.isnormal(str)) return 2;
        // ALL CLEAR
        return 3;
    },
    // IN C SET
    inc: function (c, a, b){
        if (c === "A") return true;
        if (this.lt(c, `(${a},)`)) return true;
        if (this.single(c)){
            let c1 = this.vsp(c);
            return this.inc(c1[0], a, b) && this.inc(c1[1], a, b) && this.lt(c1[1], b);
        }
        let c2 = this.asp(c);
        return this.inc(c2[0], a, b) && this.inc(c2[1], a, b);
    },
    // IS NORMAL
    isnormal: function (str){
        // CONSTANT
        if (["", "A"].includes(str)) return true;
        // SINGLE
        if (this.single(str)){
            let str1 = this.vsp(str);
            if (!this.isnormal(str1[0])) return false;
            if (!this.isnormal(str1[1])) return false;
            return this.inc(str1[1], str1[0], str1[1]);
        }
        // ADDITION
        let str2 = this.asp(str);
        if (!this.isnormal(str2[0])) return false;
        if (!this.isnormal(str2[1])) return false;
        if (this.single(str2[1])) return !this.lt(str2[0], str2[1]);
        return !this.lt(str2[0], this.asp(str2[1])[0]);
    },
    // ---------------------------------------------------------------------------------------------
    // SPLIT
    // ---------------------------------------------------------------------------------------------
    // ADDITION SPLIT
    asp: function (str){
        if (!str) return ["", ""];
        let depth = 0;
        for (let i = 0; i < str.length; i++){
            if (str[i] === "(") depth++;
            if (str[i] === ")") depth--;
            if (!depth) return [str.slice(0, i + 1), str.slice(i + 1)];
        }
    },
    // VARIABLE SPLIT
    vsp: function (str){
        let depth = 0;
        for (let i = 1; i < str.length - 1; i++){
            if (str[i] === "(") depth++;
            if (str[i] === ")") depth--;
            if (!depth && str[i] === ",") return [str.slice(1, i), str.slice(i + 1, -1)];
        }
    },
    // SINGLE
    single: function (str){return !this.asp(str)[1];},
    // ---------------------------------------------------------------------------------------------
    // ORDERING *
    // ---------------------------------------------------------------------------------------------
    // LESS THAN
    lt: function (a, b, cac = true){
        // CACHE
        if (cac){
            try {cache;} catch {return this.lt(a, b, false);}
            let key = `${this.name}-LT-${a}-${b}`;
            if (!(key in cache)) cache[key] = this.lt(a, b, false);
            return cache[key];
        }
        // CONSTANT
        if (!b) return false;
        if (a === "A") return false;
        if (b === "A") return true;
        if (!a) return true;
        // ADDITION
        if (!this.single(a) && !this.single(b)){
            let a1 = this.asp(a), b1 = this.asp(b);
            return this.lt(a1[0], b1[0]) || (!this.lt(b1[0], a1[0]) && this.lt(a1[1], b1[1]));
        }
        if (!this.single(a) && this.single(b)) return this.lt(this.asp(a)[0], b);
        if (this.single(a) && !this.single(b)) return !this.lt(this.asp(b)[0], a);
        // SINGLE
        let a2 = this.vsp(a), b2 = this.vsp(b);
        return this.lt(a2[0], b2[0]) || (!this.lt(b2[0], a2[0]) && this.lt(a2[1], b2[1]));
    },
    // GREATER THAN
    gt: function (a, b){return this.lt(b, a);},
    // LESS THAN OR EQUAL
    le: function (a, b){return !this.lt(b, a);},
    // GREATER THAN OR EQUAL
    ge: function (a, b){return !this.lt(a, b);},
    // EQUAL
    eq: function (a, b){return !this.lt(a, b) && !this.lt(b, a);},
    // NOT EQUAL
    ne: function (a, b){return this.lt(a, b) || this.lt(b, a);},
    // ---------------------------------------------------------------------------------------------
    // OPERATIONS *
    // ---------------------------------------------------------------------------------------------
    // SUCCESSOR
    s: function (str){return str + "(,)";},
    // TO STRING
    to_str: function (n){return "(,)".repeat(n);},
    // TO NUMBER
    to_num: function (str){return this.cof(str) === "(,)" ? this.to_num(str.slice(0, -3)) + 1 : 0;},
    // LEAST UNCOUNTABLE CRDINAL
    uc: function (){return "((,),)";},
    // ---------------------------------------------------------------------------------------------
    // COFINALITY *
    // ---------------------------------------------------------------------------------------------
    // COFINALITY
    cof: function (str, cac = true){
        // CACHE
        if (cac){
            try {cache;} catch {return this.cof(str, false);}
            let key = `${this.name}-COF-${str}`;
            if (!(key in cache)) cache[key] = this.cof(str, false);
            return cache[key];
        }
        // CONSTANT
        if (!str) return "";
        if (str === "A") return "(,(,))";
        // ADDITION
        if (!this.single(str)) return this.cof(this.asp(str)[1]);
        // SINGLE
        let str1 = this.vsp(str), c0 = this.cof(str1[0]), c1 = this.cof(str1[1]);
        // SINGLE ZERO
        if (!str1[1]) return this.lt("(,)", c0) ? c0 : str;
        // SINGLE SUCCESSOR
        if (c1 === "(,)") return "(,(,))";
        // SINGLE LIMIT
        if (this.lt(c1, str)) return c1;
        return "(,(,))";
    },
    // TYPE (0: ZERO / 1: SUC / 2: COUNTABLE LIM / 3: UNCOUNTABLE LIM)
    type: function (str){
        if (!this.cof(str)) return 0;
        if (this.cof(str) === "(,)") return 1;
        if (this.cof(str) === "(,(,))") return 2;
        return 3;
    },
    // ---------------------------------------------------------------------------------------------
    // FUNDAMENTAL SEQUENCE *
    // ---------------------------------------------------------------------------------------------
    fs: function (a, n = "", strong = false, cac = true){
        // CACHE
        if (cac){
            try {cache;} catch {return this.fs(a, n, strong, false);}
            let key = `${this.name}-FS-${a}-${n}-${strong}`;
            if (!(key in cache)) cache[key] = this.fs(a, n, strong, false);
            return cache[key];
        }
        // ZERO
        if (!a) return "";
        // LIMIT
        if (a === "A") return n ? `(${this.fs(a, this.fs(n))},)` : "";
        // ADDITION
        if (!this.single(a)){
            let a1 = this.asp(a);
            return a1[0] + this.fs(a1[1], n, strong);
        }
        // SINGLE
        let a2 = this.vsp(a), c0 = this.cof(a2[0]), c1 = this.cof(a2[1]);
        // SINGLE ZERO
        if (!a2[1]){
            if (!c0) return "";
            if (c0 === "(,)"){
                if (!strong) return n;
                if (n === "A") return `(${this.fs(a2[0])},A)`;
                return `(${this.fs(a2[0])},${this.fs("A", n)})`;
            }
            return `(${this.fs(a2[0], n, strong)},)`;
        }
        // SINGLE SUCCESSOR
        if (c1 === "(,)") return n ? `${this.fs(a, this.fs(n))}(${a2[0]},${this.fs(a2[1])})` : "";
        // SINGLE LIMIT
        if (this.lt(c1, a)) return `(${a2[0]},${this.fs(a2[1], n, strong)})`;
        return n ? `(${a2[0]},${this.re(a2[1], this.fs(n))})` : "";
    },
    re: function (a, n){
        let c = this.fs(this.vsp(this.cof(a))[0]);
        return this.fs(a, n ? `(${c},${this.re(a, this.fs(n))})` : "");
    },
    // ---------------------------------------------------------------------------------------------
    // MATH FORM *
    // ---------------------------------------------------------------------------------------------
    math: function (str){
        // ZERO
        if (!str) return ["0"];
        // LIMIT
        if (str === "A") return [["W", [["W", [["W", ["\\cdot_{\\cdot_\\cdot}"]]]]]]];
        // ADDITION
        if (!this.single(str)){
            let str1 = this.asp(str);
            return [].concat(this.math(str1[0]), ["+"], this.math(str1[1]));
        }
        // SINGLE
        let str2 = this.vsp(str);
        return [["B", this.math(str2[0]), this.math(str2[1])]];
    },
};
// =================================================================================================
// RATHJEN'S SMALL PSI
// =================================================================================================
const RathjenM = {
    // ---------------------------------------------------------------------------------------------
    // NAME *
    // ---------------------------------------------------------------------------------------------
    name: "RathjenM",
    // ---------------------------------------------------------------------------------------------
    // NORMAL FORM *
    // ---------------------------------------------------------------------------------------------
    // VALIDITY
    validity: function (str){
        // CONSTANT
        if (["", "M", "A"].includes(str)) return 3;
        // CHECK SYMBOLS
        for (let i = 0; i < str.length; i++) if (!"(,)MvVxr".includes(str[i])) return 0;
        // CHECK BRACKETS
        let depth = [];
        for (let i = 0; i < str.length; i++){
            if (str[i] === "("){
                if (i + 1 >= str.length) return 1;
                if (!"vVxr".includes(str[i + 1])) return 1;
                depth.push(1);
            }
            if (str[i] === ",") depth[depth.length - 1]--;
            if (depth[depth.length - 1] < 0) return 1;
            if (str[i] === ")"){
                if (!depth.length || depth[depth.length - 1]) return 1;
                depth.pop();
            }
            if ("vVxr".includes(str[i])){
                if (!i) return 1;
                if (str[i - 1] !== "(") return 1;
            }
        }
        if (depth.length) return 1;
        // CHECK NORMAL
        if (!this.isnormal(str)) return 2;
        // ALL CLEAR
        return 3;
    },
    // STAR FUNCTION
    st: function (str){
        // CONSTANT
        if (["", "M"].includes(str)) return "";
        // ADDITION
        let str1 = null;
        if (!this.single(str)) str1 = this.asp(str);
        // VEBLEN
        if (str[1] === "v" && str1 === null) str1 = this.vsp(str);
        // ELSE
        if (str1 === null) return str;
        // COMPARE
        let s0 = this.st(str1[0]), s1 = this.st(str1[1]);
        return this.lt(s0, s1) ? s1 : s0;
    },
    // IS REGULAR
    isreg: function (str){
        if (!str) return false;
        if (!this.single(str)) return false;
        if (str[1] !== "x") return false;
        let str1 = this.vsp(str);
        if (!str1[1]) return true;
        if (str1[1].slice(-4) === "(v,)") return true;
        return false;
    },
    // LEAST
    least: function (a, b){
        // CONSTANT
        if (["", "M"].includes(a)) return "";
        let a1, b1, s0, s1, s2, max;
        // ADDITION
        if (!this.single(a)){
            a1 = this.asp(a);
            s0 = this.least(a1[0], b), s1 = this.least(a1[1], b);
            return this.lt(s0, s1) ? s1 : s0;
        }
        // NOT COLLAPSE
        if ("vVx".includes(a[1])){
            a1 = this.vsp(a);
            s0 = this.least(a1[0], b), s1 = this.least(a1[1], b);
            return this.lt(s0, s1) ? s1 : s0;
        }
        // COLLAPSE
        if (a[1] === "r"){
            a1 = this.vsp(a);
            b1 = this.vsp(b);
            if (!b1[1] && !this.lt(this.st(b1[0]), a)) return "";
            if (b1[1] && !this.lt(`(x${b1[0]},${this.fs(b1[1])})`, a)) return "";
            if (this.lt(a1[0], b)) return this.least(a1[0], b);
            s0 = a1[1] + "(v,)", s1 = this.least(a1[0], b), s2 = this.least(a1[1], b);
            max = s0;
            if (this.lt(max, s1)) max = s1;
            if (this.lt(max, s2)) max = s2;
            return max;
        }
    },
    // IN C SET
    inc: function (c, a, b){
        // A MUST BE REGULAR
        if (!this.isreg(a)) return false;
        // A IS REGULAR
        return !this.lt(b, this.least(c, a));
    },
    // IS NORMAL
    isnormal: function (str){
        // CONSTANT
        if (["", "M", "A"].includes(str)) return true;
        // ADDITION
        if (!this.single(str)){
            let str1 = this.asp(str);
            if (!this.isnormal(str1[0])) return false;
            if (!this.isnormal(str1[1])) return false;
            if (this.single(str1[1])) return !this.lt(str1[0], str1[1]);
            return !this.lt(str1[0], this.asp(str1[1])[0]);
        }
        // SINGLE
        let str2 = this.vsp(str);
        if (!this.isnormal(str2[0])) return false;
        if (!this.isnormal(str2[1])) return false;
        // VEBLEN
        if (str[1] === "v") return this.lt(str2[0], str) && this.lt(str2[1], str);
        // BIG VEBLEN
        if (str[1] === "V") return this.lt(str2[0], str) && this.lt(str2[1], str) &&
                                   this.lt(str2[0], "M") && this.lt(str2[1], "M") && str2[0];
        // INACCESSIBLE
        if (str[1] === "x") return this.lt(str2[1], str);
        // COLLAPSE
        if (str[1] === "r") return this.isreg(str2[0]) && this.inc(str2[1], str2[0], str2[1]);
        // ELSE
        return false;
    },
    // ---------------------------------------------------------------------------------------------
    // SPLIT
    // ---------------------------------------------------------------------------------------------
    // ADDITION SPLIT
    asp: function (str){
        if (!str) return ["", ""];
        if (str[0] === "M") return ["M", str.slice(1)];
        let depth = 0;
        for (let i = 0; i < str.length; i++){
            if (str[i] === "(") depth++;
            if (str[i] === ")") depth--;
            if (!depth) return [str.slice(0, i + 1), str.slice(i + 1)];
        }
    },
    // VARIABLE SPLIT
    vsp: function (str){
        if (str[0] === "M") return [];
        let depth = 0;
        for (let i = 2; i < str.length - 1; i++){
            if (str[i] === "(") depth++;
            if (str[i] === ")") depth--;
            if (!depth && str[i] === ",") return [str.slice(2, i), str.slice(i + 1, -1)];
        }
    },
    // SINGLE
    single: function (str){return !this.asp(str)[1];},
    // ---------------------------------------------------------------------------------------------
    // ORDERING *
    // ---------------------------------------------------------------------------------------------
    // LESS THAN
    lt: function (a, b, cac = true){
        // CACHE
        if (cac){
            try {cache;} catch {return this.lt(a, b, false);}
            let key = `${this.name}-LT-${a}-${b}`;
            if (!(key in cache)) cache[key] = this.lt(a, b, false);
            return cache[key];
        }
        // CONSTANT
        if (!b) return false;
        if (a === "A") return false;
        if (b === "A") return true;
        if (!a) return true;
        // ADDITION
        if (!this.single(a) && !this.single(b)){
            let a1 = this.asp(a), b1 = this.asp(b);
            return this.lt(a1[0], b1[0]) || (!this.lt(b1[0], a1[0]) && this.lt(a1[1], b1[1]));
        }
        if (!this.single(a) && this.single(b)) return this.lt(this.asp(a)[0], b);
        if (this.single(a) && !this.single(b)) return !this.lt(this.asp(b)[0], a);
        // SAME
        let a2 = this.vsp(a), b2 = this.vsp(b);
        if (a === "M" && b === "M") return false;
        if (a[1] === b[1]){
            if ("vV".includes(a[1])){
                if (this.lt(a2[0], b2[0])) return this.lt(a2[1], b);
                if (this.lt(b2[0], a2[0])) return this.lt(a, b2[1]);
            }
            if (a[1] === "x"){
                if (!this.lt(a, b2[1]) && !this.lt(b2[1], a)){
                    return !this.lt(b2[0], a2[0]) || !this.lt(this.st(b2[0]), a);
                }
                if (this.lt(a2[0], b2[0])) return this.lt(a2[1], b) && this.lt(this.st(a2[0]), b);
                if (this.lt(b2[0], a2[0])) return !this.lt(b2[1], a) || !this.lt(this.st(b2[0]), a);
            }
            if (a[1] === "r"){
                if (this.lt(a2[0], b2[0])) return this.lt(a2[0], b);
                if (this.lt(b2[0], a2[0])) return this.lt(a, b2[0]);
            }
            return this.lt(a2[1], b2[1]);
        }
        // ONE SIDE M
        if (a === "M" && "vV".includes(b[1])){
            return (this.lt(a, b2[0]) || b2[1]) && (!this.lt(b2[0], a) || this.lt(a, b2[1]));
        }
        if (a === "M" && "xr".includes(b[1])) return false;
        if ("vV".includes(a[1]) && b === "M") return this.lt(a2[0], b) && this.lt(a2[1], b);
        if ("xr".includes(a[1]) && b === "M") return true;
        // ONE SIDE VEBLEN
        if (a[1] === "v") return this.lt(a2[0], b) && this.lt(a2[1], b);
        if (b[1] === "v"){
            return (this.lt(a, b2[0]) || b2[1]) && (!this.lt(b2[0], a) || this.lt(a, b2[1]));
        }
        // ELSE
        if (a[1] === "V" && b[1] === "x"){
            if (!b2[0]) return this.lt(a, b2[1]);
            return this.lt(a2[0], b) && this.lt(a2[1], b);
        }
        if (a[1] === "x" && b[1] === "V"){
            if (!a2[0]) return this.lt(a2[1], b);
            if (this.lt(a, b2[0])) return true;
            if (this.lt(b2[0], a)) return this.lt(a, b2[1]);
            return b2[1];
        }
        if (a[1] === "V" && b[1] === "r"){
            return this.lt(a2[0], b) && this.lt(a2[1], b) && this.lt(a, b2[0]);
        }
        if (a[1] === "r" && b[1] === "V"){
            if (!this.vsp(a2[0])[0]) return this.lt(this.vsp(a2[0])[1], b);
            if (this.lt(a, b2[0])) return true;
            if (this.lt(b2[0], a)) return this.lt(a, b2[1]);
            return b2[1];
        }
        if (a[1] === "x" && b[1] === "r") return this.lt(a, b2[0]) && this.inc(a, b2[0], b2[1]);
        if (a[1] === "r" && b[1] === "x"){
            if (!this.lt(a, b2[1]) && !this.lt(b2[1], a)){
                if (!this.lt(b2[0], this.vsp(a2[0])[0])) return true;
                if (!this.lt(this.st(b2[0]), a2[0])) return true;
                return !this.inc(b2[0], a2[0], a2[1]);
            }
            return !(this.lt(b, a2[0]) && this.inc(b, a2[0], a2[1]));
        }
    },
    // GREATER THAN
    gt: function (a, b){return this.lt(b, a);},
    // LESS THAN OR EQUAL
    le: function (a, b){return !this.lt(b, a);},
    // GREATER THAN OR EQUAL
    ge: function (a, b){return !this.lt(a, b);},
    // EQUAL
    eq: function (a, b){return !this.lt(a, b) && !this.lt(b, a);},
    // NOT EQUAL
    ne: function (a, b){return this.lt(a, b) || this.lt(b, a);},
    // ---------------------------------------------------------------------------------------------
    // OPERATIONS *
    // ---------------------------------------------------------------------------------------------
    // SUCCESSOR
    s: function (str){return str + "(v,)";},
    // TO STRING
    to_str: function (n){return "(v,)".repeat(n);},
    // TO NUMBER
    to_num: function (str){
        return this.cof(str) === "(v,)" ? this.to_num(str.slice(0, -4)) + 1 : 0;
    },
    // LEAST UNCOUNTABLE CRDINAL
    uc: function (){return "(x,)";},
    // NORMALIZE
    norm: function (str){
        // NORMAL
        if (this.isnormal(str)) return str;
        // ADDITION
        if (!this.single(str)){
            let str1 = this.asp(str);
            return this.norm(str1[0]) + this.norm(str1[1]);
        }
        // SINGLE
        let str2 = this.vsp(str);
        // VEBLEN
        if ("vV".includes(str[1])){
            if (str[1] === "V" && !str2[0]) return this.norm(`(x,${str2[1]})`);
            if (!this.lt(str2[1], str)) return str2[1];
            if (!this.lt(str2[0], str)) return str2[0];
        }
        // INACCESSIBLE
        if (str[1] === "x") return str2[1];
        // ELSE
        return str;
    },
    // ---------------------------------------------------------------------------------------------
    // COFINALITY *
    // ---------------------------------------------------------------------------------------------
    // COFINALITY
    cof: function (str, cac = true){
        // CACHE
        if (cac){
            try {cache;} catch {return this.cof(str, false);}
            let key = `${this.name}-COF-${str}`;
            if (!(key in cache)) cache[key] = this.cof(str, false);
            return cache[key];
        }
        // CONSTANT
        if (["", "(v,)", "M"].includes(str)) return str;
        if (str === "A") return "(v,(v,))";
        // REGULAR
        if (this.isreg(str)) return str;
        // ADDITION
        if (!this.single(str)) return this.cof(this.asp(str)[1]);
        // SINGLE
        let str1 = this.vsp(str), c0 = this.cof(str1[0]), c1 = this.cof(str1[1]), c2;
        // BOTH VEBLEN
        if ("vV".includes(str[1])){
            if (this.lt("(v,)", c1)) return c1;
            if (this.lt("(v,)", c0)) return c0;
            return "(v,(v,))";
        }
        // INACCESSIBLE
        if (str[1] === "x") return c1;
        // COLLAPSE
        if (str[1] === "r"){
            if (!this.lt(c1, str1[0])) return "(v,(v,))";
            if (this.lt("(v,)", c1)) return c1;
            c2 = this.cof(this.vsp(str1[0])[0]);
            if (!this.lt("(v,)", c2)) return "(v,(v,))";
            if (c2 === "M") return "(v,(v,))";
            return c2;
        }
    },
    // TYPE (0: ZERO / 1: SUC / 2: COUNTABLE LIM / 3: UNCOUNTABLE LIM)
    type: function (str){
        if (!this.cof(str)) return 0;
        if (this.cof(str) === "(v,)") return 1;
        if (this.cof(str) === "(v,(v,))") return 2;
        return 3;
    },
    // ---------------------------------------------------------------------------------------------
    // FUNDAMENTAL SEQUENCE *
    // ---------------------------------------------------------------------------------------------
    fs: function (a, n = "", strong = false, cac = true){
        // CACHE
        if (cac){
            try {cache;} catch {return this.fs(a, n, strong, false);}
            let key = `${this.name}-FS-${a}-${n}-${strong}`;
            if (!(key in cache)) cache[key] = this.fs(a, n, strong, false);
            return cache[key];
        }
        // ZERO
        if (!a) return "";
        // LIMIT
        if (a === "A"){
            if (!n) return "";
            if (!this.fs(n)) return "M";
            if (!this.fs(this.fs(n))) return "(vM,(v,))";
            return `(v${this.fs(a, this.fs(n))},)`;
        }
        // MAHLO
        if (a === "M"){
            if (!strong) return n;
            if (n === "A") return "(r(xA,),)";
            return `(r(x${this.fs("A", n)},),)`;
        }
        // ADDITION
        if (!this.single(a)){
            let a1 = this.asp(a);
            return a1[0] + this.fs(a1[1], n, strong);
        }
        // SINGLE
        let a2 = this.vsp(a);
        // VEBLEN
        if (a[1] === "v"){
            // BETA IS LIMIT
            if (this.lt("(v,)", this.cof(a2[1]))){
                return this.norm(`(v${a2[0]},${this.fs(a2[1], n, strong)})`);
            }
            // ALPHA IS ZERO
            if (!a2[0]){
                if (!a2[1]) return "";
                return n ? `${this.fs(a, this.fs(n))}${this.norm(`(v,${this.fs(a2[1])})`)}` : "";
            }
            // ALPHA IS SUC
            if (this.cof(a2[0]) === "(v,)"){
                // BETA IS ZERO
                if (!a2[1]){
                    return n ? this.norm(`(v${this.fs(a2[0])},${this.fs(a, this.fs(n))})`) : "";
                }
                // BETA IS SUC
                if (!n) return this.norm(`(v${a2[0]},${this.fs(a2[1])})`);
                return `(v${this.fs(a2[0])},${this.fs(a, this.fs(n))}${this.fs(n) ? "" : "(v,)"})`;
            }
            // BETA IS ZERO
            if (!a2[1]) return this.norm(`(v${this.fs(a2[0], n, strong)},)`);
            // BETA IS SUC
            return `(v${this.fs(a2[0], n, strong)},` +
                   this.norm(`(v${a2[0]},${this.fs(a2[1])})`) + "(v,))";
        }
        // BIG VEBLEN
        if (a[1] === "V"){
            // BETA IS LIMIT
            if (this.lt("(v,)", this.cof(a2[1]))){
                return this.norm(`(V${a2[0]},${this.fs(a2[1], n, strong)})`);
            }
            // ALPHA IS SUC
            if (this.cof(a2[0]) === "(v,)"){
                // BETA IS ZERO
                if (!a2[1]){
                    return n ? this.norm(`(V${this.fs(a2[0])},${this.fs(a, this.fs(n))})`) : "";
                }
                // BETA IS SUC
                if (!n) return this.norm(`(V${a2[0]},${this.fs(a2[1])})`);
                if (!this.fs(n)){
                    return this.norm(`(V${this.fs(a2[0])},${this.fs(a, this.fs(n))}(v,))`);
                }
                return this.norm(`(V${this.fs(a2[0])},${this.fs(a, this.fs(n))})`);
            }
            // BETA IS ZERO
            if (!a2[1]) return this.norm(`(V${this.fs(a2[0], n, strong)},)`);
            // BETA IS SUC
            return this.norm(`(V${this.fs(a2[0], n, strong)},` +
                   this.norm(`(V${a2[0]},${this.fs(a2[1])})`) + "(v,))");
        }
        // INACCESSIBLE
        if (a[1] === "x"){
            if (!this.lt("(v,)", this.cof(a2[1]))){
                if (!strong) return n;
                if (n === "A") return `(r${a},A)`;
                return `(r${a},${this.fs("A", n)})`;
            }
            return this.norm(`(x${a2[0]},${this.fs(a2[1], n, strong)})`);
        }
        // COLLAPSE (r(x[ALPHA],[BETA])=[CARD],[GAMMA])
        let a3 = this.vsp(a2[0]).concat(a2[1]);
        let c0 = this.cof(a3[0]), c2 = this.cof(a3[2]);
        // GAMMA COF IS MAHLO
        if (c2 === "M") return `(r${a2[0]},${this.fs(a2[1], `(r(x${this.fs("A", n)},),)`)})`;
        // GAMMA COF IS AT LEAST CARD
        if (!this.lt(c2, a2[0])) return n ? `(r${a2[0]},${this.re(a2[1], this.fs(n))})` : "";
        // GAMMA IS LIMIT
        if (this.lt("(v,)", c2)) return `(r${a2[0]},${this.fs(a2[1], n, strong)})`;
        // ALPHA IS ZERO
        if (!a3[0]){
            if (!a3[1] && !a3[2]) return n ? `(v${this.fs(a, this.fs(n))},)` : "";
            if (!n) return "";
            if (!this.fs(n)){
                if (a3[2]) return `(r${a2[0]},${this.fs(a2[1])})`;
                return this.norm(`(x,${this.fs(a3[1])})`);
            }
            if (!this.fs(this.fs(n))) return `(v${this.fs(a, this.fs(n))},(v,))`;
            return `(v${this.fs(a, this.fs(n))},)`;
        }
        // ALPHA IS ONE
        if (a3[0] === "(v,)"){
            if (!a3[1] && !a3[2]){
                return n ? this.fs(n) ? this.norm(`(V${this.fs(a, this.fs(n))},)`) : "(x,)" : "";
            }
            if (!n) return "";
            if (!this.fs(n)){
                if (a3[2]) return `(r${a2[0]},${this.fs(a2[1])})`;
                return this.norm(`(x(v,),${this.fs(a3[1])})`);
            }
            if (!this.fs(this.fs(n))) return `(V${this.fs(a, this.fs(n))},(v,))`;
            return `(V${this.fs(a, this.fs(n))},)`;
        }
        // ALPHA IS SUC
        if (c0 === "(v,)"){
            if (!a3[1] && !a3[2]){
                return n ? this.norm(`(x${this.fs(a3[0])},${this.fs(a, this.fs(n))})`) : "";
            }
            if (!n) return "";
            if (!this.fs(n)){
                if (a3[2]) return `(r${a2[0]},${this.fs(a2[1])})`;
                return this.norm(`(x${a3[0]},${this.fs(a3[1])})`);
            }
            if (!this.fs(this.fs(n))) return `(x${this.fs(a3[0])},${this.fs(a, this.fs(n))}(v,))`;
            return `(x${this.fs(a3[0])},${this.fs(a, this.fs(n))})`;
        }
        // ALPHA IS LIMIT
        if (this.lt(c0, "M")){
            if (a3[2]) return `(r(x${this.fs(a3[0], n, strong)},` +
                              `(r${a2[0]},${this.fs(a2[1])})(v,)),)`;
            if (a3[1]) return `(r(x${this.fs(a3[0], n, strong)},` +
                              `${this.norm(`(x${a3[0]},${this.fs(a3[1])})`)}(v,)),)`;
            let t = this.tail(a3[0]);
            if (this.lt(`(x${this.fs(a3[0])},${t}(v,))`, `(x${this.fs(a3[0], "(v,)")},)`)){
                return `(r(x${this.fs(a3[0], n, strong)},),)`;
            }
            return `(r(x${this.fs(a3[0], n, strong)},${t}(v,)),)`;
        }
        // ALPHA COF IS MAHLO
        if (c0 === "M"){
            if (!n){
                if (a3[2]) return `(r${a2[0]},${this.fs(a2[1])})`;
                if (a3[1]) return this.norm(`(x${a3[0]},${this.fs(a3[1])})`);
                return "";
            }
            return `(r(x${this.fs(a3[0], this.fs(a, this.fs(n)))},),)`;
        }
    },
    re: function (a, n){return this.fs(a, n ? `(r${this.cof(a)},${this.re(a, this.fs(n))})` : "");},
    tail: function (str){
        // CONSTANT
        if (["", "M"].includes(str)) return "";
        // LESS THAN M
        if (this.lt(str, "M")) return str;
        // ADDITION
        if (!this.single(str)) return this.tail(this.asp(str)[1]);
        // SINGLE (HAS TO BE VEBLEN)
        let str1 = this.vsp(str);
        return this.lt("(v,)", this.cof(str1[1])) ? this.tail(str1[1]) : this.tail(str1[0]);
    },
    // ---------------------------------------------------------------------------------------------
    // MATH FORM *
    // ---------------------------------------------------------------------------------------------
    math: function (str){
        // ZERO
        if (!str) return ["0"];
        // MAHLO
        if (str === "M") return ["M"];
        // LIMIT
        if (str === "A") return [["G", ["M", "+", "1"]]];
        // ADDITION
        if (!this.single(str)){
            let str1 = this.asp(str);
            return [].concat(this.math(str1[0]), ["+"], this.math(str1[1]));
        }
        // SINGLE
        let str2 = this.vsp(str);
        return [[str[1], this.math(str2[0]), this.math(str2[1])]];
    },
};
// =================================================================================================
// RATHJEN'S CAPITAL PSI
// =================================================================================================
const RathjenK = {
    // ---------------------------------------------------------------------------------------------
    // NAME *
    // ---------------------------------------------------------------------------------------------
    name: "RathjenK",
    // ---------------------------------------------------------------------------------------------
    // NORMAL FORM *
    // ---------------------------------------------------------------------------------------------
    // VALIDITY
    validity: function (str){
        // CONSTANT
        if (["", "K", "A"].includes(str)) return 3;
        // CHECK SYMBOLS
        for (let i = 0; i < str.length; i++) if (!"(,)KvWXR".includes(str[i])) return 0;
        // CHECK BRACKETS
        let depth = [];
        for (let i = 0; i < str.length; i++){
            if (str[i] === "("){
                if (i + 1 >= str.length) return 1;
                if (!"vWXR".includes(str[i + 1])) return 1;
                if (str[i + 1] === "v") depth.push(1);
                else if (str[i + 1] === "R") depth.push(2);
                else depth.push(0);
            }
            if (str[i] === ",") depth[depth.length - 1]--;
            if (depth[depth.length - 1] < 0) return 1;
            if (str[i] === ")"){
                if (!depth.length || depth[depth.length - 1]) return 1;
                depth.pop();
            }
            if ("vWXR".includes(str[i])){
                if (!i) return 1;
                if (str[i - 1] !== "(") return 1;
            }
        }
        if (depth.length) return 1;
        // CHECK NORMAL
        if (!this.isnormal(str)) return 2;
        // ALL CLEAR
        return 3;
    },
    // MAHLONESS
    m: function (str){
        // CONSTANT
        if (["", "K"].includes(str)) return "";
        // ADDITION
        if (!this.single(str)) return "";
        // VEBLEN
        if (str[1] === "v") return "";
        // OMEGA
        if (str[1] === "W") return this.vsp(str)[0].slice(-4) === "(v,)" ? "(v,)" : "";
        // MAHLO
        if (str[1] === "X") return this.vsp(str)[0];
        // COLLAPSE
        if (str[1] === "R") return this.vsp(str)[1];
    },
    // LEAST
    least: function (a, b = a){
        // CONSTANT
        if (["", "K"].includes(a)) return "";
        let a1, s0, s1, s2, s3, max;
        // ADDITION
        if (!this.single(a)){
            a1 = this.asp(a);
            s0 = this.least(a1[0], b), s1 = this.least(a1[1], b);
            return this.lt(s0, s1) ? s1 : s0;
        }
        // VEBLEN
        if (a[1] === "v"){
            a1 = this.vsp(a);
            s0 = this.least(a1[0], b), s1 = this.least(a1[1], b);
            return this.lt(s0, s1) ? s1 : s0;
        }
        // OMEGA
        if (a[1] === "W") return this.least(this.vsp(a)[0], b);
        // MAHLO
        if (a[1] === "X"){
            if (this.lt(a, b)) return "";
            s0 = this.vsp(a)[0] + "(v,)", s1 = this.least(this.vsp(a)[0], b);
            return this.lt(s0, s1) ? s1 : s0;
        }
        // COLLAPSE
        if (a[1] === "R"){
            if (this.lt(a, b)) return "";
            a1 = this.vsp(a);
            s0 = a1[2] + "(v,)", s1 = this.least(a1[2], b);
            s2 = this.least(a1[0], b), s3 = this.least(a1[1], b);
            max = s0;
            if (this.lt(max, s1)) max = s1;
            if (this.lt(max, s2)) max = s2;
            if (this.lt(max, s3)) max = s3;
            return max;
        }
    },
    // IN C SET
    inc: function (c, a, b){return !this.lt(a, this.least(c, b));},
    // IS NORMAL
    isnormal: function (str){
        // CONSTANT
        if (["", "K", "A"].includes(str)) return true;
        // ADDITION
        if (!this.single(str)){
            let str1 = this.asp(str);
            if (!this.isnormal(str1[0])) return false;
            if (!this.isnormal(str1[1])) return false;
            if (this.single(str1[1])) return !this.lt(str1[0], str1[1]);
            return !this.lt(str1[0], this.asp(str1[1])[0]);
        }
        // SINGLE
        let str2 = this.vsp(str);
        for (let i = 0; i < str2.length; i++) if (!this.isnormal(str2[i])) return false;
        // VEBLEN
        if (str[1] === "v") return this.lt(str2[0], str) && this.lt(str2[1], str);
        // OMEGA
        if (str[1] === "W") return this.lt(str2[0], str) && this.lt(str2[0], "K") && str2[0];
        // MAHLO
        if (str[1] === "X") return str2[0];
        // COLLAPSE
        if (str[1] === "R"){
            if (!this.m(str2[0])) return false;
            if (!this.inc(str2[0], str2[2], str2[0])) return false;
            if (!this.inc(str2[1], str2[2], str2[0])) return false;
            if (!this.inc(str2[2], str2[2], str2[0])) return false;
            if (this.lt(str2[2], str2[1])) return false;
            if (!this.lt(str2[1], this.m(str2[0]))) return false;
            return this.inc(str2[1], this.m(str2[0]), str2[0]);
        }
        // ELSE
        return false;
    },
    // ---------------------------------------------------------------------------------------------
    // SPLIT
    // ---------------------------------------------------------------------------------------------
    // ADDITION SPLIT
    asp: function (str){
        if (!str) return ["", ""];
        if (str[0] === "K") return ["K", str.slice(1)];
        let depth = 0;
        for (let i = 0; i < str.length; i++){
            if (str[i] === "(") depth++;
            if (str[i] === ")") depth--;
            if (!depth) return [str.slice(0, i + 1), str.slice(i + 1)];
        }
    },
    // VARIABLE SPLIT
    vsp: function (str){
        if (str[0] === "K") return [];
        let depth = 0, start = 2, result = [];
        for (let i = 2; i < str.length - 1; i++){
            if (str[i] === "(") depth++;
            if (str[i] === ")") depth--;
            if (!depth && str[i] === ","){
                result.push(str.slice(start, i));
                start = i + 1;
            }
        }
        return result.concat(str.slice(start, -1));
    },
    // SINGLE
    single: function (str){return !this.asp(str)[1];},
    // ---------------------------------------------------------------------------------------------
    // ORDERING *
    // ---------------------------------------------------------------------------------------------
    // LESS THAN
    lt: function (a, b, cac = true){
        // CACHE
        if (cac){
            try {cache;} catch {return this.lt(a, b, false);}
            let key = `${this.name}-LT-${a}-${b}`;
            if (!(key in cache)) cache[key] = this.lt(a, b, false);
            return cache[key];
        }
        // CONSTANT
        if (!b) return false;
        if (a === "A") return false;
        if (b === "A") return true;
        if (!a) return true;
        // ADDITION
        if (!this.single(a) && !this.single(b)){
            let a1 = this.asp(a), b1 = this.asp(b);
            return this.lt(a1[0], b1[0]) || (!this.lt(b1[0], a1[0]) && this.lt(a1[1], b1[1]));
        }
        if (!this.single(a) && this.single(b)) return this.lt(this.asp(a)[0], b);
        if (this.single(a) && !this.single(b)) return !this.lt(this.asp(b)[0], a);
        // SAME
        let a2 = this.vsp(a), b2 = this.vsp(b);
        if (a === "K" && b === "K") return false;
        if (a[1] === b[1]){
            if (a[1] === "v"){
                if (this.lt(a2[0], b2[0])) return this.lt(a2[1], b);
                if (this.lt(b2[0], a2[0])) return this.lt(a, b2[1]);
                return this.lt(a2[1], b2[1]);
            }
            if (a[1] === "W") return this.lt(a2[0], b2[0]);
            if (a[1] === "X"){
                if (this.lt(a2[0], b2[0])) return this.inc(a2[0], b2[0], b);
                if (this.lt(b2[0], a2[0])) return !this.inc(b2[0], a2[0], a);
                return false;
            }
            if (a[1] === "R"){
                if (!this.lt(b, a2[0])) return true;
                if (this.lt(a2[2], b2[2]) && this.lt(a, b2[0]) &&
                    this.inc(a2[0], b2[2], b) && this.inc(a2[1], b2[2], b) &&
                    this.inc(a2[2], b2[2], b)) return true;
                if (!this.lt(a2[2], b2[2]) && !(this.inc(b2[0], a2[2], a) &&
                    this.inc(b2[1], a2[2], a) && this.inc(b2[2], a2[2], a))) return true;
                if (!this.lt(a2[0], b2[0]) && !this.lt(b2[0], a2[0]) &&
                    !this.lt(a2[2], b2[2]) && !this.lt(b2[2], a2[2]) &&
                    this.lt(a2[1], b2[1]) && this.inc(a2[1], b2[1], b)) return true;
                if (this.lt(b2[1], a2[1]) && !this.inc(b2[1], a2[1], a)) return true;
                return false;
            }
        }
        // ONE SIDE K
        if (a === "K" && b[1] === "v"){
            return (this.lt(a, b2[0]) || b2[1]) && (!this.lt(b2[0], a) || this.lt(a, b2[1]));
        }
        if (a === "K" && b[1] === "W") return this.lt(a, b2[0]);
        if (a === "K" && "XR".includes(b[1])) return false;
        if (a[1] === "v" && b === "K") return this.lt(a2[0], b) && this.lt(a2[1], b);
        if (a[1] === "W" && b === "K") return this.lt(a2[0], b);
        if ("XR".includes(a[1]) && b === "K") return true;
        // ONE SIDE VEBLEN
        if (a[1] === "v") return this.lt(a2[0], b) && this.lt(a2[1], b);
        if (b[1] === "v"){
            return (this.lt(a, b2[0]) || b2[1]) && (!this.lt(b2[0], a) || this.lt(a, b2[1]));
        }
        // ELSE
        if (a[1] === "W" && b[1] === "X") return this.lt(a2[0], b);
        if (a[1] === "X" && b[1] === "W") return this.lt(a, b2[0]);
        if (a[1] === "W" && b[1] === "R"){
            return b2[0][1] === "W" ? this.lt(a, b2[0]) : this.lt(a2[0], b);
        }
        if (a[1] === "R" && b[1] === "W"){
            return a2[0][1] === "W" ? !this.lt(b, a2[0]) : this.lt(a, b2[0]);
        }
        if (a[1] === "X" && b[1] === "R"){
            return this.lt(a, b2[0]) && (!this.lt(a2[0], b2[2]) || this.inc(a2[0], b2[2], b));
        }
        if (a[1] === "R" && b[1] === "X"){
            return !this.lt(b, a2[0]) || (this.lt(b2[0], a2[2]) && !this.inc(b2[0], a2[2], a));
        }
    },
    // GREATER THAN
    gt: function (a, b){return this.lt(b, a);},
    // LESS THAN OR EQUAL
    le: function (a, b){return !this.lt(b, a);},
    // GREATER THAN OR EQUAL
    ge: function (a, b){return !this.lt(a, b);},
    // EQUAL
    eq: function (a, b){return !this.lt(a, b) && !this.lt(b, a);},
    // NOT EQUAL
    ne: function (a, b){return this.lt(a, b) || this.lt(b, a);},
    // ---------------------------------------------------------------------------------------------
    // OPERATIONS *
    // ---------------------------------------------------------------------------------------------
    // SUCCESSOR
    s: function (str){return str + "(v,)";},
    // TO STRING
    to_str: function (n){return "(v,)".repeat(n);},
    // TO NUMBER
    to_num: function (str){
        return this.cof(str) === "(v,)" ? this.to_num(str.slice(0, -4)) + 1 : 0;
    },
    // LEAST UNCOUNTABLE CRDINAL
    uc: function (){return "(W(v,))";},
    // NORMALIZE
    norm: function (str){
        // NORMAL
        if (this.isnormal(str)) return str;
        // ADDITION
        if (!this.single(str)){
            let str1 = this.asp(str);
            return this.norm(str1[0]) + this.norm(str1[1]);
        }
        // SINGLE
        let str2 = this.vsp(str);
        // VEBLEN
        if (str[1] === "v"){
            if (!this.lt(str2[1], str)) return str2[1];
            if (!this.lt(str2[0], str)) return str2[0];
        }
        // OMEGA
        if (str[1] === "W") return str2[0];
        // ELSE
        return str;
    },
    // ADDITION
    add: function (a, b){
        if (!b) return a;
        if (!a) return b;
        let a1 = this.asp(a), b1 = this.asp(b);
        return this.lt(a1[0], b1[0]) ? b : a1[0] + this.add(a1[1], b);
    },
    // SOLVE
    solve: function (a, b){
        if (!this.lt(a, b)) return "";
        let a1 = this.asp(a), b1 = this.asp(b);
        return this.lt(a1[0], b1[0]) ? b : this.solve(a1[1], b1[1]);
    },
    // CARDINAL SPLIT
    csp: function (a, b, left){
        // LESS THAN CARD
        if (this.lt(a, b)) return left ? "" : a;
        // SINGLE
        if (this.single(a)) return left ? a : "";
        // ADDITION
        let a1 = this.asp(a);
        return (left ? a1[0] : "") + this.csp(a1[1], b, left);
    },
    // CARDINAL ROOT
    root: function (str, target = ""){
        // CONSTANT
        if (["", "K"].includes(str)) return "";
        // ADDITION
        if (!this.single(str)) return "";
        // NOT MAHLO OR COLLAPSE
        if (!"XR".includes(str[1])) return "";
        // NO TARGET
        if (!target){
            if (str[1] === "X") return str;
            if (this.vsp(str)[0][1] === "W") return "";
            return this.root(this.vsp(str)[0]);
        }
        // HAS TARGET
        if (str[1] !== "R") return "";
        return (this.vsp(str)[0] === target) ? str : this.root(this.vsp(str)[0], target);
    },
    // TAIL
    tail: function (a, b){
        // LESS THAN CARD
        if (this.lt(a, b)) return a;
        // WEAKLY COMPACT
        if (a === "K") return "";
        // ADDITION
        if (!this.single(a)) return this.tail(this.asp(a)[1], b);
        // SINGLE
        let a1 = this.vsp(a);
        // VEBLEN
        if (a[1] === "v") return this.tail(a1[this.lt("(v,)", this.cof(a1[1])) * 1], b);
        // OMEGA
        if (a[1] === "W") return this.tail(a1[0], b);
        // MAHLO
        if (a[1] === "X") return "";
        // COLLAPSE
        if (a[1] === "R"){
            // REGULAR
            if (this.m(a)) return "";
            // NOT LEAST
            if (this.lt(this.least(a1[0]), a1[2])){
                return this.tail(this.nfp(a1[2], a1[0]) ? this.csp(a1[2], a1[0], true) : a1[2], b);
            }
            // CARD IS OMEGA
            if (a1[0][1] === "W") return "";
            // CARD IS MAHLO
            if (a1[0][1] === "X"){
                let m = this.m(a1[0]);
                return this.tail(this.mfp(m) ? this.csp(m, "K", true) : m, b);
            }
            // CARD IS COLLAPSE
            if (a1[0][1] === "R"){
                // MAHLONESS NOT FIXED POINT
                let a2 = this.vsp(a1[0]);
                if (!this.cfp(a2[2], a2[0], a2[1])) return this.tail(a2[1], b);
                // MAHLONESS IS FIXED POINT
                let ml = this.csp(a2[1], "K", true);
                return this.tail(ml ? ml : a2[2], b);
            }
        }
    },
    // NORMAL FIXED POINT
    nfp: function (a, b){
        let t = this.tail(a, b), r = this.root(t, b);
        if (!this.single(t)) return false;
        if (!r) return false;
        if (t[1] !== "R") return false;
        if (this.lt(t, `(R${b},,${this.fs(a, "", true)})`)) return false;
        return this.lt(a, this.vsp(r)[2]);
    },
    // MAHLO FIXED POINT
    mfp: function (a){
        let t = this.tail(a, "K"), r = this.root(t);
        if (!this.single(t)) return false;
        if (!r) return false;
        if (!"XR".includes(t[1])) return false;
        if (this.lt(t, `(X${this.fs(a, "", true)})`)) return false;
        return this.lt(a, this.vsp(r)[0]);
    },
    // COLLAPSING FIXED POINT
    cfp: function (a, b, c){
        let t = this.tail(c, "K"), r = this.root(t, b);
        if (!this.single(t)) return false;
        if (!r) return false;
        if (t[1] !== "R") return false;
        if (this.lt(t, `(R${b},${this.fs(c, "", true)},${a})`)) return false;
        if (this.lt(this.vsp(r)[2], a)) return false;
        if (this.lt(a, this.vsp(r)[2])) return true;
        return this.lt(c, this.vsp(r)[1]);
    },
    // ---------------------------------------------------------------------------------------------
    // COFINALITY *
    // ---------------------------------------------------------------------------------------------
    // COFINALITY
    cof: function (str, cac = true){
        // CACHE
        if (cac){
            try {cache;} catch {return this.cof(str, false);}
            let key = `${this.name}-COF-${str}`;
            if (!(key in cache)) cache[key] = this.cof(str, false);
            return cache[key];
        }
        // CONSTANT
        if (["", "(v,)", "K"].includes(str)) return str;
        if (str === "A") return "(v,(v,))";
        // REGULAR
        if (this.m(str)) return str;
        // ADDITION
        if (!this.single(str)) return this.cof(this.asp(str)[1]);
        // SINGLE
        let str1 = this.vsp(str);
        // VEBLEN
        if (str[1] === "v"){
            if (this.lt("(v,)", this.cof(str1[1]))) return this.cof(str1[1]);
            if (this.lt("(v,)", this.cof(str1[0]))) return this.cof(str1[0]);
            return "(v,(v,))";
        }
        // OMEGA
        if (str[1] === "W") return this.cof(str1[0]);
        // COLLAPSE
        return this.ccof(str1[2], str1[0], this.it(str1[2], str1[0]));
    },
    // COLLAPSING FUNDAMENTAL SEQUENCE (R[ALPHA],,[GAMMA])
    ccof: function (a, b, c, cac = true){
        // CACHE
        if (cac){
            try {cache;} catch {return this.ccof(a, b, c, false);}
            let key = `${this.name}-CCOF-${a}-${b}-${c}`;
            if (!(key in cache)) cache[key] = this.ccof(a, b, c, false);
            return cache[key];
        }
        // VARIABLES
        let b1 = this.vsp(b), l = this.least(b), m = this.m(b), a0 = this.solve(l, a);
        let al = this.csp(a0, b, true), ar = this.csp(a0, b, false), ca = this.cof(a0);
        let ml = this.csp(m, "K", true), mr = this.csp(m, "K", false);
        let cal = this.cof(al), car = this.cof(ar), cml = this.cof(ml), cmr = this.cof(mr);
        // ALPHA LEFT IS ZERO
        if (!ml){
            // GAMMA RIGHT IS LIM AND NOT FIXED POINT
            if (this.lt("(v,)", car) && !c) return ca;
            // (GAMMA IS ZERO OR GAMMA RIGHT IS SUC) AND ALPHA RIGHT IS LIM AND NOT FIXED POINT
            if ((!a0 || car === "(v,)") && this.lt("(v,)", cmr) && !c) return cmr;
            // GAMMA LEFT NOT ZERO
            if (al) return this.lt(cal, b) ? cal : "(v,(v,))";
            // ELSE
            return b[1] === "R" ? this.ccof(b1[2], b1[0], c) : "(v,(v,))";
        }
        // GAMMA IS LIM
        if (this.lt("(v,)", ca)) return this.lt(ca, b) ? ca : "(v,(v,))";
        // ALPHA RIGHT IS LIM AND NOT FP
        if (this.lt("(v,)", cmr) && !c) return cmr;
        // ALPHA LEFT COF LESS THAN K
        if (this.lt(cml, "K")) return cml;
        // ELSE
        return "(v,(v,))";
    },
    // TYPE (0: ZERO / 1: SUC / 2: COUNTABLE LIM / 3: UNCOUNTABLE LIM)
    type: function (str){
        if (!this.cof(str)) return 0;
        if (this.cof(str) === "(v,)") return 1;
        if (this.cof(str) === "(v,(v,))") return 2;
        return 3;
    },
    // ---------------------------------------------------------------------------------------------
    // FUNDAMENTAL SEQUENCE *
    // ---------------------------------------------------------------------------------------------
    // FUNDAMENTAL SEQUENCE
    fs: function (a, n = "", strong = false, cac = true){
        // CACHE
        if (cac){
            try {cache;} catch {return this.fs(a, n, strong, false);}
            let key = `${this.name}-FS-${a}-${n}-${strong}`;
            if (!(key in cache)) cache[key] = this.fs(a, n, strong, false);
            return cache[key];
        }
        // ZERO
        if (!a) return "";
        // LIMIT
        if (a === "A") return this.scfs("K", n);
        // WEAKLY COMPACT
        if (a === "K"){
            if (!strong) return n;
            if (n === "A") return "(R(XA),,A(v,))";
            return `(X${this.add("(v,)", this.fs("A", n))})`;
        }
        // REGULAR
        if (this.m(a)){
            if (!strong) return n;
            if (n === "A") return `(R${a},,A)`;
            return `(R${a},,${this.add(this.least(a), this.fs("A", n))})`;
        }
        // ADDITION
        if (!this.single(a)){
            let a1 = this.asp(a);
            return a1[0] + this.fs(a1[1], n, strong);
        }
        // SINGLE
        let a2 = this.vsp(a);
        // VEBLEN
        if (a[1] === "v"){
            // BETA IS LIMIT
            if (this.lt("(v,)", this.cof(a2[1]))){
                return this.norm(`(v${a2[0]},${this.fs(a2[1], n, strong)})`);
            }
            // ALPHA IS ZERO
            if (!a2[0]){
                if (!a2[1]) return "";
                return n ? `${this.fs(a, this.fs(n))}${this.norm(`(v,${this.fs(a2[1])})`)}` : "";
            }
            // ALPHA IS SUC
            if (this.cof(a2[0]) === "(v,)"){
                // BETA IS ZERO
                if (!a2[1]){
                    return n ? this.norm(`(v${this.fs(a2[0])},${this.fs(a, this.fs(n))})`) : "";
                }
                // BETA IS SUC
                if (!n) return this.norm(`(v${a2[0]},${this.fs(a2[1])})`);
                return `(v${this.fs(a2[0])},${this.fs(a, this.fs(n))}${this.fs(n) ? "" : "(v,)"})`;
            }
            // BETA IS ZERO
            if (!a2[1]) return this.norm(`(v${this.fs(a2[0], n, strong)},)`);
            // BETA IS SUC
            return `(v${this.fs(a2[0], n, strong)},` +
                   this.norm(`(v${a2[0]},${this.fs(a2[1])})`) + "(v,))";
        }
        // OMEGA
        if (a[1] === "W") return this.norm(`(W${this.add("(v,)", this.fs(a2[0], n, strong))})`);
        // COLLAPSE
        return this.cfs(a2[2], a2[0], this.it(a2[2], a2[0]), n, strong);
    },
    // INITIAL TERM
    it: function (a, b, cac = true){
        // CACHE
        if (cac){
            try {cache;} catch {return this.it(a, b, false);}
            let key = `${this.name}-IT-${a}-${b}`;
            if (!(key in cache)) cache[key] = this.it(a, b, false);
            return cache[key];
        }
        // VARIABLES
        let b1 = this.vsp(b), l = this.least(b), m = this.m(b), a0 = this.solve(l, a);
        let al = this.csp(a0, b, true), ar = this.csp(a0, b, false);
        let ml = this.csp(m, "K", true), mr = this.csp(m, "K", false);
        let cal = this.cof(al), car = this.cof(ar), cml = this.cof(ml), cmr = this.cof(mr);
        let tb = this.tail(a, b), tk = this.tail(m, "K");
        // GAMMA RIGHT IS SUC
        if (car === "(v,)") return cmr === "(v,)" ? `(R${b},${this.fs(m)},${this.fs(a)})` : "";
        // GAMMA RIGHT IS LIM
        if (ar) return this.nfp(a, b) ? tb : "";
        // GAMMA LEFT NOT ZERO
        if (al) return this.lt(cal, b) && this.nfp(a, b) ? tb : "";
        // ALPHA RIGHT IS SUC
        if (cmr === "(v,)"){
            if (b[1] === "W") return this.fs(b1[0]) ? this.norm(`(W${this.fs(b1[0])})`) : "";
            if (b[1] === "X") return this.fs(m) ? `(X${this.fs(m)})` : "";
            if (b[1] === "R") return `(R${b1[0]},${this.fs(m)},${b1[2]})`;
        }
        // ALPHA RIGHT IS LIM
        if (mr){
            if (b[1] === "X") return this.mfp(m) ? tk : "";
            if (b[1] === "R") return this.cfp(b1[2], b1[0], m) ? tk : "";
        }
        // ALPHA RIGHT IS ZERO
        if (b[1] === "X") return this.lt(cml, "K") && this.mfp(m) ? tk : "";
        if (b[1] === "R") return this.lt(cml, "K") && this.cfp(b1[2], b1[0], m) ? tk : "";
    },
    // COLLAPSING FUNDAMENTAL SEQUENCE (R[ALPHA],,[GAMMA])
    cfs: function (a, b, c, n = "", strong = false, cac = true){
        // CACHE
        if (cac){
            try {cache;} catch {return this.cfs(a, b, c, n, strong, false);}
            let key = `${this.name}-CFS-${a}-${b}-${c}-${n}-${strong}`;
            if (!(key in cache)) cache[key] = this.cfs(a, b, c, n, strong, false);
            return cache[key];
        }
        // VARIABLES
        let b1 = this.vsp(b), l = this.least(b), m = this.m(b), a0 = this.solve(l, a);
        let al = this.csp(a0, b, true), ar = this.csp(a0, b, false), ca = this.cof(a0);
        let ml = this.csp(m, "K", true), mr = this.csp(m, "K", false);
        let cal = this.cof(al), car = this.cof(ar), cml = this.cof(ml), cmr = this.cof(mr), d;
        // ALPHA LEFT IS ZERO
        if (!ml){
            // GAMMA RIGHT IS LIM AND NOT FIXED POINT
            if (this.lt("(v,)", car) && !c){
                return `(R${b},,${this.add(l, this.fs(a0, n, strong))})`;
            }
            // GAMMA IS ZERO AND ALPHA RIGHT IS LIM AND NOT FIXED POINT
            if (!a0 && this.lt("(v,)", cmr) && !c){
                if (b[1] === "X") return `(X${this.add("(v,)", this.fs(m, n, strong))})`;
                if (b[1] === "R") return `(R${b1[0]},${this.fs(m, n, strong)},${b1[2]})`;
            }
            // GAMMA RIGHT IS SUC AND ALPHA RIGHT IS LIM AND NOT FIXED POINT
            if (car === "(v,)" && this.lt("(v,)", cmr) && !c){
                return `(R${b},${this.fs(m, n, strong)},${this.fs(a)})`;
            }
            // GAMMA LEFT NOT ZERO
            if (al){
                // GAMMA LEFT COF LESS THAN ALPHA
                if (this.lt(cal, b)){
                    return `(R${b},,${this.add(l, this.add(this.fs(al, n, strong), c))})`;
                }
                // GAMMA LEFT COF GREATER THAN ALPHA
                if (this.lt(b, cal)){
                    if (!n) return c;
                    return `(R${b},,${this.add(this.re(this.add(l, al), this.fs(n), b), c)})`;
                }
                // GAMMA LEFT COF EQUAL ALPHA
                if (!n) return c;
                return `(R${b},,${this.add(l, this.fs(al, this.cfs(a, b, c, this.fs(n))))})`;
            }
            // OMEGA
            if (b[1] === "W") return this.scfs(c, n);
            // MAHLO
            if (b[1] === "X") return this.ofpfs(c, n);
            // COLLAPSE
            if (b[1] === "R") return this.cfs(b1[2], b1[0], c, n, strong);
        }
        // GAMMA NOT LIM
        if (!this.lt("(v,)", ca)){
            // ALPHA RIGHT IS LIM AND NOT FP
            if (this.lt("(v,)", cmr) && !c) d = this.fs(m, n, strong);
            // ALPHA LEFT COF LESS THAN K
            else if (this.lt(cml, "K")) d = this.add(this.fs(ml, n, strong), c);
            // ALPHA LEFT COF IS K
            else if (!n) return c;
            else d = this.fs(ml, this.cfs(a, b, c, this.fs(n)));
            // GAMMA NOT ZERO
            if (a0) return `(R${b},${d},${this.fs(a)})`;
            // MAHLO
            if (b[1] === "X") return `(X${this.add("(v,)", d)})`;
            // COLLAPSE
            if (b[1] === "R") return `(R${b1[0]},${d},${b1[2]})`;
        }
        // GAMMA COF LESS THAN ALPHA
        if (this.lt(ca, b)) return `(R${b},${c},${this.add(l, this.fs(a0, n, strong))})`;
        // GAMMA COF GREATER THAN ALPHA
        if (this.lt(b, ca)){
            return n ? `(R${b},,${this.add(this.re(this.add(l, al), this.fs(n), b), c)})` : c;
        }
        // GAMMA COF IS ALPHA
        return n ? `(R${b},,${this.add(l, this.fs(a0, this.cfs(a, b, c, this.fs(n))))})` : c;
    },
    // FUNDAMENTAL SEQUENCE FOR STRONGLY CRITICAL ORDINALS
    scfs: function (a, n){
        if (!n) return a;
        let p = this.scfs(a, this.fs(n));
        return `(v${p},${this.isnormal(`(v${p},)`) ? "" : "(v,)"})`;
    },
    // FUNDAMENTAL SEQUENCE FOR OMEGA FIXED POINTS
    ofpfs: function (a, n){
        if (!n) return a;
        let p = this.ofpfs(a, this.fs(n));
        return `(W${p}${this.isnormal(`(W${p})`) ? "" : "(v,)"})`;
    },
    // NORMAL RECURSION
    re: function (a, n, base = ""){
        if (!n) return this.fs(a, base);
        let c = this.cof(a), l = c === "K" ? "(v,)" : this.least(c);
        let p = this.re(a, this.fs(n), base);
        if (this.lt(p, l)) p = l;
        return this.fs(a, c === "K" ? `(X${p})` : `(R${c},,${p})`);
    },
    // ---------------------------------------------------------------------------------------------
    // MATH FORM *
    // ---------------------------------------------------------------------------------------------
    math: function (str){
        // ZERO
        if (!str) return ["0"];
        // WEAKLY COMPACT
        if (str === "K") return ["K"];
        // LIMIT
        if (str === "A") return [["G", ["K", "+", "1"]]];
        // ADDITION
        if (!this.single(str)){
            let str1 = this.asp(str);
            return [].concat(this.math(str1[0]), ["+"], this.math(str1[1]));
        }
        // SINGLE
        let str2 = this.vsp(str), result = [str[1]];
        for (let i = 0; i < str2.length; i++) result.push(this.math(str2[i]));
        return [result];
    },
};
// =================================================================================================
// STEGERT'S FIRST PSI
// =================================================================================================
const Stegert1 = {
    // ---------------------------------------------------------------------------------------------
    // NAME *
    // ---------------------------------------------------------------------------------------------
    name: "Stegert1",
    // ---------------------------------------------------------------------------------------------
    // NORMAL FORM *
    // ---------------------------------------------------------------------------------------------
    // VALIDITY
    validity: function (str){
        // CONSTANT
        if (["", "Z", "A"].includes(str)) return 3;
        // CHECK SYMBOLS
        for (let i = 0; i < str.length; i++) if (!"(,)Zv+s".includes(str[i])) return 0;
        // CHECK BRACKETS
        let depth = [], d;
        for (let i = 0; i < str.length; i++){
            if (str[i] === "("){
                if (i + 1 >= str.length) return 1;
                if (!"v+s".includes(str[i + 1])) return 1;
                if (str[i + 1] === "v") depth.push(1);
                if (str[i + 1] === "+") depth.push(0);
                if (str[i + 1] === "s") depth.push("A");
            }
            d = depth[depth.length - 1];
            if (d !== "A"){
                if (str[i] === ",") depth[depth.length - 1]--;
                if (d < 0) return 1;
            }
            if (str[i] === ")"){
                if (!depth.length || (d && d !== "A")) return 1;
                depth.pop();
            }
            if ("v+s".includes(str[i])){
                if (!i) return 1;
                if (str[i - 1] !== "(") return 1;
            }
        }
        if (depth.length) return 1;
        // CHECK NORMAL
        if (!this.isnormal(str)) return 2;
        // ALL CLEAR
        return 3;
    },
    // IS CARDINAL
    iscard: function (str){
        // ZERO
        if (!str) return false;
        // INDESCRIBABLE
        if (str === "Z") return true;
        // ADDITION
        if (!this.single(str)) return false;
        // VEBLEN
        let str1 = this.vsp(str);
        if (str[1] === "v") return !str1[0] && str1[1] === "(v,)";
        // CARDINAL
        if (str[1] === "+") return this.iscard(str1[0]);
        // COLLAPSE
        if (str[1] === "s") return str1[0][1] !== "+";
    },
    // IS (UNCOUNTABLE) REGULAR
    isreg: function (str){
        // ZERO
        if (!str) return false;
        // INDESCRIBABLE
        if (str === "Z") return true;
        // ADDITION
        if (!this.single(str)) return false;
        // VEBLEN
        if (str[1] === "v") return false;
        // CARDINAL
        if (str[1] === "+") return true;
        // COLLAPSE
        if (str[1] === "s") return this.plug(str);
    },
    // REFLECTION (0: VAR COUNT, 1: 2ND ENTRY, 2: 3RD ENTRY)
    ref: function (str, mode, cac = true){
        // CACHE
        if (cac){
            try {cache;} catch {return this.ref(str, mode, false);}
            let key = `${this.name}-REF-${str}-${mode}`;
            if (!(key in cache)) cache[key] = this.ref(str, mode, false);
            return cache[key];
        }
        // ZERO
        if (!str) return [0, null, null][mode];
        // INDESCRIBABLE
        if (str === "Z") return [1, "(a)", []][mode];
        // ADDITION
        if (!this.single(str)) return [0, null, null][mode];
        // VEBLEN
        if (str[1] === "v") return [0, null, null][mode];
        // CARDINAL
        if (str[1] === "+") return [0, "", [["Z", "(v,(v,))", ""]]][mode];
        // COLLAPSE
        if (str[1] === "s"){
            let str1 = this.vsp(str), r = this.plug(str), result = [], a1, a2, a3, a4;
            // LINE 1.
            if (str1[0] === "Z"){
                // 3RD ENTRY
                if (mode === 2){
                    for (let i = 0; i < this.to_num(r); i++){
                        result.unshift(["Z", str1.slice(-1)[0], this.to_str(i)]);
                    }
                    return result;
                }
                a1 = this.lt("(v,(v,))", str1.slice(-1)[0]);
                // LINE 1.1.
                if (!a1) return [0, this.fs(r)][mode];
                // LINE 1.2.
                if (a1) return [2, "(sZ,(a(v,)),(a))" + this.fs(r)][mode];
            }
            // LINE 2.
            if (str1[0] !== "Z" && !r.includes("s")){
                // SINGULAR
                if (!r) return [0, null, null][mode];
                // 3RD ENTRY
                if (mode === 2){
                    result = result.concat(this.tilde(str1[0], str1.slice(-1)[0], this.fs(r)));
                    result = result.concat(this.cut(this.ref(str1[0], 2), this.fs(r), ""));
                    return result;
                }
                a1 = this.cut(this.ref(str1[0], 2), this.fs(r) + "(v,)", this.fs(r))[0];
                a2 = this.lt(this.bound(str1[0], 0)[0], str1.slice(-1)[0]);
                a3 = this.lt(this.bound(a1[0], 0)[0], a1[1]);
                a4 = a1[0] === "Z";
                // LINE 2.1.
                if (!a2 && !a3) return [0, this.fs(r)][mode];
                // LINE 2.2.
                if (!a2 && a3 && a4) return [2, "(sZ,(a(v,)),(a))" + this.fs(r)][mode];
                // LINE 2.3.
                if (!a2 && a3 && !a4){
                    if (mode === 0) return this.ref(a1[0], 0) + 1;
                    if (mode === 1){
                        result = `(s${a1[0]},`;
                        for (let i = 0; i < this.ref(a1[0], 0); i++){
                            result += `(a${this.to_str(i)}(v,)),`;
                        }
                        return result + "(a))" + this.fs(r);
                    }
                }
                // LINE 2.4.
                if (a2) return [1, `(s${str1[0]},(a))` + this.fs(r)][mode];
            }
            // LINE 3.
            if (str1[0] !== "Z" && r.includes("s")){
                a1 = this.asp(r);
                // 3RD ENTRY
                if (mode === 2){
                    if (!a1[1]) return this.ref(a1[0], 2);
                    result = result.concat(this.cut(this.ref(a1[0], 2), "(v,(v,))", a1[1]));
                    result = result.concat(this.tilde(str1[0], str1.slice(-1)[0], this.fs(a1[1])));
                    result = result.concat(this.cut(this.ref(str1[0], 2), this.fs(a1[1]), ""));
                    return result;
                }
                a2 = this.ref(a1[0], 2)[0];
                a3 = this.lt(this.bound(a2[0], 0)[0], a2[1]);
                a4 = a2[0] === "Z";
                // LINE 3.1.
                if (!a3) return [0, a2[2]][mode];
                // LINE 3.2.
                if (a3 && a4) return [2, "(sZ,(a(v,)),(a))" + a2[2]][mode];
                // LINE 3.3.
                if (a3 && !a4){
                    if (mode === 0) return this.ref(a2[0], 0) + 1;
                    if (mode === 1){
                        result = `(s${a2[0]},`;
                        for (let i = 0; i < this.ref(a2[0], 0); i++){
                            result += `(a${this.to_str(i)}(v,)),`;
                        }
                        return result + "(a))" + a2[2];
                    }
                }
            }
        }
    },
    // BOUND
    bound: function (str, n){
        // ILLEGAL
        if (n > this.ref(str, 0)) return ["", "", ""];
        // ZERO
        if (!str) return ["", "", ""];
        // INDESCRIBABLE
        if (str === "Z"){
            if (n === 0) return ["(v,(v,))", "A", str];
            if (n === 1) return ["(v,)", "(v,(v,))", str];
        }
        // ADDITION
        if (!this.single(str)) return ["", "", ""];
        // VEBLEN
        if (str[1] === "v") return ["", "", ""];
        // CARDINAL
        if (str[1] === "+") return ["", "A", str];
        // COLLAPSE
        if (str[1] === "s"){
            let str1 = this.vsp(str), r = this.plug(str), a1, a2;
            // SUPERSCRIPT
            if (n === 0) return [str1.slice(-1)[0] + "(v,)", "A", str];
            // LINE 1.
            if (str1[0] === "Z"){
                if (n === 1) return ["(v,(v,))", str1.slice(-1)[0], str1[0]];
                if (n === 2) return [r, "(v,(v,))", str1[0]];
            }
            // LINE 2.
            if (str1[0] !== "Z" && !r.includes("s")){
                a1 = this.cut(this.ref(str1[0], 2), this.fs(r) + "(v,)", this.fs(r))[0];
                a2 = this.lt(this.bound(str1[0], 0)[0], str1.slice(-1)[0]);
                if (n === 1){
                    if (!a2) return [this.bound(a1[0], 0)[0], a1[1], a1[0]];
                    return [this.bound(str1[0], 0)[0], str1.slice(-1)[0], str1[0]];
                }
                if (a1[0] === "Z") if (n === 2) return [r, "(v,(v,))", a1[0]];
                return this.bound(a1[0], n - 1);
            }
            // LINE 3.
            if (str1[0] !== "Z" && r.includes("s")){
                a1 = this.asp(r);
                a2 = this.ref(a1[0], 2)[0];
                if (n === 1) return [this.bound(a2[0], 0)[0], a2[1], a2[0]];
                if (a2[0] === "Z") if (n === 2) return [a2[2] + "(v,)", "(v,(v,))", a2[0]];
                return this.bound(a2[0], n - 1);
            }
        }
    },
    // IN DOMAIN
    indom: function (str, a, n){
        // ILLEGAL
        if (n > this.ref(str, 0)) return false;
        // NORMAL CASE
        let b = this.bound(str, n);
        if (this.lt(a, b[0]) || !this.lt(a, b[1])) return false;
        if (!this.inc(a, n ? b[1] : a, str)) return false;
        // ZERO
        if (!str) return true;
        // INDESCRIBABLE
        if (str === "Z") return true;
        // ADDITION
        if (!this.single(str)) return true;
        // NOT COLLAPSE
        if (str[1] !== "s") return true;
        // COLLAPSE
        let str1 = this.vsp(str), r = this.plug(str), a1;
        // SUPERSCRIPT OR FIRST
        if (n === 0 || n === 1) return true;
        // LINE 1.
        if (str1[0] === "Z") return true;
        // LINE 2.
        if (str1[0] !== "Z" && !r.includes("s")){
            a1 = this.cut(this.ref(str1[0], 2), this.fs(r) + "(v,)", this.fs(r))[0][0];
            return (a1 === "Z") || this.indom(a1, a, n - 1);
        }
        // LINE 3.
        if (str1[0] !== "Z" && r.includes("s")){
            a1 = this.ref(this.asp(r)[0], 2)[0][0];
            return (a1 === "Z") || this.indom(a1, a, n - 1);
        }
    },
    // PLUG IN
    plug: function (str){
        // CONSTANT
        if (["", "Z"].includes(str)) return "";
        // ADDITION
        if (!this.single(str)) return "";
        // NOT COLLAPSE
        if (str[1] !== "s") return "";
        // COLLAPSE
        let str1 = this.vsp(str), r = this.ref(str1[0], 1);
        for (let i = 1; i < str1.length - 1; i++){
            r = r.replace(`(a${this.to_str(i - 1)})`, str1[i]);
        }
        return r;
    },
    // TILDE FUNCTION
    tilde: function (a, b, c){
        if (!this.lt(b, this.bound(a, 0)[0]) && !this.lt(this.bound(a, 0)[0], b) && a !== "Z"){
            return this.cut(this.ref(a, 2), c + "(v,)", c);
        }
        return [[a, b, c]];
    },
    // CUT FUNCTION
    cut: function (r, max, min){
        let result = [];
        for (let i = 0; i < r.length; i++){
            if (this.lt(r[i][2], max) && !this.lt(r[i][2], min)) result.push(r[i]);
        }
        return result;
    },
    // LEAST
    least: function (a, b = a){
        // CONSTANT
        if (["", "Z"].includes(a)) return "";
        let a1, s = [], max;
        // ADDITION
        if (!this.single(a)){
            a1 = this.asp(a);
            s.push(this.least(a1[0], b));
            s.push(this.least(a1[1], b));
            return this.lt(s[0], s[1]) ? s[1] : s[0];
        }
        // VEBLEN
        if (a[1] === "v"){
            a1 = this.vsp(a);
            s.push(this.least(a1[0], b));
            s.push(this.least(a1[1], b));
            return this.lt(s[0], s[1]) ? s[1] : s[0];
        }
        // CARDINAL
        if (a[1] === "+") return this.least(this.vsp(a)[0], b);
        // COLLAPSE
        if (a[1] === "s"){
            if (this.lt(a, b)) return "";
            a1 = this.vsp(a);
            s.push(a1.slice(-1)[0] + "(v,)");
            for (let i = 0; i < a1.length; i++) s.push(this.least(a1[i], b));
            max = s[0];
            for (let i = 1; i < s.length; i++) if (this.lt(max, s[i])) max = s[i];
            return max;
        }
    },
    // IN C SET
    inc: function (c, a, b){return !this.lt(a, this.least(c, b));},
    // IS NORMAL
    isnormal: function (str){
        // CONSTANT
        if (["", "Z", "A"].includes(str)) return true;
        // ADDITION
        if (!this.single(str)){
            let str1 = this.asp(str);
            if (!this.isnormal(str1[0])) return false;
            if (!this.isnormal(str1[1])) return false;
            if (this.single(str1[1])) return !this.lt(str1[0], str1[1]);
            return !this.lt(str1[0], this.asp(str1[1])[0]);
        }
        // SINGLE
        let str2 = this.vsp(str);
        for (let i = 0; i < str2.length; i++) if (!this.isnormal(str2[i])) return false;
        // VEBLEN
        if (str[1] === "v") return this.lt(str2[0], str) && this.lt(str2[1], str);
        // CARDINAL
        if (str[1] === "+") return this.iscard(str2[0]) && this.lt(str2[0], "Z");
        // COLLAPSE
        if (str[1] === "s"){
            if (!this.isreg(str2[0])) return false;
            if (str2.length !== this.ref(str2[0], 0) + 2) return false;
            for (let i = 0; i < str2.length - 1; i++){
                if (!i && str2.slice(-1)[0] === "A") continue;
                if (!this.indom(str2[0], str2[i ? i : str2.length - 1], i)) return false;
            }
            return true;
        }
    },
    // ---------------------------------------------------------------------------------------------
    // SPLIT
    // ---------------------------------------------------------------------------------------------
    // ADDITION SPLIT
    asp: function (str){
        if (!str) return ["", ""];
        if (str[0] === "Z") return ["Z", str.slice(1)];
        let depth = 0;
        for (let i = 0; i < str.length; i++){
            if (str[i] === "(") depth++;
            if (str[i] === ")") depth--;
            if (!depth) return [str.slice(0, i + 1), str.slice(i + 1)];
        }
    },
    // VARIABLE SPLIT
    vsp: function (str){
        if (str[0] === "Z") return [];
        let depth = 0, start = 2, result = [];
        for (let i = 2; i < str.length - 1; i++){
            if (str[i] === "(") depth++;
            if (str[i] === ")") depth--;
            if (!depth && str[i] === ","){
                result.push(str.slice(start, i));
                start = i + 1;
            }
        }
        return result.concat(str.slice(start, -1));
    },
    // SINGLE
    single: function (str){return !this.asp(str)[1];},
    // ---------------------------------------------------------------------------------------------
    // ORDERING *
    // ---------------------------------------------------------------------------------------------
    // LESS THAN
    lt: function (a, b, cac = true){
        // CACHE
        if (cac){
            try {cache;} catch {return this.lt(a, b, false);}
            let key = `${this.name}-LT-${a}-${b}`;
            if (!(key in cache)) cache[key] = this.lt(a, b, false);
            return cache[key];
        }
        // CONSTANT
        if (!b) return false;
        if (a === "A") return false;
        if (b === "A") return true;
        if (!a) return true;
        // ADDITION
        if (!this.single(a) && !this.single(b)){
            let a1 = this.asp(a), b1 = this.asp(b);
            return this.lt(a1[0], b1[0]) || (!this.lt(b1[0], a1[0]) && this.lt(a1[1], b1[1]));
        }
        if (!this.single(a) && this.single(b)) return this.lt(this.asp(a)[0], b);
        if (this.single(a) && !this.single(b)) return !this.lt(this.asp(b)[0], a);
        // SAME
        let a2 = this.vsp(a), b2 = this.vsp(b);
        if (a === "Z" && b === "Z") return false;
        if (a[1] === b[1]){
            if (a[1] === "v"){
                if (this.lt(a2[0], b2[0])) return this.lt(a2[1], b);
                if (this.lt(b2[0], a2[0])) return this.lt(a, b2[1]);
                return this.lt(a2[1], b2[1]);
            }
            if (a[1] === "+") return this.lt(a2[0], b2[0]);
            if (a[1] === "s"){
                if (!this.lt(b, a2[0])) return true;
                if (!this.lt(a2.slice(-1)[0], b2.slice(-1)[0])) for (let i = 0; i < b2.length; i++){
                    if (!this.inc(b2[i], a2.slice(-1)[0], a)) return true;
                }
                if (!this.lt(a, b2[0])) return false;
                for (let i = 0; i < a2.length; i++){
                    if (!this.inc(a2[i], b2.slice(-1)[0], b)) return false;
                }
                if (this.lt(b2.slice(-1)[0], a2.slice(-1)[0])) return false;
                if (this.lt(a2.slice(-1)[0], b2.slice(-1)[0])) return true;
                if (this.lt(a2[0], b2[0]) || this.lt(b2[0], a2[0])) return false;
                for (let i = 1; i < a2.length - 1; i++){
                    if (this.lt(a2[i], b2[i])) return this.inc(a2[i], b2[i], b);
                    if (this.lt(b2[i], a2[i])) return !this.inc(b2[i], a2[i], a);
                }
                return false;
            }
        }
        // ONE SIDE Z
        if (a === "Z" && b[1] === "v"){
            return (this.lt(a, b2[0]) || b2[1]) && (!this.lt(b2[0], a) || this.lt(a, b2[1]));
        }
        if (a === "Z" && b[1] === "+") return this.lt(a, b2[0]);
        if (a === "Z" && b[1] === "s") return false;
        if (a[1] === "v" && b === "Z") return this.lt(a2[0], b) && this.lt(a2[1], b);
        if (a[1] === "+" && b === "Z") return this.lt(a2[0], b);
        if (a[1] === "s" && b === "Z") return true;
        // ONE SIDE VEBLEN
        if (a[1] === "v") return this.lt(a2[0], b) && this.lt(a2[1], b);
        if (b[1] === "v"){
            return (this.lt(a, b2[0]) || b2[1]) && (!this.lt(b2[0], a) || this.lt(a, b2[1]));
        }
        // ELSE
        if (a[1] === "+" && b[1] === "s"){
            return b2[0][1] === "+" ? this.lt(a, b2[0]) : this.lt(a2[0], b);
        }
        if (a[1] === "s" && b[1] === "+"){
            return a2[0][1] === "+" ? !this.lt(b, a2[0]) : !this.lt(b2[0], a);
        }
    },
    // GREATER THAN
    gt: function (a, b){return this.lt(b, a);},
    // LESS THAN OR EQUAL
    le: function (a, b){return !this.lt(b, a);},
    // GREATER THAN OR EQUAL
    ge: function (a, b){return !this.lt(a, b);},
    // EQUAL
    eq: function (a, b){return !this.lt(a, b) && !this.lt(b, a);},
    // NOT EQUAL
    ne: function (a, b){return this.lt(a, b) || this.lt(b, a);},
    // ---------------------------------------------------------------------------------------------
    // OPERATIONS *
    // ---------------------------------------------------------------------------------------------
    // SUCCESSOR
    s: function (str){return str + "(v,)";},
    // TO STRING
    to_str: function (n){return "(v,)".repeat(n);},
    // TO NUMBER
    to_num: function (str){
        return this.cof(str) === "(v,)" ? this.to_num(str.slice(0, -4)) + 1 : 0;
    },
    // LEAST UNCOUNTABLE CRDINAL
    uc: function (){return "(+(v,(v,)))";},
    // NORMALIZE
    norm: function (str){
        // NORMAL
        if (this.isnormal(str)) return str;
        // ADDITION
        if (!this.single(str)){
            let str1 = this.asp(str);
            return this.norm(str1[0]) + this.norm(str1[1]);
        }
        // SINGLE
        let str2 = this.vsp(str);
        // VEBLEN
        if (str[1] === "v"){
            if (!this.lt(str2[1], str)) return str2[1];
            if (!this.lt(str2[0], str)) return str2[0];
        }
        // ELSE
        return str;
    },
    // ADDITION
    add: function (a, b){
        if (!b) return a;
        if (!a) return b;
        let a1 = this.asp(a), b1 = this.asp(b);
        return this.lt(a1[0], b1[0]) ? b : a1[0] + this.add(a1[1], b);
    },
    // SOLVE
    solve: function (a, b){
        if (!this.lt(a, b)) return "";
        let a1 = this.asp(a), b1 = this.asp(b);
        return this.lt(a1[0], b1[0]) ? b : this.solve(a1[1], b1[1]);
    },
    // CARDINAL SPLIT
    csp: function (a, b, left){
        // LESS THAN CARD
        if (this.lt(a, b)) return left ? "" : a;
        // SINGLE
        if (this.single(a)) return left ? a : "";
        // ADDITION
        let a1 = this.asp(a);
        return (left ? a1[0] : "") + this.csp(a1[1], b, left);
    },
    // LEAST COLLAPSE
    lc: function (str){
        // MUST BE REGULAR
        if (!this.isreg(str)) return str;
        // IS REGULAR
        let result = `(s${str},`;
        for (let i = 0; i < this.ref(str, 0); i++) result += this.bound(str, i + 1)[0] + ",";
        return `${result}${this.bound(str, 0)[0]})`;
    },
    // REPLACE
    rp: function (str, a, n){
        // CONSTANT
        if (["", "Z"].includes(str)) return str;
        // ADDITION
        if (!this.single(str)) return str;
        // NOT COLLAPSE
        if (str[1] !== "s") return str;
        // COLLAPSE
        let str1 = this.vsp(str), v = this.ref(str1[0], 0), result = "(s" + str1[0];
        for (let i = 1; i < v + 2; i++){
            result += ",";
            result += i === (n ? n : v + 1) ? this.add(this.bound(str1[0], n)[0], a) : str1[i];
        }
        return result + ")";
    },
    // CARDINAL ROOT
    root: function (str, target){
        // CONSTANT
        if (["", "Z"].includes(str)) return "";
        // ADDITION
        if (!this.single(str)) return "";
        // NOT COLLAPSE
        if (str[1] !== "s") return "";
        // COLLAPSE
        return (this.vsp(str)[0] === target) ? str : this.root(this.vsp(str)[0], target);
    },
    // TAIL
    tail: function (a, b){
        // LESS THAN CARD
        if (this.lt(a, b)) return a;
        // INDESCRIBABLE
        if (a === "Z") return "";
        // ADDITION
        if (!this.single(a)) return this.tail(this.asp(a)[1], b);
        // SINGLE
        let a1 = this.vsp(a);
        // VEBLEN
        if (a[1] === "v") return this.tail(a1[this.lt("(v,)", this.cof(a1[1])) * 1], b);
        // NOT COLLAPSE
        if (a[1] !== "s") return "";
        // REGULAR
        if (this.isreg(a)) return "";
        // IS LEAST
        if (!this.lt(this.bound(a1[0], 0)[0], a1.slice(-1)[0])){
            return a1[0][1] === "s" ? this.ctail(a, b) : "";
        }
        // NOT FIXED POINT
        if (!this.fp(a, 0)) return this.tail(a1.slice(-1)[0], b);
        // IS FIXED POINT
        return this.tail(this.csp(a1.slice(-1)[0], a1[0], true), b);
    },
    // COLLAPSING TAIL
    ctail: function (a, b){
        // CONSTANT
        if (["", "Z"].includes(a)) return "";
        // ADDITION
        if (!this.single(a)) return "";
        // NOT COLLAPSE
        if (a[1] !== "s") return "";
        // COLLAPSE
        let a1 = this.vsp(a), v = this.ref(a1[0], 0), a2, a3, a4;
        for (let i = v; i >= 0; i--){
            a2 = this.solve(this.bound(a1[0], i)[0], a1[i ? i : v + 1]);
            // SKIP IF LEAST
            if (!a2) continue;
            // NOT FIXED POINT
            if (!this.fp(a, i)) return this.tail(a2, b);
            // IS FIXED POINT
            a3 = this.csp(a2, this.bound(a1[0], i)[2], true);
            if (a3) return this.tail(a3, b);
            // SEARCH PREVIOUS
            for (let j = i - 1; j >= 0; j--){
                a4 = this.solve(this.bound(a1[0], j)[0], a1[j ? j : v + 1]);
                if (a4) return this.tail(a4, b);
            }
            // PREVIOUS ALL LEAST
            return "";
        }
        // ALL LEAST
        return this.ctail(a1[0], b);
    },
    // FIXED POINT
    fp: function (str, n){
        // CONSTANT
        if (["", "Z"].includes(str)) return false;
        // ADDITION
        if (!this.single(str)) return false;
        // NOT COLLAPSE
        if (str[1] !== "s") return false;
        // COLLAPSE
        let str1 = this.vsp(str), v = this.ref(str1[0], 0);
        // ILLEGAL
        if (n > v) return false;
        // LEGAL
        let n2 = n ? n : v + 1, bound = this.bound(str1[0], n);
        let a = this.solve(bound[0], str1[n2]), b = bound[2];
        let t = this.tail(a, b), r = this.root(t, str1[0]), i2;
        // BASIC
        if (!this.single(t)) return false;
        if (!r) return false;
        if (t[1] !== "s") return false;
        // NEW ORDINAL
        if (this.lt(t, this.rp(str, this.fs(a, "", true), n))) return false;
        // LOOP
        for (let i = 0; i < n; i++){
            i2 = i ? i : v + 1;
            if (this.lt(this.vsp(r)[i2], str1[i2])) return false;
            if (this.lt(str1[i2], this.vsp(r)[i2])) return true;
        }
        // GENERAL CASE
        return this.lt(this.add(bound[0], a), this.vsp(r)[n2]);
    },
    // LAST SPACE
    ls: function (str, n){
        // CONSTANT
        if (["", "Z"].includes(str)) return 0;
        // ADDITION
        if (!this.single(str)) return 0;
        // NOT COLLAPSE
        if (str[1] !== "s") return 0;
        // COLLAPSE
        let v = this.ref(str, 0), b, result = 0;
        for (let i = n + 1; i < v + 1; i++){
            b = this.bound(str, i);
            if (!this.lt(this.solve(b[0], b[1]), b[2])) result = i;
        }
        return result;
    },
    // ---------------------------------------------------------------------------------------------
    // COFINALITY *
    // ---------------------------------------------------------------------------------------------
    // COFINALITY
    cof: function (str, cac = true){
        // CACHE
        if (cac){
            try {cache;} catch {return this.cof(str, false);}
            let key = `${this.name}-COF-${str}`;
            if (!(key in cache)) cache[key] = this.cof(str, false);
            return cache[key];
        }
        // CONSTANT
        if (["", "(v,)", "Z"].includes(str)) return str;
        if (str === "A") return "(v,(v,))";
        // REGULAR
        if (this.isreg(str)) return str;
        // ADDITION
        if (!this.single(str)) return this.cof(this.asp(str)[1]);
        // SINGLE
        let str1 = this.vsp(str);
        // VEBLEN
        if (str[1] === "v"){
            if (this.lt("(v,)", this.cof(str1[1]))) return this.cof(str1[1]);
            if (this.lt("(v,)", this.cof(str1[0]))) return this.cof(str1[0]);
            return "(v,(v,))";
        }
        // COLLAPSE
        return this.ccof(str, this.it(str));
    },
    // COLLAPSING COFINALITY
    ccof: function (a, b, cac = true){
        // CACHE
        if (cac){
            try {cache;} catch {return this.ccof(a, b, false);}
            let key = `${this.name}-CCOF-${a}-${b}`;
            if (!(key in cache)) cache[key] = this.ccof(a, b, false);
            return cache[key];
        }
        // CONSTANT
        if (["", "Z"].includes(a)) return "(v,(v,))";
        // ADDITION
        if (!this.single(a)) return "(v,(v,))";
        // NOT COLLAPSE
        if (a[1] !== "s") return "(v,(v,))";
        // COLLAPSE
        let a1 = this.vsp(a), v = this.ref(a1[0], 0);
        let l = [], b0 = [], a0 = [], al = [], ar = [], d = [], e;
        for (let i = 0; i < v + 1; i++){
            l[i] = this.bound(a1[0], i)[0];
            b0[i] = this.bound(a1[0], i)[2];
            a0[i] = this.solve(l[i], a1[i ? i : v + 1]);
            al[i] = this.csp(a0[i], b0[i], true);
            ar[i] = this.csp(a0[i], b0[i], false);
            d[i] = this.solve(l[i], this.bound(a1[0], i)[1]);
        }
        // LOOP
        for (let i = v; i >= 0; i--){
            e = a0.slice(0, i + 1).concat(d.slice(i + 1));
            // NOT FIXED POINT AND ALL RIGHT IS ZERO
            if (!b && ar.slice(i + 1).every(x => !x)) for (let j = i; j < v + 1; j++){
                if (this.lt("(v,)", this.cof(this.csp(e[j], b0[j], false)))){
                    if (e.slice(i, j).every(x => (this.cof(x) === "(v,)"))) return this.cof(e[j]);
                }
            }
            // NO SPACE AFTER AND LEFT NOT ZERO
            if (!this.ls(a1[0], i) && al[i]) return this.mccof(a0[i], a, i);
            // HAS SPACE AFTER AND NOT ZERO
            if (this.ls(a1[0], i) && a0[i]) for (let j = i; j < v + 1; j++){
                if (!this.ls(a1[0], j) || this.cof(e[j]) !== "(v,)") return this.mccof(e[j], a, j);
            }
        }
        // ALL LEAST
        return this.ccof(a1[0], b);
    },
    // MAIN COLLAPSING COFINALITY
    mccof: function (str, a, k){
        let a1 = this.vsp(a)[0], b0 = this.bound(a1, k)[2];
        let str1 = this.ls(a1, k) ? str : this.csp(str, b0, true);
        return this.lt(this.cof(str1), b0) ? this.cof(str1) : "(v,(v,))";
    },
    // TYPE (0: ZERO / 1: SUC / 2: COUNTABLE LIM / 3: UNCOUNTABLE LIM)
    type: function (str){
        if (!this.cof(str)) return 0;
        if (this.cof(str) === "(v,)") return 1;
        if (this.cof(str) === "(v,(v,))") return 2;
        return 3;
    },
    // ---------------------------------------------------------------------------------------------
    // FUNDAMENTAL SEQUENCE *
    // ---------------------------------------------------------------------------------------------
    // FUNDAMENTAL SEQUENCE
    fs: function (a, n = "", strong = false, cac = true){
        // CACHE
        if (cac){
            try {cache;} catch {return this.fs(a, n, strong, false);}
            let key = `${this.name}-FS-${a}-${n}-${strong}`;
            if (!(key in cache)) cache[key] = this.fs(a, n, strong, false);
            return cache[key];
        }
        // ZERO
        if (!a) return "";
        // LIMIT
        if (a === "A") return this.scfs("Z", n);
        // REGULAR
        if (this.isreg(a)){
            if (!strong) return n;
            return this.rp(this.lc(a), n === "A" ? "A" : n ? this.fs("A", this.fs(n)) : "", 0);
        }
        // ADDITION
        if (!this.single(a)){
            let a1 = this.asp(a);
            return a1[0] + this.fs(a1[1], n, strong);
        }
        // SINGLE
        let a2 = this.vsp(a);
        // VEBLEN
        if (a[1] === "v"){
            // BETA IS LIMIT
            if (this.lt("(v,)", this.cof(a2[1]))){
                return this.norm(`(v${a2[0]},${this.fs(a2[1], n, strong)})`);
            }
            // ALPHA IS ZERO
            if (!a2[0]){
                if (!a2[1]) return "";
                return n ? `${this.fs(a, this.fs(n))}${this.norm(`(v,${this.fs(a2[1])})`)}` : "";
            }
            // ALPHA IS SUC
            if (this.cof(a2[0]) === "(v,)"){
                // BETA IS ZERO
                if (!a2[1]){
                    return n ? this.norm(`(v${this.fs(a2[0])},${this.fs(a, this.fs(n))})`) : "";
                }
                // BETA IS SUC
                if (!n) return this.norm(`(v${a2[0]},${this.fs(a2[1])})`);
                return `(v${this.fs(a2[0])},${this.fs(a, this.fs(n))}${this.fs(n) ? "" : "(v,)"})`;
            }
            // BETA IS ZERO
            if (!a2[1]) return this.norm(`(v${this.fs(a2[0], n, strong)},)`);
            // BETA IS SUC
            return `(v${this.fs(a2[0], n, strong)},` +
                   this.norm(`(v${a2[0]},${this.fs(a2[1])})`) + "(v,))";
        }
        // COLLAPSE
        return this.cfs(a, this.it(a), n, strong);
    },
    // INITIAL TERM
    it: function (str, cac = true){
        // CACHE
        if (cac){
            try {cache;} catch {return this.it(str, false);}
            let key = `${this.name}-IT-${str}`;
            if (!(key in cache)) cache[key] = this.it(str, false);
            return cache[key];
        }
        // ZERO
        if (!str) return "";
        // INDESCRIBABLE
        if (str === "Z") return "(v,(v,))";
        // ADDITION
        if (!this.single(str)) return "";
        // VEBLEN
        let str1 = this.vsp(str);
        if (str[1] === "v") return "";
        // CARDINAL
        if (str[1] === "+") return str1[0] === "(v,(v,))" ? "" : str1[0];
        // COLLAPSE
        let v = this.ref(str1[0], 0), l = [], b0 = [], a0 = [], al = [], ar = [], d = [], t = [], c;
        for (let i = 0; i < v + 1; i++){
            l[i] = this.bound(str1[0], i)[0];
            b0[i] = this.bound(str1[0], i)[2];
            a0[i] = this.solve(l[i], str1[i ? i : v + 1]);
            al[i] = this.csp(a0[i], b0[i], true);
            ar[i] = this.csp(a0[i], b0[i], false);
            d[i] = this.solve(l[i], this.bound(str1[0], i)[1]);
            t[i] = this.tail(a0[i], b0[i]);
        }
        // LOOP
        for (let i = v; i >= 0; i--){
            // RIGHT IS SUC
            if (this.cof(ar[i]) === "(v,)"){
                c = this.rp(str, this.fs(a0[i]), i);
                for (let j = i + 1; j < v + 1; j++){
                    if (!this.lt(this.cof(d[j]), b0[j])) break;
                    if (this.lt("(v,)", this.cof(d[j]))) return "";
                    c = this.rp(c, this.fs(d[j]), j);
                }
                return c;
            }
            // RIGHT IS LIM
            if (ar[i]) return this.fp(str, i) ? t[i] : "";
            // LEFT NOT ZERO
            if (al[i]) return this.lt(this.cof(al[i]), b0[i]) && this.fp(str, i) ? t[i] : "";
        }
        // ALL LEAST
        return this.it(str1[0]);
    },
    // COLLAPSING FUNDAMENTAL SEQUENCE
    cfs: function (a, b, n = "", strong = false, cac = true){
        // CACHE
        if (cac){
            try {cache;} catch {return this.cfs(a, b, n, strong, false);}
            let key = `${this.name}-CFS-${a}-${b}-${n}-${strong}`;
            if (!(key in cache)) cache[key] = this.cfs(a, b, n, strong, false);
            return cache[key];
        }
        // ZERO
        if (!a) return "";
        // INDESCRIBABLE
        if (a === "Z") return this.lcfs(b, n);
        // ADDITION
        if (!this.single(a)) return "";
        // VEBLEN
        let a1 = this.vsp(a);
        if (a[1] === "v") return "";
        // CARDINAL
        if (a[1] === "+") return this.scfs(b, n);
        // COLLAPSE
        let v = this.ref(a1[0], 0), l = [], b0 = [], a0 = [], al = [], ar = [], d = [], c, e;
        for (let i = 0; i < v + 1; i++){
            l[i] = this.bound(a1[0], i)[0];
            b0[i] = this.bound(a1[0], i)[2];
            a0[i] = this.solve(l[i], a1[i ? i : v + 1]);
            al[i] = this.csp(a0[i], b0[i], true);
            ar[i] = this.csp(a0[i], b0[i], false);
            d[i] = this.solve(l[i], this.bound(a1[0], i)[1]);
        }
        // LOOP
        for (let i = v; i >= 0; i--){
            e = a0.slice(0, i + 1).concat(d.slice(i + 1));
            // NOT FIXED POINT AND ALL RIGHT IS ZERO
            if (!b && ar.slice(i + 1).every(x => !x)) for (let j = i; j < v + 1; j++){
                if (this.lt("(v,)", this.cof(this.csp(e[j], b0[j], false)))){
                    if (e.slice(i, j).every(x => (this.cof(x) === "(v,)"))){
                        c = this.rp(a, this.fs(e[j], n, strong), j);
                        for (let k = i; k < j; k++) c = this.rp(c, this.fs(e[k]), k);
                        return c;
                    }
                }
            }
            // NO SPACE AFTER AND LEFT NOT ZERO
            if (!this.ls(a1[0], i) && al[i]) return this.mcfs(a0[i], a, b, a, n, i, strong);
            // HAS SPACE AFTER AND NOT ZERO
            if (this.ls(a1[0], i) && a0[i]){
                c = a;
                for (let j = i + 1; j < v + 1; j++) c = this.rp(c, "", j);
                for (let j = i; j < v + 1; j++){
                    if (!this.ls(a1[0], j) || this.cof(e[j]) !== "(v,)"){
                        return this.mcfs(e[j], a, b, c, n, j, strong);
                    }
                    c = this.rp(c, this.fs(e[j]), j);
                }
            }
        }
        // ALL LEAST
        return this.cfs(a1[0], b, n, strong);
    },
    // FUNDAMENTAL SEQUENCE FOR STRONGLY CRITICAL ORDINALS
    scfs: function (a, n){
        if (!n) return a;
        let p = this.scfs(a, this.fs(n));
        return `(v${p},${this.isnormal(`(v${p},)`) ? "" : "(v,)"})`;
    },
    // FUNDAMENTAL SEQUENCE FOR LIMIT CARDINALS
    lcfs: function (a, n){return n ? `(+${this.lcfs(a, this.fs(n))})` : a;},
    // MAIN COLLAPSING FUNDAMENTAL SEQUENCE
    mcfs: function (str, a, b, c, n, k, strong){
        let a1 = this.vsp(a)[0], b0 = this.bound(a1, k)[2];
        let str1 = this.ls(a1, k) ? str : this.csp(str, b0, true);
        // COF LESS THAN CARD
        if (this.lt(this.cof(str1), b0)){
            // NO SPACE AFTER
            if (!this.ls(a1, k)) return this.rp(c, this.add(this.fs(str1, n, strong), b), k);
            // HAS SPACE AFTER
            return this.rp(this.rp(c, b, this.ls(a1, k)), this.fs(str1, n, strong), k);
        }
        // COF GREATER THAN CARD
        if (this.lt(b0, this.cof(str1))){
            return n ? this.rp(c, this.add(this.re(str1, this.fs(n), b0), b), k) : b;
        }
        // COF IS CARD
        return n ? this.rp(c, this.fs(str1, this.cfs(a, b, this.fs(n))), k) : b;
    },
    // NORMAL RECURSION
    re: function (a, n, base = ""){
        if (!n) return this.fs(a, base);
        let c = this.cof(a), l = this.bound(c, 0)[0], p = this.re(a, this.fs(n), base);
        let b = this.lt(a, l) ? p : this.solve(l, p);
        return this.fs(a, this.rp(this.lc(c), b, 0));
    },
    // ---------------------------------------------------------------------------------------------
    // MATH FORM *
    // ---------------------------------------------------------------------------------------------
    // ORDINAL MATH FORM
    math: function (str){
        // ZERO
        if (!str) return ["0"];
        // INDESCRIBABLE
        if (str === "Z") return ["\\Xi"];
        // LIMIT
        if (str === "A") return [["G", ["\\Xi", "+", "1"]]];
        // ADDITION
        if (!this.single(str)){
            let str1 = this.asp(str);
            return [].concat(this.math(str1[0]), ["+"], this.math(str1[1]));
        }
        // SINGLE
        let str2 = this.vsp(str), result = [str[1]];
        for (let i = 0; i < str2.length; i++) result.push(this.math(str2[i]));
        return [result];
    },
    // REFLECTION MATH FORM
    mathref: function (str, mode = 0){
        let str1, str2, str3, valid, f, result;
        if (mode % 2){
            str1 = this.vsp(str);
            str2 = str1[0];
        } else str2 = str;
        f = (x => (mode < 4) ? this.math(x) : [x ? x : "\"\""]);
        let r1 = this.ref(str2, 1), r2 = this.ref(str2, 2).slice(1);
        let l1 = ["l"], l2 = ["l"], l3 = ["f"], b1, b2;
        // ZERO
        if (!str2) valid = false;
        // INDESCRIBABLE
        if (str2 === "Z") valid = true;
        // LIMIT
        if (str2 === "A") valid = false;
        // ADDITION
        if (!this.single(str2)) valid = false;
        // VEBLEN
        if (str2[1] === "v") valid = false;
        // CARDINAL
        if (str2[1] === "+") valid = true;
        // COLLAPSE
        if (str2[1] === "s") valid = true;
        // INVALID
        if (!valid) return [];
        // COMPLETE REFLECTION LEFT
        if (mode % 4 < 2){
            result = ["f", f(str2), [["l"]]];
            for (let i = 0; i < this.ref(str2, 0); i++){
                if (mode % 2) result[2][0].push(f(str1[i + 1]));
                else result[2][0].push(f(`(a${this.to_str(i)})`));
            }
        // COMPLETE REFLECTION RIGHT
        } else {
            result = ["L"];
            // ENTRY 1
            result.push(f(str2));
            // ENTRY 2
            if (mode % 2) for (let i = 1; i < str1.length; i++){
                r1 = r1.replace(`(a${this.to_str(i - 1)})`, str1[i]);
            }
            if (r1.includes("s")){
                b1 = this.asp(r1), b2 = this.vsp(b1[0]);
                for (let i = 1; i < b2.length - 1; i++) l1.push(f(b2[i]));
                result.push([["MP", [["f", f(b2[0]), [l1]]], f(b2.slice(-1)[0]), f(b1[1])]]);
            } else result.push([["MP", [], [], f(r1)]]);
            // ENTRY 3
            if (!r2.length) result.push(["\\epsilon"]);
            else {
                for (let i = 0; i < r2.length; i++){
                    l2.push([["MP2", [["f", f(r2[i][0]), ["\\cdots"]]], f(r2[i][1]), f(r2[i][2])]]);
                }
                result.push([l2]);
            }
            // ENTRY 4
            if (str2 === "Z") result.push(["\\epsilon"]);
            else if (str2[1] === "+") result.push(["\\epsilon"]);
            else {
                str3 = this.vsp(str2);
                l3 = l3.concat([f(str3[0]), [["l"]]]);
                for (let i = 1; i < str3.length - 1; i++) l3[2][0].push(f(str3[i]));
                result.push([l3]);
            }
            // ENTRY 5
            result.push(f(this.bound(str2, 0)[0]));
        }
        return [result];
    },
    // REFLECTION VECTOR
    mathrvec: function (str, simple = false){
        let r = this.ref(str, 2), result = [["l"]];
        let f = (x => simple ? [x ? x : "\"\""] : this.math(x));
        if (r === null) return ["\\epsilon"];
        if (!r.length) return ["\\epsilon"];
        for (let i = 0; i < r.length; i++){
            result[0].push([["MP2", [["f", f(r[i][0]), ["\\cdots"]]], f(r[i][1]), f(r[i][2])]]);
        }
        return result;
    },
};
// =================================================================================================
// STEGERT'S SECOND PSI
// =================================================================================================
const Stegert2 = {
    // ---------------------------------------------------------------------------------------------
    // NAME *
    // ---------------------------------------------------------------------------------------------
    name: "Stegert2",
    // ---------------------------------------------------------------------------------------------
    // NORMAL FORM *
    // ---------------------------------------------------------------------------------------------
    // VALIDITY
    validity: function (str){
        // CONSTANT
        if (["", "Y", "A"].includes(str)) return 3;
        // CHECK SYMBOLS
        for (let i = 0; i < str.length; i++) if (!"(,)Yv+TS".includes(str[i])) return 0;
        // CHECK BRACKETS
        let depth = [], d;
        for (let i = 0; i < str.length; i++){
            if (str[i] === "("){
                if (i + 1 >= str.length) return 1;
                if (!"v+TS".includes(str[i + 1])) return 1;
                if (str[i + 1] === "v") depth.push(1);
                if ("+T".includes(str[i + 1])) depth.push(0);
                if (str[i + 1] === "S") depth.push("A");
            }
            d = depth[depth.length - 1];
            if (d !== "A"){
                if (str[i] === ",") depth[depth.length - 1]--;
                if (d < 0) return 1;
            }
            if (str[i] === ")"){
                if (!depth.length || (d && d !== "A")) return 1;
                depth.pop();
            }
            if ("v+TS".includes(str[i])){
                if (!i) return 1;
                if (str[i - 1] !== "(") return 1;
            }
        }
        if (depth.length) return 1;
        // CHECK NORMAL
        if (!this.isnormal(str)) return 2;
        // ALL CLEAR
        return 3;
    },
    // IS CARDINAL
    iscard: function (str){
        // ZERO
        if (!str) return false;
        // FIXED POINT
        if (str === "Y") return true;
        // ADDITION
        if (!this.single(str)) return false;
        // VEBLEN
        let str1 = this.vsp(str);
        if (str[1] === "v") return !str1[0] && str1[1] === "(v,)";
        // CARDINAL
        if (str[1] === "+") return this.iscard(str1[0]);
        // INDESCRIBABLE
        if (str[1] === "T") return true;
        // COLLAPSE
        if (str[1] === "S") return str1[0][1] !== "+";
    },
    // IS (UNCOUNTABLE) REGULAR
    isreg: function (str){
        // ZERO
        if (!str) return false;
        // FIXED POINT
        if (str === "Y") return false;
        // ADDITION
        if (!this.single(str)) return false;
        // VEBLEN
        if (str[1] === "v") return false;
        // CARDINAL
        if (str[1] === "+") return true;
        // INDESCRIBABLE
        if (str[1] === "T") return true;
        // COLLAPSE
        if (str[1] === "S") return this.plug(str);
    },
    // MP SPLIT
    mpsp: function (str){
        if (!str) return ["", ""];
        let str1 = this.asp(str);
        if (str1[0][1] !== "v") return ["", str];
        let str2 = this.vsp(str1[0]);
        if (str2[0] || str2[1][0] !== "Y") return ["", str];
        return [this.asp(str2[1])[1], str1[1]];
    },
    // REFLECTION (0: VAR COUNT, 1: 2ND ENTRY, 2: 3RD ENTRY)
    ref: function (str, mode, cac = true){
        // CACHE
        if (cac){
            try {cache;} catch {return this.ref(str, mode, false);}
            let key = `${this.name}-REF-${str}-${mode}`;
            if (!(key in cache)) cache[key] = this.ref(str, mode, false);
            return cache[key];
        }
        // ZERO
        if (!str) return [0, null, null][mode];
        // FIXED POINT
        if (str === "Y") return [0, null, null][mode];
        // ADDITION
        if (!this.single(str)) return [0, null, null][mode];
        // VEBLEN
        if (str[1] === "v") return [0, null, null][mode];
        // CARDINAL
        if (str[1] === "+") return [0, "", [["", "", ""]]][mode];
        // INDESCRIBABLE
        if (str[1] === "T") return [1, "(a)", [["", "", this.lmw(this.vsp(str)[0])]]][mode];
        // COLLAPSE
        if (str[1] === "S"){
            let str1 = this.vsp(str), r = this.mpsp(this.plug(str));
            let mp = this.mpsp(this.ref(str1[0], 1)), result = [], a1, a2, a3, a4;
            // LINE 1.
            if (!mp[0] && mp[1].includes("a")){
                // 3RD ENTRY
                if (mode === 2){
                    result = this.merge(result, this.tilde(str1[0], str1.slice(-1)[0], r[1]));
                    result = this.merge(result, this.ref(str1[0], 2).slice(1));
                    return result;
                }
                a1 = this.lt(this.bound(str1[0], 0)[0], str1.slice(-1)[0]);
                a2 = !this.lt("(v,)", this.cof(r[1]));
                // VAR COUNT
                if (mode === 0) return a1 * 2 + !a2;
                // LINE 1.1.
                if (!a1 && !a2) return "(a)";
                // LINE 1.2.
                if (!a1 && a2) return r[1];
                // LINE 1.3.
                if (a1 && !a2) return `(v,Y(S${str1[0]},(a(v,)(v,)),(a(v,))))(a)`;
                // LINE 1.4.
                if (a1 && a2) return `(v,Y(S${str1[0]},(a(v,)),(a)))` + r[1];
            }
            // LINE 2.
            if (!mp[0] && !mp[1].includes("a")){
                // SINGULAR
                if (!r[1]) return [0, null, null][mode];
                // 3RD ENTRY
                if (mode === 2){
                    result = this.merge(result,
                                        this.tilde(str1[0], str1.slice(-1)[0], this.fs(r[1])));
                    result = this.merge(result, this.cut(this.ref(str1[0], 2), this.fs(r[1]), ""));
                    return result;
                }
                a1 = this.lt(this.bound(str1[0], 0)[0], str1.slice(-1)[0]);
                a2 = this.cl(this.ref(str1[0], 2), this.fs(r[1]))[0][1];
                a3 = !this.lt("(v,)", this.cof(this.fs(r[1])));
                a4 = this.ref(str1[0], 2)[1];
                // VAR COUNT
                if (mode === 0) return (a1 ? 1 : a2 ? this.ref(a4[0], 0) + 1 : 0) + !a3;
                // LINE 2.1.
                if (!a1 && !a2 && !a3) return "(a)";
                // LINE 2.2.
                if (!a1 && !a2 && a3) return this.fs(r[1]);
                // LINE 2.3/4.
                if (!a1 && a2 && !a3){
                    result = `(v,Y(S${a4[0]},`;
                    for (let i = 0; i < this.ref(a4[0], 0); i++){
                        result += `(a${this.to_str(i)}(v,)(v,)),`;
                    }
                    return result + "(a(v,))))(a)";
                }
                // LINE 2.5/6.
                if (!a1 && a2 && a3){
                    result = `(v,Y(S${a4[0]},`;
                    for (let i = 0; i < this.ref(a4[0], 0); i++){
                        result += `(a${this.to_str(i)}(v,)),`;
                    }
                    return result + "(a)))" + this.fs(r[1]);
                }
                // LINE 2.7.
                if (a1 && !a3) return `(v,Y(S${str1[0]},(a(v,))))(a)`;
                // LINE 2.8.
                if (a1 && a3) return `(v,Y(S${str1[0]},(a)))` + this.fs(r[1]);
            }
            // LINE 3.
            if (mp[0] && mp[1].includes("a")){
                a1 = this.ref(r[0], 2);
                // 3RD ENTRY
                if (mode === 2){
                    result = this.merge(result, this.cut(a1, "Y", r[1] + "(v,)"));
                    result = this.merge(result, this.tilde(str1[0], str1.slice(-1)[0], r[1]));
                    result = this.merge(result, this.ref(str1[0], 2).slice(1));
                    return result;
                }
                a2 = a1[0][1];
                a3 = !this.lt("(v,)", this.cof(a1[0][2]));
                // VAR COUNT
                if (mode === 0) return (this.ref(a1[0][0], 0) + 1) * !!a2 + !a3;
                // LINE 3.1.
                if (!a2 && !a3) return "(a)";
                // LINE 3.2.
                if (!a2 && a3) return a1[0][2];
                // LINE 3.3/4.
                if (a2 && !a3){
                    result = `(v,Y(S${this.ref(r[0], 2)[0][0]},`;
                    for (let i = 0; i < this.ref(a1[0][0], 0); i++){
                        result += `(a${this.to_str(i)}(v,)(v,)),`;
                    }
                    return result + "(a(v,))))(a)";
                }
                // LINE 3.5/6.
                if (a2 && a3){
                    result = `(v,Y(S${this.ref(r[0], 2)[0][0]},`;
                    for (let i = 0; i < this.ref(a1[0][0], 0); i++){
                        result += `(a${this.to_str(i)}(v,)),`;
                    }
                    return result + "(a)))" + a1[0][2];
                }
            }
            // LINE 4.
            if (mp[0] && !mp[1].includes("a")){
                a1 = this.ref(r[0], 2);
                // 3RD ENTRY
                if (mode === 2){
                    if (!r[1]) return a1;
                    result = this.merge(result, this.cut(a1, "Y", r[1]));
                    result = this.merge(result,
                                        this.tilde(str1[0], str1.slice(-1)[0], this.fs(r[1])));
                    result = this.merge(result, this.cut(this.ref(str1[0], 2), this.fs(r[1]), ""));
                    return result;
                }
                a2 = a1[0][1];
                a3 = !this.lt("(v,)", this.cof(a1[0][2]));
                // VAR COUNT
                if (mode === 0) return (this.ref(a1[0][0], 0) + 1) * !!a2 + !a3;
                // LINE 4.1.
                if (!a2 && !a3) return "(a)";
                // LINE 4.2.
                if (!a2 && a3) return a1[0][2];
                // LINE 4.3/4.
                if (a2 && !a3){
                    result = `(v,Y(S${this.ref(r[0], 2)[0][0]},`;
                    for (let i = 0; i < this.ref(a1[0][0], 0); i++){
                        result += `(a${this.to_str(i)}(v,)(v,)),`;
                    }
                    return result + "(a(v,))))(a)";
                }
                // LINE 4.5/6.
                if (a2 && a3){
                    result = `(v,Y(S${this.ref(r[0], 2)[0][0]},`;
                    for (let i = 0; i < this.ref(a1[0][0], 0); i++){
                        result += `(a${this.to_str(i)}(v,)),`;
                    }
                    return result + "(a)))" + a1[0][2];
                }
            }
        }
    },
    // BOUND
    bound: function (str, n){
        // ILLEGAL
        if (n > this.ref(str, 0)) return ["", "", "", false];
        // ZERO
        if (!str) return ["", "", "", false];
        // FIXED POINT
        if (str === "Y") return ["", "", "", false];
        // ADDITION
        if (!this.single(str)) return ["", "", "", false];
        // VEBLEN
        if (str[1] === "v") return ["", "", "", false];
        // CARDINAL
        if (str[1] === "+") return ["", "A", str, false];
        // INDESCRIBABLE
        if (str[1] === "T"){
            if (n === 0) return ["Y", "A", str, false];
            if (n === 1) return ["(v,)", this.lmw(this.vsp(str)[0]), "Y", false];
        }
        // COLLAPSE
        if (str[1] === "S"){
            let str1 = this.vsp(str), r = this.mpsp(this.plug(str));
            let mp = this.mpsp(this.ref(str1[0], 1)), a1, a2, a3, a4, a5, r0, r1, r2, b;
            // SUPERSCRIPT
            if (n === 0) return [str1.slice(-1)[0] + "(v,)", "A", str, false];
            // LINE 1.
            if (!mp[0] && mp[1].includes("a")){
                a1 = this.lt(this.bound(str1[0], 0)[0], str1.slice(-1)[0]);
                a2 = !this.lt("(v,)", this.cof(r[1]));
                a3 = this.ref(str1[0], 2);
                r1 = a3.length > 1 ? a3[1][2] : "";
                // LINE 1.1. (LINE 1.2. HAS NO VARIABLES)
                if (!a1) return [r1 + "(v,)", r[1], "Y", false];
                // LINE 1.3.
                if (a1 && !a2){
                    if (n === 1) return [r1 + "(v,)", r[1], "Y", false];
                    if (n === 2){
                        return [this.bound(str1[0], 0)[0], str1.slice(-1)[0], str1[0], false];
                    }
                    if (n === 3) return this.bound(str1[0], 1).slice(0, 3).concat([true]);
                }
                // LINE 1.4.
                if (a1 && a2){
                    if (n === 1){
                        return [this.bound(str1[0], 0)[0], str1.slice(-1)[0], str1[0], false];
                    }
                    if (n === 2) return [r[1] + "(v,)"].concat(this.bound(str1[0], 1).slice(1));
                }
            }
            // LINE 2.
            if (!mp[0] && !mp[1].includes("a")){
                a1 = this.lt(this.bound(str1[0], 0)[0], str1.slice(-1)[0]);
                a2 = this.cl(this.ref(str1[0], 2), this.fs(r[1]))[0][1];
                a3 = !this.lt("(v,)", this.cof(this.fs(r[1])));
                a4 = this.ref(str1[0], 2)[1];
                a5 = this.ref(str1[0], 2);
                r1 = a5.length > 1 ? a5[1][2] : "";
                r2 = a5.length > 2 ? a5[2][2] : "";
                r0 = this.lt(r1, this.fs(r[1])) ? r1 : r2;
                // LINE 2.1. (LINE 2.2. HAS NO VARIABLES)
                if (!a1 && !a2) return [r0 + "(v,)", this.fs(r[1]), "Y", false];
                // LINE 2.3/4.
                if (!a1 && a2 && !a3){
                    if (n === 1) return [r2 + "(v,)", this.fs(r[1]), "Y", false];
                    if (n === 2) return [this.bound(a4[0], 0)[0], a4[1], a4[0], false];
                    b = this.bound(a4[0], n - 2);
                    if (n === 3 && this.mpsp(this.ref(a4[0], 1))[1].includes("a")) b[3] = true;
                    return b;
                }
                // LINE 2.5/6.
                if (!a1 && a2 && a3){
                    if (n === 1) return [this.bound(a4[0], 0)[0], a4[1], a4[0], false];
                    b = this.bound(a4[0], n - 1);
                    if (n === 2 && this.mpsp(this.ref(a4[0], 1))[1].includes("a")) b[0] = r[1];
                    return b;
                }
                // LINE 2.7.
                if (a1 && !a3){
                    if (n === 1) return [r0 + "(v,)", this.fs(r[1]), "Y", false];
                    if (n === 2){
                        return [this.bound(str1[0], 0)[0], str1.slice(-1)[0], str1[0], false];
                    }
                }
                // LINE 2.8.
                if (a1 && a3) return [this.bound(str1[0], 0)[0], str1.slice(-1)[0], str1[0], false];
            }
            // LINE 3.
            if (mp[0] && mp[1].includes("a")){
                a1 = this.ref(r[0], 2);
                a2 = a1[0][1];
                a3 = !this.lt("(v,)", this.cof(a1[0][2]));
                r1 = a1[0][2];
                r2 = a1.length > 1 ? a1[1][2] : r[1];
                // LINE 3.1. (LINE 3.2. HAS NO VARIABLES)
                if (!a2) return [r2 + "(v,)", r1, "Y", false];
                // LINE 3.3/4.
                if (a2 && !a3){
                    if (n === 1) return [r2 + "(v,)", r1, "Y", false];
                    if (n === 2) return [this.bound(a1[0][0], 0)[0], a1[0][1], a1[0][0], false];
                    b = this.bound(a1[0][0], n - 2);
                    if (n === 3 && this.mpsp(this.ref(a1[0][0], 1))[1].includes("a")) b[3] = true;
                    return b;
                }
                // LINE 3.5/6.
                if (a2 && a3){
                    if (n === 1) return [this.bound(a1[0][0], 0)[0], a1[0][1], a1[0][0], false];
                    b = this.bound(a1[0][0], n - 1);
                    if (n === 2 && this.mpsp(this.ref(a1[0][0], 1))[1].includes("a")){
                        b[0] = r1 + "(v,)";
                    }
                    return b;
                }
            }
            // LINE 4.
            if (mp[0] && !mp[1].includes("a")){
                a1 = this.ref(r[0], 2);
                a2 = a1[0][1];
                a3 = !this.lt("(v,)", this.cof(a1[0][2]));
                r1 = a1[0][2];
                r2 = a1.length > 1 ? a1[1][2] : this.fs(r[1]);
                // LINE 4.1. (LINE 4.2. HAS NO VARIABLES)
                if (!a2) return [r2 + "(v,)", r1, "Y", false];
                // LINE 4.3/4.
                if (a2 && !a3){
                    if (n === 1) return [r2 + "(v,)", r1, "Y", false];
                    if (n === 2) return [this.bound(a1[0][0], 0)[0], a1[0][1], a1[0][0], false];
                    b = this.bound(a1[0][0], n - 2);
                    if (n === 3 && this.mpsp(this.ref(a1[0][0], 1))[1].includes("a")) b[3] = true;
                    return b;
                }
                // LINE 4.5/6.
                if (a2 && a3){
                    if (n === 1) return [this.bound(a1[0][0], 0)[0], a1[0][1], a1[0][0], false];
                    b = this.bound(a1[0][0], n - 1);
                    if (n === 2 && this.mpsp(this.ref(a1[0][0], 1))[1].includes("a")){
                        b[0] = r1 + "(v,)";
                    }
                    return b;
                }
            }
        }
    },
    // IN DOMAIN
    indom: function (str, a, n){
        // ILLEGAL
        if (n > this.ref(str, 0)) return false;
        // NORMAL CASE
        let b = this.bound(str, n);
        if (this.lt(a, b[0]) || !this.lt(a, b[1])) return false;
        if (!this.inc(a, n ? b[1] : a, str)) return false;
        // ZERO
        if (!str) return true;
        // FIXED POINT
        if (str === "Y") return true;
        // ADDITION
        if (!this.single(str)) return true;
        // NOT COLLAPSE
        if (str[1] !== "S") return true;
        // COLLAPSE
        let str1 = this.vsp(str), r = this.mpsp(this.plug(str));
        let mp = this.mpsp(this.ref(str1[0], 1)), a1, a2;
        // SUPERSCRIPT
        if (n === 0) return true;
        // LINE 1.
        if (!mp[0] && mp[1].includes("a")) return true;
        // LINE 2.
        if (!mp[0] && !mp[1].includes("a")){
            a1 = !!this.lt("(v,)", this.cof(this.fs(r[1])));
            if (n < a1 + 2) return true;
            if (!this.cl(this.ref(str1[0], 2), this.fs(r[1]))[0][1]) return true;
            return this.indom(this.ref(str1[0], 2)[1][0], a, n - a1 - 1);
        }
        // LINE 3/4.
        if (mp[0]){
            a1 = this.ref(r[0], 2);
            a2 = !!this.lt("(v,)", this.cof(a1[0][2]));
            if (n < a2 + 2) return true;
            return this.indom(a1[0][0], a, n - a2 - 1);
        }
    },
    // PLUG IN
    plug: function (str){
        // CONSTANT
        if (["", "Y"].includes(str)) return "";
        // ADDITION
        if (!this.single(str)) return "";
        // NOT COLLAPSE
        if (str[1] !== "S") return "";
        // COLLAPSE
        let str1 = this.vsp(str), r = this.ref(str1[0], 1);
        for (let i = 1; i < str1.length - 1; i++){
            r = r.replace(`(a${this.to_str(i - 1)})`, str1[i]);
        }
        return r;
    },
    // CL FUNCTION
    cl: function (r, a){
        for (let i = r.length - 1; i >= 0; i--){
            if (!this.lt(r[i][2], a)) return [r[i].slice(0, 2).concat([a])];
        }
        return [];
    },
    // MERGE FUNCTION
    merge: function (a, b){
        if (!(a.length * b.length)) return a.concat(b);
        if (a.slice(-1)[0][0] === b[0][0] && a.slice(-1)[0][1] === b[0][1]){
            return a.concat(b.slice(1));
        }
        return a.concat(b);
    },
    // TILDE FUNCTION
    tilde: function (a, b, c){
        if (!this.lt(b, this.bound(a, 0)[0]) && !this.lt(this.bound(a, 0)[0], b)){
            return this.cl(this.ref(a, 2), c);
        }
        return [[a, b, c]];
    },
    // CUT FUNCTION
    cut: function (r, max, min){
        let result = [];
        if (max && !this.lt("(v,)", this.cof(max))) for (let i = 0; i < r.length; i++){
            if (!this.lt(r[i][2], max)) result = this.cl(r, this.fs(max));
        }
        for (let i = 0; i < r.length; i++){
            if (this.lt(r[i][2], max) && !this.lt(r[i][2], min)){
                if (result.length) if (result.slice(-1)[0][2] === r[i][2]) result.pop();
                result.push(r[i]);
            }
        }
        return result;
    },
    // LEAST
    least: function (a, b = a){
        // CONSTANT
        if (["", "Y"].includes(a)) return "";
        let a1, s = [], max;
        // ADDITION
        if (!this.single(a)){
            a1 = this.asp(a);
            s.push(this.least(a1[0], b));
            s.push(this.least(a1[1], b));
            return this.lt(s[0], s[1]) ? s[1] : s[0];
        }
        // VEBLEN
        if (a[1] === "v"){
            a1 = this.vsp(a);
            s.push(this.least(a1[0], b));
            s.push(this.least(a1[1], b));
            return this.lt(s[0], s[1]) ? s[1] : s[0];
        }
        // CARDINAL OR INDESCRIBABLE
        if ("+T".includes(a[1])) return this.least(this.vsp(a)[0], b);
        // COLLAPSE
        if (a[1] === "S"){
            if (this.lt(a, b)) return "";
            a1 = this.vsp(a);
            s.push(a1.slice(-1)[0] + "(v,)");
            for (let i = 0; i < a1.length; i++) s.push(this.least(a1[i], b));
            max = s[0];
            for (let i = 1; i < s.length; i++) if (this.lt(max, s[i])) max = s[i];
            return max;
        }
    },
    // IN C SET
    inc: function (c, a, b){return !this.lt(a, this.least(c, b));},
    // IS NORMAL
    isnormal: function (str){
        // CONSTANT
        if (["", "Y", "A"].includes(str)) return true;
        // ADDITION
        if (!this.single(str)){
            let str1 = this.asp(str);
            if (!this.isnormal(str1[0])) return false;
            if (!this.isnormal(str1[1])) return false;
            if (this.single(str1[1])) return !this.lt(str1[0], str1[1]);
            return !this.lt(str1[0], this.asp(str1[1])[0]);
        }
        // SINGLE
        let str2 = this.vsp(str);
        for (let i = 0; i < str2.length; i++) if (!this.isnormal(str2[i])) return false;
        // VEBLEN
        if (str[1] === "v") return this.lt(str2[0], str) && this.lt(str2[1], str);
        // CARDINAL
        if (str[1] === "+") return this.iscard(str2[0]) && this.lt(str2[0], "Y");
        // INDESCRIBABLE
        if (str[1] === "T") return this.lt("(v,)", this.cof(str2[0])) && this.lt(str2[0], "Y");
        // COLLAPSE
        if (str[1] === "S"){
            if (!this.isreg(str2[0])) return false;
            if (str2.length !== this.ref(str2[0], 0) + 2) return false;
            for (let i = 0; i < str2.length - 1; i++){
                if (!i && str2.slice(-1)[0] === "A") continue;
                if (!this.indom(str2[0], str2[i ? i : str2.length - 1], i)) return false;
            }
            let mp1 = this.mpsp(this.ref(str2[0], 1)), mp2 = this.mpsp(this.plug(str));
            if (!mp1[0]) return true;
            if (!this.ref(this.vsp(mp1[0])[0], 1).includes("a")) return true;
            if (!this.lt(mp2[1], this.vsp(mp2[0])[1])) return false;
            if (!this.isnormal(mp2[0])) return false;
            return true;
        }
    },
    // ---------------------------------------------------------------------------------------------
    // SPLIT
    // ---------------------------------------------------------------------------------------------
    // ADDITION SPLIT
    asp: function (str){
        if (!str) return ["", ""];
        if (str[0] === "Y") return ["Y", str.slice(1)];
        let depth = 0;
        for (let i = 0; i < str.length; i++){
            if (str[i] === "(") depth++;
            if (str[i] === ")") depth--;
            if (!depth) return [str.slice(0, i + 1), str.slice(i + 1)];
        }
    },
    // VARIABLE SPLIT
    vsp: function (str){
        if (str[0] === "Y") return [];
        let depth = 0, start = 2, result = [];
        for (let i = 2; i < str.length - 1; i++){
            if (str[i] === "(") depth++;
            if (str[i] === ")") depth--;
            if (!depth && str[i] === ","){
                result.push(str.slice(start, i));
                start = i + 1;
            }
        }
        return result.concat(str.slice(start, -1));
    },
    // SINGLE
    single: function (str){return !this.asp(str)[1];},
    // ---------------------------------------------------------------------------------------------
    // ORDERING *
    // ---------------------------------------------------------------------------------------------
    // LESS THAN
    lt: function (a, b, cac = true){
        // CACHE
        if (cac){
            try {cache;} catch {return this.lt(a, b, false);}
            let key = `${this.name}-LT-${a}-${b}`;
            if (!(key in cache)) cache[key] = this.lt(a, b, false);
            return cache[key];
        }
        // CONSTANT
        if (!b) return false;
        if (a === "A") return false;
        if (b === "A") return true;
        if (!a) return true;
        // ADDITION
        if (!this.single(a) && !this.single(b)){
            let a1 = this.asp(a), b1 = this.asp(b);
            return this.lt(a1[0], b1[0]) || (!this.lt(b1[0], a1[0]) && this.lt(a1[1], b1[1]));
        }
        if (!this.single(a) && this.single(b)) return this.lt(this.asp(a)[0], b);
        if (this.single(a) && !this.single(b)) return !this.lt(this.asp(b)[0], a);
        // SAME
        let a2 = this.vsp(a), b2 = this.vsp(b);
        if (a === "Y" && b === "Y") return false;
        if (a[1] === b[1]){
            if (a[1] === "v"){
                if (this.lt(a2[0], b2[0])) return this.lt(a2[1], b);
                if (this.lt(b2[0], a2[0])) return this.lt(a, b2[1]);
                return this.lt(a2[1], b2[1]);
            }
            if ("+T".includes(a[1])) return this.lt(a2[0], b2[0]);
            if (a[1] === "S"){
                if (!this.lt(b, a2[0])) return true;
                if (!this.lt(a2.slice(-1)[0], b2.slice(-1)[0])) for (let i = 0; i < b2.length; i++){
                    if (!this.inc(b2[i], a2.slice(-1)[0], a)) return true;
                }
                if (!this.lt(a, b2[0])) return false;
                for (let i = 0; i < a2.length; i++){
                    if (!this.inc(a2[i], b2.slice(-1)[0], b)) return false;
                }
                if (this.lt(b2.slice(-1)[0], a2.slice(-1)[0])) return false;
                if (this.lt(a2.slice(-1)[0], b2.slice(-1)[0])) return true;
                if (this.lt(a2[0], b2[0]) || this.lt(b2[0], a2[0])) return false;
                for (let i = 1; i < a2.length - 1; i++){
                    if (this.lt(a2[i], b2[i])) return this.inc(a2[i], b2[i], b);
                    if (this.lt(b2[i], a2[i])) return !this.inc(b2[i], a2[i], a);
                }
                return false;
            }
        }
        // ONE SIDE Y
        if (a === "Y" && b[1] === "v"){
            return (this.lt(a, b2[0]) || b2[1]) && (!this.lt(b2[0], a) || this.lt(a, b2[1]));
        }
        if (a === "Y" && b[1] === "+") return this.lt(a, b2[0]);
        if (a === "Y" && "TS".includes(b[1])) return false;
        if (a[1] === "v" && b === "Y") return this.lt(a2[0], b) && this.lt(a2[1], b);
        if (a[1] === "+" && b === "Y") return this.lt(a2[0], b);
        if ("TS".includes(a[1]) && b === "Y") return true;
        // ONE SIDE VEBLEN
        if (a[1] === "v") return this.lt(a2[0], b) && this.lt(a2[1], b);
        if (b[1] === "v"){
            return (this.lt(a, b2[0]) || b2[1]) && (!this.lt(b2[0], a) || this.lt(a, b2[1]));
        }
        // ELSE
        if (a[1] === "+" && b[1] === "T") return this.lt(a2[0], b);
        if (a[1] === "T" && b[1] === "+") return !this.lt(b2[0], a);
        if (a[1] === "+" && b[1] === "S"){
            return b2[0][1] === "+" ? this.lt(a, b2[0]) : this.lt(a2[0], b);
        }
        if (a[1] === "S" && b[1] === "+"){
            return a2[0][1] === "+" ? !this.lt(b, a2[0]) : !this.lt(b2[0], a);
        }
        if (a[1] === "T" && b[1] === "S") return this.lt(a, b2[0]);
        if (a[1] === "S" && b[1] === "T") return !this.lt(b, a2[0]);
    },
    // GREATER THAN
    gt: function (a, b){return this.lt(b, a);},
    // LESS THAN OR EQUAL
    le: function (a, b){return !this.lt(b, a);},
    // GREATER THAN OR EQUAL
    ge: function (a, b){return !this.lt(a, b);},
    // EQUAL
    eq: function (a, b){return !this.lt(a, b) && !this.lt(b, a);},
    // NOT EQUAL
    ne: function (a, b){return this.lt(a, b) || this.lt(b, a);},
    // ---------------------------------------------------------------------------------------------
    // OPERATIONS *
    // ---------------------------------------------------------------------------------------------
    // SUCCESSOR
    s: function (str){return str + "(v,)";},
    // TO STRING
    to_str: function (n){return "(v,)".repeat(n);},
    // TO NUMBER
    to_num: function (str){
        return this.cof(str) === "(v,)" ? this.to_num(str.slice(0, -4)) + 1 : 0;
    },
    // LEAST UNCOUNTABLE CRDINAL
    uc: function (){return "(+(v,(v,)))";},
    // NORMALIZE
    norm: function (str){
        // NORMAL
        if (this.isnormal(str)) return str;
        // ADDITION
        if (!this.single(str)){
            let str1 = this.asp(str);
            return this.norm(str1[0]) + this.norm(str1[1]);
        }
        // SINGLE
        let str2 = this.vsp(str);
        // VEBLEN
        if (str[1] === "v"){
            if (!this.lt(str2[1], str)) return str2[1];
            if (!this.lt(str2[0], str)) return str2[0];
        }
        // ELSE
        return str;
    },
    // ADDITION
    add: function (a, b){
        if (!b) return a;
        if (!a) return b;
        let a1 = this.asp(a), b1 = this.asp(b);
        return this.lt(a1[0], b1[0]) ? b : a1[0] + this.add(a1[1], b);
    },
    // SOLVE
    solve: function (a, b){
        if (!this.lt(a, b)) return "";
        let a1 = this.asp(a), b1 = this.asp(b);
        return this.lt(a1[0], b1[0]) ? b : this.solve(a1[1], b1[1]);
    },
    // CARDINAL SPLIT
    csp: function (a, b, left){
        // LESS THAN CARD
        if (this.lt(a, b)) return left ? "" : a;
        // SINGLE
        if (this.single(a)) return left ? a : "";
        // ADDITION
        let a1 = this.asp(a);
        return (left ? a1[0] : "") + this.csp(a1[1], b, left);
    },
    // LEFT MULTIPLY BY OMEGA
    lmw: function (str){
        if (!str) return "";
        let result = "", a = str, b;
        for (;;){
            b = this.asp(a);
            result += this.lt(b[0], "(v,(v,(v,)))") ? `(v,${this.vsp(b[0])[1]}(v,))` : b[0];
            a = b[1];
            if (!a) break;
        }
        return result;
    },
    // INDESCRIBABILITY SPLIT
    isp: function (str){
        if (!str) return ["", ""];
        let a = "", b = str, c;
        for (;;){
            if (this.lt(b, "(v,(v,))")) break;
            c = this.asp(b);
            a += this.lt(c[0], "(v,(v,(v,)))") ? `(v,${this.fs(this.vsp(c[0])[1])})` : c[0];
            b = c[1];
        }
        return [a, b];
    },
    // LEAST COLLAPSE
    lc: function (str){
        // MUST BE REGULAR
        if (!this.isreg(str)) return str;
        // IS REGULAR
        let v = this.ref(str, 0), l = [], b, result = `(S${str},`;
        for (let i = 0; i < v; i++){
            b = this.bound(str, i + 1);
            l.push(b[3] ? l[i - 2] + "(v,)" : b[0]);
        }
        for (let i = 0; i < v; i++) result += l[i] + ",";
        return `${result}${this.bound(str, 0)[0]})`;
    },
    // REPLACE
    rp: function (str, a, n){
        // CONSTANT
        if (["", "Y"].includes(str)) return str;
        // ADDITION
        if (!this.single(str)) return str;
        // NOT COLLAPSE
        if (str[1] !== "S") return str;
        // COLLAPSE
        let str1 = this.vsp(str), v = this.ref(str1[0], 0), b, l, d = [], r = [];
        let result = "(S" + str1[0];
        for (let i = 0; i < v + 1; i++){
            b = this.bound(str1[0], i);
            l = (b[3] ? str1[i - 2] + "(v,)" : b[0]);
            d = (n === i ? a : this.solve(l, str1[i ? i : v + 1]));
            r.push(this.add(b[3] ? r[i - 2] + "(v,)" : l, d));
        }
        for (let i = 0; i < v + 1; i++) result += "," + r[i === v ? 0 : i + 1];
        return result + ")";
    },
    // CARDINAL ROOT
    root: function (str, target){
        // CONSTANT
        if (["", "Y"].includes(str)) return "";
        // ADDITION
        if (!this.single(str)) return "";
        // NOT COLLAPSE
        if (str[1] !== "S") return "";
        // COLLAPSE
        return (this.vsp(str)[0] === target) ? str : this.root(this.vsp(str)[0], target);
    },
    // TAIL
    tail: function (a, b, y = ""){
        // LESS THAN CARD
        if (this.lt(a, b)) return a;
        // FIXED POINT
        if (a === "Y") return "";
        // ADDITION
        if (!this.single(a)) return this.tail(this.asp(a)[1], b, y);
        // SINGLE
        let a1 = this.vsp(a);
        // VEBLEN
        if (a[1] === "v") return this.tail(a1[this.lt("(v,)", this.cof(a1[1])) * 1], b, y);
        // INDESCRIBABLE AND LESS THAN Y CASE
        if (a[1] === "T" && y && this.lt(y, a)) return this.tail(a1[0], b, y);
        // NOT COLLAPSE
        if (a[1] !== "S") return "";
        // REGULAR
        if (this.isreg(a)) return "";
        // IS LEAST
        if (!this.solve(this.bound(a1[0], 0)[0], a1.slice(-1)[0])){
            return a1[0][1] === "S" ? this.ctail(a, b, y) : "";
        }
        // LESS THAN Y CASE
        if (b[1] === "+" && this.lt(a, "Y") && !this.csp(a, b, false) && b !== y){
            return this.tail(a, b, b);
        }
        // NOT FIXED POINT
        if (!this.fp(a, 0, y)) return this.tail(a1.slice(-1)[0], b, y);
        // IS FIXED POINT
        return this.tail(this.csp(a1.slice(-1)[0], a1[0], true), b, y);
    },
    // COLLAPSING TAIL
    ctail: function (a, b, y = ""){
        // CONSTANT
        if (["", "Y"].includes(a)) return "";
        // ADDITION
        if (!this.single(a)) return "";
        // INDESCRIBABLE
        if (a[1] === "T") return this.vsp(a)[0];
        // NOT COLLAPSE
        if (a[1] !== "S") return "";
        // COLLAPSE
        let a1 = this.vsp(a), v = this.ref(a1[0], 0), bound, a2, a3, a4;
        // LOOP
        for (let i = v; i >= 0; i--){
            bound = this.bound(a1[0], i);
            a2 = this.solve(bound[3] ? a1[i - 2] + "(v,)" : bound[0], a1[i ? i : v + 1]);
            // SKIP IF LEAST
            if (!a2) continue;
            // NOT FIXED POINT
            if (!this.fp(a, i, y)) return this.tail(a2, b, y);
            // IS FIXED POINT
            a3 = this.csp(a2, bound[2], true);
            if (a3) return this.tail(a3, b, y);
            // SEARCH PREVIOUS
            for (let j = i - 1; j >= 0; j--){
                bound = this.bound(a1[0], j);
                a4 = this.solve(bound[3] ? a1[j - 2] + "(v,)" : bound[0], a1[j ? j : v + 1]);
                if (a4) return this.tail(a4, b, y);
            }
            // PREVIOUS ALL LEAST
            return "";
        }
        // ALL LEAST
        return this.ctail(a1[0], b, y);
    },
    // FIXED POINT
    fp: function (str, n, y = ""){
        // CONSTANT
        if (["", "Y"].includes(str)) return false;
        // ADDITION
        if (!this.single(str)) return false;
        // NOT COLLAPSE
        if (str[1] !== "S") return false;
        // COLLAPSE
        let str1 = this.vsp(str), v = this.ref(str1[0], 0);
        // ILLEGAL
        if (n > v) return false;
        // LEGAL
        let n2 = n ? n : v + 1, bound = this.bound(str1[0], n);
        let a = this.solve(bound[0], str1[n2]), b = bound[2];
        let t = this.tail(a, b, y), r = this.root(t, str1[0]), i2;
        // BASIC
        if (!this.single(t)) return false;
        if (!r) return false;
        if (t[1] !== "S") return false;
        // NEW ORDINAL
        if (this.lt(t, this.rp(str, this.fs(a, "", true, str1[0]), n))) return false;
        // LOOP
        for (let i = 0; i < n; i++){
            i2 = i ? i : v + 1;
            if (this.lt(this.vsp(r)[i2], str1[i2])) return false;
            if (this.lt(str1[i2], this.vsp(r)[i2])) return true;
        }
        // GENERAL CASE
        return this.lt(this.add(bound[0], a), this.vsp(r)[n2]);
    },
    // LAST SPACE
    ls: function (str, n){
        // CONSTANT
        if (["", "Y"].includes(str)) return 0;
        // ADDITION
        if (!this.single(str)) return 0;
        // NOT COLLAPSE
        if (str[1] !== "S") return 0;
        // COLLAPSE
        let v = this.ref(str, 0), b, result = 0;
        for (let i = n + 1; i < v + 1; i++){
            b = this.bound(str, i);
            if (!this.lt(this.solve(b[0], b[1]), b[2])) result = i;
        }
        return result;
    },
    // ---------------------------------------------------------------------------------------------
    // COFINALITY *
    // ---------------------------------------------------------------------------------------------
    // COFINALITY
    cof: function (str, y = "", cac = true){
        // CACHE
        if (cac){
            try {cache;} catch {return this.cof(str, y, false);}
            let key = `${this.name}-COF-${str}-${y}`;
            if (!(key in cache)) cache[key] = this.cof(str, y, false);
            return cache[key];
        }
        // CONSTANT
        if (["", "(v,)"].includes(str)) return str;
        if (["Y", "A"].includes(str)) return "(v,(v,))";
        // REGULAR
        if (this.isreg(str)){
            if (str[1] === "T" && y && this.lt(y, str)){
                let c = this.cof(this.vsp(str)[0], y);
                return this.lt("(v,)", c) ? c : "(v,(v,))";
            }
            return str;
        }
        // ADDITION
        if (!this.single(str)) return this.cof(this.asp(str)[1], y);
        // SINGLE
        let str1 = this.vsp(str);
        // VEBLEN
        if (str[1] === "v"){
            if (this.lt("(v,)", this.cof(str1[1], y))) return this.cof(str1[1], y);
            if (this.lt("(v,)", this.cof(str1[0], y))) return this.cof(str1[0], y);
            return "(v,(v,))";
        }
        // COLLAPSE
        return this.ccof(str, this.it(str, y), y);
    },
    // COLLAPSING COFINALITY
    ccof: function (a, b, y = "", cac = true){
        // CACHE
        if (cac){
            try {cache;} catch {return this.ccof(a, b, y, false);}
            let key = `${this.name}-CCOF-${a}-${b}-${y}`;
            if (!(key in cache)) cache[key] = this.ccof(a, b, y, false);
            return cache[key];
        }
        // CONSTANT
        if (["", "Y"].includes(a)) return "(v,(v,))";
        // ADDITION
        if (!this.single(a)) return "(v,(v,))";
        // INDESCRIBABLE
        let a1 = this.vsp(a);
        if (a[1] === "T"){
            return this.lt("(v,)", this.cof(a1[0], y)) ? this.cof(a1[0], y) : "(v,(v,))";
        }
        // NOT COLLAPSE
        if (a[1] !== "S") return "(v,(v,))";
        // COLLAPSE
        let v = this.ref(a1[0], 0), l = [], b0 = [], a0 = [], al = [], ar = [], d = [], bound, e;
        for (let i = 0; i < v + 1; i++){
            bound = this.bound(a1[0], i);
            l[i] = bound[3] ? l[i - 2] + "(v,)": bound[0];
            b0[i] = bound[2];
            a0[i] = this.solve(l[i], a1[i ? i : v + 1]);
            al[i] = this.csp(a0[i], b0[i], true);
            ar[i] = this.csp(a0[i], b0[i], false);
            d[i] = this.solve(l[i], bound[1]);
        }
        // LESS THAN Y CASE
        if (a1[0][1] === "+" && this.lt(a0[0], "Y") && this.cof(al[0])[1] === "T"){
            if (this.lt(a1[0], this.cof(al[0])) && (!this.lt("(v,)", this.cof(ar[0])) || b)){
                let y1 = y ? y : a1[0];
                return this.lt(this.cof(al[0], y1), a1[0]) ? this.cof(al[0], y1) : "(v,(v,))";
            }
        }
        // LOOP
        for (let i = v; i >= 0; i--){
            e = a0.slice(0, i + 1).concat(d.slice(i + 1));
            // NOT FIXED POINT AND ALL RIGHT IS ZERO
            if (!b && ar.slice(i + 1).every(x => !x)) for (let j = i; j < v + 1; j++){
                if (this.lt("(v,)", this.cof(this.csp(e[j], b0[j], false)))){
                    if (e.slice(i, j).every(x => (this.cof(x) === "(v,)"))){
                        return this.cof(e[j], y);
                    }
                }
            }
            // NO SPACE AFTER AND LEFT NOT ZERO
            if (!this.ls(a1[0], i) && al[i]) return this.mccof(a0[i], a, i, y);
            // HAS SPACE AFTER AND NOT ZERO
            if (this.ls(a1[0], i) && a0[i]) for (let j = i; j < v + 1; j++){
                if (!this.ls(a1[0], j) || this.cof(e[j]) !== "(v,)"){
                    return this.mccof(e[j], a, j, y);
                }
            }
        }
        // ALL LEAST
        return this.ccof(a1[0], b, y);
    },
    // MAIN COLLAPSING COFINALITY
    mccof: function (str, a, k, y = ""){
        let a1 = this.vsp(a)[0], b0 = this.bound(a1, k)[2];
        let str1 = this.ls(a1, k) ? str : this.csp(str, b0, true);
        return this.lt(this.cof(str1, y), b0) ? this.cof(str1, y) : "(v,(v,))";
    },
    // TYPE (0: ZERO / 1: SUC / 2: COUNTABLE LIM / 3: UNCOUNTABLE LIM)
    type: function (str){
        if (!this.cof(str)) return 0;
        if (this.cof(str) === "(v,)") return 1;
        if (this.cof(str) === "(v,(v,))") return 2;
        return 3;
    },
    // ---------------------------------------------------------------------------------------------
    // FUNDAMENTAL SEQUENCE *
    // ---------------------------------------------------------------------------------------------
    // FUNDAMENTAL SEQUENCE
    fs: function (a, n = "", strong = false, y = "", cac = true){
        // CACHE
        if (cac){
            try {cache;} catch {return this.fs(a, n, strong, y, false);}
            let key = `${this.name}-FS-${a}-${n}-${strong}-${y}`;
            if (!(key in cache)) cache[key] = this.fs(a, n, strong, y, false);
            return cache[key];
        }
        // ZERO
        if (!a) return "";
        // FIXED POINT
        if (a === "Y") return n ? `(T${this.fs(a, this.fs(n))})` : "(v,(v,))";
        // LIMIT
        if (a === "A") return this.scfs("Y", n);
        // REGULAR
        if (this.isreg(a)){
            if (a[1] === "T" && y && this.lt(y, a)){
                let b = this.solve("(v,)", this.isp(this.vsp(a)[0])[0]);
                if (this.lt("(v,)", this.cof(b, y))){
                    return `(T${this.lmw(this.add("(v,)", this.fs(b, n, strong, y)))})`;
                }
                let c = b ? `(T${this.lmw(this.add("(v,)", this.fs(b)))})` : "";
                return this.lcfs(this.lt(c, y) ? y : c, n);
            }
            if (!strong) return n;
            return this.rp(this.lc(a), n === "A" ? "A" : n ? this.fs("A", this.fs(n)) : "", 0);
        }
        // ADDITION
        if (!this.single(a)){
            let a1 = this.asp(a);
            return a1[0] + this.fs(a1[1], n, strong, y);
        }
        // SINGLE
        let a2 = this.vsp(a);
        // VEBLEN
        if (a[1] === "v"){
            // BETA IS LIMIT
            if (this.lt("(v,)", this.cof(a2[1]))){
                return this.norm(`(v${a2[0]},${this.fs(a2[1], n, strong, y)})`);
            }
            // ALPHA IS ZERO
            if (!a2[0]){
                if (!a2[1]) return "";
                return n ? `${this.fs(a, this.fs(n))}${this.norm(`(v,${this.fs(a2[1])})`)}` : "";
            }
            // ALPHA IS SUC
            if (this.cof(a2[0]) === "(v,)"){
                // BETA IS ZERO
                if (!a2[1]){
                    return n ? this.norm(`(v${this.fs(a2[0])},${this.fs(a, this.fs(n))})`) : "";
                }
                // BETA IS SUC
                if (!n) return this.norm(`(v${a2[0]},${this.fs(a2[1])})`);
                return `(v${this.fs(a2[0])},${this.fs(a, this.fs(n))}${this.fs(n) ? "" : "(v,)"})`;
            }
            // BETA IS ZERO
            if (!a2[1]) return this.norm(`(v${this.fs(a2[0], n, strong, y)},)`);
            // BETA IS SUC
            return `(v${this.fs(a2[0], n, strong, y)},` +
                   this.norm(`(v${a2[0]},${this.fs(a2[1])})`) + "(v,))";
        }
        // COLLAPSE
        return this.cfs(a, this.it(a, y), n, strong, y);
    },
    // INITIAL TERM
    it: function (str, y = "", cac = true){
        // CACHE
        if (cac){
            try {cache;} catch {return this.it(str, y, false);}
            let key = `${this.name}-IT-${str}-${y}`;
            if (!(key in cache)) cache[key] = this.it(str, y, false);
            return cache[key];
        }
        // CONSTANT
        if (["", "Y"].includes(str)) return "";
        // ADDITION
        if (!this.single(str)) return "";
        // VEBLEN
        let str1 = this.vsp(str);
        if (str[1] === "v") return "";
        // CARDINAL
        if (str[1] === "+") return str1[0] === "(v,(v,))" ? "" : str1[0];
        // INDESCRIBABLE
        if (str[1] === "T"){
            let str2 = this.solve("(v,)", this.isp(str1[0])[0]);
            if (!str2) return "(v,(v,))";
            if (this.lt("(v,)", this.cof(str2))) return "";
            return `(T${this.lmw(this.add("(v,)", this.fs(str2)))})`;
        }
        // COLLAPSE
        let v = this.ref(str1[0], 0), l = [], b0 = [], a0 = [], al = [], ar = [], d = [], t = [];
        let b, c;
        for (let i = 0; i < v + 1; i++){
            b = this.bound(str1[0], i);
            l[i] = b[3] ? l[i - 2] + "(v,)": b[0];
            b0[i] = b[2];
            a0[i] = this.solve(l[i], str1[i ? i : v + 1]);
            al[i] = this.csp(a0[i], b0[i], true);
            ar[i] = this.csp(a0[i], b0[i], false);
            d[i] = this.solve(l[i], b[1]);
            t[i] = this.tail(a0[i], b0[i], y);
        }
        // LESS THAN Y CASE
        if (str1[0][1] === "+" && this.lt(a0[0], "Y") && this.cof(al[0])[1] === "T"){
            if (this.lt(str1[0], this.cof(al[0])) && !ar[0]){
                let y1 = y ? y : str1[0];
                return this.fp(str, 0, y1) ? this.tail(a0[0], str1[0], y1) : "";
            }
        }
        // LOOP
        for (let i = v; i >= 0; i--){
            // RIGHT IS SUC
            if (this.cof(ar[i]) === "(v,)"){
                c = this.rp(str, this.fs(a0[i]), i);
                for (let j = i + 1; j < v + 1; j++){
                    if (!this.lt(this.cof(d[j], y), b0[j])) break;
                    if (this.lt("(v,)", this.cof(d[j], y))) return "";
                    c = this.rp(c, this.fs(d[j]), j);
                }
                return c;
            }
            // RIGHT IS LIM
            if (ar[i]) return this.fp(str, i, y) ? t[i] : "";
            // LEFT NOT ZERO
            if (al[i]) return this.lt(this.cof(al[i], y), b0[i]) && this.fp(str, i, y) ? t[i] : "";
        }
        // ALL LEAST
        return this.it(str1[0], y);
    },
    // COLLAPSING FUNDAMENTAL SEQUENCE
    cfs: function (a, b, n = "", strong = false, y = "", cac = true){
        // CACHE
        if (cac){
            try {cache;} catch {return this.cfs(a, b, n, strong, y, false);}
            let key = `${this.name}-CFS-${a}-${b}-${n}-${strong}-${y}`;
            if (!(key in cache)) cache[key] = this.cfs(a, b, n, strong, y, false);
            return cache[key];
        }
        // CONSTANT
        if (["", "Y"].includes(a)) return "";
        // ADDITION
        if (!this.single(a)) return "";
        // VEBLEN
        let a1 = this.vsp(a);
        if (a[1] === "v") return "";
        // CARDINAL
        if (a[1] === "+") return this.scfs(b, n);
        // INDESCRIBABLE
        if (a[1] === "T"){
            let a2 = this.solve("(v,)", this.isp(a1[0])[0]);
            if (!this.lt("(v,)", this.cof(a2)) || b) return this.lcfs(b, n);
            return `(T${this.lmw(this.add("(v,)", this.fs(a2, n, strong, y)))})`;
        }
        // COLLAPSE
        let v = this.ref(a1[0], 0), l = [], b0 = [], a0 = [], al = [], ar = [], d = [], bound, c, e;
        for (let i = 0; i < v + 1; i++){
            bound = this.bound(a1[0], i);
            l[i] = bound[3] ? l[i - 2] + "(v,)": bound[0];
            b0[i] = bound[2];
            a0[i] = this.solve(l[i], a1[i ? i : v + 1]);
            al[i] = this.csp(a0[i], b0[i], true);
            ar[i] = this.csp(a0[i], b0[i], false);
            d[i] = this.solve(l[i], bound[1]);
        }
        // LESS THAN Y CASE
        if (a1[0][1] === "+" && this.lt(a0[0], "Y") && this.cof(al[0])[1] === "T"){
            if (this.lt(a1[0], this.cof(al[0])) && (!this.lt("(v,)", this.cof(ar[0])) || b)){
                return this.mcfs(a0[0], a, b, a, n, 0, strong, y ? y : a1[0]);
            }
        }
        // LOOP
        for (let i = v; i >= 0; i--){
            e = a0.slice(0, i + 1).concat(d.slice(i + 1));
            // NOT FIXED POINT AND ALL RIGHT IS ZERO
            if (!b && ar.slice(i + 1).every(x => !x)) for (let j = i; j < v + 1; j++){
                if (this.lt("(v,)", this.cof(this.csp(e[j], b0[j], false)))){
                    if (e.slice(i, j).every(x => (this.cof(x) === "(v,)"))){
                        c = this.rp(a, this.fs(e[j], n, strong, y), j);
                        for (let k = i; k < j; k++) c = this.rp(c, this.fs(e[k]), k);
                        return c;
                    }
                }
            }
            // NO SPACE AFTER AND LEFT NOT ZERO
            if (!this.ls(a1[0], i) && al[i]) return this.mcfs(a0[i], a, b, a, n, i, strong, y);
            // HAS SPACE AFTER AND NOT ZERO
            if (this.ls(a1[0], i) && a0[i]){
                c = a;
                for (let j = i + 1; j < v + 1; j++) c = this.rp(c, "", j);
                for (let j = i; j < v + 1; j++){
                    if (!this.ls(a1[0], j) || this.cof(e[j]) !== "(v,)"){
                        return this.mcfs(e[j], a, b, c, n, j, strong, y);
                    }
                    c = this.rp(c, this.fs(e[j]), j);
                }
            }
        }
        // ALL LEAST
        return this.cfs(a1[0], b, n, strong, y);
    },
    // FUNDAMENTAL SEQUENCE FOR STRONGLY CRITICAL ORDINALS
    scfs: function (a, n){
        if (!n) return a;
        let p = this.scfs(a, this.fs(n));
        return `(v${p},${this.isnormal(`(v${p},)`) ? "" : "(v,)"})`;
    },
    // FUNDAMENTAL SEQUENCE FOR LIMIT CARDINALS
    lcfs: function (a, n){return n ? `(+${this.lcfs(a, this.fs(n))})` : a;},
    // MAIN COLLAPSING FUNDAMENTAL SEQUENCE
    mcfs: function (str, a, b, c, n, k, strong, y){
        let a1 = this.vsp(a)[0], b0 = this.bound(a1, k)[2];
        let str1 = this.ls(a1, k) ? str : this.csp(str, b0, true);
        // COF LESS THAN CARD
        if (this.lt(this.cof(str1, y), b0)){
            // NO SPACE AFTER
            if (!this.ls(a1, k)) return this.rp(c, this.add(this.fs(str1, n, strong, y), b), k);
            // HAS SPACE AFTER
            return this.rp(this.rp(c, b, this.ls(a1, k)), this.fs(str1, n, strong, y), k);
        }
        // COF GREATER THAN CARD
        if (this.lt(b0, this.cof(str1, y))){
            return n ? this.rp(c, this.add(this.re(str1, this.fs(n), b0, y), b), k) : b;
        }
        // COF IS CARD
        return n ? this.rp(c, this.fs(str1, this.cfs(a, b, this.fs(n)), false, y), k) : b;
    },
    // NORMAL RECURSION
    re: function (a, n, base = "", y = ""){
        if (!n) return this.fs(a, base, false, y);
        let c = this.cof(a, y), l = this.bound(c, 0)[0], p = this.re(a, this.fs(n), base, y);
        let b = this.lt(a, l) ? p : this.solve(l, p);
        return this.fs(a, this.rp(this.lc(c), b, 0), false, y);
    },
    // ---------------------------------------------------------------------------------------------
    // MATH FORM *
    // ---------------------------------------------------------------------------------------------
    // ORDINAL MATH FORM
    math: function (str){
        // ZERO
        if (!str) return ["0"];
        // FIXED POINT
        if (str === "Y") return ["\\Upsilon"];
        // LIMIT
        if (str === "A") return [["G", ["\\Upsilon", "+", "1"]]];
        // ADDITION
        if (!this.single(str)){
            let str1 = this.asp(str);
            return [].concat(this.math(str1[0]), ["+"], this.math(str1[1]));
        }
        // SINGLE
        let str2 = this.vsp(str), result = [str[1]];
        for (let i = 0; i < str2.length; i++){
            if (str[1] === "S" && i && i < str2.length - 1 && this.lt(str2[i], "Y")){
                let str3 = this.isp(str2[i]);
                result.push([["l", this.math(str3[0]), this.math(str3[1])]]);
                continue;
            }
            result.push(this.math(str2[i]));
        }
        return [result];
    },
    // INDESCRIBABILITY MATH FORM
    mathid: function (str, simple = false){
        let f = (x => simple ? [x ? x : "\"\""] : this.math(x));
        if (str.includes("a")) return f(str);
        let str1 = this.isp(str);
        return [["l", f(str1[0]), f(str1[1])]];
    },
    // REFLECTION MATH FORM
    mathref: function (str, mode = 0){
        let str1, str2, str3, valid, f, result;
        if (mode % 2){
            str1 = this.vsp(str);
            str2 = str1[0];
        } else str2 = str;
        f = (x => (mode < 4) ? this.math(x) : [x ? x : "\"\""]);
        let r1 = this.ref(str2, 1), r2 = this.ref(str2, 2).slice(1);
        let l1 = ["l"], l2 = ["l"], l3 = ["f"], b1;
        // ZERO
        if (!str2) valid = false;
        // FIXED POINT
        if (str2 === "Y") valid = false;
        // LIMIT
        if (str2 === "A") valid = false;
        // ADDITION
        if (!this.single(str2)) valid = false;
        // VEBLEN
        if (str2[1] === "v") valid = false;
        // CARDINAL
        if (str2[1] === "+") valid = true;
        // INDESCRIBABLE
        if (str2[1] === "T") valid = true;
        // COLLAPSE
        if (str2[1] === "S") valid = true;
        // INVALID
        if (!valid) return [];
        // COMPLETE REFLECTION LEFT
        if (mode % 4 < 2){
            result = ["f", f(str2), [["l"]]];
            for (let i = 0; i < this.ref(str2, 0); i++){
                if (!(mode % 2)) result[2][0].push(f(`(a${this.to_str(i)})`));
                else if (this.lt(str1[i + 1], "Y")){
                    result[2][0].push(this.mathid(str1[i + 1], mode >= 4));
                } else result[2][0].push(f(str1[i + 1]));
            }
        // COMPLETE REFLECTION RIGHT
        } else {
            result = ["L"];
            // ENTRY 1
            result.push(f(str2));
            // ENTRY 2
            if (mode % 2) for (let i = 1; i < str1.length; i++){
                r1 = r1.replace(`(a${this.to_str(i - 1)})`, str1[i]);
            }
            r1 = this.mpsp(r1);
            if (r1[0]){
                b1 = this.vsp(r1[0]);
                for (let i = 1; i < b1.length - 1; i++){
                    l1.push(this.lt(b1[i], "Y") ? this.mathid(b1[i], mode >= 4) : f(b1[i]));
                }
                result.push([["MP", [["f", f(b1[0]), [l1]]],
                              f(b1.slice(-1)[0]), this.mathid(r1[1], mode >= 4)]]);
            } else result.push([["MP", [], [], this.mathid(r1[1], mode >= 4)]]);
            // ENTRY 3
            if (!r2.length) result.push(["\\epsilon"]);
            else {
                for (let i = 0; i < r2.length; i++){
                    l2.push([["MP2", [["f", f(r2[i][0]), ["\\cdots"]]],
                              f(r2[i][1]), this.mathid(r2[i][2], mode >= 4)]]);
                }
                result.push([l2]);
            }
            // ENTRY 4
            if ("+T".includes(str2[1])) result.push(["\\epsilon"]);
            else {
                str3 = this.vsp(str2);
                l3 = l3.concat([f(str3[0]), [["l"]]]);
                for (let i = 1; i < str3.length - 1; i++){
                    if (this.lt(str3[i], "Y")) l3[2][0].push(this.mathid(str3[i], mode >= 4));
                    else l3[2][0].push(f(str3[i]));
                }
                result.push([l3]);
            }
            // ENTRY 5
            result.push(f(this.bound(str2, 0)[0]));
        }
        return [result];
    },
    // REFLECTION VECTOR
    mathrvec: function (str, simple = false){
        let r = this.ref(str, 2), result = [["l"]];
        let f = (x => simple ? [x ? x : "\"\""] : this.math(x));
        if (r === null) return ["\\epsilon"];
        if (!r.length) return ["\\epsilon"];
        for (let i = 0; i < r.length; i++){
            result[0].push([["MP2", [["f", f(r[i][0]), ["\\cdots"]]],
                             f(r[i][1]), this.mathid(r[i][2], simple)]]);
        }
        return result;
    },
};