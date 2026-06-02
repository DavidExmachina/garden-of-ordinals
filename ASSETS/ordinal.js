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
        let str1 = this.vsp(str), c = [];
        for (let i = 0; i < str1.length; i++) c.push(this.cof(str1[i]));
        // VEBLEN
        if (str[1] === "v"){
            if (this.lt("(v,)", c[1])) return c[1];
            if (this.lt("(v,)", c[0])) return c[0];
            return "(v,(v,))";
        }
        // OMEGA
        if (str[1] === "W") return c[0];
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