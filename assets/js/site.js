/* Prime Wires: site behaviour + wire data model.
   GRADES and SIZES are the single source of truth for the calculators and the material ladder.
   All index prices, coating weights and tensile bands are indicative placeholders, see README. */

(function(){
  "use strict";

  /* ---------------- data model ---------------- */

  var GRADES = [
    { id:"gi",     name:"Galvanised (G.I.)",   base:"Low carbon mild steel", coating:"Electro galvanised zinc",
      coatingWeight:"8 to 12 g/m²",  tensile:"700 to 900 N/mm²", density:7.85, corrosion:1, corrosionLabel:"Low",
      relCost:1.0,  rate:92,  sections:"20 to 26 gauge", spools:"2, 5, 15, 25 kg", hex:"#8A9199",
      note:"Our most popular grade and the lowest cost per pin. Best for cartons kept dry and opened within a few weeks." },
    { id:"rp",     name:"Rust resistant (R.P.)", base:"Low carbon mild steel", coating:"Heavy electro zinc",
      coatingWeight:"18 to 25 g/m²", tensile:"700 to 900 N/mm²", density:7.85, corrosion:2, corrosionLabel:"Moderate",
      relCost:1.1,  rate:101, sections:"20 to 26 gauge", spools:"2, 5, 15, 25 kg", hex:"#9DA6AC",
      note:"Same steel core with a heavier zinc coating. For the monsoon season and storage without climate control." },
    { id:"pw",     name:"Power G.I. stitching wire", base:"Low carbon mild steel", coating:"Maximum electro zinc",
      coatingWeight:"30 to 40 g/m²", tensile:"700 to 900 N/mm²", density:7.85, corrosion:3, corrosionLabel:"High",
      relCost:1.3,  rate:120, sections:"20 to 26 gauge", spools:"5, 15, 25 kg", hex:"#6E767D",
      note:"Our heaviest zinc coating. For coastal warehouses and long transit." },
    { id:"cc",     name:"Copper coated",       base:"Low carbon mild steel", coating:"Electro copper",
      coatingWeight:"6 to 10 g/m²",  tensile:"700 to 900 N/mm²", density:7.85, corrosion:1.4, corrosionLabel:"Low to moderate",
      relCost:1.25, rate:115, sections:"22 to 26 gauge", spools:"2, 5, 15 kg", hex:"#C2703D",
      note:"Chosen for its look, not for rust protection. For gift cartons and book work." },
    { id:"brass",  name:"Pure brass",          base:"Solid copper and zinc alloy", coating:"None required",
      coatingWeight:"None", tensile:"620 to 780 N/mm²", density:8.50, corrosion:6, corrosionLabel:"Immune",
      relCost:7.0,  rate:640, sections:"22 to 26 gauge", spools:"2, 5, 15, 25 kg", hex:"#C9A24B",
      note:"Contains no steel, so it cannot rust. The usual choice for export and pharma cartons." },
    { id:"copper", name:"Pure copper",         base:"Electrolytic copper, solid", coating:"None required",
      coatingWeight:"None", tensile:"380 to 520 N/mm²", density:8.90, corrosion:6.2, corrosionLabel:"Immune",
      relCost:7.8,  rate:718, sections:"22 to 26 gauge", spools:"2, 5, 15 kg", hex:"#B5652F",
      note:"Solid copper with the softest clinch. Good for multiwall board and older machines." },
    /* Stainless steel is quoted on application. The client has not yet supplied a
       tensile band, a density or an index price, so it deliberately carries none:
       quoteOnly keeps it out of every arithmetic path while still listing it
       everywhere grades are enumerated. Populate density and rate to enable it. */
    { id:"ss",     name:"Stainless steel",     base:"Stainless steel, solid, no coating", coating:"None required",
      coatingWeight:"None", tensile:"On request", density:null, corrosion:6, corrosionLabel:"Immune to red rust",
      relCost:null, rate:null, sections:"22 to 26 gauge", spools:"On request", hex:"#B9BFC4", quoteOnly:true,
      note:"Solid stainless steel in magnetic and nonmagnetic grades. For food and pharmaceutical cartons." }
  ];

  /* Grades the calculators can price. The six costed grades, in their original
     order, so every existing input produces exactly the result it did before. */
  var CALC_GRADES = GRADES.filter(function(g){ return !g.quoteOnly; });

  var SIZES = [
    { gauge:20, t:0.90, w:2.20 },
    { gauge:21, t:0.80, w:2.00 },
    { gauge:22, t:0.75, w:1.90 },
    { gauge:23, t:0.63, w:1.60 },
    { gauge:24, t:0.55, w:1.40 },
    { gauge:25, t:0.50, w:1.25 },
    { gauge:26, t:0.45, w:1.15 }
  ];

  var MACHINES = [
    { id:"insun",   name:"Insun",               type:"Fully automatic box stitcher", gaugeMin:22, gaugeMax:24, spool:"15 / 25 kg reel, 200 mm core", grades:["rp","pw","brass"] },
    { id:"godswill",name:"Gods Will",            type:"Semi and fully automatic",       gaugeMin:22, gaugeMax:25, spool:"15 / 25 kg reel",             grades:["gi","rp","pw","cc","brass","copper"] },
    { id:"mepl",    name:"MEPL",                 type:"Semi automatic stitcher",      gaugeMin:23, gaugeMax:25, spool:"5 / 15 kg reel",               grades:["gi","rp"] },
    { id:"bielo",   name:"Bielomatik",           type:"Book and saddle stitching line", gaugeMin:24, gaugeMax:26, spool:"2 / 5 kg spool",               grades:["cc","brass","copper"] },
    { id:"ech",     name:"ECH",                  type:"Automatic stitcher",           gaugeMin:22, gaugeMax:24, spool:"15 kg reel",                   grades:["rp","pw","brass"] },
    { id:"joydzign",name:"Joy Dzign",            type:"Semi automatic stitcher",      gaugeMin:23, gaugeMax:25, spool:"5 / 15 kg reel",               grades:["gi","rp"] },
    { id:"manual",  name:"Manual / foot stitcher",type:"Pedal or hand operated",       gaugeMin:24, gaugeMax:26, spool:"2 / 5 kg spool",               grades:["gi","cc","copper"] }
  ];

  var ENV_GRADE = { dry:"gi", humid:"rp", coastal:"pw", export:"brass" };

  function gradeById(id){ for (var i=0;i<GRADES.length;i++) if (GRADES[i].id===id) return GRADES[i]; return GRADES[0]; }
  function gradeNames(){ return GRADES.map(function(g){ return g.name; }).join(", "); }
  function sizeByGauge(g){ g=+g; for (var i=0;i<SIZES.length;i++) if (SIZES[i].gauge===g) return SIZES[i]; return SIZES[3]; }
  function fmt(n,d){ return n.toLocaleString("en-IN",{minimumFractionDigits:d==null?2:d,maximumFractionDigits:d==null?2:d}); }
  function rupee(n){ return "₹" + fmt(n, n<1?3:2); }

  /* cross-section (t×w) × density × length consumed per stitch × price per kg, see README */
  function calcStitch(t,w,density,useMm,ratePerKg){
    var area = t*w;                              // mm²
    var volume = area*useMm;                      // mm³
    var massG = volume*density/1000;               // grams
    var costPerStitch = (massG/1000)*ratePerKg;     // rupees
    var lengthMPerKg = 1000/(area*density);         // metres of wire per kg
    return { area:area, massG:massG, costPerStitch:costPerStitch, lengthMPerKg:lengthMPerKg };
  }

  /* ---------------- chrome: year, burger, reveal, image fallback ---------------- */

  function initYear(){
    var y = new Date().getFullYear();
    document.querySelectorAll("[data-year]").forEach(function(el){ el.textContent = y; });
  }

  function initBurger(){
    var burger = document.querySelector(".burger");
    var drawer = document.getElementById("drawer");
    if (!burger || !drawer) return;
    burger.addEventListener("click", function(){
      var open = drawer.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    drawer.querySelectorAll("a").forEach(function(a){
      a.addEventListener("click", function(){ drawer.classList.remove("is-open"); burger.setAttribute("aria-expanded","false"); });
    });
  }

  /* Products dropdown. CSS already opens it on hover and on keyboard focus;
     this adds click/tap (touch screens have no hover), keeps aria-expanded
     honest, and closes it on Escape or a click anywhere else. */
  function initNavMenu(){
    document.querySelectorAll(".nav__dd").forEach(function(dd){
      var btn = dd.querySelector(".nav__btn");
      if (!btn) return;
      function set(open){
        dd.classList.toggle("is-open", open);
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      }
      btn.addEventListener("click", function(e){
        e.stopPropagation();
        var open = !dd.classList.contains("is-open");
        set(open);
        /* A click that closes it leaves focus on the label, which would hold
           it open through :focus-within; mark it dismissed so it really shuts. */
        dd.classList.toggle("is-dismissed", !open);
      });
      dd.addEventListener("mouseenter", function(){ btn.setAttribute("aria-expanded","true"); });
      dd.addEventListener("mouseleave", function(){ if (!dd.classList.contains("is-open")) btn.setAttribute("aria-expanded","false"); });
      /* Escape closes it and returns focus to the label; .is-dismissed stops
         the CSS :focus-within rule reopening it while focus sits there. */
      dd.addEventListener("keydown", function(e){
        if (e.key === "Escape" && (dd.classList.contains("is-open") || dd.contains(document.activeElement))){
          set(false); dd.classList.add("is-dismissed"); btn.focus();
        }
      });
      dd.addEventListener("focusout", function(e){
        if (!dd.contains(e.relatedTarget)){ set(false); dd.classList.remove("is-dismissed"); }
      });
      document.addEventListener("click", function(e){ if (!dd.contains(e.target)) set(false); });
    });
  }

  /* ---------------- motion: scroll reveals, header, count up ---------------- */

  var REDUCE = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Grids whose children arrive one after another, and single blocks that
     arrive on their own. Nothing in the hero is tagged: it has its own
     first-paint sequence in CSS. */
  var GROUPS = ".cards,.steps,.icon-grid,.personas,.ranges,.gallery,.plist,.faq,.cmp-list";
  var SINGLES = "main h2,main .sect__head,main .lede,main .prose,main .tbl-wrap,main .photo-card,main .ph," +
                "main .tool,main .out,main .readout,main .quote,main .callout,main .cta-card,main .strip," +
                "main .chiplist,main .flexrow,main .mq,main .ladder,main .crumbs";

  function tagForReveal(){
    var skip = ".hero,.phero";
    document.querySelectorAll(GROUPS).forEach(function(group){
      if (group.closest(skip)) return;
      var inside = group.parentElement && group.parentElement.closest(".rv");
      if (inside && !group.classList.contains("rv")) return;   // its wrapper already reveals as one
      group.classList.remove("rv","rv-d1","rv-d2");
      /* Stagger along each row only, so the third card in a row trails the
         first, but a long list does not make its tenth item wait. */
      var rowTop = null, col = 0;
      Array.prototype.forEach.call(group.children, function(child){
        var top = child.offsetTop;
        col = (rowTop !== null && Math.abs(top - rowTop) < 4) ? col + 1 : 0;
        rowTop = top;
        child.classList.add("rv");
        child.style.setProperty("--rv-delay", (Math.min(col, 5) * 0.09).toFixed(2) + "s");
      });
    });
    document.querySelectorAll(SINGLES).forEach(function(el){
      if (el.closest(skip) || el.classList.contains("rv")) return;
      if (el.parentElement && el.parentElement.closest(".rv")) return;
      el.classList.add("rv");
      if (el.matches(".ph,.photo-card")) el.classList.add("rv-zoom");
    });
  }

  function reveal(el){
    el.classList.add("is-visible");
    /* Once the reveal has run, hand the element back to its own transitions
       (card lifts, image zooms) by removing the reveal classes. */
    var delay = parseFloat(el.style.getPropertyValue("--rv-delay")) || 0;
    setTimeout(function(){
      el.classList.remove("rv","rv-d1","rv-d2","rv-zoom","is-visible");
      el.style.removeProperty("--rv-delay");
    }, 1600 + delay * 1000);
  }

  function initReveal(){
    if (!REDUCE && "IntersectionObserver" in window) tagForReveal();
    var els = document.querySelectorAll(".rv");
    if (REDUCE || !("IntersectionObserver" in window)) { els.forEach(reveal); return; }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){ reveal(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold:0.1, rootMargin:"0px 0px -6% 0px" });
    els.forEach(function(el){ io.observe(el); });
  }

  /* The header settles once the page moves: a shadow, a smaller logo, and a
     thin line along its bottom edge that fills as the reader scrolls. */
  function initHeader(){
    var hdr = document.querySelector(".hdr");
    if (!hdr) return;
    var ticking = false;
    function update(){
      ticking = false;
      var y = window.scrollY || window.pageYOffset;
      var room = document.documentElement.scrollHeight - window.innerHeight;
      hdr.classList.toggle("is-scrolled", y > 12);
      hdr.style.setProperty("--scroll", room > 0 ? Math.min(y / room, 1).toFixed(4) : 0);
    }
    window.addEventListener("scroll", function(){
      if (!ticking){ ticking = true; window.requestAnimationFrame(update); }
    }, { passive:true });
    window.addEventListener("resize", update);
    update();
  }

  /* Small whole numbers in the figure strips count up when they come into
     view. Years are left alone: nobody wants to watch 2003 count up from 0. */
  function initCountUp(){
    if (REDUCE || !("IntersectionObserver" in window)) return;
    document.querySelectorAll(".strip__val").forEach(function(el){
      var m = el.textContent.trim().match(/^(\d+)(\+?)$/);
      if (!m) return;
      var target = +m[1], suffix = m[2];
      if (target < 2 || target >= 1000) return;
      el.setAttribute("aria-label", el.textContent.trim());
      var io = new IntersectionObserver(function(entries){
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        var start = null;
        function step(t){
          if (start === null) start = t;
          var p = Math.min((t - start) / 1100, 1);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
          if (p < 1) window.requestAnimationFrame(step);
        }
        el.textContent = "0" + suffix;
        window.requestAnimationFrame(step);
      }, { threshold:0.6 });
      io.observe(el);
    });
  }

  function initImageFallback(){
    document.querySelectorAll("img[data-fallback]").forEach(function(img){
      img.addEventListener("error", function(){
        var box = document.createElement("div");
        box.style.cssText = "width:100%;height:100%;display:flex;align-items:center;justify-content:center;" +
          "background:#F4F4FA;color:#5A5875;font-family:Instrument Sans,system-ui,sans-serif;font-size:11px;text-align:center;padding:12px";
        box.textContent = img.getAttribute("alt") || "Image unavailable";
        img.replaceWith(box);
      }, { once:true });
    });
  }

  /* ---------------- material ladder (index.html) ---------------- */

  function initLadder(){
    var host = document.querySelector("[data-ladder]");
    var readout = document.querySelector("[data-readout]");
    if (!host) return;

    var maxCorrosion = Math.max.apply(null, CALC_GRADES.map(function(g){ return g.corrosion; }));
    var maxCost = Math.max.apply(null, CALC_GRADES.map(function(g){ return g.relCost; }));

    host.innerHTML = CALC_GRADES.map(function(g,i){
      return '<div class="ladder__row' + (i===0?' is-active':'') + '" data-grade="' + g.id + '" tabindex="0" role="button" aria-label="' + g.name + '">' +
        '<div class="ladder__name">' + g.name + '</div>' +
        '<div class="ladder__bar-wrap"><div class="ladder__bar" data-fill="' + (g.corrosion/maxCorrosion) + '" style="background:var(--accent)"></div></div>' +
        '<div class="ladder__bar-wrap"><div class="ladder__bar" data-fill="' + (g.relCost/maxCost) + '" style="background:var(--data-2)"></div></div>' +
      '</div>';
    }).join("");

    /* Fill the bars from zero on first paint, one deliberate entrance moment,
       driven by transform so it stays off the main thread and respects
       prefers-reduced-motion (the global media query collapses the transition). */
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        host.querySelectorAll(".ladder__bar").forEach(function(bar){
          bar.style.transform = "scaleX(" + bar.getAttribute("data-fill") + ")";
        });
      });
    });

    function renderReadout(g){
      if (!readout) return;
      readout.innerHTML =
        '<span class="eyebrow">Grade detail</span>' +
        '<h3 class="d3" style="margin-top:10px;color:var(--text-primary)">' + g.name + '</h3>' +
        '<p style="font-size:13.5px;color:var(--text-secondary);margin-top:10px;line-height:1.6">' + g.note + '</p>' +
        '<div class="readout__specs" style="margin-top:18px">' +
          '<div><span class="k">Base metal</span><span class="v">' + g.base + '</span></div>' +
          '<div><span class="k">Coating</span><span class="v">' + g.coating + '</span></div>' +
          '<div><span class="k">Coating weight</span><span class="v">' + g.coatingWeight + '</span></div>' +
          '<div><span class="k">Tensile</span><span class="v">' + g.tensile + '</span></div>' +
          '<div><span class="k">Corrosion life</span><span class="v">' + g.corrosionLabel + '</span></div>' +
          '<div><span class="k">Relative cost</span><span class="v">' + g.relCost.toFixed(1) + '×</span></div>' +
          '<div><span class="k">Index price</span><span class="v">' + rupee(g.rate) + '/kg</span></div>' +
          '<div><span class="k">Sections</span><span class="v">' + g.sections + '</span></div>' +
        '</div>';
    }

    function activate(id){
      host.querySelectorAll(".ladder__row").forEach(function(row){
        row.classList.toggle("is-active", row.getAttribute("data-grade")===id);
      });
      renderReadout(gradeById(id));
    }

    host.querySelectorAll(".ladder__row").forEach(function(row){
      var id = row.getAttribute("data-grade");
      row.addEventListener("mouseenter", function(){ activate(id); });
      row.addEventListener("focus", function(){ activate(id); });
      row.addEventListener("click", function(){ activate(id); });
      row.addEventListener("keydown", function(e){ if (e.key==="Enter" || e.key===" "){ e.preventDefault(); activate(id); } });
    });

    activate(CALC_GRADES[0].id);
  }

  /* ---------------- cost per pin calculator ---------------- */

  function initCostPerPin(){
    var host = document.querySelector("[data-cpp]");
    if (!host) return;

    var gradeSel = document.getElementById("cpp-grade");
    var sizeSel  = document.getElementById("cpp-size");
    var rateInp  = document.getElementById("cpp-rate");
    var useInp   = document.getElementById("cpp-use");
    var pinsInp  = document.getElementById("cpp-pins");
    var boxesInp = document.getElementById("cpp-boxes");
    var valueInp = document.getElementById("cpp-value");

    gradeSel.innerHTML = CALC_GRADES.map(function(g){ return '<option value="' + g.id + '">' + g.name + '</option>'; }).join("");
    sizeSel.innerHTML = SIZES.map(function(s){ return '<option value="' + s.gauge + '">' + s.gauge + ' gauge, ' + s.t.toFixed(2) + ' × ' + s.w.toFixed(2) + ' mm</option>'; }).join("");
    sizeSel.value = "23";

    var lastGrade = gradeSel.value;
    gradeSel.addEventListener("change", function(){
      var g = gradeById(gradeSel.value);
      if (gradeSel.value !== lastGrade) { rateInp.value = g.rate; lastGrade = gradeSel.value; }
      render();
    });
    [sizeSel, rateInp, useInp, pinsInp, boxesInp, valueInp].forEach(function(el){
      el.addEventListener("input", render);
      el.addEventListener("change", render);
    });

    function render(){
      var g = gradeById(gradeSel.value);
      var s = sizeByGauge(sizeSel.value);
      var rate = +rateInp.value || 0;
      var useMm = +useInp.value || 0;
      var pins = +pinsInp.value || 0;
      var boxes = +boxesInp.value || 0;
      var value = +valueInp.value || 0;

      var r = calcStitch(s.t, s.w, g.density, useMm, rate);
      var costPerCarton = r.costPerStitch * pins;
      var monthlyKg = (r.massG * pins * boxes) / 1000;
      var monthlySpend = monthlyKg * rate;

      document.getElementById("cpp-out").textContent = rupee(r.costPerStitch);
      document.getElementById("cpp-box").textContent = rupee(costPerCarton);
      document.getElementById("cpp-share").textContent = value>0 ? (costPerCarton/value*100).toFixed(2) + "%" : "n/a";
      document.getElementById("cpp-kg").textContent = fmt(monthlyKg,1) + " kg";
      document.getElementById("cpp-mo").textContent = rupee(monthlySpend);
      document.getElementById("cpp-len").textContent = fmt(r.lengthMPerKg,1) + " m/kg";

      renderComparison(s, useMm, pins, g.id);
    }

    function renderComparison(s, useMm, pins, currentId){
      var cmp = document.getElementById("cpp-cmp");
      var rows = CALC_GRADES.map(function(g){
        var r = calcStitch(s.t, s.w, g.density, useMm, g.rate);
        return { g:g, cost: r.costPerStitch*pins };
      });
      var max = Math.max.apply(null, rows.map(function(r){ return r.cost; }));
      cmp.innerHTML = rows.map(function(r){
        var frac = max>0 ? (r.cost/max) : 0;
        return '<div class="cmp-row' + (r.g.id===currentId?' is-current':'') + '">' +
          '<div class="cmp-name">' + r.g.name + '</div>' +
          '<div class="cmp-bar-wrap"><div class="cmp-bar" style="transform:scaleX(' + frac + ');background:' + r.g.hex + '"></div></div>' +
          '<div class="cmp-val">' + rupee(r.cost) + '</div>' +
        '</div>';
      }).join("");
    }

    render();
  }

  /* ---------------- length & weight calculator ---------------- */

  function initWeightCalc(){
    var host = document.querySelector("[data-wcalc]");
    if (!host) return;

    var sizeSel = document.getElementById("wc-size");
    var gradeSel = document.getElementById("wc-grade");
    var kgInp = document.getElementById("wc-kg");

    sizeSel.innerHTML = SIZES.map(function(s){ return '<option value="' + s.gauge + '">' + s.gauge + ' gauge, ' + s.t.toFixed(2) + ' × ' + s.w.toFixed(2) + ' mm</option>'; }).join("");
    sizeSel.value = "23";
    gradeSel.innerHTML = CALC_GRADES.map(function(g){ return '<option value="' + g.id + '">' + g.name + '</option>'; }).join("");

    [sizeSel, gradeSel, kgInp].forEach(function(el){
      el.addEventListener("input", render);
      el.addEventListener("change", render);
    });

    function render(){
      var s = sizeByGauge(sizeSel.value);
      var g = gradeById(gradeSel.value);
      var kg = +kgInp.value || 0;
      var area = s.t*s.w;
      var lengthMPerKg = 1000/(area*g.density);
      var metres = lengthMPerKg*kg;

      document.getElementById("wc-m").textContent = fmt(metres,1);
      document.getElementById("wc-permkg").textContent = fmt(lengthMPerKg,1) + " m";
      document.getElementById("wc-area").textContent = area.toFixed(3) + " mm²";
      document.getElementById("wc-dens").textContent = g.density.toFixed(2) + " g/cm³";
    }

    render();
  }

  /* ---------------- machine compatibility finder ---------------- */

  function initMachineFinder(){
    var host = document.querySelector("[data-machines]");
    if (!host) return;

    var machineSel = document.getElementById("mf-machine");
    var chips = document.querySelectorAll("#mf-env .chip");
    var out = document.getElementById("mf-out");

    machineSel.innerHTML = MACHINES.map(function(m){ return '<option value="' + m.id + '">' + m.name + ', ' + m.type + '</option>'; }).join("");

    var env = "dry";
    chips.forEach(function(chip){
      chip.addEventListener("click", function(){
        chips.forEach(function(c){ c.classList.remove("is-on"); });
        chip.classList.add("is-on");
        env = chip.getAttribute("data-env");
        render();
      });
    });
    machineSel.addEventListener("change", render);

    function render(){
      var m = MACHINES.find(function(m){ return m.id===machineSel.value; }) || MACHINES[0];
      var recId = ENV_GRADE[env] || "gi";
      var rec = gradeById(recId);
      var runsIt = m.grades.indexOf(recId) !== -1;

      out.innerHTML =
        '<div class="out">' +
          '<span class="eyebrow">Recommended wire</span>' +
          '<div class="out__big" style="font-size:clamp(1.6rem,3vw,2.2rem)">' + rec.name + '</div>' +
          '<div class="out__unit">' + rec.corrosionLabel + ' corrosion life · ' + rec.relCost.toFixed(1) + '× relative cost</div>' +
          '<div class="out__rows">' +
            '<div><span class="k">Machine</span><span class="v">' + m.name + '</span></div>' +
            '<div><span class="k">Gauge range on this machine</span><span class="v">' + m.gaugeMin + ' to ' + m.gaugeMax + '</span></div>' +
            '<div><span class="k">Spool format</span><span class="v">' + m.spool + '</span></div>' +
            '<div><span class="k">Grade commonly run here</span><span class="v">' + (runsIt ? 'Yes' : 'Less common, but compatible') + '</span></div>' +
          '</div>' +
          '<p style="font-size:13px;color:var(--text-secondary);margin-top:18px;line-height:1.6">Changing the grade does not change the wire size, so ' + rec.name.toLowerCase() + ' will run at the same gauge your machine is already set for.</p>' +
          '<p style="font-size:13px;color:var(--text-secondary);margin-top:10px;line-height:1.6">All seven grades are made in this size range: ' + gradeNames() + '. Stainless steel is quoted on request; please <a href="stainless-steel-stitching-wire.html" style="color:var(--accent)">check machine compatibility</a> before ordering it.</p>' +
          '<div class="flexrow" style="margin-top:20px">' +
            '<a class="btn btn--solid" href="cost-per-pin.html">Cost this grade</a>' +
            '<a class="btn btn--ghost" href="enquiry.html#sample">Request a sample</a>' +
          '</div>' +
        '</div>';
    }

    render();
  }

  /* ---------------- hero video ---------------- */

  /* The markup ships a poster and no src, so nothing downloads until this runs.
     Two groups never get the file at all: anyone who has asked their system for
     reduced motion, and anyone on a metered or 2G connection. That matters more
     than usual here, since the clip alone outweighs the rest of the site's
     imagery and most of these buyers are on a phone. Both groups keep the
     poster frame, which is the same photograph the hero used before. */

  function initHeroVideo(){
    var video = document.querySelector("[data-hero-video]");
    if (!video) return;

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    var conn = navigator.connection || {};
    var thrifty = conn.saveData === true || /(^|-)2g$/.test(conn.effectiveType || "");

    function start(){
      if (reduce.matches || thrifty) return;
      if (!video.src){
        video.preload = "auto";
        video.src = video.getAttribute("data-hero-video");
      }
      /* Autoplay can still be refused; the poster is already the fallback. */
      var p = video.play();
      if (p && p.catch) p.catch(function(){});
    }

    function stop(){
      video.pause();
      try { video.currentTime = 0; } catch (e) {}
    }

    start();

    /* Honour a change of preference without a reload. */
    var onChange = function(){ reduce.matches ? stop() : start(); };
    if (reduce.addEventListener) reduce.addEventListener("change", onChange);
    else if (reduce.addListener) reduce.addListener(onChange);

    /* Nothing is gained by decoding frames for a tab nobody is looking at. */
    document.addEventListener("visibilitychange", function(){
      if (document.hidden) video.pause();
      else if (video.src) start();
    });
  }

  /* ---------------- RFQ form ---------------- */

  function initRfqForm(){
    var form = document.querySelector("[data-rfq]");
    if (!form) return;
    var note = form.querySelector("[data-rfq-note]");

    var button = form.querySelector("button[type=submit]");

    function say(text){
      note.hidden = false;
      note.textContent = text;
    }

    /* Posted to Netlify over fetch rather than as a normal form submission, so a
       buyer who has just typed out their gauge, volume and machine stays on the
       page instead of being thrown to a bare success screen. Netlify still needs
       the static markup in enquiry.html to register the form at deploy time. */
    form.addEventListener("submit", function(e){
      e.preventDefault();
      if (!form.reportValidity()) return;

      var label = button.textContent;
      button.disabled = true;
      button.textContent = "Sending...";

      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(form)).toString()
      }).then(function(res){
        if (!res.ok) throw new Error(res.status);
        form.reset();
        say("Thank you, we have received your enquiry and will reply within one working day. If it is urgent, please call +91 90040 37154.");
      }).catch(function(){
        /* Never swallow it. A lost enquiry the sender believes was sent is worse
           than an honest failure, so hand them the two channels that always work. */
        say("Sorry, your enquiry could not be sent. Please email info@primewires.in or call +91 90040 37154.");
      }).then(function(){
        button.disabled = false;
        button.textContent = label;
      });
    });
  }

  /* ---------------- boot ---------------- */

  document.addEventListener("DOMContentLoaded", function(){
    initYear();
    initBurger();
    initNavMenu();
    initReveal();
    initHeader();
    initCountUp();
    initImageFallback();
    initLadder();
    initCostPerPin();
    initWeightCalc();
    initMachineFinder();
    initHeroVideo();
    initRfqForm();
  });
})();
