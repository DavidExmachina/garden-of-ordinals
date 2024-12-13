// =================================================================================================
// BASIC FUNCTIONS
// =================================================================================================
// USE STRICT
"use strict";
// CACHE
var cache = {};
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
        var depth = 0;
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
        var str1 = this.asp(str);
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
        var depth = 0;
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
            var key = `${this.name}-LT-${a}-${b}`;
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
            var a1 = this.asp(a), b1 = this.asp(b);
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
            var key = `${this.name}-COF-${str}`;
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
    // COUNTABLE
    countable: function (str){return true;},
    // ---------------------------------------------------------------------------------------------
    // FUNDAMENTAL SEQUENCE *
    // ---------------------------------------------------------------------------------------------
    fs: function (a, n = "", strong = false, cac = true){
        // CACHE
        if (cac){
            var key = `${this.name}-FS-${a}-${n}-${strong}`;
            if (!(key in cache)) cache[key] = this.fs(a, n, strong, false);
            return cache[key];
        }
        // ZERO
        if (!a) return "";
        // LIMIT
        if (a === "A") return n ? `(${this.fs(a, this.fs(n))})` : "";
        // ADDITION
        if (!this.single(a)){
            var a1 = this.asp(a);
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
    // MATH FORM
    // ---------------------------------------------------------------------------------------------
    math: function (str){
        // ZERO
        if (!str) return ["0"];
        // LIMIT
        if (str === "A") return [["e", ["0"]]];
        // ADDITION
        if (!this.single(str)){
            var str1 = this.asp(str);
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
        var depth = [];
        for (let i = 0; i < str.length; i++){
            if (str[i] === "(") depth.push(1);
            if (str[i] === ",") depth[depth.length - 1] --;
            if (str[i] === ")"){
                if (depth[depth.length - 1]) return 1;
                depth.pop();
            }
        }
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
            var str1 = this.vsp(str);
            if (!this.isnormal(str1[0])) return false;
            if (!this.isnormal(str1[1])) return false;
            return this.lt(str1[1], str);
        }
        // ADDITION
        var str2 = this.asp(str);
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
        var depth = 0;
        for (let i = 0; i < str.length; i++){
            if (str[i] === "(") depth++;
            if (str[i] === ")") depth--;
            if (!depth) return [str.slice(0, i + 1), str.slice(i + 1)];
        }
    },
    // VARIABLE SPLIT
    vsp: function (str){
        var depth = 0;
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
            var key = `${this.name}-LT-${a}-${b}`;
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
            var a1 = this.asp(a), b1 = this.asp(b);
            return this.lt(a1[0], b1[0]) || (!this.lt(b1[0], a1[0]) && this.lt(a1[1], b1[1]));
        }
        if (!this.single(a) && this.single(b)) return this.lt(this.asp(a)[0], b);
        if (this.single(a) && !this.single(b)) return !this.lt(this.asp(b)[0], a);
        // SINGLE
        var a2 = this.vsp(a), b2 = this.vsp(b);
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
            var key = `${this.name}-COF-${str}`;
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
    // COUNTABLE
    countable: function (str){return true;},
    // ---------------------------------------------------------------------------------------------
    // FUNDAMENTAL SEQUENCE *
    // ---------------------------------------------------------------------------------------------
    fs: function (a, n = "", strong = false, cac = true){
        // CACHE
        if (cac){
            var key = `${this.name}-FS-${a}-${n}-${strong}`;
            if (!(key in cache)) cache[key] = this.fs(a, n, strong, false);
            return cache[key];
        }
        // ZERO
        if (!a) return "";
        // LIMIT
        if (a === "A") return n ? `(${this.fs(a, this.fs(n))},)` : "";
        // ADDITION
        if (!this.single(a)){
            var a1 = this.asp(a);
            return a1[0] + this.fs(a1[1], n);
        }
        // SINGLE
        var a2 = this.vsp(a);
        if (this.cof(a2[1]) === "(,(,))") return this.norm(`(${a2[0]},${this.fs(a2[1], n)})`);
        if (!a2[0]){
            if (!a2[1]) return "";
            return n ? `${this.fs(a, this.fs(n))}${this.norm(`(,${this.fs(a2[1])})`)}` : "";
        }
        if (this.cof(a2[0]) === "(,)"){
            if (!n) return "";
            if (!a2[1]) return `(${this.fs(a2[0])},${this.fs(a, this.fs(n))})`;
            if (!this.fs(n)) return this.norm(`(${a2[0]},${this.fs(a2[1])})`);
            if (!this.fs(this.fs(n))){
                if (a2[0] === "(,)") return `(,${this.fs(a, this.fs(n)).repeat(2)})`;
                return `(${this.fs(a2[0])},${this.fs(a, this.fs(n))}(,))`;
            }
            return `(${this.fs(a2[0])},${this.fs(a, this.fs(n))})`;
        }
        if (!a2[1]) return `(${this.fs(a2[0], n)},)`;
        return `(${this.fs(a2[0], n)},${this.norm(`(${a2[0]},${this.fs(a2[1])})`)}(,))`;
    },
    // ---------------------------------------------------------------------------------------------
    // MATH FORM
    // ---------------------------------------------------------------------------------------------
    math: function (str){
        // ZERO
        if (!str) return ["0"];
        // LIMIT
        if (str === "A") return [["G", ["0"]]];
        // ADDITION
        if (!this.single(str)){
            var str1 = this.asp(str);
            return [].concat(this.math(str1[0]), ["+"], this.math(str1[1]));
        }
        // SINGLE
        var str2 = this.vsp(str);
        return [["v", this.math(str2[0]), this.math(str2[1])]];
    },
};
// =================================================================================================
// BUCHHOLZ FUNCTION
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
        var depth = [];
        for (let i = 0; i < str.length; i++){
            if (str[i] === "(") depth.push(1);
            if (str[i] === ",") depth[depth.length - 1] --;
            if (str[i] === ")"){
                if (depth[depth.length - 1]) return 1;
                depth.pop();
            }
        }
        // CHECK NORMAL
        if (!this.isnormal(str)) return 2;
        // ALL CLEAR
        return 3;
    },
    // IN C SET
    inc: function (c, a, b){
        if (this.lt(c, `(${a},)`)) return true;
        if (this.single(c)){
            var c1 = this.vsp(c);
            return this.lt(c1[0], "(,(,))(,)") && this.inc(c1[1], a, b) && this.lt(c1[1], b);
        }
        var c2 = this.asp(c);
        return this.inc(c2[0], a, b) && this.inc(c2[1], a, b);
    },
    // IS NORMAL
    isnormal: function (str){
        // CONSTANT
        if (["", "A"].includes(str)) return true;
        // SINGLE
        if (this.single(str)){
            var str1 = this.vsp(str);
            if (!this.isnormal(str1[0])) return false;
            if (!this.isnormal(str1[1])) return false;
            return this.inc(str1[1], str1[0], str1[1]);
        }
        // ADDITION
        var str2 = this.asp(str);
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
        var depth = 0;
        for (let i = 0; i < str.length; i++){
            if (str[i] === "(") depth++;
            if (str[i] === ")") depth--;
            if (!depth) return [str.slice(0, i + 1), str.slice(i + 1)];
        }
    },
    // VARIABLE SPLIT
    vsp: function (str){
        var depth = 0;
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
            var key = `${this.name}-LT-${a}-${b}`;
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
            var a1 = this.asp(a), b1 = this.asp(b);
            return this.lt(a1[0], b1[0]) || (!this.lt(b1[0], a1[0]) && this.lt(a1[1], b1[1]));
        }
        if (!this.single(a) && this.single(b)) return this.lt(this.asp(a)[0], b);
        if (this.single(a) && !this.single(b)) return !this.lt(this.asp(b)[0], a);
        // SINGLE
        var a2 = this.vsp(a), b2 = this.vsp(b);
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
            var key = `${this.name}-COF-${str}`;
            if (!(key in cache)) cache[key] = this.cof(str, false);
            return cache[key];
        }
        // CONSTANT
        if (!str) return "";
        if (str === "A") return "(,(,))";
        // ADDITION
        if (!this.single(str)) return this.cof(this.asp(str)[1]);
        // SINGLE
        var str1 = this.vsp(str);
        var c1 = this.cof(str1[1]);
        // SINGLE ZERO
        if (!str1[1]){
            var c2 = this.cof(str1[0]);
            if (this.lt(c2, "(,(,))")) return str;
            return c2;
        }
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
    // COUNTABLE
    countable: function (str){return this.lt(str, "((,),)");},
    // ---------------------------------------------------------------------------------------------
    // FUNDAMENTAL SEQUENCE *
    // ---------------------------------------------------------------------------------------------
    fs: function (a, n = "", strong = false, cac = true){
        // CACHE
        if (cac){
            var key = `${this.name}-FS-${a}-${n}-${strong}`;
            if (!(key in cache)) cache[key] = this.fs(a, n, strong, false);
            return cache[key];
        }
        // ZERO
        if (!a) return "";
        // LIMIT
        if (a === "A") return n ? `((,(,)),${this.fs(a, this.fs(n))})` : "";
        // ADDITION
        if (!this.single(a)){
            var a1 = this.asp(a);
            return a1[0] + this.fs(a1[1], n, strong);
        }
        // SINGLE
        var a2 = this.vsp(a);
        var c1 = this.cof(a2[1]);
        var c2;
        // SINGLE ZERO
        if (!a2[1]){
            c2 = this.cof(a2[0]);
            if (!c2) return "";
            if (c2 === "(,)"){
                if (!strong) return n;
                if (n === "A") return `(${this.fs(a2[0])},A)`;
                return `(${this.fs(a2[0])},${this.fs("A", n)})`;
            }
            return `(${this.fs(a2[0], n, strong)},)`
        }
        // SINGLE SUCCESSOR
        if (c1 === "(,)") return n ? `${this.fs(a, this.fs(n))}(${a2[0]},${this.fs(a2[1])})` : "";
        // SINGLE LIMIT
        if (this.lt(c1, a)) return `(${a2[0]},${this.fs(a2[1], n, strong)})`;
        return n ? `(${a2[0]},${this.re(a2[1], this.fs(n))})` : "";
    },
    re: function (a, n){
        var c = this.fs(this.vsp(this.cof(a))[0]);
        return this.fs(a, n ? `(${c},${this.re(a, this.fs(n))})` : "");
    },
    // ---------------------------------------------------------------------------------------------
    // MATH FORM
    // ---------------------------------------------------------------------------------------------
    math: function (str){
        // ZERO
        if (!str) return ["0"];
        // LIMIT
        if (str === "A") return [["e", [["W", ["\\omega"]], "+", "1"]]];
        // ADDITION
        if (!this.single(str)){
            var str1 = this.asp(str);
            return [].concat(this.math(str1[0]), ["+"], this.math(str1[1]));
        }
        // SINGLE
        var str2 = this.vsp(str);
        return [["b", this.math(str2[0]), this.math(str2[1])]];
    },
};
// =================================================================================================
// EXTENEDED BUCHHOLZ FUNCTION
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
        var depth = [];
        for (let i = 0; i < str.length; i++){
            if (str[i] === "(") depth.push(1);
            if (str[i] === ",") depth[depth.length - 1] --;
            if (str[i] === ")"){
                if (depth[depth.length - 1]) return 1;
                depth.pop();
            }
        }
        // CHECK NORMAL
        if (!this.isnormal(str)) return 2;
        // ALL CLEAR
        return 3;
    },
    // IN C SET
    inc: function (c, a, b){
        if (this.lt(c, `(${a},)`)) return true;
        if (this.single(c)){
            var c1 = this.vsp(c);
            return this.inc(c1[0], a, b) && this.inc(c1[1], a, b) && this.lt(c1[1], b);
        }
        var c2 = this.asp(c);
        return this.inc(c2[0], a, b) && this.inc(c2[1], a, b);
    },
    // IS NORMAL
    isnormal: function (str){
        // CONSTANT
        if (["", "A"].includes(str)) return true;
        // SINGLE
        if (this.single(str)){
            var str1 = this.vsp(str);
            if (!this.isnormal(str1[0])) return false;
            if (!this.isnormal(str1[1])) return false;
            return this.inc(str1[1], str1[0], str1[1]);
        }
        // ADDITION
        var str2 = this.asp(str);
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
        var depth = 0;
        for (let i = 0; i < str.length; i++){
            if (str[i] === "(") depth++;
            if (str[i] === ")") depth--;
            if (!depth) return [str.slice(0, i + 1), str.slice(i + 1)];
        }
    },
    // VARIABLE SPLIT
    vsp: function (str){
        var depth = 0;
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
            var key = `${this.name}-LT-${a}-${b}`;
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
            var a1 = this.asp(a), b1 = this.asp(b);
            return this.lt(a1[0], b1[0]) || (!this.lt(b1[0], a1[0]) && this.lt(a1[1], b1[1]));
        }
        if (!this.single(a) && this.single(b)) return this.lt(this.asp(a)[0], b);
        if (this.single(a) && !this.single(b)) return !this.lt(this.asp(b)[0], a);
        // SINGLE
        var a2 = this.vsp(a), b2 = this.vsp(b);
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
            var key = `${this.name}-COF-${str}`;
            if (!(key in cache)) cache[key] = this.cof(str, false);
            return cache[key];
        }
        // CONSTANT
        if (!str) return "";
        if (str === "A") return "(,(,))";
        // ADDITION
        if (!this.single(str)) return this.cof(this.asp(str)[1]);
        // SINGLE
        var str1 = this.vsp(str);
        var c1 = this.cof(str1[1]);
        // SINGLE ZERO
        if (!str1[1]){
            var c2 = this.cof(str1[0]);
            if (this.lt(c2, "(,(,))")) return str;
            return c2;
        }
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
    // COUNTABLE
    countable: function (str){return this.lt(str, "((,),)");},
    // ---------------------------------------------------------------------------------------------
    // FUNDAMENTAL SEQUENCE *
    // ---------------------------------------------------------------------------------------------
    fs: function (a, n = "", strong = false, cac = true){
        // CACHE
        if (cac){
            var key = `${this.name}-FS-${a}-${n}-${strong}`;
            if (!(key in cache)) cache[key] = this.fs(a, n, strong, false);
            return cache[key];
        }
        // ZERO
        if (!a) return "";
        // LIMIT
        if (a === "A") return n ? `(${this.fs(a, this.fs(n))},)` : "";
        // ADDITION
        if (!this.single(a)){
            var a1 = this.asp(a);
            return a1[0] + this.fs(a1[1], n, strong);
        }
        // SINGLE
        var a2 = this.vsp(a);
        var c1 = this.cof(a2[1]);
        var c2;
        // SINGLE ZERO
        if (!a2[1]){
            c2 = this.cof(a2[0]);
            if (!c2) return "";
            if (c2 === "(,)"){
                if (!strong) return n;
                if (n === "A") return `(${this.fs(a2[0])},A)`;
                return `(${this.fs(a2[0])},${this.fs("A", n)})`;
            }
            return `(${this.fs(a2[0], n, strong)},)`
        }
        // SINGLE SUCCESSOR
        if (c1 === "(,)") return n ? `${this.fs(a, this.fs(n))}(${a2[0]},${this.fs(a2[1])})` : "";
        // SINGLE LIMIT
        if (this.lt(c1, a)) return `(${a2[0]},${this.fs(a2[1], n, strong)})`;
        return n ? `(${a2[0]},${this.re(a2[1], this.fs(n))})` : "";
    },
    re: function (a, n){
        var c = this.fs(this.vsp(this.cof(a))[0]);
        return this.fs(a, n ? `(${c},${this.re(a, this.fs(n))})` : "");
    },
    // ---------------------------------------------------------------------------------------------
    // MATH FORM
    // ---------------------------------------------------------------------------------------------
    math: function (str){
        // ZERO
        if (!str) return ["0"];
        // LIMIT
        if (str === "A") return [["W", [["W", [["W", ["\\cdot_{\\cdot_\\cdot}"]]]]]]];
        // ADDITION
        if (!this.single(str)){
            var str1 = this.asp(str);
            return [].concat(this.math(str1[0]), ["+"], this.math(str1[1]));
        }
        // SINGLE
        var str2 = this.vsp(str);
        return [["B", this.math(str2[0]), this.math(str2[1])]];
    },
};
// =================================================================================================
// RATHJEN FUNCTION BASED ON M
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
        var depth = [];
        for (let i = 0; i < str.length; i++){
            if (str[i] === "("){
                if (i + 1 >= str.length) return 1;
                if (!"vVxr".includes(str[i + 1])) return 1;
                depth.push(1);
            }
            if (str[i] === ",") depth[depth.length - 1] --;
            if (depth[depth.length - 1] < 0) return 1;
            if (str[i] === ")"){
                if (depth[depth.length - 1]) return 1;
                depth.pop();
            }
            if ("vVxr".includes(str[i])){
                if (!i) return 1;
                if (str[i - 1] !== "(") return 1;
            }
        }
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
        var str1 = null;
        if (!this.single(str)) str1 = this.asp(str);
        // VEBLEN
        if (str[1] === "v" && str1 === null) str1 = this.vsp(str);
        // ELSE
        if (str1 === null) return str;
        // COMPARE
        var s0 = this.st(str1[0]), s1 = this.st(str1[1]);
        return this.lt(s0, s1) ? s1 : s0;
    },
    // IS REGULAR
    isreg: function (str){
        if (!str) return false;
        if (!this.single(str)) return false;
        if (str[1] !== "x") return false;
        var str1 = this.vsp(str);
        if (!str1[1]) return true;
        if (str1[1].slice(-4) === "(v,)") return true;
        return false;
    },
    // LEAST
    least: function (a, b){
        // CONSTANT
        if (["", "M"].includes(a)) return "";
        var a1, b1, s0, s1, s2, max;
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
            var str1 = this.asp(str);
            if (!this.isnormal(str1[0])) return false;
            if (!this.isnormal(str1[1])) return false;
            if (this.single(str1[1])) return !this.lt(str1[0], str1[1]);
            return !this.lt(str1[0], this.asp(str1[1])[0]);
        }
        // SINGLE
        var str2 = this.vsp(str);
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
        var depth = 0;
        for (let i = 0; i < str.length; i++){
            if (str[i] === "(") depth++;
            if (str[i] === ")") depth--;
            if (!depth) return [str.slice(0, i + 1), str.slice(i + 1)];
        }
    },
    // VARIABLE SPLIT
    vsp: function (str){
        if (str[0] === "M") return [];
        var depth = 0;
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
            var key = `${this.name}-LT-${a}-${b}`;
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
            var a1 = this.asp(a), b1 = this.asp(b);
            return this.lt(a1[0], b1[0]) || (!this.lt(b1[0], a1[0]) && this.lt(a1[1], b1[1]));
        }
        if (!this.single(a) && this.single(b)) return this.lt(this.asp(a)[0], b);
        if (this.single(a) && !this.single(b)) return !this.lt(this.asp(b)[0], a);
        // SAME
        var a2 = this.vsp(a), b2 = this.vsp(b);
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
                return !this.lt(b2[0], this.vsp(a2[0])[0]) ||
                       !this.lt(this.st(b2[0]), a2[0]) ||
                       !this.inc(b2[0], a2[0], a2[1]);
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
            var str1 = this.asp(str);
            return this.norm(str1[0]) + this.norm(str1[1]);
        }
        // SINGLE
        var str2 = this.vsp(str);
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
            var key = `${this.name}-COF-${str}`;
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
        var str1 = this.vsp(str), c0 = this.cof(str1[0]), c1 = this.cof(str1[1]), a;
        // BOTH VEBLEN
        if ("vV".includes(str[1])){
            if (!this.lt(c1, "(v,(v,))")) return c1;
            if (!this.lt(c0, "(v,(v,))")) return c0;
            return "(v,(v,))";
        }
        // INACCESSIBLE
        if (str[1] === "x") return c1;
        // COLLAPSE
        if (str[1] === "r"){
            if (!this.lt(c1, str1[0])) return "(v,(v,))";
            if (!this.lt(c1, "(v,(v,))")) return c1;
            a = this.cof(this.vsp(str1[0])[0]);
            if (this.lt(a, "(v,(v,))")) return "(v,(v,))";
            if (a === "M") return "(v,(v,))";
            return a;
        }
    },
    // TYPE (0: ZERO / 1: SUC / 2: COUNTABLE LIM / 3: UNCOUNTABLE LIM)
    type: function (str){
        if (!this.cof(str)) return 0;
        if (this.cof(str) === "(v,)") return 1;
        if (this.cof(str) === "(v,(v,))") return 2;
        return 3;
    },
    // COUNTABLE
    countable: function (str){return this.lt(str, "(x,)");},
    // ---------------------------------------------------------------------------------------------
    // FUNDAMENTAL SEQUENCE *
    // ---------------------------------------------------------------------------------------------
    fs: function (a, n = "", strong = false, cac = true){
        // CACHE
        if (cac){
            var key = `${this.name}-FS-${a}-${n}-${strong}`;
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
            var a1 = this.asp(a);
            return a1[0] + this.fs(a1[1], n, strong);
        }
        // SINGLE
        var a2 = this.vsp(a);
        // VEBLEN
        if (a[1] === "v"){
            // BETA IS LIMIT
            if (!this.lt(this.cof(a2[1]), "(v,(v,))")){
                return this.norm(`(v${a2[0]},${this.fs(a2[1], n, strong)})`);
            }
            // ALPHA IS ZERO
            if (!a2[0]){
                if (!a2[1]) return "";
                return n ? `${this.fs(a, this.fs(n))}${this.norm(`(v,${this.fs(a2[1])})`)}` : "";
            }
            // ALPHA IS SUC
            if (this.cof(a2[0]) === "(v,)"){
                if (!n) return "";
                if (!a2[1]) return `(v${this.fs(a2[0])},${this.fs(a, this.fs(n))})`;
                if (!this.fs(n)) return this.norm(`(v${a2[0]},${this.fs(a2[1])})`);
                if (!this.fs(this.fs(n))){
                    if (a2[0] === "(v,)") return `(v,${this.fs(a, this.fs(n)).repeat(2)})`;
                    return `(v${this.fs(a2[0])},${this.fs(a, this.fs(n))}(v,))`;
                }
                return `(v${this.fs(a2[0])},${this.fs(a, this.fs(n))})`;
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
            if (!this.lt(this.cof(a2[1]), "(v,(v,))")){
                return this.norm(`(V${a2[0]},${this.fs(a2[1], n, strong)})`);
            }
            // ALPHA IS SUC AND BETA IS ZERO
            if (this.cof(a2[0]) === "(v,)" && !a2[1]){
                if (!n) return "";
                if (a2[0] === "(v,)") return `(x,${this.fs(a, this.fs(n))})`;
                return `(V${this.fs(a2[0])},${this.fs(a, this.fs(n))})`;
            }
            // ALPHA IS SUC AND BETA IS SUC
            if (this.cof(a2[0]) === "(v,)" && this.cof(a2[1]) === "(v,)"){
                if (!n) return "";
                if (!this.fs(n)) return this.norm(`(V${a2[0]},${this.fs(a2[1])})`);
                if (!this.fs(this.fs(n))){
                    if (a2[0] === "(v,)") return `(x,${this.fs(a, this.fs(n))}(v,))`;
                    return `(V${this.fs(a2[0])},${this.fs(a, this.fs(n))}(v,))`;
                }
                if (a2[0] === "(v,)") return `(x,${this.fs(a, this.fs(n))})`;
                return `(V${this.fs(a2[0])},${this.fs(a, this.fs(n))})`;
            }
            // BETA IS ZERO
            if (!a2[1]) return this.norm(`(V${this.fs(a2[0], n, strong)},)`);
            // BETA IS SUC
            return this.norm(`(V${this.fs(a2[0], n, strong)},` +
                   this.norm(`(V${a2[0]},${this.fs(a2[1])})`) + "(v,))");
        }
        // INACCESSIBLE
        if (a[1] === "x"){
            if (this.lt(this.cof(a2[1]), "(v,(v,))")){
                if (!strong) return n;
                if (n === "A") return `(r${a},A)`;
                return `(r${a},${this.fs("A", n)})`;
            }
            return this.norm(`(x${a2[0]},${this.fs(a2[1], n, strong)})`);
        }
        // COLLAPSE (r(x[ALPHA],[BETA])=[CARD],[GAMMA])
        var a3 = this.vsp(a2[0]).concat(a2[1]);
        var c0 = this.cof(a3[0]), c2 = this.cof(a3[2]);
        // GAMMA COF IS MAHLO
        if (c2 === "M") return `(r${a2[0]},${this.fs(a2[1], `(r(x${this.fs("A", n)},),)`)})`;
        // GAMMA COF IS NOT LESS THAN CARD
        if (!this.lt(c2, a2[0])) return n ? `(r${a2[0]},${this.re(a2[1], this.fs(n))})` : "";
        // GAMMA IS LIMIT
        if (!this.lt(c2, "(v,(v,))")) return `(r${a2[0]},${this.fs(a2[1], n, strong)})`;
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
            var t = this.tail(a3[0]);
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
        var str1 = this.vsp(str);
        if (this.lt(this.cof(str1[1]), "(v,(v,))")) return this.tail(str1[0]);
        return this.tail(str1[1]);
    },
    // ---------------------------------------------------------------------------------------------
    // MATH FORM
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
            var str1 = this.asp(str);
            return [].concat(this.math(str1[0]), ["+"], this.math(str1[1]));
        }
        // SINGLE
        var str2 = this.vsp(str);
        return [[str[1], this.math(str2[0]), this.math(str2[1])]];
    },
};
// =================================================================================================
// RATHJEN FUNCTION BASED ON K
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
        var depth = [];
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
                if (depth[depth.length - 1]) return 1;
                depth.pop();
            }
            if ("vWXR".includes(str[i])){
                if (!i) return 1;
                if (str[i - 1] !== "(") return 1;
            }
        }
        // CHECK NORMAL
        if (!this.isnormal(str)) return 2;
        // ALL CLEAR
        return 3;
    },
    // M FUNCTION
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
        var a1, s0, s1, s2, s3, max;
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
            var str1 = this.asp(str);
            if (!this.isnormal(str1[0])) return false;
            if (!this.isnormal(str1[1])) return false;
            if (this.single(str1[1])) return !this.lt(str1[0], str1[1]);
            return !this.lt(str1[0], this.asp(str1[1])[0]);
        }
        // SINGLE
        var str2 = this.vsp(str);
        for (let i = 0; i < str2.length; i++) if (!this.isnormal(str2[i])) return false;
        // VEBLEN
        if (str[1] === "v") return this.lt(str2[0], str) && this.lt(str2[1], str);
        // OMEGA
        if (str[1] === "W") return this.lt(str2[0], str) && this.lt(str2[0], "K") && str2[0];
        // MAHLO
        if (str[1] === "X") return str2[0];
        // COLLAPSE
        if (str[1] === "R"){
            return this.m(str2[0]) &&
                   this.inc(str2[0], str2[2], str2[0]) &&
                   this.inc(str2[1], str2[2], str2[0]) &&
                   this.inc(str2[2], str2[2], str2[0]) &&
                   !this.lt(str2[2], str2[1]) &&
                   this.lt(str2[1], this.m(str2[0])) &&
                   this.inc(str2[1], this.m(str2[0]), str2[0]);
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
        var depth = 0;
        for (let i = 0; i < str.length; i++){
            if (str[i] === "(") depth++;
            if (str[i] === ")") depth--;
            if (!depth) return [str.slice(0, i + 1), str.slice(i + 1)];
        }
    },
    // VARIABLE SPLIT
    vsp: function (str){
        if (str[0] === "K") return [];
        var depth = 0, start = 2, result = [];
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
            var key = `${this.name}-LT-${a}-${b}`;
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
            var a1 = this.asp(a), b1 = this.asp(b);
            return this.lt(a1[0], b1[0]) || (!this.lt(b1[0], a1[0]) && this.lt(a1[1], b1[1]));
        }
        if (!this.single(a) && this.single(b)) return this.lt(this.asp(a)[0], b);
        if (this.single(a) && !this.single(b)) return !this.lt(this.asp(b)[0], a);
        // SAME
        var a2 = this.vsp(a), b2 = this.vsp(b);
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
                if (this.lt(b, a2[0])){
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
                if (this.lt(a2[0], b2[0]) || this.lt(b2[0], a2[0]) ||
                    this.lt(a2[1], b2[1]) || this.lt(b2[1], a2[1]) ||
                    this.lt(a2[2], b2[2]) || this.lt(b2[2], a2[2])) return !this.lt(b, a);
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
            var str1 = this.asp(str);
            return this.norm(str1[0]) + this.norm(str1[1]);
        }
        // SINGLE
        var str2 = this.vsp(str);
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
    add: function (a, b, c = null){
        // ZERO
        if (!b) return a;
        if (!a) return b;
        var a1 = this.asp(a), b1 = this.asp(b);
        // NO LIMIT
        if (c === null) return this.lt(a1[0], b1[0]) ? b : a1[0] + this.add(a1[1], b);
        // HAS LIMIT
        var c1 = this.asp(c);
        // A NOT LESS THAN LIMIT
        if (!this.lt(a, c)) return a;
        // CANCEL OUT SAME FIRST PART
        if (!this.lt(a1[0], b1[0]) && !this.lt(b1[0], c1[0]) && !this.lt(c1[0], a1[0])){
            return a1[0] + this.add(a1[1], b1[1], c1[1]);
        }
        return this.add(a, b);
    },
    // TAIL (0: GET, 1: DEL, 2: REP)
    tail: function (a, b, mode = 0){
        // ZERO
        if (!a) return "";
        // LESS THAN CARD
        if (this.lt(a, b)) return mode === 0 ? a : mode === 1 ? "" : b;
        // EQUAL TO CARD
        if (!this.lt(b, a)) return mode === 0 ? "" : a;
        // ADDITION
        if (!this.single(a)){
            var a1 = this.asp(a);
            return (mode === 0 ? "" : a1[0]) + this.tail(a1[1], b, mode);
        }
        // NOT VEBLEN OR OMEGA OR IN DEL MODE
        if (!"vW".includes(a[1]) || mode === 1) return a;
        var a2 = this.vsp(a);
        // VEBLEN
        if (a[1] === "v"){
            if (mode === 0) return this.tail(a2[1 - this.lt(this.cof(a2[1]), "(v,(v,))")], b, mode);
            if (this.lt(this.cof(a2[1]), "(v,(v,))")){
                return `(v${this.tail(a2[0], b, mode)},${a2[1]})`;
            }
            return `(v${a2[0]},${this.tail(a2[1], b, mode)})`;
        }
        // OMEGA
        if (a[1] === "W"){
            if (mode === 0) return this.tail(a2[0], b, mode);
            return `(W${this.tail(a2[0], b, mode)})`;
        }
    },
    // TAILS
    tails: function (a, b){return [this.tail(a, b, 0), this.tail(a, b, 1), this.tail(a, b, 2)];},
    // OMEGA TAIL
    wtail: function (str){
        // CONSTANT
        if (["", "K"].includes(str)) return str;
        var str1, s0, s1;
        // ADDITION
        if (!this.single(str)){
            str1 = this.asp(str);
            s0 = this.wtail(str1[0]), s1 = this.wtail(str1[1]);
            return this.lt(s0, s1) ? s1 : s0;
        }
        // VEBLEN
        if (str[1] === "v"){
            str1 = this.vsp(str);
            s0 = this.wtail(str1[0]), s1 = this.wtail(str1[1]);
            return this.lt(s0, s1) ? s1 : s0;
        }
        // OMEGA
        if (str[1] === "W") return this.wtail(this.vsp(str)[0]);
        // ELSE
        return str;
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
        if (!target) return str[1] === "X" ? str : this.root(this.vsp(str)[0]);
        // HAS TARGET
        if (str[1] === "X") return "";
        var str1 = this.vsp(str)[0];
        if (str1 === target) return str;
        if (str1[1] === "X") return "";
        return this.root(str1, target);
    },
    // IS FIXED POINT
    isfp: function (a, b, c = null){
        var t = c === null ? this.tails(a, b) : this.tails(c, "K"), r, r1;
        if (!this.single(t[0])) return false;
        if (!this.isnormal(t[2])) return false;
        if (t[0][1] !== "R" && !(t[0][1] === "X" && b === "K")) return false;
        if (c === null && b !== "K"){
            if (this.lt(this.vsp(t[0])[2], t[2])) return false;
            if (this.lt(t[0], `(R${b},,${t[2]})`)) return false;
            return true;
        }
        r = this.root(t[0], c === null ? "" : b);
        r1 = this.vsp(r);
        if (b === "K"){
            if (this.lt(r1[0], t[2])) return false;
            if (this.lt(`(R${r},,${r1[0]}(v,))`, `(R(X${t[2]}),,${t[2]}(v,))`)) return false;
            return true;
        }
        if (!r) return false;
        if (this.lt(r1[2], a)) return false;
        if (this.lt(`(R${r1[0]},,${r1[2]})`, `(R${b},,${a})`)) return false;
        if (!this.lt(a, r1[2])){
            if (this.lt(r1[1], t[2])) return false;
            if (this.lt(r, `(R${b},${t[2]},${a})`)) return false;
        }
        return true;
    },
    // ---------------------------------------------------------------------------------------------
    // COFINALITY *
    // ---------------------------------------------------------------------------------------------
    // COFINALITY
    cof: function (str, cac = true){
        // CACHE
        if (cac){
            var key = `${this.name}-COF-${str}`;
            if (!(key in cache)) cache[key] = this.cof(str, false);
            return cache[key];
        }
        // CONSTANT
        if (["", "(v,)", "K"].includes(str)) return str;
        if ("AB".includes(str)) return "(v,(v,))";
        // REGULAR
        if (this.m(str)) return str;
        // ADDITION
        if (!this.single(str)) return this.cof(this.asp(str)[1]);
        // SINGLE
        var str1 = this.vsp(str), c = [];
        for (let i = 0; i < str1.length; i++) c.push(this.cof(str1[i]));
        // VEBLEN
        if (str[1] === "v"){
            if (!this.lt(c[1], "(v,(v,))")) return c[1];
            if (!this.lt(c[0], "(v,(v,))")) return c[0];
            return "(v,(v,))";
        }
        // OMEGA
        if (str[1] === "W") return c[0];
        // MAHLO
        if (str[1] === "X") return str;
        // COLLAPSE (R[ALPHA],[BETA],[GAMMA])
        return this.ccof(str1[2], str1[0], "");
    },
    // COLLAPSE COFINALITY
    ccof: function (a, b, c, cac = true){
        // CACHE
        if (cac){
            var key = `${this.name}-CCOF-${a}-${b}-${c}`;
            if (!(key in cache)) cache[key] = this.ccof(a, b, c, false);
            return cache[key];
        }
        // VARIABLES
        var l = this.least(b), b1 = this.vsp(b), m = this.m(b);
        var t = this.tails(a, b), ca = this.cof(a), ct = this.cof(t[1]);
        var tm = this.tails(m, "K"), cm = this.cof(m), ctm = this.cof(tm[1]);
        var nfp1 = m !== tm[1] && !this.lt(cm, "(v,(v,))") && !this.isfp(m, "K");
        var nfp2 = m !== tm[1] && !this.lt(cm, "(v,(v,))") && !this.isfp(b1[2], b1[0], m);
        var d1;
        // RIGHT IS LIM NOT FP
        if (a !== t[1] && !this.lt(ca, "(v,(v,))") && !this.isfp(a, b)) return ca;
        // INSIDE RIGHT IS LIM NOT FP AND A IS SUC AND C IS ZERO
        if (((b[1] === "X" && nfp1) || (b[1] === "R" && nfp2)) && ca === "(v,)" && !c) return cm;
        // RIGHT IS ZERO OR LEAST
        if (a === t[1] || !this.lt(l, a)){
            // LEFT IS LIM
            if (t[1] && this.lt(l, t[1]) && this.lt(ct, b)) return ca;
            // LEFT IS ZERO
            if (!t[1] || !this.lt(l, t[1])){
                // B IS MAHLO
                if (b[1] === "X" && nfp1){
                    d1 = `(X${this.add("(v,)", tm[1])})`;
                    return this.ccof(this.least(d1), d1, c);
                }
                // B IS COLLAPSE
                if (b[1] === "R" && (nfp2 || !tm[1])){
                    d1 = `(R${b1[0]},${this.fs(m)},${b1[2]})`;
                    if (!nfp2 && cm !== "(v,)") d1 = tm[0];
                    return this.ccof(b1[2], b1[0], c ? c : d1);
                }
                if ("XR".includes(b[1]) && tm[1] && this.lt(ctm, "K")) return ctm;
            }
            // LEFT COF IS B OR GREATER
            return "(v,(v,))";
        }
        // INSIDE RIGHT IS LIM NOT FP OR INSIDE LEFT IS ZERO AND INSIDE RIGHT IS SUC
        if (b[1] === "W" || (!tm[1] && cm === "(v,)") ||
           (b[1] === "X" && nfp1) || (b[1] === "R" && nfp2)){
            d1 = ca === "(v,)" ? `(R${b},${this.fs(m)},${this.fs(a)})` : t[0];
            return this.ccof(this.add(l, t[1], t[1]), b, d1);
        }
        // INSIDE LEFT IS ZERO AND INSIDE RIGHT IS LIM
        if (!tm[1]) return ca === "(v,)" ? cm : this.ccof(this.add(l, t[1], t[1]), b, t[0]);
        // INSIDE RIGHT IS ZERO OR SUC
        if (m === tm[1] || cm === "(v,)"){
            return this.lt(ctm, "K") ? ctm : ca === "(v,)" ? "(v,(v,))" : ca;
        }
        // INSIDE RIGHT IS LIM
        return ca === "(v,)" ? c ? this.lt(ctm, "K") ? ctm : "(v,(v,))" : cm : ca;
    },
    // TYPE (0: ZERO / 1: SUC / 2: COUNTABLE LIM / 3: UNCOUNTABLE LIM)
    type: function (str){
        if (!this.cof(str)) return 0;
        if (this.cof(str) === "(v,)") return 1;
        if (this.cof(str) === "(v,(v,))") return 2;
        return 3;
    },
    // COUNTABLE
    countable: function (str){return this.lt(str, "(W(v,))");},
    // ---------------------------------------------------------------------------------------------
    // FUNDAMENTAL SEQUENCE *
    // ---------------------------------------------------------------------------------------------
    fs: function (a, n = "", strong = false, cac = true){
        // CACHE
        if (cac){
            var key = `${this.name}-FS-${a}-${n}-${strong}`;
            if (!(key in cache)) cache[key] = this.fs(a, n, strong, false);
            return cache[key];
        }
        // ZERO
        if (!a) return "";
        // LIMIT
        if (a === "A"){
            if (!n) return "";
            if (!this.fs(n)) return "K";
            if (!this.fs(this.fs(n))) return "(vK,(v,))";
            return `(v${this.fs(a, this.fs(n))},)`;
        }
        // WEAKLY COMPACT
        if (a === "K"){
            if (!strong) return n;
            if (n === "A") return "(R(XA),,A(v,))";
            return `(X${this.add("(v,)", this.fs("A", n))})`;
        }
        // ADDITION
        if (!this.single(a)){
            var a1 = this.asp(a);
            return a1[0] + this.fs(a1[1], n, strong);
        }
        // SINGLE
        var a2 = this.vsp(a), c = [];
        for (let i = 0; i < a2.length; i++) c.push(this.cof(a2[i]));
        // VEBLEN
        if (a[1] === "v"){
            // BETA IS LIMIT
            if (!this.lt(c[1], "(v,(v,))")){
                return this.norm(`(v${a2[0]},${this.fs(a2[1], n, strong)})`);
            }
            // ALPHA IS ZERO
            if (!a2[0]){
                if (!a2[1]) return "";
                return n ? `${this.fs(a, this.fs(n))}${this.norm(`(v,${this.fs(a2[1])})`)}` : "";
            }
            // ALPHA IS SUC
            if (c[0] === "(v,)"){
                if (!n) return "";
                if (!a2[1]) return `(v${this.fs(a2[0])},${this.fs(a, this.fs(n))})`;
                if (!this.fs(n)) return this.norm(`(v${a2[0]},${this.fs(a2[1])})`);
                if (!this.fs(this.fs(n))){
                    if (a2[0] === "(v,)") return `(v,${this.fs(a, this.fs(n)).repeat(2)})`;
                    return `(v${this.fs(a2[0])},${this.fs(a, this.fs(n))}(v,))`;
                }
                return `(v${this.fs(a2[0])},${this.fs(a, this.fs(n))})`;
            }
            // BETA IS ZERO
            if (!a2[1]) return this.norm(`(v${this.fs(a2[0], n, strong)},)`);
            // BETA IS SUC
            return `(v${this.fs(a2[0], n, strong)},` +
                   this.norm(`(v${a2[0]},${this.fs(a2[1])})`) + "(v,))";
        }
        // OMEGA
        if (a[1] === "W"){
            if (this.lt(c[0], "(v,(v,))")){
                if (!strong) return n;
                if (n === "A") return `(R${a},,A)`;
                return `(R${a},,${this.fs("A", n)})`;
            }
            return this.norm(`(W${this.add("(v,)", this.fs(a2[0], n, strong))})`);
        }
        // MAHLO
        if (a[1] === "X"){
            if (!strong) return n;
            if (n === "A") return `(R${a},,A)`;
            return `(R${a},,${this.add(this.least(a), this.fs("A", n))})`;
        }
        // COLLAPSE
        if (a2[1]){
            if (!strong) return n;
            if (n === "A") return `(R${a},,A)`;
            return `(R${a},,${this.add(this.least(a), this.fs("A", n))})`;
        }
        // COLLAPSE SINGULAR
        return this.col(a2[2], a2[0], "", n, strong);
    },
    col: function (a, b, c, n, strong, cac = true){
        // CACHE
        if (cac){
            var key = `${this.name}-COL-${a}-${b}-${c}-${n}-${strong}`;
            if (!(key in cache)) cache[key] = this.col(a, b, c, n, strong, false);
            return cache[key];
        }
        // VARIABLES
        var l = this.least(b), la = this.add(l, a, a), b1 = this.vsp(b), m = this.m(b);
        var t = this.tails(a, b), ca = this.cof(a), ct = this.cof(t[1]);
        var tm = this.tails(m, "K"), cm = this.cof(m), ctm = this.cof(tm[1]);
        var nfp1 = m !== tm[1] && !this.lt(cm, "(v,(v,))") && !this.isfp(m, "K");
        var nfp2 = m !== tm[1] && !this.lt(cm, "(v,(v,))") && !this.isfp(b1[2], b1[0], m);
        var d1, d2, d3, t1, t2, t3;
        // RIGHT IS LIM NOT FP
        if (a !== t[1] && !this.lt(ca, "(v,(v,))") && !this.isfp(a, b)){
            return `(R${b},${c},${this.add(l, this.fs(a, n, strong), a)})`;
        }
        // INSIDE RIGHT IS LIM NOT FP AND A IS SUC AND C IS ZERO
        if (((b[1] === "X" && nfp1) || (b[1] === "R" && nfp2)) && ca === "(v,)" && !c){
            // A IS LEAST
            if (!this.lt(l, a)){
                // B IS MAHLO
                if (b[1] === "X") return `(X${this.add("(v,)", this.fs(m, n, strong), m)})`;
                // B IS COLLAPSE
                if (b[1] === "R") return `(R${b1[0]},${this.fs(m, n, strong)},${b1[2]})`;
            }
            // A IS NOT LEAST
            return `(R${b},${this.fs(m, n, strong)},${this.fs(a)})`;
        }
        // RIGHT IS ZERO OR LEAST AND LEFT IS LIM
        if ((a === t[1] || !this.lt(l, a)) && t[1] && this.lt(l, t[1]) && this.lt(ct, b)){
            // LEFT COLLAPSE
            if (t[0][1] === "R" && !c){
                t1 = this.fs(this.least(this.vsp(t[0])[0]));
                t2 = this.tails(t1, this.vsp(t[0])[0]);
                t3 = t1 === t2[0] && t1 === t2[1] ? "" : t2[0];
                d2 = this.add(l, this.add(this.fs(a), t3), a);
                d3 = this.add(l, this.fs(a, "(v,)"), a);
                if (!this.lt(`(R${b},,${d2})`, `(R${b},,${d3})`) && this.lt(d2, a)){
                    return `(R${b},,${this.add(l, this.add(this.fs(a, n, strong), t3), a)})`;
                }
            }
            // LEFT NOT COLLAPSE
            d1 = this.add(this.fs(a, n, strong), this.isfp(a, b) && !c ? t[0] : c);
            return `(R${b},,${this.add(l, d1, a)})`;
        }
        // RIGHT IS ZERO OR LEAST
        if (a === t[1] || !this.lt(l, a)){
            // LEFT IS ZERO
            if (!t[1] || !this.lt(l, t[1])){
                // B IS OMEGA
                if (b[1] === "W"){
                    if (!c && b1[0] !== "(v,)"){
                        d1 = this.norm(`(W${this.fs(b1[0])})`);
                        return this.col(l, "(W(v,))", d1, n, strong);
                    }
                    if (!n) return c;
                    d1 = this.col(la, b, c, this.fs(n), strong);
                    return `(v${d1},${this.isnormal(`(v${d1},)`) ? "" : "(v,)"})`;
                }
                // B IS MAHLO
                if (b[1] === "X"){
                    // INSIDE RIGHT IS LIM NOT FP
                    if (nfp1){
                        d1 = `(X${this.add("(v,)", tm[1])})`;
                        return this.col(this.least(d1), d1, c, n, strong);
                    }
                    // INSIDE LEFT IS ZERO
                    if (!tm[1]){
                        // INSIDE RIGHT IS SUC
                        if (cm === "(v,)"){
                            if (!c && b1[0] !== "(v,)"){
                                d1 = `(X${this.fs(m)})`;
                                return this.col("(v,)(v,)", "(X(v,))", d1, n, strong);
                            }
                            if (!n) return c;
                            d1 = this.col(la, b, c, this.fs(n), strong);
                            return `(W${d1}${this.isnormal(`(W${d1})`) ? "" : "(v,)"})`;
                        }
                        // INSIDE RIGHT IS LIM
                        return this.col("(v,)(v,)", "(X(v,))", c ? c : m, n, strong);
                    }
                }
                // B IS COLLAPSE
                if (b[1] === "R"){
                    // INSIDE RIGHT IS LIM NOT FP
                    if (nfp2) d1 = c ? c : `(R${b1[0]},${this.fs(m)},${b1[2]})`;
                    // INSIDE LEFT IS ZERO
                    if (!tm[1]){
                        d1 = c ? c : cm === "(v,)" ? `(R${b1[0]},${this.fs(m)},${b1[2]})` : tm[0];
                    }
                    if (nfp2 || !tm[1]) return this.col(b1[2], b1[0], d1, n, strong);
                }
                // INSIDE LEFT IS LIM
                if (this.lt(ctm, "K")){
                    d1 = this.fs(tm[1], n, strong);
                    d2 = b[1] === "X" ? this.isfp(m, "K") : this.isfp(b1[2], b1[0], m);
                    d3 = b[1] === "X" ? `(X${this.fs(m)})` : `(R${b1[0]},${this.fs(m)},${b1[2]})`;
                    if (m === tm[1]) d1 = this.add(d1, d2 && !c ? tm[0] : c);
                    else d1 = this.add(d1, c ? c : cm === "(v,)" ? d3 : tm[0]);
                // INSIDE LEFT IS COF K
                } else {
                    if (!n){
                        d1 = this.fs(m);
                        d1 = b[1] === "X" ? `(X${d1})` : `(R${b1[0]},${d1},${b1[2]})`;
                        return c ? c : m === tm[1] ? "" : cm === "(v,)" ? d1 : tm[0];
                    }
                    d1 = this.fs(tm[1], this.col(la, b, c, this.fs(n), strong));
                }
                if (b[1] === "X") return `(X${this.add("(v,)", d1)})`;
                if (b[1] === "R") return `(R${b1[0]},${d1},${b1[2]})`;
            }
            // LEFT COF IS B OR GREATER
            if (!n) return c;
            // LEFT COF IS B
            if (!this.lt(b, ct)) d1 = this.fs(a, this.col(la, b, c, this.fs(n), strong));
            // LEFT COF IS GREATER AND OMEGA OR NOT K
            else if (b[1] === "X" ? this.lt(ct, "K") : ct[1] === "W"){
                d1 = this.add(this.re(t[1], this.fs(n)), c);
            // LEFT COF IS GREATER AND NOT OMEGA OR K
            } else if (b[1] === "W") d1 = this.add(this.re(t[1], this.fs(n), this.wtail(b)), c);
            else {
                d1 = this.add(this.re(t[1], "", this.fs(l)), c);
                if (this.lt(d1, this.add(this.re(t[1], "(v,)", this.fs(l)), c))){
                    d1 = this.add(this.re(t[1], this.fs(n), this.fs(l)), c);
                } else d1 = this.add(this.re(t[1], n, this.fs(l)), c);
            }
            return `(R${b},,${this.add(l, d1, a)})`;
        }
        // B IS OMEGA OR NOT FIXED POINT
        if (b[1] === "W" || (b[1] === "X" && nfp1) || (b[1] === "R" && nfp2)){
            d1 = ca === "(v,)" ? `(R${b},${this.fs(m)},${this.fs(a)})` : t[0];
            return this.col(this.add(l, t[1], t[1]), b, d1, n, strong);
        }
        // INSIDE LEFT IS ZERO
        if (!tm[1]){
            if (cm !== "(v,)" && ca === "(v,)"){
                return `(R${b},${this.fs(m, n, strong)},${this.fs(a)})`;
            }
            d1 = `(R${b},${this.fs(m)},${this.fs(a)})`;
            if (cm !== "(v,)" || ca !== "(v,)") d1 = t[0];
            return this.col(this.add(l, t[1], t[1]), b, d1, n, strong);
        }
        // INSIDE LEFT IS LIM
        if (this.lt(ctm, "K")){
            if (m === tm[1] || cm === "(v,)"){
                if (ca === "(v,)"){
                    d1 = this.fs(tm[1], n, strong);
                    if (m === tm[1]) d1 = this.add(d1, c);
                    else d1 = this.add(d1, c ? c : `(R${b},${this.fs(m)},${this.fs(a)})`);
                    return `(R${b},${d1},${this.fs(a)})`;
                }
                return `(R${b},${this.add(this.fs(tm[1], n, strong), c ? c : t[0])},${l})`;
            }
            if (ca === "(v,)"){
                if (c) d1 = this.add(this.fs(tm[1], n, strong), c);
                else d1 = this.fs(m, n, strong);
                return `(R${b},${d1},${this.fs(a)})`;
            }
            return `(R${b},${c ? c : t[0]},${this.add(l, this.fs(a, n, strong), a)})`;
        }
        // INSIDE LEFT IS COF K
        if (!this.lt(ctm, "K")){
            if (ca === "(v,)"){
                if (m === tm[1] || cm === "(v,)"){
                    if (!n) return c ? c : m === tm[1] ? "" : `(R${b},${this.fs(m)},${this.fs(a)})`;
                    d1 = this.fs(tm[1], this.col(la, b, c, this.fs(n), strong));
                } else if (c){
                    if (!n) return c;
                    d1 = this.fs(tm[1], this.col(la, b, c, this.fs(n), strong));
                } else d1 = this.fs(m, n, strong);
                return `(R${b},${d1},${this.fs(a)})`;
            }
            d1 = c ? c : t[0];
            if (m === tm[1] || cm === "(v,)") d1 = this.fs(tm[1], d1);
            return `(R${b},${d1},${this.add(l, this.fs(a, n, strong), a)})`;
        }
    },
    re: function (a, n, base = ""){
        var c = this.cof(a), t = this.tails(base, c);
        if (!n) return this.fs(a, base === t[0] && base === t[1] ? "" : t[0]);
        var p = this.re(a, this.fs(n), base), l = c === "K" ? "(v,)" : this.least(c);
        return this.fs(a, c === "K" ? `(X${this.add(l, p, p)})` : `(R${c},,${this.add(l, p, p)})`);
    },
    // ---------------------------------------------------------------------------------------------
    // MATH FORM
    // ---------------------------------------------------------------------------------------------
    math: function (str){
        // ZERO
        if (!str) return ["0"];
        // MAHLO
        if (str === "K") return ["K"];
        // LIMIT
        if (str === "A") return [["G", ["K", "+", "1"]]];
        // ADDITION
        if (!this.single(str)){
            var str1 = this.asp(str);
            return [].concat(this.math(str1[0]), ["+"], this.math(str1[1]));
        }
        // SINGLE
        var str2 = this.vsp(str), result = [str[1]];
        for (let i = 0; i < str2.length; i++) result.push(this.math(str2[i]));
        return [result];
    },
};
// =================================================================================================
// GROWING HIERARCHIES
// =================================================================================================
// FAST-GROWING HIERARCHY
function fgh(rule, a, n, t = 1){
    if (t === 0) return n;
    if (t > 1) return fgh(rule, a, fgh(rule, a, n), t - 1);
    if (!a) return n + 1;
    if (rule.type(a) === 1) return fgh(rule, rule.fs(a), n, n);
    return fgh(rule, rule.fs(a, rule.to_str(n)), n);
}
// SLOW-GROWING HIERARCHY
function sgh(rule, a, n, t = 1){
    if (t === 0) return n;
    if (t > 1) return sgh(rule, a, sgh(rule, a, n), t - 1);
    if (!a) return 0;
    if (rule.type(a) === 1) return sgh(rule, rule.fs(a), n) + 1;
    return sgh(rule, rule.fs(a, rule.to_str(n)), n);
}
// =================================================================================================
// SIMPLIFICATION
// =================================================================================================
// CONVERT A FORMULA TO A STRING
function st(math){return JSON.stringify(math);}
// CHECK IF TWO FORMULAE ARE EQUAL
function feq(a, b){return st(a) === st(b);}
// CLONE A FORMULA
function clone(math){
    if (typeof math !== "object") return math;
    var result, k;
    if (Array.isArray(math)){
        result = [];
        for (let i = 0; i < math.length; i++) result.push(clone(math[i]));
    } else {
        result = {};
        k = Object.keys(math);
        for (let i = 0; i < k.length; i++) result[k[i]] = clone(math[k[i]]);
    }
    return result;
}
// COMPARE BUCHHOLZ FUNCTION
function combuch(a, b){
    // ZERO CASE / OTHER
    if (feq(b, ["0"])) return false;
    if (!feq(a, ["0"])){
        if (typeof a[0] !== "object") return false;
        if (!"bB".includes(a[0][0])) return false;
    }
    if (typeof b[0] !== "object") return true;
    if (!"bB".includes(b[0][0])) return true;
    if (feq(a, ["0"])) return true;
    // ADDITION
    if (a.length > 1 && b.length > 1) return combuch([a[0]], [b[0]]) ||
       (!combuch([b[0]], [a[0]]) && combuch(a.slice(2), b.slice(2)));
    if (a.length > 1 && b.length === 1) return combuch([a[0]], b);
    if (a.length === 1 && b.length > 1) return !combuch([b[0]], a);
    // SINGLE
    return combuch(a[0][1], b[0][1]) || (!combuch(b[0][1], a[0][1]) && combuch(a[0][2], b[0][2]));
}
// REWRITE BUCHHOLZ FUNCTION
function rebuch(math, level = 2){
    // DO NOTHING IF LEVEL IS 0
    if (!level) return math;
    // ZERO CASE
    if (feq(math, ["0"])) return math;
    // LOOP
    var result = [], item, index;
    for (let i = 0; i < math.length; i++){
        // KEEP SIMPLE TERMS
        if (typeof math[i] !== "object"){
            result.push(math[i]);
            continue;
        }
        // KEEP NON-BUCHHOLZ TERMS
        if (!"bB".includes(math[i][0])){
            item = clone(math[i]);
            for (let j = 1; j < item.length; j++) item[j] = rebuch(item[j], level);
            result.push(item);
            continue;
        }
        if (level < 2){
            if (level > 0 && feq(math[i][1], ["0"]) && feq(math[i][2], ["0"])){
                result.push(["v", ["0"], ["0"]]);
                continue;
            }
            item = clone(math[i]);
            for (let j = 1; j < item.length; j++) item[j] = rebuch(item[j], level);
            result.push(item);
            continue;
        }
        // IF BETA-TERM IS ZERO
        if (feq(math[i][2], ["0"])){
            if (feq(math[i][1], ["0"])) result.push(["v", ["0"], ["0"]]);
            else result.push(["W", rebuch(math[i][1], level)]);
            continue;
        }
        // SCAN BUCHHOLZ TERMS
        index = null;
        for (let j = 0; j < math[i][2].length; j += 2) if (combuch([math[i][2][j]], [math[i]])){
            index = j;
            break;
        }
        // PROCESS BUCHHOLZ TERMS
        item = [clone(math[i])];
        if (index === 0){
            item = item.concat(["+"], math[i][2]);
            item[0][2] = ["0"];
        } else if (index !== null){
            item = item.concat(math[i][2].slice(index - 1));
            item[0][2] = item[0][2].slice(0, index - 1);
        }
        if (feq(item[0], ["b", ["0"], ["0"]]) || feq(item[0], ["B", ["0"], ["0"]])){
            item = item.slice(2);
            result.push([0, ["\\omega"], rebuch(item, level)]);
        } else if (item.length === 1){
            for (let j = 1; j < item[0].length; j++) item[0][j] = rebuch(item[0][j], level);
            result.push(item[0]);
        } else result.push([0, ["\\omega"], rebuch(item, level)]);
    }
    return result;
}
// REWRITE χ_α(β)
function rechi(math, level = 2){
    // DO NOTHING IF LEVEL IS 0
    if (!level) return math;
    // ZERO CASE
    if (feq(math, ["0"])) return math;
    // LOOP
    var result = [], item;
    for (let i = 0; i < math.length; i++){
        // KEEP SIMPLE TERMS
        if (typeof math[i] !== "object"){
            result.push(math[i]);
            continue;
        }
        // KEEP NON-CHI TERMS
        if (math[i][0] != "x"){
            item = clone(math[i]);
            for (let j = 1; j < item.length; j++) item[j] = rechi(item[j], level);
            result.push(item);
            continue;
        }
        // REWRITE χ_0(α) AS Ω_α
        if (level > 0 && feq(math[i][1], ["0"])){
            if (feq(math[i][2], ["0"])){
                result.push(["W", [["v", ["0"], ["0"]]]]);
                continue;
            }
            if (feq(math[i][2][0], ["v", ["0"], ["0"]])){
                result.push(["W", [["v", ["0"], ["0"]], "+"].concat(math[i][2])]);
                continue;
            }
            result.push(["W", rechi(math[i][2], level)]);
        // REWRITE χ_1(α) AS I_α
        } else if (level > 1 && feq(math[i][1], [["v", ["0"], ["0"]]])){
            if (feq(math[i][2], ["0"])){
                result.push(["I", [["v", ["0"], ["0"]]]]);
                continue;
            }
            if (feq(math[i][2][0], ["v", ["0"], ["0"]])){
                result.push(["I", [["v", ["0"], ["0"]], "+"].concat(math[i][2])]);
                continue;
            }
            result.push(["I", rechi(math[i][2], level)]);
        // χ_2+(α) REMAINS THE SAME
        } else result.push([math[i][0], rechi(math[i][1], level), rechi(math[i][2], level)]);
    }
    return result;
}
// HAS K
function hask(math){
    // LOOP
    for (let i = 0; i < math.length; i++){
        // CHECK SIMPLE TERMS
        if (typeof math[i] !== "object") if (math[i] === "K") return true;
        // CHECK COMPLEX TERMS
        for (let j = 1; j < math[i].length; j++) if (hask(math[i][j])) return true;
    }
    return false;
}
// REWRITE Ξ(α)
function rexi(math, level = 4){
    // DO NOTHING IF LEVEL IS 0
    if (!level) return math;
    // ZERO CASE
    if (feq(math, ["0"])) return math;
    // LOOP
    var result = [], item;
    for (let i = 0; i < math.length; i++){
        // KEEP SIMPLE TERMS
        if (typeof math[i] !== "object"){
            result.push(math[i]);
            continue;
        }
        // KEEP NON-XI TERMS
        if (math[i][0] != "X"){
            item = clone(math[i]);
            for (let j = 1; j < item.length; j++) item[j] = rexi(item[j], level);
            result.push(item);
            continue;
        }
        // REWRITE Ξ(1) AS I
        if (level > 1 && feq(math[i][1], [["v", ["0"], ["0"]]])) result.push("I");
        // REWRITE Ξ(2) AS M
        else if (level > 2 && feq(math[i][1], [["v", ["0"], ["0"]], "+", ["v", ["0"], ["0"]]])){
            result.push("M");
        // REWRITE Ξ(3) AS N
        } else if (level > 3 && feq(math[i][1],
                   [["v", ["0"], ["0"]], "+", ["v", ["0"], ["0"]], "+", ["v", ["0"], ["0"]]])){
            result.push("N");
        // REWRITE Ξ(α) AS Ξ_α UNLESS α IS FIXED POINT
        } else if (level > 0 && !hask(math[i][1])) result.push(["X_", rexi(math[i][1], level)]);
        // ELSE REMAINS THE SAME
        else result.push([math[i][0], rexi(math[i][1], level)]);
    }
    return result;
}
// REWRITE UNCOUNTABLE
function reunc(math){
    // ZERO CASE
    if (feq(math, ["0"])) return math;
    // LOOP
    var result = [], item;
    for (let i = 0; i < math.length; i++){
        // KEEP SIMPLE TERMS
        if (typeof math[i] !== "object"){
            result.push(math[i]);
            continue;
        }
        // KEEP OTHER TERMS
        if (!["W", "I", "X_"].includes(math[i][0])){
            item = clone(math[i]);
            for (let j = 1; j < item.length; j++) item[j] = reunc(item[j]);
            result.push(item);
            continue;
        }
        // REWRITE Ω_1 AS Ω
        if (feq(math[i], ["W", [["v", ["0"], ["0"]]]])) result.push("\\Omega");
        // REWRITE I_1 AS I
        else if (feq(math[i], ["I", [["v", ["0"], ["0"]]]])) result.push("I");
        // REWRITE Ξ_1 AS Ξ
        else if (feq(math[i], ["X_", [["v", ["0"], ["0"]]]])) result.push("\\Xi");
        // KEEP ELSE
        else result.push([math[i][0], reunc(math[i][1])]);
    }
    return result;
}
// REWRITE VEBLEN FUNCTION
function reveb(math, level1 = 5, level2 = 4){
    // DO NOTHING IF LEVEL IS 0
    if (!level1 && !level2) return math;
    // ZERO CASE
    if (feq(math, ["0"])) return math;
    // LOOP
    var result = [], item;
    for (let i = 0; i < math.length; i++){
        // KEEP SIMPLE TERMS
        if (typeof math[i] !== "object"){
            result.push(math[i]);
            continue;
        }
        // KEEP NON-VEBLEN TERMS
        if (!"vV".includes(math[i][0])){
            item = clone(math[i]);
            for (let j = 1; j < item.length; j++) item[j] = reveb(item[j], level1, level2);
            result.push(item);
            continue;
        }
        // REWRITE φ_0(0) AS 1
        if (level1 > 0 && math[i][0] === "v" && feq(math[i], ["v", ["0"], ["0"]])){
            result.push([0, ["\\omega"], ["0"]]);
        // REWRITE φ_0(α) AS ω^α
        } else if (level1 > 1 && math[i][0] === "v" && feq(math[i][1], ["0"])){
            result.push([0, ["\\omega"], reveb(math[i][2], level1, level2)]);
        // REWRITE φ_1(α) AS ε_α
        } else if (level1 > 2 && math[i][0] === "v" && feq(math[i][1], [["v", ["0"], ["0"]]])){
            result.push(["e", reveb(math[i][2], level1, level2)]);
        // REWRITE φ_2(α) AS ζ_α
        } else if (level1 > 3 && math[i][0] === "v" && feq(math[i][1],
                   [["v", ["0"], ["0"]], "+", ["v", ["0"], ["0"]]])){
            result.push(["z", reveb(math[i][2], level1, level2)]);
        // REWRITE φ_3(α) AS η_α
        } else if (level1 > 4 && math[i][0] === "v" && feq(math[i][1],
                   [["v", ["0"], ["0"]], "+", ["v", ["0"], ["0"]], "+", ["v", ["0"], ["0"]]])){
            result.push(["h", reveb(math[i][2], level1, level2)]);
        // REWRITE Φ_0(α) AS Ω_α
        } else if (level2 > 0 && math[i][0] === "V" && feq(math[i][1], ["0"])){
            result.push(["W", reveb(math[i][2], level1, level2)]);
        // REWRITE Φ_1(α) AS E_α
        } else if (level2 > 1 && math[i][0] === "V" && feq(math[i][1], [["v", ["0"], ["0"]]])){
            result.push(["E", reveb(math[i][2], level1, level2)]);
        // REWRITE Φ_2(α) AS Z_α
        } else if (level2 > 2 && math[i][0] === "V" && feq(math[i][1],
                   [["v", ["0"], ["0"]], "+", ["v", ["0"], ["0"]]])){
            result.push(["Z", reveb(math[i][2], level1, level2)]);
        // REWRITE Φ_3(α) AS H_α
        } else if (level2 > 3 && math[i][0] === "V" && feq(math[i][1],
                   [["v", ["0"], ["0"]], "+", ["v", ["0"], ["0"]], "+", ["v", ["0"], ["0"]]])){
            result.push(["H", reveb(math[i][2], level1, level2)]);
        // φ_4+(α) OR Φ_4+(α) REMAINS THE SAME
        } else result.push([math[i][0], reveb(math[i][1], level1, level2),
                                        reveb(math[i][2], level1, level2)]);
    }
    return result;
}
// EXPONENTIAL SIMPLIFICATION
function spexp(math){
    // ZERO CASE
    if (feq(math, ["0"])) return math;
    // LOOP
    var result = [], a, math2, add, mult, depth;
    for (let i = 0; i < math.length; i++){
        // KEEP THE NON-ARRAYS
        if (typeof math[i] !== "object"){
            result.push(math[i]);
            continue;
        }
        // KEEP THE NON-ω-EXPONENTS
        if (typeof math[i] === "object" ? (math[i][0] !== 0 || math[i][1][0] !== "\\omega") :
            (math[i] === "\\omega")){
            a = clone(math[i]);
            if (!a[0]) a[2] = spexp(a[2]);
            else for (let j = 1; j < a.length; j++) a[j] = spexp(a[j]);
            result.push(a);
            continue;
        }
        // PROCESS ω-EXPONENTS
        math2 = spexp(clone(math[i][2])), add = [], mult = null, depth = 0;
        // REWRITE ω^0 AS 1
        if (feq(math2, ["0"])){
            result.push("1");
            continue;
        }
        // REWRITE ω^1 AS ω
        if (feq(math2, ["1"])){
            result.push("\\omega");
            continue;
        }
        // PROCESS EXPONENTS
        math2.push("+");
        for (let j = 0; j < math2.length; j++){
            // WHEN HITTING 1 OR ω
            if ((typeof math2[j] === "object" ?
                (math2[j][0] === 0 && math2[j][1][0] === "\\omega") :
                ["1", "\\omega"].includes(math2[j])) && !add.length){
                // IF EVERYTHING AFTER IS A SINGLE 1
                if (feq(math2.slice(j, -1), ["1"])){
                    result = result.concat(["\\omega", "*"]);
                    break;
                }
                // ELSE
                result = result.concat([[0, ["\\omega"], math2.slice(j, -1)], "*"]);
                break;
            }
            // WHEN HITTING THE + OR * SIGN
            if ("+*".includes(math2[j])){
                if (typeof mult === "object"){
                    for (let k = 1; k < mult.length; k++) mult[k] = spexp(mult[k]);
                    add.push(clone(mult));
                } else add.push(mult);
                mult = null;
                // PASS FOR * SIGN
                if (math2[j] === "*") continue;
                // PROCESS EXPONENT
                if (!add[0][0]){
                    if (add.length > 1){
                        a = [0, add[0][1], []];
                        for (let k = 0; k < add.length; k++) a[2] = a[2].concat([add[k], "*"]);
                        a[2] = a[2].slice(0, -1);
                        result = result.concat([a, "*"]);
                    } else result = result.concat([[0, add[0][1], add], "*"]);
                // PROCESS NON-EXPONENT
                } else if (add.length > 1){
                    a = [0, [add[0]], []];
                    for (let k = 1; k < add.length; k++) a[2] = a[2].concat([add[k], "*"]);
                    a[2] = a[2].slice(0, -1);
                    result = result.concat([a, "*"]);
                } else result = result.concat(add, ["*"]);
                add = [];
                continue;
            }
            mult = math2[j];
        }
        result = result.slice(0, -1);
    }
    return result;
}
// MULTIPLICATIVE SIMPLIFICATION
function spmult(math){
    // ZERO CASE
    if (feq(math, ["0"])) return math;
    // LOOP
    var math2 = math.concat(["+"]), result = [], a, b, base = [], exp = [], item = null;
    for (let i = 0; i < math2.length; i++){
        // WHEN NOT HITTING + OR * OUTSIDE THE BRACKETS
        if (!"+*".includes(math2[i])){
            item = clone(math2[i]);
            continue;
        }
        // IF BASE NOT DETERMINED
        if (!base.length){
            // SIMPLE SYMBOL
            if (typeof item !== "object"){
                base = item;
                exp = ["1"];
            // EXPONENT
            } else if (!item[0]){
                base = spmult(item[1])[0];
                exp = spmult(item[2]);
            // ELSE
            } else {
                for (let j = 1; j < item.length; j++) item[j] = spmult(item[j]);
                base = clone(item);
                exp = ["1"];
            }
        // IF BASE DETERMINED
        } else {
            a = [], b = [];
            // SIMPLE SYMBOL
            if (typeof item !== "object"){
                a = item;
                b = ["1"];
            // EXPONENT
            } else if (!item[0]){
                a = spmult(item[1])[0];
                b = spmult(item[2]);
            // ELSE
            } else {
                for (let j = 1; j < item.length; j++) item[j] = spmult(item[j]);
                a = clone(item);
                b = ["1"];
            }
            // IF BASE EQUAL
            if (feq(base, a)){
                if (feq(exp, ["1"]) && !feq(b, ["1"])) exp = clone(b);
                else exp = exp.concat(["+"], b);
            // IF BASE NOT EQUAL
            } else {
                if (feq(exp, ["1"])) result.push(base);
                else result.push([0, [base], exp]);
                result.push("*");
                base = a;
                exp = b;
            }
        }
        item = null;
        // PASS FOR * SIGN
        if (math2[i] === "*") continue;
        // OUTPUT LAST VALUE
        if (feq(exp, ["1"])) result.push(base);
        else result.push([0, [base], exp]);
        result.push("+");
        base = [], exp = [];
    }
    return result.slice(0, -1);
}
// ADDITIVE SIMPLIFICATION
function spadd(math){
    // ZERO CASE
    if (feq(math, ["0"])) return math;
    // LOOP
    var math2 = math.concat(["+"]), result = [], base = [], add = [], n = 0, item = null;
    for (let i = 0; i < math2.length; i++){
        // WHEN NOT HITTING + OR * OUTSIDE THE BRACKETS
        if (!"+*".includes(math2[i])){
            item = clone(math2[i]);
            continue;
        }
        // SIMPLIFY COMPLEX SYMBOLS
        if (typeof item === "object"){
            for (let j = 1; j < item.length; j++) item[j] = spadd(item[j]);
        }
        // ADD ITEM
        add = add.concat([item, "*"]);
        item = null;
        // PASS FOR * SIGN
        if (math2[i] === "*") continue;
        // IF BASE NOT DETERMINED
        if (!base.length){
            base = clone(add);
            n = 1;
        // IF BASE DETERMINED
        } else {
            // IF BASE EQUAL
            if (feq(base, add)) n++;
            // IF BASE NOT EQUAL
            else {
                // IF BASE EQUAL 1
                if (feq(base, ["1", "*"])) result = result.concat([n.toString(), "+"]);
                // IF SINGULAR
                else if (n === 1) result = result.concat(base.slice(0, -1), ["+"]);
                // IF PLURAL
                else result = result.concat(base, [n.toString(), "+"]);
                base = add;
                n = 1;
            }
        }
        add = [];
    }
    // FINAL ADDITION
    // IF BASE EQUAL 1
    if (feq(base, ["1", "*"])) result = result.concat([n.toString(), "+"]);
    // IF SINGULAR
    else if (n === 1) result = result.concat(base.slice(0, -1), ["+"]);
    // IF PLURAL
    else result = result.concat(base, [n.toString(), "+"]);
    return result.slice(0, -1);
}
// REMOVE REMOVABLE * SIGN
function remult(math){
    // ZERO CASE
    if (feq(math, ["0"])) return math;
    // LOOP
    var result = [], a;
    for (let i = 0; i < math.length; i++){
        // KEEP ALL NON-* SYMBOLS
        if (math[i] !== "*"){
            // KEEP SIMPLE SYMBOLS
            if (typeof math[i] !== "object"){
                result.push(math[i]);
                continue;
            }
            // SIMPLIFY COMPLEX SYMBOLS
            a = clone(math[i]);
            for (let j = 1; j < a.length; j++) a[j] = remult(a[j]);
            result.push(a);
            continue;
        }
        // CHECK LEFT
        if (typeof math[i - 1] === "object"){
            if ("vVbBrRxX".includes(math[i - 1][0])){
                result.push("*");
                continue;
            }
            if ("012".includes(math[i - 1][0]) && "vVbBrRxX".includes(math[i - 1][1][0][0])){
                result.push("*");
                continue;
            }
        }
        // CHECK RIGHT
        if (typeof math[i + 1] === "object"){
            if ("vVbBrRxX".includes(math[i + 1][0])){
                result.push("*");
                continue;
            }
            if ("012".includes(math[i + 1][0]) && "vVbBrRxX".includes(math[i + 1][1][0][0])){
                result.push("*");
                continue;
            }
        }
    }
    return result;
}
// ORIGINAL FUNCTION
function orifunc(math){
    // ZERO CASE
    if (feq(math, ["0"])) return math;
    // LOOP
    var result = clone(math);
    for (let i = 0; i < result.length; i++){
        if (typeof result[i] !== "object") continue;
        if ("Br".includes(result[i][0])) result[i][0] = "b";
        for (let j = 1; j < result[i].length; j++) result[i][j] = orifunc(result[i][j]);
    }
    return result;
}
// REWEITE FUNCTION
function refunc(math){
    // ZERO CASE
    if (feq(math, ["0"])) return math;
    // LOOP
    var result = [];
    for (let i = 0; i < math.length; i++){
        // KEEP THE NON-ARRAYS
        if (typeof math[i] !== "object"){
            result.push(math[i]);
            continue;
        }
        // REWEITE FUNCTION
        if (math[i][0] === 0) result.push([0, refunc(math[i][1]), refunc(math[i][2])]);
        else if (math[i][0] === 1) result.push([1, refunc(math[i][1]), refunc(math[i][2])]);
        else if (math[i][0] === 2){
            result.push([2, refunc(math[i][1]), refunc(math[i][2]), refunc(math[i][3])]);
        } else if (math[i][0] === "W") result.push([1, ["\\Omega"], refunc(math[i][1])]);
        else if (math[i][0] === "e") result.push([1, ["\\varepsilon"], refunc(math[i][1])]);
        else if (math[i][0] === "E") result.push([1, ["E"], refunc(math[i][1])]);
        else if (math[i][0] === "z") result.push([1, ["\\zeta"], refunc(math[i][1])]);
        else if (math[i][0] === "Z") result.push([1, ["Z"], refunc(math[i][1])]);
        else if (math[i][0] === "h") result.push([1, ["\\eta"], refunc(math[i][1])]);
        else if (math[i][0] === "H") result.push([1, ["H"], refunc(math[i][1])]);
        else if (math[i][0] === "G") result.push([1, ["\\Gamma"], refunc(math[i][1])]);
        else if (math[i][0] === "I") result.push([1, ["I"], refunc(math[i][1])]);
        else if (math[i][0] === "v"){
            result.push([1, ["\\varphi"], refunc(math[i][1])]);
            result = result.concat(["("], refunc(math[i][2]), [")"]);
        } else if (math[i][0] === "V"){
            result.push([1, ["\\Phi"], refunc(math[i][1])]);
            result = result.concat(["("], refunc(math[i][2]), [")"]);
        } else if (math[i][0] === "b"){
            result.push([1, ["\\psi"], refunc(math[i][1])]);
            result = result.concat(["("], refunc(math[i][2]), [")"]);
        } else if (math[i][0] === "B"){
            result.push([2, ["\\psi"], refunc(math[i][1]), ["*"]]);
            result = result.concat(["("], refunc(math[i][2]), [")"]);
        } else if (math[i][0] === "r"){
            result.push([1, ["\\rho"], refunc(math[i][1])]);
            result = result.concat(["("], refunc(math[i][2]), [")"]);
        } else if (math[i][0] === "R"){
            result.push([2, ["\\Psi"], refunc(math[i][1]), refunc(math[i][2])]);
            result = result.concat(["("], refunc(math[i][3]), [")"]);
        } else if (math[i][0] === "x"){
            result.push([1, ["\\chi"], refunc(math[i][1])]);
            result = result.concat(["("], refunc(math[i][2]), [")"]);
        } else if (math[i][0] === "X"){
            result = result.concat(["\\Xi", "("], refunc(math[i][1]), [")"]);
        } else if (math[i][0] === "X_"){
            result.push([1, ["\\Xi"], refunc(math[i][1])]);
        }
    }
    return result;
}
// TOTAL SIMPLIFICATION
function simplify(math, options){
    var result = clone(math);
    result = rebuch(result, options.rebuch);
    result = rechi(result, options.rechi);
    result = rexi(result, options.rexi);
    result = reunc(result);
    result = reveb(result, Math.max(options.reveb1, options.force_omega),
                   options.reveb2 + !!options.reveb2);
    if (options.simplify > 0) result = spexp(result);
    if (options.simplify > 1) result = spmult(result);
    if (options.simplify > 2) result = spadd(result);
    result = remult(result);
    if (!options.specify) result = orifunc(result);
    result = refunc(result);
    return result;
}
// =================================================================================================
// NOTATION
// =================================================================================================
// REPLACE MATHJAX SYMBOLS WITH TEXTS
function replace(math){
    const rep = [
        ["\\varepsilon", "ε"],
        ["\\zeta", "ζ"],
        ["\\eta", "η"],
        ["\\rho", "ρ"],
        ["\\varphi", "φ"],
        ["\\chi", "χ"],
        ["\\psi", "ψ"],
        ["\\omega", "ω"],
        ["\\Gamma", "Γ"],
        ["\\Xi", "Ξ"],
        ["\\Phi", "Φ"],
        ["\\Psi", "Ψ"],
        ["\\Omega", "Ω"],
    ];
    var result = clone(math);
    for (let i = 0; i < rep.length; i++) result = result.split(rep[i][0]).join(rep[i][1]);
    return result;
}
// HTML NOTATION
function html(math, rep = true){
    var text = "";
    for (let i = 0; i < math.length; i++){
        if (typeof math[i] === "object"){
            if (math[i][0] === 0){
                text += html(math[i][1], false);
                text += `<sup>${html(math[i][2], false)}</sup>`;
            } else if (math[i][0] === 1){
                text += html(math[i][1], false);
                text += `<sub>${html(math[i][2], false)}</sub>`;
            } else if (math[i][0] === 2){
                text += html(math[i][1], false);
                text += `<sub>${html(math[i][2], false)}</sub>`;
                text += `<sup>${html(math[i][3], false)}</sup>`;
            } else {
                text += math[i][0] + "(";
                for (let j = 1; j < math[i].length; j++) text += html(math[i][j], false) + ",";
                text = text.slice(0, -1) + ")";
            }
        } else text += math[i];
    }
    if (rep) return replace(text);
    return text;
}
// MATHJAX NOTATION
function mathjax(math, bracket = true){
    var text = "";
    for (let i = 0; i < math.length; i++){
        if (typeof math[i] === "object"){
            if (math[i][0] === 0){
                text += `{${mathjax(math[i][1], false)}}^`;
                text += `{${mathjax(math[i][2], false)}}`;
            } else if (math[i][0] === 1){
                text += `{${mathjax(math[i][1], false)}}_`;
                text += `{${mathjax(math[i][2], false)}}`;
            } else if (math[i][0] === 2){
                text += `{${mathjax(math[i][1], false)}}_`;
                text += `{${mathjax(math[i][2], false)}}^`;
                text += `{${mathjax(math[i][3], false)}}`;
            } else {
                text += math[i][0] + "(";
                for (let j = 1; j < math[i].length; j++) text += mathjax(math[i][j], false) + ",";
                text = text.slice(0, -1) + ")";
            }
        } else text += math[i];
    }
    if (bracket) return `\\( ${text} \\)`;
    return text;
}
// DISPLAY ORDINAL
function display(str, rule, mode, options){
    if (mode === 0) return str;
    if (mode === 1) return html(simplify(rule.math(str), options));
    if (mode === 2) return mathjax(simplify(rule.math(str), options));
}
// =================================================================================================
// CHAINS
// =================================================================================================
// CHECK IF AN ARRAY IS IN ANOTHER ARRAY
function array_include(arrs, arr){
    for (let i = 0; i < arrs.length; i++){
        if (JSON.stringify(arrs[i]) === JSON.stringify(arr)) return true;
    }
    return false;
}
// CHAIN LESS THAN
function chain_lt(a, b){
    if (!a.length) return false;
    if (!b.length) return true;
    if (a[0] !== b[0]) return a[0] < b[0];
    return chain_lt(a.slice(1), b.slice(1));
}
// CHAIN COMPARISON
function chain_comp(a, b){
    if (chain_lt(a, b)) return -1;
    if (chain_lt(b, a)) return 1;
    return 0;
}
// REDUCE CHAIN
function chain_reduce(chain){
    if (chain.length < 2) return [];
    var result = chain.slice(0, -1);
    for (let i = chain.length - 2; i >= 0; i--){
        if (chain[i]){
            result[i]--;
            break;
        } else result.pop();
    }
    return result;
}
// EXPAND CHAIN LIST
function list_expand(list, chain){
    if (!array_include(list, chain)) return list;
    var result = JSON.parse(JSON.stringify(list));
    for (let i = 0;; i++){
        if (!array_include(list, chain.concat([i]))){
            result.push(chain.concat([i]));
            result.sort(chain_comp);
            return result;
        }
    }
}
// REMOVE CHAIN LIST
function list_remove(list, chain){
    var result = [];
    for (let i = 0; i < list.length; i++){
        if (JSON.stringify(list[i].slice(0, chain.length)) !== JSON.stringify(chain)){
            result.push(list[i]);
        }
    }
    return result;
}
// COLLAPSE CHAIN LIST
function list_collapse(list, chain){
    var max = null;
    for (let i = 0; i < list.length; i++){
        if (JSON.stringify(list[i].slice(0, chain.length)) === JSON.stringify(chain) &&
            list[i].length - chain.length === 1){
            if (max === null) max = list[i][list[i].length - 1];
            else if (max < list[i][list[i].length - 1]) max = list[i][list[i].length - 1];
        }
    }
    if (max === null) return list;
    return list_remove(list, chain.concat([max]));
}
// =================================================================================================
// EXPANSIONS
// =================================================================================================
// LOWER BOUNDED FS
function lowfs(rule, a, n, low = null){
    if (low === null) return rule.fs(a, rule.to_str(n), true);
    var more = 0;
    for (;;){
        if (rule.lt(low, rule.fs(a, rule.to_str(more), true))) break;
        else more++;
    }
    return rule.fs(a, rule.to_str(n + more), true);
}
// CHAIN FS
function chainfs(rule, initial, chain, cac = true){
    if (cac){
        var key = `${rule.name}-CHAIN-${initial}-${st(chain)}`;
        if (!(key in cache)) cache[key] = chainfs(rule, initial, chain, false);
        return cache[key];
    }
    var result = initial, r, low;
    for (let i = 0; i < chain.length; i++){
        r = chain_reduce(chain.slice(0, i + 1));
        low = r.length ? chainfs(rule, initial, r) : null;
        result = lowfs(rule, result, chain[i], low);
        if (rule.type(result) < 2) break;
    }
    return result;
}
// SEARCH ORDINAL
function search(rule, initial, str){
    if (initial === str) return [];
    var result = [], n = 0, ord;
    for (let i = 0; i < 10000; i++){
        ord = chainfs(rule, initial, result.concat([n]));
        if (!rule.lt(ord, str)) result.push(n);
        if (rule.lt(str, ord)) n = -1;
        if (!rule.lt(str, ord) && !rule.lt(ord, str)) break;
        n++;
        if (i === 9999) result = null;
    }
    return result;
}