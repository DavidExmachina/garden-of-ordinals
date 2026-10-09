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
// CONVERT FILE TO DOM
function to_dom(text){return new DOMParser().parseFromString(text, "text/html");}
// COPY CODE
function copy(str){navigator.clipboard.writeText(str);}
// GET PARAMETER
function get_para(code, url = null){
    return new URLSearchParams(url === null ? window.location.search : url).get(code);
}
// CHANGE URL
function change_url(url){window.history.pushState({}, "", url);}
// CHECK VALIDITY OF A NUMBER
function num_validity(n, mode = 0){
    try {Number(n)} catch {return false;}
    if (mode === 0 && !Number.isInteger(Number(n))) return false;
    if (mode === 1 && (Number(n) < 0 || !n)) return false;
    return true;
}
// =================================================================================================
// ABBREVIATIONS
// =================================================================================================
// CURRENT LANGUAGE
function lang(){return data.constant.langs[data.save.lang];}
// WORDS IN CURRENT LANGUAGE
function words(){return data.resources.words[lang()];}
// CURRENT RULE
function rule(){return [null, null].concat(data.constant.systems, [null])[get_mode()[0]];}
// INITIAL ORDINAL
function initial(){return data.system.initial;}
// CURRENT CHAINS
function chains(){return data.system.chains;}
// PRESETS
function presets(){return get_mode()[0] < 2 ? [] : data.save.presets[get_mode()[0] - 2];}
// DISPLAY MODE
function display_mode(){return data.save.options.display;}
// INDENT MODE
function indent_mode(){return data.save.options.indent;}
// DISPLAY OPTIONS
function doption(){
    let options = {};
    let op = [
        "simplify", "specify", "reveb1", "reveb2",
        "rebuch", "rechi", "rexi", "rek", "ref", "square",
    ];
    for (let i = 0; i < op.length; i++) options[op[i]] = data.save.options[op[i]];
    options.force_omega = [4, 5].includes(get_mode()[0]) * 1;
    return options;
}
// DEFAULT DISPLAY
function display2(str, no_original = false){
    if (rule() === null) return str;
    return display(str, rule(), Math.max(display_mode(), no_original), doption());
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
    let x, y, vx, vy, a, b, c;
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
    let id, k, div, particle, pdiv, x, y;
    if (data.save.options.background && data.background < 500){
        data.background = Math.min(data.background + t1 - t2, 500);
    }
    if (!data.save.options.background && data.background > 0){
        data.background = Math.max(data.background - t1 + t2, 0);
    }
    document.querySelector(".background").style.opacity = data.background / 500;
    if (!data.background) return;
    if (Math.random() * 500000000 < (t1 - t2) * window.innerWidth * window.innerHeight){
        for (;;){
            id = Math.floor(Math.random() * 1000000);
            if (!(id in data.particles)) break;
        }
        data.particles[id] = generate_particle(t1);
        div = document.createElement("div");
        div.setAttribute("class", "ord" + z(id, 6));
        div.innerHTML = data.resources.particles[Math.floor(Math.random() * 250)];
        document.querySelector(".background").appendChild(div);
        MathJax.typesetPromise([div]);
    }
    k = Object.keys(data.particles);
    for (let i = 0; i < k.length; i++){
        particle = data.particles[k[i]];
        if (t1 >= particle[1]){
            delete data.particles[k[i]];
            div = document.querySelector(".ord" + z(k[i], 6));
            MathJax.typesetClear([div]);
            div.remove();
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
// SET TITLE
function set_title(){document.title = words().title;}
// SET MENU
function set_menu(){
    let elm;
    MathJax.typesetClear([document.querySelector(".menu")]);
    set_text("menu-title", words().title);
    set_text("menu0", words().help);
    for (let i = 0; i < data.constant.systems.length; i++){
        set_text("menu" + (i + 1), replaceall(words().systems[i], " \\(", "\\( \\"));
    }
    set_text("menu9", words().sheet.hlco);
    set_text("lang0", words().lang);
    for (let i = 0; i < data.constant.langs.length; i++){
        elm = document.getElementById("lang" + (i + 1));
        set_display(elm, data.lang);
        set_text("lang" + (i + 1), data.resources.words[data.constant.langs[i]].lang);
        elm.setAttribute("class", "lang-button2 button" + ((data.save.lang === i) * 2 + 1));
    }
    MathJax.typesetPromise([document.querySelector(".menu")]);
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
    set_title();
    set_menu();
}
// SET TAB
function set_tab(){
    let mode = ["", words().help].concat(words().systems, [words().sheet.hlco]);
    MathJax.typesetClear([document.querySelector(".tab")]);
    set_text("system", mode[get_mode()[0]]);
    set_text("back", words().back);
    set_text("tab0", words().calculate);
    set_text("tab1", words().explore);
    set_text("tab2", words().options);
    set_text("tab3", words().help);
    for (let i = 0; i < 4; i++){
        document.getElementById("tab" + i).setAttribute("class",
            "tab-button button" + (get_mode()[1] === i ? 3 : 1));
        document.getElementById("tab" + i).setAttribute("onclick",
            get_mode()[1] === i ? "" : `change_tab(${i});`);
    }
    MathJax.typesetPromise([document.querySelector(".tab")]);
}
// SET EXPLORE
function set_explore(){
    if (!get_mode()[0]){
        document.querySelector(".ordinals").innerHTML = "";
        return;
    }
    if (get_mode()[0] > 1) update_explore(true);
}
// SET OPTIONS
function set_options(){
    let options = ["background", "display", "indent", "simplify", "specify", "reveb1", "reveb2",
                   "rebuch", "rechi", "rexi", "rek", "ref", "square"], element, condition, a;
    MathJax.typesetClear([document.querySelector(".options")]);
    set_display(document.querySelectorAll(".op-item")[4], [5, 6, 7, 8, 9].includes(get_mode()[0]));
    set_display(document.querySelectorAll(".op-item")[5], [3, 6, 7, 8, 9].includes(get_mode()[0]));
    set_display(document.querySelectorAll(".op-item")[6], get_mode()[0] === 6);
    set_display(document.querySelectorAll(".op-item")[7], [4, 5].includes(get_mode()[0]));
    set_display(document.querySelectorAll(".op-item")[8], get_mode()[0] === 6);
    set_display(document.querySelectorAll(".op-item")[9], get_mode()[0] === 7);
    set_display(document.querySelectorAll(".op-item")[10], get_mode()[0] === 7);
    set_display(document.querySelectorAll(".op-item")[11], [8, 9].includes(get_mode()[0]));
    set_display(document.querySelectorAll(".op-item")[12], [8, 9].includes(get_mode()[0]));
    for (let i = 0; i < options.length; i++){
        for (let j = 0; j < [2, 3, 3, 6, 2, 6, 4, 4, 3, 5, 2, 3, 2][i]; j++){
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
    a = `\\( ${data.save.options.specify ? "X" : "\\Xi"}(\\alpha) \\)`;
    set_text("op9", words().option.rewrite.replace("${ord}", a));
    set_text("op10", words().option.rewrite.replace("${ord}", "\\( K \\)"));
    set_text("op11", words().option.reflection);
    set_text("op12", words().option.square);
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
    set_text("op3-2", "\\( \\omega^{\\alpha*\\beta} \\)");
    set_text("op3-3", "\\( \\alpha*\\beta \\)");
    set_text("op3-4", "\\( \\omega^{\\alpha+\\beta} \\)");
    set_text("op3-5", "\\( \\alpha+\\beta \\)");
    a = Math.min(Math.max(get_mode()[0] - 6, 0), 2);
    a = ["\\psi_\\alpha(\\beta)", "\\Xi(\\alpha)", "\\Psi_\\mathbb{X}^\\alpha"][a];
    set_text("op4-0", `\\( ${a} \\)`);
    a = ["\\psi_\\alpha^*(\\beta)", "\\rho_\\alpha(\\beta)", "X(\\alpha)"];
    a = a.concat(["\\mathfrak{p}_\\mathbb{X}^\\alpha", "\\mathfrak{P}_\\mathbb{X}^\\alpha"]);
    set_text("op4-1", `\\( ${a[Math.max(get_mode()[0] - 5, 0)]} \\)`);
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
    set_text("op7-2", "\\( \\psi_{\\Omega_\\alpha}(\\beta) \\)");
    set_text("op7-3", "\\( \\omega^{\\Omega_\\alpha+\\beta} \\)");
    set_text("op8-0", "\\( \\chi_\\alpha(\\beta) \\)");
    set_text("op8-1", "\\( \\Omega_{1+\\beta} \\)");
    set_text("op8-2", "\\( I_{1+\\beta} \\)");
    set_text("op9-0", `\\( ${data.save.options.specify ? "X" : "\\Xi"}(\\alpha) \\)`);
    set_text("op9-1", `\\( ${data.save.options.specify ? "X" : "\\Xi"}_\\alpha \\)`);
    set_text("op9-2", "\\( I \\)");
    set_text("op9-3", "\\( M \\)");
    set_text("op9-4", "\\( N \\)");
    set_text("op10-0", "\\( K \\)");
    set_text("op10-1", "\\( \\mathcal{K} \\)");
    set_text("op11-0", "\\( \\mathbb{F}_\\kappa(\\cdots) \\)");
    set_text("op11-1", "\\( [\\kappa,\\cdots] \\)");
    set_text("op11-2", "\\( [\\kappa\\cdots] \\)");
    set_text("op12-0", words().option.off);
    set_text("op12-1", words().option.on);
    MathJax.typesetPromise([document.querySelector(".options")]);
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
    let button = document.querySelector(".contents span");
    button.innerHTML = words()[data.save.contents ? "hide" : "show"];
    set_display(document.querySelector(".contents-content"), data.save.contents);
}
// SET CONTENTS
function set_contents(){
    let text = "", id = [0, 0, 0, 0, 0, 0], depth, index;
    let hs = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
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
// SET MATHJAX IN HELP GRADUALLY
async function gradual_mathjax_help(elements, n = 10){
    if (get_mode()[1] !== 3) return;
    if (!elements.length) return;
    await MathJax.typesetPromise(elements.slice(0, n));
    await new Promise(x => setTimeout(x, 10));
    await gradual_mathjax_help(elements.slice(n), n);
}
// SET MATHJAX GRADUALLY
async function gradual_mathjax_sheet(elements, n = 10){
    if (get_mode()[1] !== 4) return;
    await MathJax.typesetPromise(elements.slice(0, n));
    await new Promise(x => setTimeout(x, 10));
    await gradual_mathjax_sheet(elements.slice(n), n);
}
// SET HELP
async function set_help(){
    let filename, content, hash;
    MathJax.typesetClear([document.querySelector(".help")]);
    if (get_mode()[1] !== 3){
        document.querySelector(".help").innerHTML = "";
        return;
    }
    document.querySelector(".help").innerHTML = words().loading;
    document.querySelector(".help").scrollTop = 0;
    if (!get_mode()[0]) return;
    filename = "ASSETS/DATA/";
    filename += data.resources.help[get_mode()[0] - 1];
    filename += `_${data.constant.langs[data.save.lang]}.html`;
    content = to_dom(await (await fetch(filename)).text());
    content = add_space(content.getElementsByTagName("body")[0].innerHTML, 12);
    content = "\n" + " ".repeat(20) + `<div class="contents"></div>` + content;
    document.querySelector(".help").innerHTML = content;
    set_contents();
    hash = window.location.hash;
    if (hash) document.getElementById(hash.slice(1)).scrollIntoView();
    gradual_mathjax_help(Array.from(document.querySelectorAll(".help > *")));
}
// CHANGE PAGE
function change_page(page = null){
    let p;
    if (page === null){
        p = document.getElementById("page1").value;
        if (num_validity(p, 0) ? (p <= 0 || p > data.resources.sheet.pages) : true){
            alert(words().sheet.invalid_page.replace("${max}", `${data.resources.sheet.pages}`));
            return;
        }
        p = Number(p);
    } else p = data.save.sheet.page + page * 2;
    data.save.sheet.page = p - 1;
    save_data();
    set_sheet();
}
// SET SHEET HELP DIRECT
function set_sheet_help(){
    let content = data.sheet_help.getElementById(`help${z(data.save.sheet.page, 2)}`).innerHTML;
    content = add_space(content, 12);
    document.querySelector(".sheet-help").innerHTML = content;
    gradual_mathjax_sheet(Array.from(document.querySelectorAll(".sheet-help > *")));
}
// SET SHEET HELP WITH LOADING
async function set_sheet_help_load(){
    let l = lang(), filename, content;
    if (l !== data.sheet_lang){
        filename = `ASSETS/DATA/${data.resources.sheet.help}_${l}.html`;
        content = to_dom(await (await fetch(filename)).text());
        if (l !== lang()) return;
        data.sheet_lang = l;
        data.sheet_help = content;
    }
    set_sheet_help();
}
// CHANGE ZOOM
function change_zoom(zoom = null){
    let z, grades = [];
    if (zoom === null){
        z = document.getElementById("zoom1").value;
        if (!num_validity(z, 1)){
            alert(words().sheet.invalid_zoom);
            return;
        }
        z = Number(z);
    } else {
        for (let i = 0; i < 4; i++){
            grades = grades.concat(Array.from({length: 10}, (x, y) => (y + 10) * 5 * 2 ** (i - 1)));
        }
        grades.push(400);
        if (zoom) z = Math.min.apply(null, grades.filter(x => x > data.save.sheet.zoom));
        else z = Math.max.apply(null, grades.filter(x => x < data.save.sheet.zoom));
    }
    data.save.sheet.zoom = z;
    save_data();
    set_sheet_zoom();
}
// SET ZOOM
function set_sheet_zoom(){
    document.getElementById("zoom1").value = "";
    document.getElementById("zoom1").placeholder = `${data.save.sheet.zoom}`;
    if (data.save.sheet.zoom > 25){
        document.getElementById("zb1").className = "sheet-button button1";
        document.getElementById("zb1").setAttribute("onclick", "change_zoom(0);");
    } else {
        document.getElementById("zb1").className = "sheet-disabled";
        document.getElementById("zb1").removeAttribute("onclick");
    }
    if (data.save.sheet.zoom < 400){
        document.getElementById("zb2").className = "sheet-button button1";
        document.getElementById("zb2").setAttribute("onclick", "change_zoom(1);");
    } else {
        document.getElementById("zb2").className = "sheet-disabled";
        document.getElementById("zb2").removeAttribute("onclick");
    }
    document.querySelector(".sheet-screen").style.fontSize = `${data.save.sheet.zoom}%`;
}
// CHANGE COPY
function change_copy(){
    data.save.sheet.copy = !data.save.sheet.copy;
    save_data();
    set_sheet_ordinal();
}
// SET SHEET COPY
function set_sheet_copy(){
    let cp = words().sheet["copy_" + (data.save.sheet.copy ? "enabled" : "disabled")];
    document.querySelector(".sheet-copy").innerHTML = cp;
}
// SET SHEET TABLE ORDINAL
function set_sheet_ordinal(){
    let ordinals = document.querySelectorAll(".sheet-ordinal");
    for (let i = 0; i < ordinals.length; i++){
        ordinals[i].className = "sheet-ordinal" + (data.save.sheet.copy ? " button2" : "");
    }
    set_sheet_copy();
}
// SET SHEET TABLE
async function set_sheet_table(){
    let p = data.save.sheet.page, line = [], table;
    let filename = `ASSETS/DATA/${data.resources.sheet.content}${z(p, 2)}.json`;
    let content = JSON.parse(await (await fetch(filename)).text());
    if (p !== data.save.sheet.page) return;
    for (let i = 0; i < data.resources.sheet.page_size; i++){
        for (let j = 0; j < data.resources.sheet.names.length; j++){
            if (content[i][j] !== null && !line.includes(j)) line.push(j);
        }
    }
    line.sort();
    table = `<table><tbody><tr>`;
    for (let i = 0; i < line.length; i++){
        table += `<th>${data.resources.sheet.names[line[i]]}</th>`;
    }
    table += `</tr>`;
    for (let i = 0; i < data.resources.sheet.page_size; i++){
        table += `<tr>`;
        for (let j = 0; j < line.length; j++){
            table += `<td`;
            if (data.resources.sheet.names[line[j]] === "#") table += ` style="text-align: end;"`;
            if (data.resources.sheet.rules[line[j]] !== null && content[i][line[j]] !== null){
                table += ` class="sheet-ordinal"`;
                table += ` onclick="if (data.save.sheet.copy) copy('${content[i][line[j]]}');"`;
            }
            table += `>`;
            if (content[i][line[j]] !== null) if (data.resources.sheet.rules[line[j]] === null){
                table += content[i][line[j]];
            } else table += display(
                content[i][line[j]],
                data.constant.systems[data.resources.sheet.rules[line[j]]],
                display_mode(),
                data.resources.sheet.options,
            );
            table += `</td>`;
        }
        table += `</tr>`;
    }
    table += `</tbody></table>`;
    document.querySelector(".sheet-screen").innerHTML = table;
    set_sheet_ordinal();
    gradual_mathjax_sheet(Array.from(document.querySelectorAll(".sheet-screen td")));
}
// SET SHEET
function set_sheet(){
    MathJax.typesetClear([document.querySelector(".sheet-help")]);
    MathJax.typesetClear([document.querySelector(".sheet-screen")]);
    if (get_mode()[1] !== 4){
        document.querySelector(".sheet-help").innerHTML = "";
        document.querySelector(".sheet-screen").innerHTML = "";
        return;
    }
    document.querySelector(".sheet-help").innerHTML = words().loading;
    document.querySelector(".sheet-screen").innerHTML = words().loading;
    let n = z(data.save.sheet.page * data.resources.sheet.page_size, 4) + "-";
    n += z((data.save.sheet.page + 1) * data.resources.sheet.page_size - 1, 4);
    document.querySelector(".sheet-title").innerHTML = words().sheet.ordinal.replace("${n}", n);
    document.getElementById("page1").value = "";
    document.getElementById("page1").placeholder = `${data.save.sheet.page + 1}`;
    set_text("page2", `/${data.resources.sheet.pages}`);
    set_text("page3", words().sheet.jump);
    set_text("zoom2", words().sheet.apply);
    if (data.save.sheet.page > 0){
        document.getElementById("pb1").className = "sheet-button button1";
        document.getElementById("pb1").setAttribute("onclick", "change_page(0);");
    } else {
        document.getElementById("pb1").className = "sheet-disabled";
        document.getElementById("pb1").removeAttribute("onclick");
    }
    if (data.save.sheet.page < data.resources.sheet.pages - 1){
        document.getElementById("pb2").className = "sheet-button button1";
        document.getElementById("pb2").setAttribute("onclick", "change_page(1);");
    } else {
        document.getElementById("pb2").className = "sheet-disabled";
        document.getElementById("pb2").removeAttribute("onclick");
    }
    if (lang() !== data.sheet_lang) set_sheet_help_load();
    else set_sheet_help();
    set_sheet_zoom();
    set_sheet_copy();
    set_sheet_table();
}
// SET SYSTEM
function set_system(){
    data.system.history = [""];
    data.system.position = 0;
    data.system.initial = "A";
    data.system.chains = [[]];
    data.system.select = null;
    data.system.search = null;
    document.querySelector(".cal-bar").value = "";
    if (rule() !== null) set_console();
}
// SET MAIN INTERFACE
function set_main(){
    set_title();
    if (data.mode1 === get_mode()[0] && data.mode2 === get_mode()[1]) return;
    set_display(document.querySelector(".menu"), !get_mode()[0]);
    set_display(document.querySelector(".system"), get_mode()[0]);
    set_display(document.querySelector(".tab-main"), rule() !== null);
    set_display(document.querySelector(".calculate"), get_mode()[1] === 0);
    set_display(document.querySelector(".explore"), get_mode()[1] === 1);
    set_display(document.querySelector(".options"), get_mode()[1] === 2);
    set_display(document.querySelector(".help"), get_mode()[1] === 3);
    set_display(document.querySelector(".sheet"), get_mode()[1] === 4);
    set_menu();
    set_tab();
    if (data.mode1 != get_mode()[0]) set_system();
    data.mode1 = get_mode()[0];
    data.mode2 = get_mode()[1];
    if (get_mode()[0]){
        if (data.lang) set_lang();
        if (get_mode()[1] === 0){
            if (data.no_console) set_console();
            set_input();
            set_preset();
        }
        if (get_mode()[1] === 1) set_explore();
        if (get_mode()[1] === 2) set_options();
        set_help();
        set_sheet();
    }
}
// CHANGE MODE
function change_mode(mode){
    if (get_mode()[0] === mode) return;
    let m = (mode === 1) * 3 + (mode === 10) * 4;
    data.change = 1000;
    data.destination = `?mode=${mode}-${m}&ver=${data.constant.save.version}`;
}
// CHANGE TAB
function change_tab(tab){
    if (get_mode()[1] === tab) return;
    change_url(`?mode=${get_mode()[0]}-${tab}&ver=${data.constant.save.version}`);
    set_main();
}
// UPDATE MAIN INTERFACE
function update_main(t1, t2){
    let oc, op;
    if (!data.change) return;
    oc = data.change;
    data.change = Math.max(data.change - t1 + t2, 0);
    op = Math.min(Math.abs(data.change - 500), 500) / 500;
    document.querySelector(".main").style.opacity = op;
    document.querySelector(".main").style.userSelect = data.change ? "none" : "auto";
    document.querySelector(".main").style.msUserSelect = data.change ? "none" : "auto";
    document.querySelector(".main").style.WebkitUserSelect = data.change ? "none" : "auto";
    document.querySelector(".main").style.pointerEvents = data.change ? "none" : "auto";
    if (oc >= 500 && data.change < 500){
        if (data.destination) change_url(data.destination);
        set_main();
    }
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
    document.querySelector(".cal-bar").placeholder = words().input;
}
// SET CONSOLE
function set_console(text = null, error = false){
    let t = [], a, b, rep, content = "";
    data.no_console = document.querySelector(".calculate").hasAttribute("style");
    if (data.no_console) return;
    if (text === null){
        t.push(words().console.initial);
        a = "";
        for (let i = 0; i < 2 + (get_mode()[0] === 7) + ([8, 9].includes(get_mode()[0])) * 2; i++){
            b = words().console.rep2.replace("${a}", "BCDE"[i]);
            b = b.replace("${b}", display_mode() < 2 ? "bcde"[i] : `\\( ${"bcde"[i]} \\)`);
            a += b;
        }
        t.push(words().console.rep1.replace("${rep}", a));
        rep = (a, b) => words().console.rep3.replace("${a}", a).replace("${b}", b);
        t.push(rep(words().console.empty, display2("", true)));
        t.push(rep(words().console.str.replace("${str}", "A"), display2("A", true)));
        if (get_mode()[0] === 8){
            t.push(rep(words().console.str.replace("${str}", "Z"), display2("Z", true)));
        }
        if (get_mode()[0] === 9){
            t.push(rep(words().console.str.replace("${str}", "Y"), display2("Y", true)));
        }
        t.push(rep("BC", display_mode() < 2 ? "b+c" : "\\( b+c \\)"));
        if (get_mode()[0] === 2){
            if (display_mode() < 2) t.push(rep("(B)", "ω<sup>b</sup>"));
            else t.push(rep("(B)", "\\( \\omega^b \\)"));
        }
        if (get_mode()[0] === 3){
            if (display_mode() < 2) t.push(rep("(B,C)", "φ<sub>b</sub>(c)"));
            else t.push(rep("(B,C)", "\\( \\varphi_b(c) \\)"));
        }
        if (get_mode()[0] === 4){
            if (display_mode() < 2) t.push(rep("(B,C)", "ψ<sub>b</sub>(c)"));
            else t.push(rep("(B,C)", "\\( \\psi_b(c) \\)"));
        }
        if (get_mode()[0] === 5){
            if (display_mode() < 2){
                a = data.save.options.specify ? "ψ<sub>b</sub><sup>*</sup>(c)" : "ψ<sub>b</sub>";
            } else {
                a = data.save.options.specify ? "\\( \\psi_b^*(c) \\)" : "\\( \\psi_b(c) \\)";
            }
            t.push(rep("(B,C)", a));
        }
        if (get_mode()[0] === 6){
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
        if (get_mode()[0] === 7){
            if (display_mode() < 2){
                t.push(rep("(vB,C)", "φ<sub>b</sub>(c)"));
                t.push(rep("(WB)", "Ω<sub>b</sub>"));
                a = data.save.options.specify ? "X" : "Ξ";
                a = data.save.options.rexi ? `${a}<sub>b</sub>` : `${a}(b)`;
                t.push(rep("(XB)", a));
                t.push(rep("(RB,C,D)", "Ψ<sub>b</sub><sup>c</sup>(d)"));
            } else {
                t.push(rep("(vB,C)", "\\( \\varphi_b(c) \\)"));
                t.push(rep("(WB)", "\\( \\Omega_b \\)"));
                a = data.save.options.specify ? "X" : "\\Xi";
                a = data.save.options.rexi ? `\\( ${a}_b \\)` : `\\( ${a}(b) \\)`;
                t.push(rep("(XB)", a));
                t.push(rep("(RB,C,D)", "\\( \\Psi_b^c(d) \\)"));
            }
        }
        if (get_mode()[0] === 8){
            if (display_mode() < 2){
                t.push(rep("(vB,C)", "φ<sub>b</sub>(c)"));
                t.push(rep("(+B)", "b<sup>+</sup>"));
                a = data.save.options.ref ? "[b,c,d,...]" : "F<sub>b</sub>(c,d,...)";
                a = `${data.save.options.specify ? "st" : "Ψ"}<sub>${a}</sub><sup>e</sup>`;
            } else {
                t.push(rep("(vB,C)", "\\( \\varphi_b(c) \\)"));
                t.push(rep("(+B)", "\\( b^+ \\)"));
                a = data.save.options.ref ? "[b,c,d,\\cdots]" : "\\mathbb{F}_b(c,d,\\cdots)";
                a = `\\( \\${data.save.options.specify ? "mathfrak{p}" : "Psi"}_{${a}}^e \\)`;
            }
            t.push(rep("(sB,C,D,...,E)", a));
        }
        if (get_mode()[0] === 9){
            if (display_mode() < 2){
                t.push(rep("(vB,C)", "φ<sub>b</sub>(c)"));
                t.push(rep("(+B)", "b<sup>+</sup>"));
                t.push(rep("(TB)", "Θ(b)"));
                a = data.save.options.ref ? "[b,c,d,...]" : "F<sub>b</sub>(c,d,...)";
                a = `${data.save.options.specify ? "St" : "Ψ"}<sub>${a}</sub><sup>e</sup>`;
            } else {
                t.push(rep("(vB,C)", "\\( \\varphi_b(c) \\)"));
                t.push(rep("(+B)", "\\( b^+ \\)"));
                t.push(rep("(TB)", "\\( \\Theta(b) \\)"));
                a = data.save.options.ref ? "[b,c,d,\\cdots]" : "\\mathbb{F}_b(c,d,\\cdots)";
                a = `\\( \\${data.save.options.specify ? "mathfrak{P}" : "Psi"}_{${a}}^e \\)`;
            }
            t.push(rep("(SB,C,D,...,E)", a));
        }
    } else t = text;
    for (let i = 0; i < t.length; i++){
        content += t[i] ? `<div${error ? ` class="error"` : ""}>${t[i]}</div>` : "<br>";
    }
    MathJax.typesetClear([document.querySelector(".cal-console")]);
    document.querySelector(".cal-console").innerHTML = content;
    MathJax.typesetPromise([document.querySelector(".cal-console")]);
}
// SET PRESET
function set_preset(){
    let text = "", command;
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
        text += `<input class="cal-item" name="name" autocomplete="off" `;
        text += `placeholder="${words().name}" `;
        text += `onfocusout="check_preset(${i * 2});"></input>`;
        text += `<input class="cal-item" name="ordinal" autocomplete="off" `;
        text += `placeholder="${words().ordinal}" `;
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
    let item = document.querySelectorAll(".cal-item")[n + 2].value, valid = true;
    if (item === "") valid = false;
    if (item.includes(" ")) valid = false;
    if (item.includes("\"")) valid = false;
    if (item.includes("[")) valid = false;
    if (item.includes("]")) valid = false;
    for (let i = 0; i < presets().length; i++) if (item === presets()[i].name) valid = false;
    if (n === presets().length * 2){
        if (valid){
            data.save.presets[get_mode()[0] - 2].push({name: item, content: ""});
            save_data();
        }
    } else if (n < presets().length * 2){
        if (n % 2){
            data.save.presets[get_mode()[0] - 2][(n - 1) / 2].content = item;
            save_data();
        } else if (item === "" && data.save.presets[get_mode()[0] - 2][n / 2].content === ""){
            data.save.presets[get_mode()[0] - 2] =
                presets().slice(0, n / 2).concat(presets().slice(n / 2 + 1));
            save_data();
        } else if (valid){
            data.save.presets[get_mode()[0] - 2][n / 2].name = item;
            save_data();
        }
    }
    set_preset();
}
// IMPORT PRESET
function preset_import(){
    let input, command;
    input = document.createElement("input");
    input.type = "file";
    command = function (e){
        let file, reader, command;
        file = e.target.files[0];
        reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        command = function (e){
            let load, error = false, result = [];
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
                data.save.presets[get_mode()[0] - 2] = result;
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
    let filename = `Save_${rule().name}.json`;
    saveAs(new File([JSON.stringify(presets())], filename, {type: "text/plain;charset=utf-8"}));
}
// RESET PRESET
function preset_reset(reset){
    if (reset){
        data.save.presets[get_mode()[0] - 2] = clone(data.constant.save.presets[get_mode()[0] - 2]);
        save_data();
        set_console([words().console.reset_success]);
        set_preset();
    } else set_console([words().console.reset_cancel]);
}
// SHIFT COMMAND
function shift_command(prev){
    if (!data.system.position) data.system.history[0] = document.querySelector(".cal-bar").value;
    data.system.position = Math.max(data.system.position + prev * 2 - 1, 0);
    data.system.position = Math.min(data.system.position, data.system.history.length - 1);
    document.querySelector(".cal-bar").value = data.system.history[data.system.position];
}
// SAVE COMMAND
function save_command(){
    data.system.history[0] = document.querySelector(".cal-bar").value;
    data.system.history.unshift("");
    data.system.position = 0;
}
// READ COMMAND
function read_command(){
    save_command();
    execute_command(document.querySelector(".cal-bar").value);
}
// EXECUTE COMMAND
function execute_command(code){
    // READ CODE
    let sections = [], c = "", quote = false, empty = true, old, a, b, n, l, r, t1, t2, text;
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
    // DISPLAY
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
    // COF
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
    // COMP
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
    // FS
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
                t2 = display2(rule().fs(t2, "A", true));
                if ([8, 9].includes(get_mode()[0])) if (display_mode() === 2){
                    t2 = t2.slice(3, -3).replace(display2("A").slice(3, -3), "\\alpha");
                    t2 = `\\( sup\\{${t2}\\in T|\\alpha&lt;${display2("A").slice(3, -3)}\\} \\)`;
                } else t2 = `sup{${t2.replace(display2("A"), "a")}∈T|a&lt;${display2("A")}}`;
                text[0] = text[0].replace("${b}", t2);
            } else {
                t2 = display2(t2);
                text.push(words().console.warning_uc.replace("${ord}", t2));
            }
        } else t2 = display2(t2);
        if (display_mode() < 2) text.push("α=" + t2);
        else text.push("\\( \\alpha=" + t2.slice(3));
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
    // REF
    if (sections[0] === "ref"){
        if (sections.length !== 2){
            set_console(fm("ref ord"), true);
            return;
        }
        if (![8, 9].includes(get_mode()[0])){
            set_console([er(words().error.not_supported1), words().error.not_supported2], true);
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
        text = [];
        a = (d, m) => d(simplify(rule().mathref(sections[1], !display_mode() * 4 + m), doption()));
        b = rule().single(sections[1]) && sections[1].length > 1;
        if (rule().isreg(sections[1])){
            if (display_mode() < 2) t1 = a(html, 0) + "=" + a(html, 2);
            else t1 = a(mathjax, 0).slice(0, -3) + "=" + a(mathjax, 2).slice(3);
        } else t1 = words().console.ref_undefined.replace("${ord}", display2(sections[1]));
        text.push(t1);
        if (b ? "sS".includes(sections[1][1]) : false){
            if (display_mode() < 2) t1 = a(html, 1) + "=" + a(html, 3);
            else t1 = a(mathjax, 1).slice(0, -3) + "=" + a(mathjax, 3).slice(3);
            text = text.concat(["", t1]);
        }
        if (rule().isreg(sections[1])){
            if (display_mode() === 2) t1 = `\\( \\vec{R}_{${display2(sections[1]).slice(3, -3)}}=`;
            else t1 = `<ruby>R<rt>→</rt></ruby><sub>${display2(sections[1])}</sub>=`;
            a = display_mode() < 2 ? html : mathjax;
            a = a(simplify(rule().mathrvec(sections[1], !display_mode()), doption()));
            if (display_mode() === 2) a = a.slice(3);
            t1 += a;
            text = text.concat(["", t1]);
        }
        if (b ? "sS".includes(sections[1][1]) : false){
            a = simplify(rule().mathref(sections[1], !display_mode() * 4 + 1), doption());
            if (display_mode() < 2){
                t1 = `M<sub>${html(a)}</sub><sup>`;
                t1 += display2(rule().vsp(sections[1]).slice(-1)[0]) + "</sup>";
            } else {
                t1 = `\\( \\mathfrak{M}_{${mathjax(a).slice(3, -3)}}^{`;
                t1 += display2(rule().vsp(sections[1]).slice(-1)[0]).slice(3, -3) + "} \\)";
            }
            t1 = words().console.ref_set.replace("${set}", t1);
            t1 = t1.replace("${a}", display_mode() === 2 ? "\\( \\alpha \\)" : "α");
            text = text.concat(["", t1]);
            t1 = display2(rule().vsp(sections[1])[0]);
            if (display_mode() < 2) t1 = "1. α&lt;" + t1;
            else t1 = "1. \\( \\alpha&lt;" + t1.slice(3);
            text.push(t1);
            n = 0;
            a = simplify(rule().mathref(sections[1], !display_mode() * 4 + 3), doption());
            a = (display_mode() < 2 ? html : mathjax)(a).split(";")[1];
            if (a.includes("M")){
                if (display_mode() === 2) a = "\\mathfrak" + a.replace("-{P}", "-P");
                if (display_mode() < 2) t1 = "2. α∈" + a.split("-P")[0];
                else t1 = `2. \\( \\alpha\\in${a.split("-P")[0]} \\)`;
                text.push(t1);
                n++;
            }
            t1 = display2(rule().vsp(sections[1]).slice(-1)[0]);
            if (display_mode() < 2){
                t1 = `${n + 2}. C(${t1},α)∩${display2(rule().vsp(sections[1])[0])}=α`;
            } else {
                t1 = `${n + 2}. \\( C(${t1.slice(3, -3)},\\alpha)\\cap`;
                t1 += display2(rule().vsp(sections[1])[0]).slice(3, -3) + "=\\alpha \\)";
            }
            text.push(t1);
            a = simplify(rule().mathref(sections[1], !display_mode() * 4 + 1), doption());
            if (display_mode() < 2){
                t1 = `${n + 3}. ${html(a)},`;
                t1 += display2(rule().vsp(sections[1]).slice(-1)[0]);
                t1 += "∈C(α)";
            } else {
                t1 = `${n + 3}. ${mathjax(a).slice(0, -3)},`;
                t1 += display2(rule().vsp(sections[1]).slice(-1)[0]).slice(3, -3);
                t1 += "\\in C(\\alpha) \\)";
            }
            text.push(t1);
            if (rule().isreg(sections[1])){
                if (get_mode()[0] === 8){
                    r = rule().plug(sections[1]);
                    if (r.includes("s")) r = rule().asp(r)[1];
                    l = rule().ref(rule().vsp(sections[1])[0], 2).slice(1);
                    l.push([
                        rule().vsp(sections[1])[0],
                        rule().vsp(sections[1]).slice(-1)[0],
                        rule().fs(r),
                    ]);
                    for (let i = 0; i < l.length; i++){
                        t1 = "";
                        if (rule().lt(rule().bound(l[i][0], 0)[0], l[i][1])){
                            if (display_mode() < 2){
                                t1 += "M<sub>";
                                t2 = display2(l[i][0]);
                                t2 = simplify([["f", [t2], ["\\cdots"]]], doption());
                                t1 += html(t2) + "</sub><sup>&lt;";
                                t1 += display2(l[i][1]) + "</sup>-";
                            } else {
                                t1 += "\\( \\mathfrak{M}_{";
                                t2 = display2(l[i][0]).slice(3, -3);
                                t2 = simplify([["f", [t2], ["\\cdots"]]], doption());
                                t1 += mathjax(t2).slice(3, -3) + "}^{&lt;";
                                t1 += display2(l[i][1]).slice(3, -3) + "} \\)-";
                            }
                        }
                        if (display_mode() < 2){
                            if (display_mode()) t2 = display2(l[i][2]);
                            else t2 = `${rule().to_num(l[i][2])}`;
                            t1 += `Π<sub>${t2}</sub><sup>1</sup>`;
                        } else t1 += `\\( \\Pi_{${display2(l[i][2]).slice(3, -3)}}^1 \\)`;
                        t1 = words().console.ref_indescribable.replace("${mp}", t1);
                        t1 = t1.replace("${a}", display_mode() === 2 ? "\\( \\alpha \\)" : "α");
                        t1 = `${n + i + 4}. ${t1}`;
                        text.push(t1);
                    }
                }
                if (get_mode()[0] === 9){
                    r = rule().mpsp(rule().plug(sections[1]));
                    if (rule().mpsp(rule().ref(rule().vsp(sections[1])[0], 1))[1].includes("a")){
                        r = r[1];
                    } else r = rule().fs(r[1]);
                    l = rule().cl(rule().ref(rule().vsp(sections[1])[0], 2), r);
                    l = l.concat(rule().ref(rule().vsp(sections[1])[0], 2).slice(1));
                    l.push([rule().vsp(sections[1])[0], rule().vsp(sections[1]).slice(-1)[0], r]);
                    for (let i = 0; i < l.length; i++){
                        t1 = "";
                        if (l[i][1]) if (rule().lt(rule().bound(l[i][0], 0)[0], l[i][1])){
                            if (display_mode() < 2){
                                t1 += "M<sub>";
                                t2 = display2(l[i][0]);
                                t2 = simplify([["f", [t2], ["\\cdots"]]], doption());
                                t1 += html(t2) + "</sub><sup>&lt;";
                                t1 += display2(l[i][1]) + "</sup>-";
                            } else {
                                t1 += "\\( \\mathfrak{M}_{";
                                t2 = display2(l[i][0]).slice(3, -3);
                                t2 = simplify([["f", [t2], ["\\cdots"]]], doption());
                                t1 += mathjax(t2).slice(3, -3) + "}^{&lt;";
                                t1 += display2(l[i][1]).slice(3, -3) + "} \\)-";
                            }
                        }
                        a = rule().isp(l[i][2]);
                        if (a[0]) t1 += display2(a[0]) + "-";
                        if (display_mode() < 2){
                            if (display_mode()) t2 = display2(a[1]);
                            else t2 = `${rule().to_num(a[1])}`;
                            t1 += `Π<sub>${t2}</sub><sup>1</sup>`;
                        } else t1 += `\\( \\Pi_{${display2(a[1]).slice(3, -3)}}^1 \\)`;
                        t1 = words().console.ref_indescribable.replace("${mp}", t1);
                        t1 = t1.replace("${a}", display_mode() === 2 ? "\\( \\alpha \\)" : "α");
                        t1 = `${n + i + 4}. ${t1}`;
                        text.push(t1);
                    }
                }
            }
        }
        set_console(text);
        return;
    }
    // FGH
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
    // SGH
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
            if (rule().type(t1[0]) === 0) t1 = t1.slice(-1);
            else if (rule().type(t1[0]) === 1){
                t1[0] = rule().fs(t1[0]);
                t1[2]++;
            } else if (rule().type(t1[0]) === 2) t1[0] = rule().fs(t1[0], rule().to_str(t1[1]));
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
    // MGH
    if (sections[0] === "mgh"){
        if (![3, 4].includes(sections.length)){
            set_console(fm("mgh ord n [steps=1]"), true);
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
                set_console([er(words().error.uncountable), words().error.uncountable_mgh], true);
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
            text = [`\\( \\begin{align} & m_{${display2(sections[1]).slice(3, -3)}}(${t1}) \\\\`];
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
                    t1[t1.length - 2] = 2;
                } else {
                    t1[t1.length - 2]--;
                    t1 = t1.slice(0, t1.length - 1).concat([rule().fs(t1[t1.length - 3]),
                                                           2, t1[t1.length - 1]]);
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
                    text[0] += `m<sub>${display2(t1[j * 2])}</sub>`;
                    text[0] += `${t1[j * 2 + 1] > 1 ? `<sup>${t1[j * 2 + 1]}</sup>` : ""}(`;
                } else {
                    text[0] += `m_{${display2(t1[j * 2]).slice(3, -3)}}`;
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
    // HH
    if (sections[0] === "hh"){
        if (![3, 4].includes(sections.length)){
            set_console(fm("hh ord n [steps=1]"), true);
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
                set_console([er(words().error.uncountable), words().error.uncountable_hh], true);
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
            text = [`&nbsp;&nbsp;H<sub>${display2(sections[1])}</sub>(${t1})<br>`];
        } else {
            text = [`\\( \\begin{align} & H_{${display2(sections[1]).slice(3, -3)}}(${t1}) \\\\`];
        }
        t1 = [sections[1], t1];
        for (let i = 0; i < t2; i++){
            if (rule().type(t1[0]) === 0) t1 = t1.slice(-1);
            else if (rule().type(t1[0]) === 1){
                t1[0] = rule().fs(t1[0]);
                t1[1]++;
            } else if (rule().type(t1[0]) === 2){
                t1[0] = rule().fs(t1[0], rule().to_str(t1[1]));
            }
            text[0] += display_mode() < 2 ? "=" : " = & ";
            if (t1.length === 1){text[0] += t1[0]; break;}
            if (display_mode() < 2) text[0] += `H<sub>${display2(t1[0])}</sub>`;
            else text[0] += `H_{${display2(t1[0]).slice(3, -3)}}`;
            text[0] += `(${t1[1]})${display_mode() < 2 ? "<br>" : " \\\\"}`;
        }
        if (t1.length > 1) text[0] += display_mode() < 2 ? "=..." : " = & \\cdots \\\\";
        if (display_mode() === 2) text[0] += " \\end{align} \\)";
        set_console(text);
        return;
    }
    // INITIAL
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
    // SEARCH
    if (sections[0] === "search"){
        if (![2, 3].includes(sections.length)){
            set_console(fm("search ord [steps=10000]"), true);
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
        if (sections.length === 2) t1 = 10000;
        else {
            t1 = Number(sections[2]);
            if (!Number.isInteger(t1) || t1 < 0){
                set_console([er(words().error.invalid_num1), words().error.invalid_num2], true);
                return;
            }
        }
        a = (new Date).getTime();
        t2 = search(rule(), initial(), sections[1], t1);
        if (t2 === null){
            text = [er(words().error.not_found1), words().error.not_found2];
            text[1] = text[1].replace("${a}", display2(sections[1]));
            text[1] = text[1].replace("${b}", display2(initial()));
            text[1] = text[1].replace("${c}", t1);
            set_console(text, true);
            return;
        }
        chain_search(t2);
        a = (new Date).getTime() - a;
        text = words().console.search_success1;
        text = text.replace("${ord}", display2(sections[1]));
        text = text.replace("${s}", (a - a % 1000) / 1000);
        text = text.replace("${ms}", z(a % 1000, 3));
        text = [text, words().console.search_success2];
        set_console(text);
        return;
    }
    // PRESET
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
        let result = 0;
        for (let i = 0; i < chain.length; i++) result += chain[i];
        return result;
    }
}
// ORDINAL LIST
function chain_list(){
    let result = [];
    for (let i = 0; i < chains().length; i++) result.push(st(chains()[i]));
    return result;
}
// UPDATE EXPLORE
function update_explore(tab = false){
    let content = "", ord, index, y;
    for (let i = 0; i < chains().length; i++){
        ord = chainfs(rule(), initial(), chains()[i]);
        content += `<div class="ordinal" style="margin-left: `;
        content += `${indent(chains()[i], indent_mode()) * 32}px;">`;
        content += `<div class="select button2" onclick="`;
        content += `chain_select(${st(chains()[i])});">√</div>`;
        if (rule().type(ord) < 2){
            content += `<div class="disabled">+</div>`;
            content += `<div class="disabled">++</div>`;
            content += `<div class="disabled">!!!</div>`;
        } else {
            content += `<div class="plus1 button2" onclick="`;
            content += `chain_expand(${st(chains()[i])});">+</div>`;
            content += `<div class="plus2 button2" onclick="`;
            content += `chain_expand_recursive(${st(chains()[i])});">++</div>`;
            content += `<div class="plus3 button2" onclick="`;
            content += `chain_expand_all(${st(chains()[i])});">!!!</div>`;
        }
        if (feq(clone(chains()), list_collapse(clone(chains()), chains()[i]))){
            content += `<div class="disabled">-</div>`;
        } else {
            content += `<div class="minus button2" onclick="`;
            content += `chain_collapse(${st(chains()[i])});">-</div>`;
        }
        content += `<div class="copy1 button2" onclick="copy('${ord}')">${words().copy}</div>`;
        content += `<div class="ord">${display2(ord)}`;
        if (rule().type(ord) === 3){
            content += `<span class="uexp">`;
            ord = display2(rule().fs(ord, "A", true));
            if ([8, 9].includes(get_mode()[0])) if (display_mode() === 2){
                ord = ord.slice(3, -3).replace(display2("A").slice(3, -3), "\\alpha");
                ord = `\\( sup\\{${ord}\\in T|\\alpha&lt;${display2("A").slice(3, -3)}\\} \\)`;
            } else ord = `sup{${ord.replace(display2("A"), "a")}∈T|a&lt;${display2("A")}}`;
            content += words().expand_as.replace("${ord}", ord);
            content += `</span>`;
        }
        content += `</div></div>`;
    }
    document.querySelector(".ordinals").innerHTML = content;
    if (data.system.select !== null){
        index = chain_list().indexOf(data.system.select);
        document.querySelectorAll(".ordinal")[index].style.backgroundColor = "#00000010";
    }
    if (data.system.search !== null){
        index = chain_list().indexOf(data.system.search);
        document.querySelectorAll(".ordinal")[index].style.backgroundColor = "#00000020";
        if (tab){
            y = document.querySelectorAll(".ordinal")[index].getBoundingClientRect().y;
            y -= document.querySelectorAll(".ordinal")[0].getBoundingClientRect().y;
            document.querySelector(".explore").scrollTop = y;
        }
    }
    MathJax.typesetPromise([document.querySelector(".ordinals")]);
}
// SELECT
function chain_select(chain){
    if (data.system.search === st(chain)) data.system.search = null;
    else if (data.system.select === st(chain)) data.system.select = null;
    else data.system.select = st(chain);
    update_explore(true);
}
// EXPAND
function chain_expand(chain){
    if (rule().type(chainfs(rule(), initial(), chain)) < 2) return;
    data.system.chains = list_expand(data.system.chains, chain);
    update_explore();
}
// EXPAND RECURSIVELY
function chain_expand_recursive(chain){
    if (rule().type(chainfs(rule(), initial(), chain)) < 2) return;
    let old = [], added = null;
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
    let chains2 = [];
    for (let i = 0; i < chains().length; i++){
        if (!chain_lt(chain, chains()[i])) chains2.push(chains()[i]);
    }
    for (let i = 0; i < chains2.length; i++) chain_expand_recursive(chains2[i]);
}
// COLLAPSE
function chain_collapse(chain){
    data.system.chains = list_collapse(chains(), chain);
    if (!chain_list().includes(data.system.select)) data.system.select = null;
    if (!chain_list().includes(data.system.search)) data.system.search = null;
    update_explore();
}
// SEARCH AND EXPAND
function chain_search(position){
    let chains = chain_list();
    for (let i = 0; i < position.length + 1; i++) for (let j = 0; j < position[i] + 1; j++){
        if (!chains.includes(st(position.slice(0, i).concat([j])))){
            chain_expand(position.slice(0, i));
        }
    }
    data.system.search = st(position);
    if (data.system.select === data.system.search) data.system.select = null;
}
// =================================================================================================
// DATA
// =================================================================================================
// GET SYSTEM LANGUAGE
function get_lang(){
    let lan = navigator.language.toLowerCase();
    if (lan.includes("ja")) return 3;
    if (!lan.includes("zh")) return 0;
    if (lan.includes("hant")) return 2;
    if (lan.includes("hk")) return 2;
    if (lan.includes("mo")) return 2;
    if (lan.includes("tw")) return 2;
    return 1;
}
// GET MODE
function get_mode(){
    let mode = get_para("mode");
    if (mode === null) return [0, 0];
    if (!mode.includes("-")) return [0, 0];
    return [Number(mode.split("-")[0]), Number(mode.split("-")[1])];
}
// SAVE DATA
function save_data(){localStorage.setItem("data-ord", JSON.stringify(data.save));}
// LOAD DATA
async function load_data(){
    let d = JSON.parse(localStorage.getItem("data-ord")), ver, k;
    if (d === null) data.save.lang = get_lang();
    else data.save = d;
    data.resources = JSON.parse(await (await fetch("ASSETS/DATA/resources.json")).text());
    data.constant.save.presets = clone(data.resources.presets);
    k = Object.keys(data.constant.save);
    for (let i = 0; i < k.length; i++){
        if (data.save[k[i]] === undefined) data.save[k[i]] = clone(data.constant.save[k[i]]);
    }
    if (d === null){
        save_data();
        return;
    }
    ver = data.save.version === undefined ? "1.2-" : data.save.version;
    if (ver < "1.3"){
        if (data.save.options.simplify){
            data.save.options.simplify += data.save.options.simplify - 1;
        }
        if (data.save.options.rebuch > 1) data.save.options.rebuch++;
    }
    if (ver < "2.0"){
        for (let i = 0; i < 2; i++) data.save.presets.push(data.constant.save.presets[i + 6]);
        if (data.save.options.simplify >= 6){
            data.save.options.simplify = data.constant.save.options.simplify;
        }
        if (data.save.options.rebuch >= 4){
            data.save.options.rebuch = data.constant.save.options.rebuch;
        }
        data.save.options.rek = data.constant.save.options.rek;
        data.save.options.ref = data.constant.save.options.ref;
        data.save.options.square = data.constant.save.options.square;
    }
    if (ver < data.constant.save.version){
        data.save.version = data.constant.save.version;
        save_data();
    }
}
// =================================================================================================
// INITIALIZE
// =================================================================================================
// SET DATA
let data = {
    constant    : {
        langs       : ["en", "zh-Hans", "zh-Hant", "ja"],
        systems     : [
            Cantor,
            Veblen,
            Buchholz,
            ExBuchholz,
            RathjenM,
            RathjenK,
            Stegert1,
            Stegert2,
        ],
        save        : {
            version     : "2.0",
            lang        : 0,
            presets     : [],
            options     : {
                background  : 1,
                display     : 2,
                indent      : 1,
                simplify    : 5,
                specify     : 1,
                reveb1      : 5,
                reveb2      : 3,
                rebuch      : 3,
                rechi       : 2,
                rexi        : 4,
                rek         : 0,
                ref         : 1,
                square      : 0,
            },
            contents    : true,
            sheet       : {
                page    : 0,
                zoom    : 100,
                copy    : true,
            },
        },
    },
    system      : {
        rule        : null,
        history     : [""],
        position    : 0,
        initial     : "A",
        chains      : [[]],
        select      : null,
        search      : null,
    },
    resources   : null,
    now         : null,
    time        : 0,
    particles   : {},
    interval    : false,
    change      : 2000,
    background  : 500,
    destination : "",
    mode1       : null,
    mode2       : null,
    lang        : false,
    no_console  : false,
    sheet_lang  : "",
    sheet_help  : null,
    save        : {},
};
// =================================================================================================
// MAIN
// =================================================================================================
// INITIALIZE
function initialize(){
    set_title();
    set_text("version", "V" + data.constant.save.version);
    let command1 = function (e){
        if (e.key === "Enter"){
            document.querySelector(".cal-enter").click();
            e.preventDefault();
        }
        if (e.key === "ArrowUp"){
            shift_command(true);
            e.preventDefault();
        }
        if (e.key === "ArrowDown"){
            shift_command(false);
            e.preventDefault();
        }
    }
    let command2 = function (e){
        if (e.key === "Enter"){
           document.getElementById("page3").click();
            e.preventDefault();
        }
    }
    let command3 = function (e){
        if (e.key === "Enter"){
           document.getElementById("zoom2").click();
            e.preventDefault();
        }
    }
    document.querySelector(".cal-bar").addEventListener("keydown", command1);
    document.getElementById("page1").addEventListener("keydown", command2);
    document.getElementById("zoom1").addEventListener("keydown", command3);
    data.interval = true;
    data.background = data.save.options.background * 500;
}
// MAIN
async function main(){
    await load_data();
    initialize();
}
// INTERVAL
function interval(){
    if (!data.interval) return;
    let t = Date.now();
    if (data.now === null) data.now = Date.now();
    try {update(t - data.now, data.time);} catch {}
    data.time = t - data.now;
}
// SET FUNCTIONS
window.onload = main;
window.onpopstate = set_main;
setInterval(interval, 1);