// =================================================================================================
// BASIC FUNCTIONS
// =================================================================================================
// USE STRICT
"use strict";
// CACHE
let cache = {};
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
    let result, k;
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
    if (a.length > 1 && b.length > 1){
        if (combuch([a[0]], [b[0]])) return true;
        return (!combuch([b[0]], [a[0]]) && combuch(a.slice(2), b.slice(2)));
    }
    if (a.length > 1 && b.length === 1) return combuch([a[0]], b);
    if (a.length === 1 && b.length > 1) return !combuch([b[0]], a);
    // SINGLE
    return combuch(a[0][1], b[0][1]) || (!combuch(b[0][1], a[0][1]) && combuch(a[0][2], b[0][2]));
}
// REWRITE BUCHHOLZ FUNCTION
function rebuch(math, level = 3){
    // DO NOTHING IF LEVEL IS 0
    if (!level) return math;
    // ZERO CASE
    if (feq(math, ["0"]) || feq(math, [])) return math;
    // LOOP
    let result = [], item, index;
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
        if (level < 3){
            if (level > 0 && feq(math[i][1], ["0"]) && feq(math[i][2], ["0"])){
                result.push(["v", ["0"], ["0"]]);
                continue;
            }
            item = clone(math[i]);
            item[1] = rebuch(item[1], level + (level === 2));
            item[2] = rebuch(item[2], level);
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
    if (feq(math, ["0"]) || feq(math, [])) return math;
    // LOOP
    let result = [], item;
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
        // CHECK VEBLEN TERMS
        if (math[i][0] !== "v") continue;
        for (let j = 1; j < math[i].length; j++) if (hask(math[i][j])) return true;
    }
    return false;
}
// REWRITE Ξ(α)
function rexi(math, level = 4){
    // DO NOTHING IF LEVEL IS 0
    if (!level) return math;
    // ZERO CASE
    if (feq(math, ["0"]) || feq(math, [])) return math;
    // LOOP
    let result = [], item;
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
        } else if (level > 0 && !hask(math[i][1])) result.push(["X1", rexi(math[i][1], level)]);
        // ELSE REMAINS THE SAME
        else result.push([math[i][0], rexi(math[i][1], level)]);
    }
    return result;
}
// REWRITE UNCOUNTABLE
function reunc(math){
    // ZERO CASE
    if (feq(math, ["0"]) || feq(math, [])) return math;
    // LOOP
    let result = [], item;
    for (let i = 0; i < math.length; i++){
        // KEEP SIMPLE TERMS
        if (typeof math[i] !== "object"){
            result.push(math[i]);
            continue;
        }
        // KEEP OTHER TERMS
        if (!["W", "I", "X1"].includes(math[i][0])){
            item = clone(math[i]);
            for (let j = 1; j < item.length; j++) item[j] = reunc(item[j]);
            result.push(item);
            continue;
        }
        // REWRITE Ω_1 AS Ω
        if (feq(math[i], ["W", [["v", ["0"], ["0"]]]])) result.push("\\Omega");
        // REWRITE I_1 AS I
        else if (feq(math[i], ["I", [["v", ["0"], ["0"]]]])) result.push("I");
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
    if (feq(math, ["0"]) || feq(math, [])) return math;
    // LOOP
    let result = [], item;
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
function spexp(math, level = 1){
    // ZERO CASE
    if (feq(math, ["0"]) || feq(math, [])) return math;
    // LOOP
    let result = [], a, math2, add, mult, depth;
    for (let i = 0; i < math.length; i++){
        // KEEP THE NON-ARRAYS
        if (typeof math[i] !== "object"){
            result.push(math[i]);
            continue;
        }
        // KEEP THE NON-ω-EXPONENTS
        if (typeof math[i] === "object") a = (math[i][0] !== 0 || math[i][1][0] !== "\\omega");
        else a = (math[i] === "\\omega");
        if (a){
            a = clone(math[i]);
            if (!a[0]) a[2] = spexp(a[2], level);
            else for (let j = 1; j < a.length; j++) a[j] = spexp(a[j], level);
            result.push(a);
            continue;
        }
        // PROCESS ω-EXPONENTS
        math2 = spexp(clone(math[i][2]), level), add = [], mult = null, depth = 0;
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
        if (level === 0){
            a = clone(math[i]);
            if (a[0]) for (let j = 1; j < a.length; j++) a[j] = spexp(a[j], level);
            else if (a[2].length < 3) a[2] = spexp(a[2], level);
            else if (a[2][1] !== "+") a[2] = spexp(a[2], level);
            else if (typeof a[2][2] !== "object") a[2] = spexp(a[2], level);
            else if (a[2][2][0]) a[2] = spexp(a[2], level);
            else if (st(a[2][0]) !== st(a[2][2][2][0])) a[2] = spexp(a[2], level);
            else a[2] = spexp(a[2].slice(2), level);
            result.push(a);
            continue;
        }
        math2.push("+");
        for (let j = 0; j < math2.length; j++){
            // WHEN HITTING 1 OR ω
            if (typeof math2[j] === "object"){
                a = (math2[j][0] === 0 && math2[j][1][0] === "\\omega");
            } else a = ["1", "\\omega"].includes(math2[j]);
            if (a && !add.length){
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
                    for (let k = 1; k < mult.length; k++) mult[k] = spexp(mult[k], level);
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
                        if (result.length < 2) result = result.concat([a, "*"]);
                        else if (result.slice(-1)[0] !== "*"){
                            result = result.concat([a, "*"]);
                        } else if (st(result.slice(-2, -1)[0]) !== st(add[0][1][0])){
                            result = result.concat([a, "*"]);
                        } else result = result.slice(0, -2).concat([a, "*"]);
                    } else if (result.length < 2){
                        result = result.concat([[0, add[0][1], add], "*"]);
                    } else if (result.slice(-1)[0] !== "*"){
                        result = result.concat([[0, add[0][1], add], "*"]);
                    } else if (st(result.slice(-2, -1)[0]) !== st(add[0][1][0])){
                        result = result.concat([[0, add[0][1], add], "*"]);
                    } else result = result.slice(0, -2).concat([[0, add[0][1], add], "*"]);
                // PROCESS NON-EXPONENT
                } else if (add.length > 1){
                    a = [0, [add[0]], []];
                    for (let k = 1; k < add.length; k++) a[2] = a[2].concat([add[k], "*"]);
                    a[2] = a[2].slice(0, -1);
                    if (result.length < 2) result = result.concat([a, "*"]);
                    else if (result.slice(-1)[0] !== "*") result = result.concat([a, "*"]);
                    else if (st(result.slice(-2, -1)[0]) !== st(add[0])){
                        result = result.concat([a, "*"]);
                    } else result = result.slice(0, -2).concat([a, "*"]);
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
    if (feq(math, ["0"]) || feq(math, [])) return math;
    // LOOP
    let math2 = math.concat(["+"]), result = [], a, b, base = [], exp = [], item = null;
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
    if (feq(math, ["0"]) || feq(math, [])) return math;
    // LOOP
    let math2 = math.concat(["+"]), result = [], base = [], add = [], n = 0, item = null;
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
    if (feq(math, ["0"]) || feq(math, [])) return math;
    // LOOP
    let result = [], a;
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
    if (feq(math, ["0"]) || feq(math, [])) return math;
    // LOOP
    let result = clone(math);
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
    if (feq(math, ["0"]) || feq(math, [])) return math;
    // LOOP
    let result = [];
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
        } else if (math[i][0] === "X1"){
            result.push([1, ["\\Xi"], refunc(math[i][1])]);
        } else {
            result.push([math[i][0]]);
            for (let j = 1; j < math[i].length; j++){
                result[result.length - 1].push(refunc(math[i][j]));
            }
        }
    }
    return result;
}
// TOTAL SIMPLIFICATION
function simplify(math, options){
    let result = clone(math);
    result = rebuch(result, options.rebuch);
    result = rechi(result, options.rechi);
    result = rexi(result, options.rexi);
    result = reunc(result);
    result = reveb(result, Math.max(options.reveb1, options.force_omega),
                   options.reveb2 + !!options.reveb2);
    if (options.simplify > 0) result = spexp(result, options.simplify % 2);
    if (options.simplify > 1) result = spmult(result);
    if (options.simplify > 3) result = spadd(result);
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
        ["\\cdot_{\\cdot_\\cdot}", "..."],
    ];
    let result = clone(math);
    for (let i = 0; i < rep.length; i++) result = result.split(rep[i][0]).join(rep[i][1]);
    return result;
}
// HTML NOTATION
function html(math, rep = true){
    let text = "";
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
    let text = "";
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
    for (let i = 0; i < arrs.length; i++) if (st(arrs[i]) === st(arr)) return true;
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
    let result = chain.slice(0, -1);
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
    let result = JSON.parse(st(list));
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
    let result = [];
    for (let i = 0; i < list.length; i++){
        if (st(list[i].slice(0, chain.length)) !== st(chain)) result.push(list[i]);
    }
    return result;
}
// COLLAPSE CHAIN LIST
function list_collapse(list, chain){
    let max = null;
    for (let i = 0; i < list.length; i++){
        if (st(list[i].slice(0, chain.length)) === st(chain) &&
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
    let more = 0;
    for (;;){
        if (rule.lt(low, rule.fs(a, rule.to_str(more), true))) break;
        else more++;
    }
    return rule.fs(a, rule.to_str(n + more), true);
}
// CHAIN FS
function chainfs(rule, initial, chain, cac = true){
    if (cac){
        try {cache;} catch {return chainfs(rule, initial, chain, false);}
        let key = `${rule.name}-CHAIN-${initial}-${st(chain)}`;
        if (!(key in cache)) cache[key] = chainfs(rule, initial, chain, false);
        return cache[key];
    }
    let result = initial, r, low;
    for (let i = 0; i < chain.length; i++){
        r = chain_reduce(chain.slice(0, i + 1));
        low = r.length ? chainfs(rule, initial, r) : null;
        result = lowfs(rule, result, chain[i], low);
        if (rule.type(result) < 2) break;
    }
    return result;
}
// SEARCH ORDINAL
function search(rule, initial, str, steps){
    if (initial === str) return [];
    let result = [], n = 0, ord;
    for (let i = 0; i < steps; i++){
        ord = chainfs(rule, initial, result.concat([n]));
        if (!rule.lt(ord, str)) result.push(n);
        if (rule.lt(str, ord)) n = -1;
        if (!rule.lt(str, ord) && !rule.lt(ord, str)) break;
        n++;
        if (i === steps - 1) result = null;
    }
    return result;
}