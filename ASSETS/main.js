// =================================================================================================
// BASIC FUNCTIONS
// =================================================================================================
// USE STRICT
"use strict";
// FILL ZERO
function z(n, d){return n.toString().padStart(d, "0");}
// REPLACE ALL (String.prototype.replaceAll() has compatibility issues)
function replaceall(text, match, target){return text.split(match).join(target);}
// ADD SPACE
function add_space(text, space){
    if (space >= 0) return replaceall(text, "\n", "\n" + " ".repeat(space));
    else return replaceall(text, "\n" + " ".repeat(-space), "\n");
}
// READ FILE
function read_file(file){
    var command, req = new XMLHttpRequest(), result = null;
    command = function (){if ([0, 200].includes(req.status)) result = req.responseText;}
    req.open("GET", file, false);
    req.onreadystatechange = command;
    req.send(null);
    return result;
}
// CONVERT FILE TO DOM
function to_dom(text){return new DOMParser().parseFromString(text, 'text/html');}
// COPY CODE
function copy(str){navigator.clipboard.writeText(str);}
// =================================================================================================
// ABBREVIATIONS
// =================================================================================================
// CURRENT LANGUAGE
function lang(){return data.constant.langs[data.save.lang];}
// WORDS IN CURRENT LANGUAGE
function words(){return data.resources.words[lang()];}
// CURRENT RULE
function rule(){return [null, null].concat(data.constant.systems)[data.mode1];}
// INITIAL ORDINAL
function initial(){return data.system.initial;}
// CURRENT CHAINS
function chains(){return data.system.chains;}
// PRESETS
function presets(){return data.mode1 < 2 ? [] : data.save.presets[data.mode1 - 2];}
// DISPLAY MODE
function display_mode(){return data.save.options.display;}
// INDENT MODE
function indent_mode(){return data.save.options.indent;}
// DEFAULT DISPLAY
function display2(str, no_original = false){
    var options = {}, op = ["simplify", "specify", "reveb1", "reveb2", "rebuch", "rechi", "rexi"];
    for (let i = 0; i < op.length; i++) options[op[i]] = data.save.options[op[i]];
    options.force_omega = [4, 5].includes(data.mode1) * 1;
    return display(str, rule(), Math.max(display_mode(), no_original), options);
}
// ERROR TEXT
function er(text){return words().error.error + text;}
// FORMAT TEXT
function fm(text){return [er(words().error.invalid_format), words().error.format + text];}
// =================================================================================================
// BACKGROUND
// =================================================================================================
// GENERATE PARTICLE PARAMETERS
function generate_particle(t){
    var x, y, vx, vy, a, b, c;
    x = Math.floor(window.innerWidth * Math.random());
    y = Math.floor(window.innerHeight * Math.random());
    a = Math.random();
    b = Math.random();
    if (b > a){c = a; a = b; b = c;}
    vx = a * Math.cos(2 * Math.PI * b / a) * 100;
    vy = a * Math.sin(2 * Math.PI * b / a) * 100;
    return [t, t + Math.floor(Math.random() * 5000) + 5000, x, y, vx, vy];
}
// UPDATE BACKGROUND
function update_background(t1, t2){
    var id, k, div, particle, pdiv, x, y;
    if (data.save.options.background && data.background < 500)
        data.background = Math.min(data.background + t1 - t2, 500);
    if (!data.save.options.background && data.background > 0)
        data.background = Math.max(data.background - t1 + t2, 0);
    document.querySelector(".background").style.opacity = data.background / 500;
    if (Math.random() * 500000000 < (t1 - t2) * window.innerWidth * window.innerHeight){
        for (;;){
            id = Math.floor(Math.random() * 1000000);
            if (!(id in data.particles)) break;
        }
        data.particles[id] = generate_particle(t1);
        div = document.createElement("div");
        div.setAttribute("class", "ord" + z(id, 6));
        div.innerHTML = data.resources.particles[Math.floor(Math.random() * 200)];
        document.querySelector(".background").appendChild(div);
        MathJax.typeset([div]);
    }
    k = Object.keys(data.particles);
    for (let i = 0; i < k.length; i++){
        particle = data.particles[k[i]];
        if (t1 >= particle[1]){
            delete data.particles[k[i]];
            document.querySelector(".ord" + z(k[i], 6)).remove();
        }
    }
    k = Object.keys(data.particles);
    for (let i = 0; i < k.length; i++){
        particle = data.particles[k[i]];
        pdiv = document.querySelector(".ord" + z(k[i], 6));
        x = particle[2] - pdiv.offsetWidth / 2 + particle[4] * (t1 - particle[0]) / 1000;
        y = particle[3] - pdiv.offsetHeight / 2 + particle[5] * (t1 - particle[0]) / 1000;
        pdiv.style.left = x + "px";
        pdiv.style.top = y + "px";
        pdiv.style.opacity = Math.min(Math.min(t1 - particle[0], particle[1] - t1), 1000) / 2000;
    }
}
// =================================================================================================
// CONTENT
// =================================================================================================
// SET WINDOW DISPLAY STATE
function set_display(elm, state){
    if (state) elm.removeAttribute("style");
    else elm.setAttribute("style", "display: none;");
}
// SET TEXT
function set_text(id, text){document.getElementById(id).innerHTML = text;}
// SET MENU
function set_menu(){
    var elm;
    set_text("menu-title", words().title);
    set_text("menu0", words().help);
    for (let i = 0; i < data.constant.systems.length; i++){
        set_text("menu" + (i + 1), replaceall(words().systems[i], " \\(", "\\( \\"));
    }
    set_text("lang0", words().lang);
    for (let i = 0; i < data.constant.langs.length; i++){
        elm = document.getElementById("lang" + (i + 1));
        set_display(elm, data.lang);
        set_text("lang" + (i + 1), data.resources.words[data.constant.langs[i]].lang);
        elm.setAttribute("class", "lang-button2 button" + ((data.save.lang === i) * 2 + 1));
    }
    MathJax.typeset([document.querySelector(".menu")]);
}
// SET LANGUAGE
function set_lang(lang = null){
    if (lang === null) data.lang = !data.lang;
    else {
        if (data.save.lang === lang) return;
        data.save.lang = lang;
        data.lang = false;
        save_data();
    }
    set_text("title", words().title);
    set_menu();
}
// SET TAB
function set_tab(){
    set_text("system", ["", words().help].concat(words().systems)[data.mode1]);
    if (!data.mode1) set_text("system", "");
    set_text("back", words().back);
    set_text("tab0", words().calculate);
    set_text("tab1", words().explore);
    set_text("tab2", words().options);
    set_text("tab3", words().help);
    for (let i = 0; i < 4; i++){
        document.getElementById("tab" + i).setAttribute("class",
            "tab-button button" + (data.mode2 === i ? 3 : 1));
        document.getElementById("tab" + i).setAttribute("onclick",
            data.mode2 === i ? "" : `change_tab(${i});`);
    }
    MathJax.typeset([document.querySelector(".tab")]);
}
// SET EXPLORE
function set_explore(){
    if (!data.mode1){
        document.querySelector(".ordinals").innerHTML = "";
        return;
    }
    if (data.mode1 > 1) update_explore();
}
// SET OPTIONS
function set_options(){
    var options = ["background", "display", "indent", "simplify", "specify",
                   "reveb1", "reveb2", "rebuch", "rechi", "rexi"], element, condition;
    set_display(document.querySelectorAll(".op-item")[4], [5, 6].includes(data.mode1));
    set_display(document.querySelectorAll(".op-item")[5], [3, 6, 7].includes(data.mode1));
    set_display(document.querySelectorAll(".op-item")[6], data.mode1 === 6);
    set_display(document.querySelectorAll(".op-item")[7], [4, 5].includes(data.mode1));
    set_display(document.querySelectorAll(".op-item")[8], data.mode1 === 6);
    set_display(document.querySelectorAll(".op-item")[9], data.mode1 === 7);
    for (let i = 0; i < options.length; i++){
        for (let j = 0; j < [2, 3, 3, 4, 2, 6, 4, 3, 3, 5][i]; j++){
            element = document.getElementById(`op${i}-${j}`);
            condition = data.save.options[options[i]] === j;
            element.setAttribute("class", `op-button button${condition * 2 + 1}`);
            if (condition) element.removeAttribute("onclick");
            else element.setAttribute("onclick", `change_option('${options[i]}', ${j});`);
        }
    }
    set_text("op0", words().option.background);
    set_text("op1", words().option.display_mode);
    set_text("op2", words().option.indent_mode);
    set_text("op3", words().option.simplification);
    set_text("op4", words().option.specification);
    set_text("op5", words().option.rewrite.replace("${ord}", "\\( \\varphi_\\alpha(\\beta) \\)"));
    set_text("op6", words().option.rewrite.replace("${ord}", "\\( \\Phi_\\alpha(\\beta) \\)"));
    set_text("op7", words().option.rewrite.replace("${ord}", "\\( \\psi_\\alpha(\\beta) \\)"));
    set_text("op8", words().option.rewrite.replace("${ord}", "\\( \\chi_\\alpha(\\beta) \\)"));
    set_text("op9", words().option.rewrite.replace("${ord}", "\\( \\Xi(\\alpha) \\)"));
    set_text("op0-0", words().option.off);
    set_text("op0-1", words().option.on);
    set_text("op1-0", words().option.original);
    set_text("op1-1", "HTML");
    set_text("op1-2", "MathJax");
    set_text("op2-0", words().option.none);
    set_text("op2-1", words().option.expansive);
    set_text("op2-2", words().option.recursive);
    set_text("op3-0", words().option.none);
    set_text("op3-1", "\\( \\alpha^\\beta \\)");
    set_text("op3-2", "\\( \\alpha*\\beta \\)");
    set_text("op3-3", "\\( \\alpha+\\beta \\)");
    set_text("op4-0", "\\( \\psi_\\alpha(\\beta) \\)");
    set_text("op4-1", `\\( \\${data.mode1 === 6 ? "rho_\\alpha" : "psi_\\alpha^*"}(\\beta) \\)`);
    set_text("op5-0", "\\( \\varphi_\\alpha(\\beta) \\)");
    set_text("op5-1", "\\( 1 \\)");
    set_text("op5-2", "\\( \\omega^\\beta \\)");
    set_text("op5-3", "\\( \\varepsilon_\\beta \\)");
    set_text("op5-4", "\\( \\zeta_\\beta \\)");
    set_text("op5-5", "\\( \\eta_\\beta \\)");
    set_text("op6-0", "\\( \\Phi_\\alpha(\\beta) \\)");
    set_text("op6-1", "\\( E_\\beta \\)");
    set_text("op6-2", "\\( Z_\\beta \\)");
    set_text("op6-3", "\\( H_\\beta \\)");
    set_text("op7-0", "\\( \\psi_\\alpha(\\beta) \\)");
    set_text("op7-1", "\\( 1 \\)");
    set_text("op7-2", "\\( \\omega^{\\Omega_\\alpha+\\beta} \\)");
    set_text("op8-0", "\\( \\chi_\\alpha(\\beta) \\)");
    set_text("op8-1", "\\( \\Omega_{1+\\beta} \\)");
    set_text("op8-2", "\\( I_{1+\\beta} \\)");
    set_text("op9-0", "\\( \\Xi(\\alpha) \\)");
    set_text("op9-1", "\\( \\Xi_\\alpha \\)");
    set_text("op9-2", "\\( I \\)");
    set_text("op9-3", "\\( M \\)");
    set_text("op9-4", "\\( N \\)");
    MathJax.typeset([document.querySelector(".options")]);
}
// CHANGE OPTION
function change_option(item, value){
    if (data.save.options[item] === value) return;
    data.save.options[item] = value;
    save_data();
    set_options();
}
// REFRESH CONTENTS
function refresh_contents(){
    var button = document.querySelector(".contents span");
    button.innerHTML = words()[data.save.contents ? "hide" : "show"];
    set_display(document.querySelector(".contents-content"), data.save.contents);
}
// SET CONTENTS
function set_contents(){
    var text = "", id = [0, 0, 0, 0, 0, 0], depth, index;
    var hs = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
    text += `<div class="contents-title"><b>${words().contents}&nbsp;</b>`;
    text += `<span class="button2 hide-show" onclick="change_contents();"></span></div>`;
    text += `<div class="contents-content">`;
    for (let i = 0; i < hs.length; i++){
        depth = Number(hs[i].tagName.slice(-1)) - 1;
        id[depth]++;
        for (let j = depth + 1; j < id.length; j++) id[j] = 0;
        index = replaceall(id.slice(0, depth + 1).toString(), ",", ".");
        hs[i].id = index;
        text += `<div>${"&emsp;".repeat(depth)}${index}. `;
        text += `<a href="#${index}">${hs[i].innerHTML}</a></div>`;
    }
    text += `</div>`;
    document.querySelector(".contents").innerHTML = text;
    refresh_contents();
}
// CHANGE CONTENTS
function change_contents(){
    data.save.contents = !data.save.contents;
    save_data();
    refresh_contents();
}
// SET HELP
function set_help(){
    var filename, content;
    if (!data.mode1){
        document.querySelector(".help").innerHTML = "";
        return;
    }
    filename = "ASSETS/DATA/";
    filename += data.resources.help_files[data.mode1 - 1];
    filename += `_${data.constant.langs[data.save.lang]}.html`;
    content = to_dom(read_file(filename));
    content = add_space(content.getElementsByTagName("body")[0].innerHTML, 16);
    content = "\n" + " ".repeat(24) + `<div class="contents"></div>` + content;
    document.querySelector(".help").innerHTML = content;
    set_contents();
    document.querySelector(".help").scrollTop = 0;
    MathJax.typeset([document.querySelector(".help")]);
}
// SET SYSTEM
function set_system(){
    data.system.initial = "A";
    data.system.chains = [[]];
    data.search = null;
    document.querySelector(".cal-bar").value = "";
    if (data.mode1 > 1) set_console();
}
// SET MAIN INTERFACE
function set_main(system = true){
    set_display(document.querySelector(".menu"), !data.mode1);
    set_display(document.querySelector(".system"), data.mode1);
    set_display(document.querySelector(".tab-main"), data.mode1 !== 1);
    set_display(document.querySelector(".calculate"), data.mode2 === 0);
    set_display(document.querySelector(".explore"), data.mode2 === 1);
    set_display(document.querySelector(".options"), data.mode2 === 2);
    set_display(document.querySelector(".help"), data.mode2 === 3);
    set_menu();
    set_tab();
    if (system) set_system();
    if (data.mode1){
        if (data.mode2 === 0){
            set_input();
            set_preset();
        }
        if (data.mode2 === 1) set_explore();
        if (data.mode2 === 2) set_options();
        if (data.mode2 === 3) set_help();
    }
}
// CHANGE MODE
function change_mode(mode){
    if (data.mode1 === mode) return;
    data.mode1 = mode;
    data.mode2 = (data.mode1 === 1) * 3;
    data.change = 1000;
}
// CHANGE TAB
function change_tab(tab){
    if (data.mode2 === tab) return;
    data.mode2 = tab;
    set_main(false);
}
// UPDATE MAIN INTERFACE
function update_main(t1, t2){
    var op;
    if (!data.change) return;
    data.change = Math.max(data.change - t1 + t2, 0);
    op = Math.min(Math.abs(data.change - 500), 500) / 500;
    document.querySelector(".main").style.opacity = op;
    document.querySelector(".main").style["user-select"] = data.change ? "none" : "auto";
    document.querySelector(".main").style["-ms-user-select"] = data.change ? "none" : "auto";
    document.querySelector(".main").style["-webkit-user-select"] = data.change ? "none" : "auto";
    document.querySelector(".main").style["pointer-events"] = data.change ? "none" : "auto";
    if (data.change + t1 - t2 >= 500 && data.change < 500) set_main();
}
// UPDATE EVERYTHING
function update(t1, t2){
    update_background(t1, t2);
    update_main(t1, t2);
}
// =================================================================================================
// CALCULATE
// =================================================================================================
// SET INPUT
function set_input(){
    document.querySelector(".cal-bar").setAttribute("placeholder", words().input);
}
// SET CONSOLE
function set_console(text = null, error = false){
    var t = [], a, b, rep, content = "";
    if (text === null){
        t.push(words().console.initial);
        a = "";
        for (let i = 0; i < 2 + (data.mode1 === 7); i++){
            b = words().console.rep2.replace("${a}", "BCD"[i]);
            b = b.replace("${b}", display_mode() < 2 ? "bcd"[i] : `\\( ${"bcd"[i]} \\)`);
            a += b;
        }
        t.push(words().console.rep1.replace("${rep}", a));
        rep = function (a, b){return words().console.rep3.replace("${a}", a).replace("${b}", b);}
        t.push(rep(words().console.empty, display2("", true)));
        t.push(rep(words().console.stra, display2("A", true)));
        t.push(rep("BC", display_mode() < 2 ? "b+c" : "\\( b+c \\)"));
        if (data.mode1 === 2){
            if (display_mode() < 2) t.push(rep("(B)", "ω<sup>b</sup>"));
            else t.push(rep("(B)", "\\( \\omega^b \\)"));
        }
        if (data.mode1 === 3){
            if (display_mode() < 2) t.push(rep("(B,C)", "φ<sub>b</sub>(c)"));
            else t.push(rep("(B,C)", "\\( \\varphi_b(c) \\)"));
        }
        if (data.mode1 === 4){
            if (display_mode() < 2) t.push(rep("(B,C)", "ψ<sub>b</sub>(c)"));
            else t.push(rep("(B,C)", "\\( \\psi_b(c) \\)"));
        }
        if (data.mode1 === 5){
            if (display_mode() < 2){
                a = data.save.options.specify ? "ψ<sub>b</sub><sup>*</sup>(c)" : "ψ<sub>b</sub>";
            } else {
                a = data.save.options.specify ? "\\( \\psi_b^*(c) \\)" : "\\( \\psi_b(c) \\)";
            }
            t.push(rep("(B,C)", a));
        }
        if (data.mode1 === 6){
            if (display_mode() < 2){
                t.push(rep("(vB,C)", "φ<sub>b</sub>(c)"));
                t.push(rep("(VB,C)", "Φ<sub>b</sub>(c)"));
                t.push(rep("(xB,C)", "χ<sub>b</sub>(c)"));
                a = `${data.save.options.specify ? "ρ" : "ψ"}<sub>b</sub>(c)`;
            } else {
                t.push(rep("(vB,C)", "\\( \\varphi_b(c) \\)"));
                t.push(rep("(VB,C)", "\\( \\Phi_b(c) \\)"));
                t.push(rep("(xB,C)", "\\( \\chi_b(c) \\)"));
                a = `\\( \\${data.save.options.specify ? "rho" : "psi"}_b(c) \\)`;
            }
            t.push(rep("(rB,C)", a));
        }
        if (data.mode1 === 7){
            if (display_mode() < 2){
                t.push(rep("(vB,C)", "φ<sub>b</sub>(c)"));
                t.push(rep("(WB)", "Ω<sub>b</sub>"));
                t.push(rep("(XB)", data.save.options.rexi ? "Ξ<sub>b</sub>" : "Ξ(b)"));
                t.push(rep("(RB,C,D)", "Ψ<sub>b</sub><sup>c</sup>(d)"));
            } else {
                t.push(rep("(vB,C)", "\\( \\varphi_b(c) \\)"));
                t.push(rep("(WB)", "\\( \\Omega_b \\)"));
                t.push(rep("(XB)", data.save.options.rexi ? "\\( \\Xi_b \\)" : "\\( \\Xi(b) \\)"));
                t.push(rep("(RB,C,D)", "\\( \\Psi_b^c(d) \\)"));
            }
        }
    } else t = text;
    for (let i = 0; i < t.length; i++){
        content += `<div${error ? ` class="error"` : ""}>${t[i]}</div>`;
    }
    document.querySelector(".cal-console").innerHTML = content;
    MathJax.typeset([document.querySelector(".cal-console")]);
}
// SET PRESET
function set_preset(){
    var text = "", command;
    command = function (n){
        return function (e){
            if (e.key === "Enter"){
                for (let i = 2; i < document.querySelectorAll(".cal-item").length; i++){
                    document.querySelectorAll(".cal-item")[i].removeAttribute("onfocusout");
                }
                check_preset(n);
                e.preventDefault();
            }
        }
    }
    text += "<div id=\"preset\" class=\"cal-item\">Presets</div>";
    text += "<div class=\"cal-item\"></div>";
    for (let i = 0; i < presets().length + 1; i++){
        text += `<input class="cal-item" placeholder="${words().name}" `;
        text += `onfocusout="check_preset(${i * 2});"></input>`;
        text += `<input class="cal-item" placeholder="${words().ordinal}" `;
        text += `onfocusout="check_preset(${i * 2 + 1});"></input>`;
    }
    document.querySelector(".cal-items").innerHTML = text;
    for (let i = 2; i < document.querySelectorAll(".cal-item").length; i++){
        document.querySelectorAll(".cal-item")[i].addEventListener("keydown", command(i - 2));
        if (i >= presets().length * 2 + 2) continue;
        if (i % 2) document.querySelectorAll(".cal-item")[i].value = presets()[(i - 3) / 2].content;
        else document.querySelectorAll(".cal-item")[i].value = presets()[(i - 2) / 2].name;
    }
}
// CHECK PRESET
function check_preset(n){
    var item = document.querySelectorAll(".cal-item")[n + 2].value, valid = true;
    if (item === "") valid = false;
    if (item.includes(" ")) valid = false;
    if (item.includes("\"")) valid = false;
    if (item.includes("[")) valid = false;
    if (item.includes("]")) valid = false;
    for (let i = 0; i < presets().length; i++) if (item === presets()[i].name) valid = false;
    if (n === presets().length * 2){
        if (valid) {
            data.save.presets[data.mode1 - 2].push({name: item, content: ""});
            save_data();
        }
    } else if (n < presets().length * 2){
        if (n % 2){
            data.save.presets[data.mode1 - 2][(n - 1) / 2].content = item;
            save_data();
        } else if (item === "" && data.save.presets[data.mode1 - 2][n / 2].content === ""){
            data.save.presets[data.mode1 - 2] =
                presets().slice(0, n / 2).concat(presets().slice(n / 2 + 1));
            save_data();
        } else if (valid){
            data.save.presets[data.mode1 - 2][n / 2].name = item;
            save_data();
        }
    }
    set_preset();
}
// IMPORT PRESET
function preset_import(){
    var input, command;
    input = document.createElement("input");
    input.type = "file";
    command = function (e){
        var file, reader, command;
        file = e.target.files[0];
        reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        command = function (e){
            var load, error = false, result = [];
            try {
                load = JSON.parse(e.target.result);
                for (let i = 0; i < load.length; i++){
                    if (!("name" in load[i])) throw "";
                    if (!("content" in load[i])) throw "";
                    if (typeof load[i].name !== "string") throw "";
                    if (typeof load[i].content !== "string") throw "";
                    result.push({name : load[i].name, content : load[i].content});
                }
            } catch {error = true;}
            if (!error){
                data.save.presets[data.mode1 - 2] = result;
                save_data();
                set_console([words().console.import_success]);
                set_preset();
            } else set_console([er(words().error.import_fail1), words().error.import_fail2], true);
        }
        reader.onload = command;
    }
    input.onchange = command;
    input.click();
}
// EXPORT PRESET
function preset_export(){
    var filename = `Save_${rule().name}.json`;
    saveAs(new File([JSON.stringify(presets())], filename, {type: "text/plain;charset=utf-8"}));
}
// RESET PRESET
function preset_reset(reset){
    if (reset){
        data.save.presets[data.mode1 - 2] = clone(data.constant.save.presets[data.mode1 - 2]);
        save_data();
        set_console([words().console.reset_success]);
        set_preset();
    } else set_console([words().console.reset_cancel]);
}
// READ COMMAND
function read_command(){execute_command(document.querySelector(".cal-bar").value);}
// EXECUTE COMMAND
function execute_command(code){
    // READ CODE
    var sections = [], c = "", quote = false, empty = true, old, t1, t2, text;
    for (let i = 0; i < code.length; i++){
        if (code[i] === "\""){
            quote = !quote;
            if (!quote) empty = false;
            continue;
        }
        if (code[i] === " " && !quote){
            if (!empty) sections.push(c);
            c = "";
            empty = true;
            continue;
        }
        c += code[i];
        empty = false;
    }
    if (!empty) sections.push(c);
    // PROCESS CODE
    for (let i = 1; i < sections.length; i++){
        for (let j = 0; j < 10000; j++){
            old = sections[i];
            for (let k = 0; k < presets().length; k++){
                old = replaceall(old, `[${presets()[k].name}]`, presets()[k].content);
            }
            if (old === sections[i]) break;
            if (j === 9999){
                set_console([er(words().error.loop)], true);
                return;
            }
            sections[i] = old;
        }
    }
    for (let i = 1; i < sections.length; i++) sections[i] = replaceall(sections[i], " ", "");
    // EXECUTE CODE
    if (sections.length < 1){
        set_console();
        return;
    }
    if (sections[0] === "display"){
        if (sections.length !== 2){
            set_console(fm("display ord"), true);
            return;
        }
        if (rule().validity(sections[1]) < 1){
            set_console([er(words().error.invalid1_1), words().error.invalid1_2], true);
            return;
        }
        if (rule().validity(sections[1]) < 2){
            set_console([er(words().error.invalid2_1), words().error.invalid2_2], true);
            return;
        }
        if (rule().validity(sections[1]) < 3){
            set_console([er(words().error.invalid3_1), words().error.invalid3_2], true);
            return;
        }
        if (display_mode() < 2) text = ["α=" + display2(sections[1])];
        else text = ["\\( \\alpha=" + display2(sections[1]).slice(3)];
        set_console(text);
        return;
    }
    if (sections[0] === "cof"){
        if (sections.length !== 2){
            set_console(fm("cof ord"), true);
            return;
        }
        if (rule().validity(sections[1]) < 1){
            set_console([er(words().error.invalid1_1), words().error.invalid1_2], true);
            return;
        }
        if (rule().validity(sections[1]) < 2){
            set_console([er(words().error.invalid2_1), words().error.invalid2_2], true);
            return;
        }
        if (rule().validity(sections[1]) < 3){
            set_console([er(words().error.invalid3_1), words().error.invalid3_2], true);
            return;
        }
        t1 = rule().cof(sections[1]);
        text = [""];
        if (display_mode() < 2) text[0] += "Cof(α)=" + display2(t1);
        else text[0] += "\\( Cof(\\alpha)=" + display2(t1).slice(3);
        text[0] += `<div class="copy2 button2" onclick="copy('${t1}')">${words().copy}</div>`;
        set_console(text);
        return;
    }
    if (sections[0] === "comp"){
        if (sections.length !== 3){
            set_console(fm("comp ord1 ord2"), true);
            return;
        }
        if (rule().validity(sections[1]) < 1 || rule().validity(sections[2]) < 1){
            set_console([er(words().error.invalid1_1), words().error.invalid1_2], true);
            return;
        }
        if (rule().validity(sections[1]) < 2 || rule().validity(sections[2]) < 2){
            set_console([er(words().error.invalid2_1), words().error.invalid2_2], true);
            return;
        }
        if (rule().validity(sections[1]) < 3 || rule().validity(sections[2]) < 3){
            set_console([er(words().error.invalid3_1), words().error.invalid3_2], true);
            return;
        }
        t1 = 1;
        if (rule().lt(sections[1], sections[2])) t1--;
        if (rule().lt(sections[2], sections[1])) t1++;
        text = [""];
        if (display_mode() < 2) text[0] += display2(sections[1]);
        else text[0] += display2(sections[1]).slice(0, -3);
        text[0] += ["&lt;", "=", "&gt;"][t1];
        if (display_mode() < 2) text[0] += display2(sections[2]);
        else text[0] += display2(sections[2]).slice(3);
        set_console(text);
        return;
    }
    if (sections[0] === "fs"){
        if (![2, 3, 4].includes(sections.length)){
            set_console(fm("fs ord [steps=3] [\"strong\"]"), true);
            return;
        }
        if (rule().validity(sections[1]) < 1){
            set_console([er(words().error.invalid1_1), words().error.invalid1_2], true);
            return;
        }
        if (rule().validity(sections[1]) < 2){
            set_console([er(words().error.invalid2_1), words().error.invalid2_2], true);
            return;
        }
        if (rule().validity(sections[1]) < 3){
            set_console([er(words().error.invalid3_1), words().error.invalid3_2], true);
            return;
        }
        if (sections.length === 2) t1 = 3;
        else {
            t1 = Number(sections[2]);
            if (!Number.isInteger(t1) || t1 < 0){
                set_console([er(words().error.invalid_num1), words().error.invalid_num2], true);
                return;
            }
        }
        t2 = sections[1];
        text = [];
        if (rule().type(t2) > 2){
            if (sections.length === 4 ? sections[3] === "strong" : false){
                text.push(words().console.expanding_as);
                text[0] = text[0].replace("${a}", display2(t2));
                t2 = rule().fs(t2, "A", true);
                text[0] = text[0].replace("${b}", display2(t2));
            } else text.push(words().console.warning_uc.replace("${ord}", display2(t2)));
        }
        if (display_mode() < 2) text.push("α=" + display2(t2));
        else text.push("\\( \\alpha=" + display2(t2).slice(3));
        for (let i = 0; i < t1 + 1; i++){
            t2 = sections.length === 4 ? sections[3] === "strong" : false;
            t2 = rule().fs(sections[1], rule().to_str(i), t2);
            if (display_mode() < 2) text.push(`α[${i}]=` + display2(t2));
            else text.push(`\\( \\alpha[${i}]=` + display2(t2).slice(3));
            text[text.length - 1] += `<div class="copy2 button2" `;
            text[text.length - 1] += `onclick="copy('${t2}')">${words().copy}</div>`;
        }
        set_console(text);
        return;
    }
    if (sections[0] === "fgh"){
        if (![3, 4].includes(sections.length)){
            set_console(fm("fgh ord n [steps=1]"), true);
            return;
        }
        if (rule().uc() === null ? true : sections[1] !== rule().fs(rule().uc(), "A", true)){
            if (rule().validity(sections[1]) < 1){
                set_console([er(words().error.invalid1_1), words().error.invalid1_2], true);
                return;
            }
            if (rule().validity(sections[1]) < 2){
                set_console([er(words().error.invalid2_1), words().error.invalid2_2], true);
                return;
            }
            if (rule().validity(sections[1]) < 3){
                set_console([er(words().error.invalid3_1), words().error.invalid3_2], true);
                return;
            }
            if (rule().uc() !== null) if (!rule().lt(sections[1], rule().uc())){
                set_console([er(words().error.uncountable), words().error.uncountable_fgh], true);
                return;
            }
        }
        t1 = Number(sections[2]);
        if (!Number.isInteger(t1) || t1 < 0){
            set_console([er(words().error.invalid_num1), words().error.invalid_num2], true);
            return;
        }
        if (sections.length === 3) t2 = 1;
        else {
            t2 = Number(sections[3]);
            if (!Number.isInteger(t2) || t2 < 0){
                set_console([er(words().error.invalid_num1), words().error.invalid_num2], true);
                return;
            }
        }
        if (display_mode() < 2){
            text = [`&nbsp;&nbsp;f<sub>${display2(sections[1])}</sub>(${t1})<br>`];
        } else {
            text = [`\\( \\begin{align} & f_{${display2(sections[1]).slice(3, -3)}}(${t1}) \\\\`];
        }
        t1 = [sections[1], 1, t1];
        for (let i = 0; i < t2; i++){
            if (rule().type(t1[t1.length - 3]) === 0){
                if (t1[t1.length - 2] === 1){
                    t1[t1.length - 1]++;
                    t1 = t1.slice(0, t1.length - 3).concat(t1.slice(t1.length - 1));
                } else {
                    t1[t1.length - 2]--;
                    t1[t1.length - 1]++;
                }
            } else if (rule().type(t1[t1.length - 3]) === 1){
                if (t1[t1.length - 2] === 1){
                    t1[t1.length - 3] = rule().fs(t1[t1.length - 3]);
                    t1[t1.length - 2] = t1[t1.length - 1];
                } else {
                    t1[t1.length - 2]--;
                    t1 = t1.slice(0, t1.length - 1).concat([rule().fs(t1[t1.length - 3]),
                                                           t1[t1.length - 1],
                                                           t1[t1.length - 1]]);
                }
            } else if (rule().type(t1[t1.length - 3]) === 2){
                if (t1[t1.length - 2] === 1){
                    t1[t1.length - 3] = rule().fs(t1[t1.length - 3],
                                                  rule().to_str(t1[t1.length - 1]));
                } else {
                    t1[t1.length - 2]--;
                    t1 = t1.slice(0, t1.length - 1).concat([
                        rule().fs(t1[t1.length - 3], rule().to_str(t1[t1.length - 1])),
                        1, t1[t1.length - 1]]);
                }
            }
            text[0] += display_mode() < 2 ? "=" : " = & ";
            for (let j = 0; j < (t1.length - 1) / 2; j++){
                if (display_mode() < 2){
                    text[0] += `f<sub>${display2(t1[j * 2])}</sub>`;
                    text[0] += `${t1[j * 2 + 1] > 1 ? `<sup>${t1[j * 2 + 1]}</sup>` : ""}(`;
                } else {
                    text[0] += `f_{${display2(t1[j * 2]).slice(3, -3)}}`;
                    text[0] += `${t1[j * 2 + 1] > 1 ? `^{${t1[j * 2 + 1]}}` : ""}(`;
                }
            }
            text[0] += t1[t1.length - 1] + ")".repeat((t1.length - 1) / 2);
            text[0] += display_mode() < 2 ? "<br>" : " \\\\";
            if (t1.length === 1) break;
        }
        if (t1.length > 1) text[0] += display_mode() < 2 ? "=..." : " = & \\cdots \\\\";
        if (display_mode() === 2) text[0] += " \\end{align} \\)";
        set_console(text);
        return;
    }
    if (sections[0] === "sgh"){
        if (![3, 4].includes(sections.length)){
            set_console(fm("sgh ord n [steps=1]"), true);
            return;
        }
        if (rule().uc() === null ? true : sections[1] !== rule().fs(rule().uc(), "A", true)){
            if (rule().validity(sections[1]) < 1){
                set_console([er(words().error.invalid1_1), words().error.invalid1_2], true);
                return;
            }
            if (rule().validity(sections[1]) < 2){
                set_console([er(words().error.invalid2_1), words().error.invalid2_2], true);
                return;
            }
            if (rule().validity(sections[1]) < 3){
                set_console([er(words().error.invalid3_1), words().error.invalid3_2], true);
                return;
            }
            if (rule().uc() !== null) if (!rule().lt(sections[1], rule().uc())){
                set_console([er(words().error.uncountable), words().error.uncountable_sgh], true);
                return;
            }
        }
        t1 = Number(sections[2]);
        if (!Number.isInteger(t1) || t1 < 0){
            set_console([er(words().error.invalid_num1), words().error.invalid_num2], true);
            return;
        }
        if (sections.length === 3) t2 = 1;
        else {
            t2 = Number(sections[3]);
            if (!Number.isInteger(t2) || t2 < 0){
                set_console([er(words().error.invalid_num1), words().error.invalid_num2], true);
                return;
            }
        }
        text = [""];
        if (display_mode() < 2){
            text = [`&nbsp;&nbsp;g<sub>${display2(sections[1])}</sub>(${t1})<br>`];
        } else {
            text = [`\\( \\begin{align} & g_{${display2(sections[1]).slice(3, -3)}}(${t1}) \\\\`];
        }
        t1 = [sections[1], t1, 0];
        for (let i = 0; i < t2; i++){
            if (rule().type(t1[t1.length - 3]) === 0){
                t1 = t1.slice(2);
            } else if (rule().type(t1[t1.length - 3]) === 1){
                t1[0] = rule().fs(t1[0]);
                t1[2]++;
            }
            else if (rule().type(t1[t1.length - 3]) === 2){
                t1[0] = rule().fs(t1[0], rule().to_str(t1[1]));
            }
            text[0] += display_mode() < 2 ? "=" : " = & ";
            if (t1.length === 1){text[0] += t1[0]; break;}
            if (display_mode() < 2) text[0] += `g<sub>${display2(t1[0])}</sub>`;
            else text[0] += `g_{${display2(t1[0]).slice(3, -3)}}`;
            text[0] += `(${t1[1]})` + (t1[2] ? "+" + t1[2] : "");
            text[0] += display_mode() < 2 ? "<br>" : " \\\\";
        }
        if (t1.length > 1) text[0] += display_mode() < 2 ? "=..." : " = & \\cdots \\\\";
        if (display_mode() === 2) text[0] += " \\end{align} \\)";
        set_console(text);
        return;
    }
    if (sections[0] === "initial"){
        if (sections.length !== 2){
            set_console(fm("initial ord"), true);
            return;
        }
        if (rule().validity(sections[1]) < 1){
            set_console([er(words().error.invalid1_1), words().error.invalid1_2], true);
            return;
        }
        if (rule().validity(sections[1]) < 2){
            set_console([er(words().error.invalid2_1), words().error.invalid2_2], true);
            return;
        }
        if (rule().validity(sections[1]) < 3){
            set_console([er(words().error.invalid3_1), words().error.invalid3_2], true);
            return;
        }
        data.system.initial = sections[1];
        data.system.chains = [[]];
        set_explore();
        set_console([words().console.set_initial.replace("${ord}", display2(sections[1]))]);
        return;
    }
    if (sections[0] === "search"){
        if (sections.length !== 2){
            set_console(fm("search ord"), true);
            return;
        }
        if (rule().validity(sections[1]) < 1){
            set_console([er(words().error.invalid1_1), words().error.invalid1_2], true);
            return;
        }
        if (rule().validity(sections[1]) < 2){
            set_console([er(words().error.invalid2_1), words().error.invalid2_2], true);
            return;
        }
        if (rule().validity(sections[1]) < 3){
            set_console([er(words().error.invalid3_1), words().error.invalid3_2], true);
            return;
        }
        t1 = search(rule(), initial(), sections[1]);
        if (t1 === null){
            text = [er(words().error.not_found1), words().error.not_found2];
            text[1] = text[1].replace("${a}", display2(sections[1]));
            text[1] = text[1].replace("${b}", display2(initial()));
            set_console(text, true);
            return;
        }
        chain_search(sections[1]);
        text = [words().console.search_success1.replace("${ord}", display2(sections[1]))];
        text.push(words().console.search_success2);
        set_console(text);
        return;
    }
    if (sections[0] === "preset"){
        if (sections.length !== 2){
            set_console(fm("preset \"import\"/\"export\"/\"reset\""), true);
            return;
        }
        if (sections[1] === "import"){
            set_console([words().console.import_preset]);
            preset_import();
            return;
        }
        if (sections[1] === "export"){
            set_console([words().console.export_preset]);
            preset_export();
            return;
        }
        if (sections[1] === "reset"){
            text = [words().console.reset_preset];
            text[0] += `<div class="yes button2" onclick="preset_reset(true);">`;
            text[0] += words().yes + `</div>`;
            text[0] += `<div class="no button2" onclick="preset_reset(false);">`;
            text[0] += words().no + `</div>`;
            set_console(text);
            return;
        }
        text = [er(words().error.unknown_aux1), words().error.unknown_aux2];
        text[0] = text[0].replace("${command}", sections[1]);
        set_console(text, true);
        return;
    }
    text = [er(words().error.unknown1.replace("${command}", sections[0])), words().error.unknown2];
    set_console(text, true);
}
// =================================================================================================
// EXPLORE
// =================================================================================================
// INDENT
function indent(chain, mode = 0){
    if (mode === 0) return 0;
    if (mode === 1) return chain.length;
    if (mode === 2){
        var result = 0;
        for (let i = 0; i < chain.length; i++) result += chain[i];
        return result;
    }
}
// UPDATE EXPLORE
function update_explore(){
    var content = "", ord, y;
    for (let i = 0; i < chains().length; i++){
        ord = chainfs(rule(), initial(), chains()[i]);
        content += `<div class="ordinal" style="margin-left: `;
        content += `${indent(chains()[i], indent_mode()) * 32}px;">`;
        if (rule().type(ord) < 2){
            content += `<div class="disabled">+</div>`;
            content += `<div class="disabled">++</div>`;
            content += `<div class="disabled">!!!</div>`;
        } else {
            content += `<div class="plus1 button2" onclick="`;
            content += `chain_expand(${JSON.stringify(chains()[i])});">+</div>`;
            content += `<div class="plus2 button2" onclick="`;
            content += `chain_expand_recursive(${JSON.stringify(chains()[i])});">++</div>`;
            content += `<div class="plus3 button2" onclick="`;
            content += `chain_expand_all(${JSON.stringify(chains()[i])});">!!!</div>`;
        }
        if (feq(clone(chains()), list_collapse(clone(chains()), chains()[i]))){
            content += `<div class="disabled">-</div>`;
        } else {
            content += `<div class="minus button2" onclick="`;
            content += `chain_collapse(${JSON.stringify(chains()[i])});">-</div>`;
        }
        content += `<div class="copy1 button2" onclick="copy('${ord}')">${words().copy}</div>`;
        content += `<div class="ord">${display2(ord)}`;
        if (rule().type(ord) === 3){
            content += `<span class="uexp">`;
            content += words().expand_as.replace("${ord}", display2(rule().fs(ord, "A", true)));
            content += `</span>`;
        }
        content += `</div></div>`;
    }
    document.querySelector(".ordinals").innerHTML = content;
    if (data.search !== null){
        document.querySelectorAll(".ordinal")[data.search].style["background-color"] = "#00000020";
        y = document.querySelectorAll(".ordinal")[data.search].getBoundingClientRect().y;
        y -= document.querySelectorAll(".ordinal")[0].getBoundingClientRect().y;
        document.querySelector(".explore").scrollTop = y;
    }
    MathJax.typeset([document.querySelector(".ordinals")]);
}
// EXPAND
function chain_expand(chain){
    if (rule().type(chainfs(rule(), initial(), chain)) < 2) return;
    data.search = null;
    data.system.chains = list_expand(data.system.chains, chain);
    update_explore();
}
// EXPAND RECURSIVELY
function chain_expand_recursive(chain){
    if (rule().type(chainfs(rule(), initial(), chain)) < 2) return;
    data.search = null;
    var old = [], added = null;
    for (let i = 0; i < chains().length; i++) old.push(st(chains()[i]));
    data.system.chains = list_expand(data.system.chains, chain);
    for (let i = 0; i < chains().length; i++) if (!old.includes(st(chains()[i]))){
        added = clone(chains()[i]);
        break;
    }
    for (;;){
        if (rule().type(chainfs(rule(), initial(), added)) < 2) break;
        data.system.chains = list_expand(data.system.chains, added);
        added.push(0);
    }
    update_explore();
}
// EXPAND ALL
function chain_expand_all(chain){
    if (rule().type(chainfs(rule(), initial(), chain)) < 2) return;
    data.search = null;
    var chains2 = [];
    for (let i = 0; i < chains().length; i++){
        if (!chain_lt(chain, chains()[i])) chains2.push(chains()[i]);
    }
    for (let i = 0; i < chains2.length; i++) chain_expand_recursive(chains2[i]);
}
// COLLAPSE
function chain_collapse(chain){
    data.search = null;
    data.system.chains = list_collapse(chains(), chain);
    update_explore();
}
// SEARCH AND EXPAND
function chain_search(str){
    var position = search(rule(), initial(), str), chains2 = [], id;
    for (let i = 0; i < chains().length; i++) chains2.push(st(chains()[i]));
    for (let i = 0; i < position.length + 1; i++) for (let j = 0; j < position[i] + 1; j++){
        if (!chains2.includes(st(position.slice(0, i).concat([j])))){
            chain_expand(position.slice(0, i));
        }
    }
    chains2 = [];
    for (let i = 0; i < chains().length; i++) chains2.push(st(chains()[i]));
    data.search = chains2.indexOf(st(position));
}
// =================================================================================================
// DATA
// =================================================================================================
// GET SYSTEM LANGUAGE
function get_lang(){
    var lan = navigator.language.toLowerCase();
    if (lan.includes("ja")) return 3;
    if (!lan.includes("zh")) return 0;
    if (lan.includes("hant")) return 2;
    if (lan.includes("hk")) return 2;
    if (lan.includes("mo")) return 2;
    if (lan.includes("tw")) return 2;
    return 1;
}
// SAVE DATA
function save_data(){localStorage.setItem("data-ord", JSON.stringify(data.save));}
// LOAD DATA
function load_data(){
    var d = JSON.parse(localStorage.getItem("data-ord")), k;
    if (d === null) data.save.lang = get_lang();
    else data.save = d;
    data.resources = JSON.parse(read_file("ASSETS/DATA/resources.json"));
    data.constant.save.presets = clone(data.resources.presets);
    k = Object.keys(data.constant.save);
    for (let i = 0; i < k.length; i++){
        if (data.save[k[i]] === undefined) data.save[k[i]] = clone(data.constant.save[k[i]]);
    }
    if (d === null) save_data();
}
// =================================================================================================
// INITIALIZE
// =================================================================================================
// SET DATA
var data = {
    constant    : {
        langs       : ["en", "zh-Hans", "zh-Hant", "jp"],
        systems     : [Cantor, Veblen, Buchholz, ExBuchholz, RathjenM, RathjenK],
        save        : {
            lang        : 0,
            presets     : [],
            options     : {
                background  : 1,
                display     : 2,
                indent      : 1,
                simplify    : 3,
                specify     : 1,
                reveb1      : 5,
                reveb2      : 3,
                rebuch      : 2,
                rechi       : 2,
                rexi        : 4,
            },
            contents    : true,
        },
    },
    system      : {
        rule    : null,
        initial : "A",
        chains  : [[]],
    },
    resources   : null,
    now         : null,
    time        : 0,
    particles   : {},
    interval    : false,
    change      : 2000,
    background  : 500,
    mode1       : 0,
    mode2       : 0,
    goto        : 0,
    lang        : false,
    search      : null,
    save        : {},
};
// =================================================================================================
// MAIN
// =================================================================================================
// INITIALIZE
function initialize(){
    set_text("title", words().title);
    var command = function (e){
        if (e.key === "Enter"){
            e.preventDefault();
            document.querySelector(".cal-enter").click();
        }
    }
    document.querySelector(".cal-bar").addEventListener("keydown", command);
    data.interval = true;
    data.background = data.save.options.background * 500;
}
// MAIN
function main(){
    load_data();
    initialize();
}
// INTERVAL
function interval(){
    if (!data.interval) return;
    var t = Date.now();
    if (data.now === null) data.now = Date.now();
    try {update(t - data.now, data.time);} catch {}
    data.time = t - data.now;
}
// SET FUNCTIONS
window.onload = main;
setInterval(interval, 1);