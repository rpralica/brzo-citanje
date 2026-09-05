var fontSize = 18;
var FONT_MIN = 12;
var FONT_MAX = 48;
var wpmRijeci = document.getElementById('wpmRijeci');
var sek = document.getElementById('sek');
var min = document.getElementById('min');
var wpmRez = document.getElementById('wpmRez');
var wpmBtn = document.getElementById('wpmBtn');



function calcWpm() {
  var mints = (Number(min.value) * 60 + Number(sek.value)) / 60;
  wpmRez.value = Math.floor(wpmRijeci.value / mints);
}

wpmBtn.addEventListener('click', function (e) {
  e.preventDefault();
  calcWpm();
});

function changeFont(delta) {
  fontSize = fontSize + delta;
  if (fontSize < FONT_MIN) fontSize = FONT_MIN;
  if (fontSize > FONT_MAX) fontSize = FONT_MAX;
  applyFont();
}

function resetFont() {
  fontSize = 18;
  applyFont();
}

function applyFont() {
  document.getElementById('textArea').style.fontSize = fontSize + 'px';
  document.getElementById('fontSizeLabel').innerHTML = fontSize;
}

function countWords(s) {
  var trimmed = s.replace(/^\s+|\s+$/g, '');
  if (trimmed.length === 0) return 0;
  var parts = trimmed.split(/\s+/);
  return parts.length;
}

function updateCount() {
  var content = document.getElementById('textArea').value;
  var words = countWords(content);
  var chars = content.length;
  document.getElementById('countLabel').innerHTML =
    'Rijeci: ' + words + '   Karaktera: ' + chars;
}

function clearText() {
  document.getElementById('textArea').value = '';
  updateCount();
  document.getElementById('selectionLabel').innerHTML = 'Selektovano rijeci: 0';
  currentFileName = '';
  document.getElementById('positionLabel').innerHTML = '';
}

// --- Ucitavanje .txt fajla i pamcenje pozicije ---
var currentFileName = '';

function loadTextFile(event) {
  var file = event.target.files[0];
  if (!file) return;

  var reader = new FileReader();
  reader.onload = function (e) {
    document.getElementById('textArea').value = e.target.result;
    currentFileName = file.name;
    updateCount();

    var savedPos = localStorage.getItem('pozicija_' + currentFileName);
    if (savedPos !== null) {
      document.getElementById('positionLabel').innerHTML =
        'Nadjena sacuvana pozicija za ovaj fajl (karakter ' +
        savedPos +
        "). Klikni 'Idi na sacuvanu poziciju'.";
    } else {
      document.getElementById('positionLabel').innerHTML = '';
    }
  };
  reader.readAsText(file, 'UTF-8');
}

function savePosition() {
  if (!currentFileName) {
    alert('Prvo ucitaj .txt fajl da bi mogao sacuvati poziciju.');
    return;
  }
  var ta = document.getElementById('textArea');
  var pos = ta.selectionStart;
  localStorage.setItem('pozicija_' + currentFileName, pos);
  document.getElementById('positionLabel').innerHTML =
    'Sacuvano na karakteru ' + pos + '.';
}

function goToSavedPosition() {
  if (!currentFileName) {
    alert('Prvo ucitaj .txt fajl.');
    return;
  }
  var savedPos = localStorage.getItem('pozicija_' + currentFileName);
  if (savedPos === null) {
    alert('Nema sacuvane pozicije za ovaj fajl.');
    return;
  }
  var pos = parseInt(savedPos, 10);
  var ta = document.getElementById('textArea');
  ta.focus();
  ta.selectionStart = pos;
  ta.selectionEnd = pos;
  document.getElementById('positionLabel').innerHTML =
    'Na poziciji ' + pos + '.';
}

function countSelection() {
  var ta = document.getElementById('textArea');
  var start = ta.selectionStart;
  var end = ta.selectionEnd;
  var n = 0;
  if (start !== undefined && end !== undefined && end > start) {
    var selected = ta.value.substring(start, end);
    n = countWords(selected);
  }
  document.getElementById('selectionLabel').innerHTML =
    'Selektovano rijeci: ' + n;
}

// --- Banka recenica za generisanje vjezbovnog teksta ---
var SENTENCE_BANK = [
  'Jutro je pocelo maglom koja se polako dizala iznad rijeke.',
  'Stari mlin na obali godinama stoji napusten i zarastao u trave.',
  'Djeca su trcala niz ulicu tjerajuci obruc od bicikla.',
  'Miris svjezeg hljeba sirio se cijelom pekarom vec od pet ujutru.',
  'Planinski vrh bio je pokriven snijegom i onda kada je dolina bila zelena.',
  'Vlak je kasnio dvadeset minuta zbog radova na pruzi.',
  'Biblioteka u centru grada otvorena je do kasno u noc.',
  'Ribar je svako jutro izlazio na jezero prije izlaska sunca.',
  'Novi most preko rijeke skratio je put za pola sata.',
  'Baka je cuvala stare fotografije u drvenoj kutiji na tavanu.',
  'Vjetar je nosio lisce preko prazne skolske dvorista.',
  'Kompjuterski program je izracunao rezultat za samo nekoliko sekundi.',
  'Susjed je posadio jabuke uz ogradu jos prije dvadeset godina.',
  'Autobus je stao na svakoj stanici, pa je voznja potrajala duze.',
  'Mladi inzenjer je predlozio novo rjesenje za ustedu energije.',
  'Kisa je padala cijelu noc, a jutro je bilo svjeze i cisto.',
  'Trg je bio pun ljudi koji su cekali pocetak koncerta.',
  'Fabrika papira zatvorena je prije deset godina zbog nedostatka sirovina.',
  'Planinari su krenuli u zoru kako bi stigli na vrh prije podne.',
  'Novinar je proveo cijeli dan trazeci odgovore na svoja pitanja.',
  'Vocnjak iza kuce daje dovoljno sljiva za cijelu zimu.',
  'Grad je noc izgledao potpuno drugacije nego danju.',
  'Ucenici su pazljivo slusali dok je nastavnik objasnjavao novo gradivo.',
  'Stara knjizara na uglu prodaje i polovne udzbenike.',
  'Radnici su popravljali krov skole tokom ljetnog raspusta.',
  'Pas je cekao ispred vrata svaki dan u isto vrijeme.',
  'Rijeka je nabujala nakon nekoliko dana neprekidne kise.',
  'Pekar je otvorio radnju prije nego sto je grad uopste prohodao.',
  'Fudbalska utakmica je otkazana zbog loseg vremena.',
  'Fabrika automobila najavila je otvaranje novih radnih mjesta.',
  'Djevojcica je crtala kucu sa velikim prozorima i crvenim krovom.',
  'Vozac kamiona vozio je cijelu noc da bi stigao na vrijeme.',
  'Zimski dani su kratki, pa se mrak spusta vec poslije cetiri.',
  'Poljoprivrednik je posijao psenicu ranije nego prosle godine.',
  'Grupa turista je fotografisala staru tvrdjavu sa svih strana.',
  'Nastavnica je pohvalila ucenike za trud ulozen u projekat.',
  'Vjetrenjace na brdu okrecu se cak i pri slabom vjetru.',
  'Prodavnica na uglu radi od sedam ujutru do deset uvece.',
  'Pilot je najavio putnicima blago kasnjenje zbog nevremena.',
  'Stari sat na tornju otkucava svaki puni sat vec stotinu godina.',
  'Ljekar je preporucio pacijentu vise kretanja i manje soli u ishrani.',
  'Djeca su gradila zamak od pijeska sve dok nije dosla plima.',
  'Vatrogasci su brzo stavili pozar pod kontrolu.',
  'Bibliotekar je pomogao studentu da pronadje potrebnu knjigu.',
  'Selo je ostalo bez struje na nekoliko sati zbog oluje.',
  'Mladic je popravio bicikl koristeci samo osnovni alat.',
  'Novi zakon je izazvao rasprave medju stanovnicima grada.',
  'Kuvar je pripremio rucak za pedeset gostiju bez icije pomoci.',
  'Astronom je posmatrao zvijezde satima kroz stari teleskop.',
  'Radionica za popravku obuce postoji na istom mjestu decenijama.',
  'Djed je pricao unucima price iz svoje mladosti svako vece.',
  'Ledeni vjetar je tjerao prolaznike da zurno traze zaklon.',
  'Trgovac je snizio cijene pred kraj sezone.',
  'Studenti su organizovali predavanje o zastiti zivotne sredine.',
  'Slikar je proveo cijelo popodne radeci na jednom detalju platna.',
  'Autobuska stanica je obnovljena prosle godine.',
  'Farmer je prodao dio stoke zbog suse koja je potrajala mjesecima.',
  'Deca su se igrala skrivaca iza starih ambara.',
  'Postar je dolazio u selo samo dva puta sedmicno.',
  'Muzicari su svirali na trgu sve do ponoci.',
  'Voz za glavni grad polazi svakog jutra u sest.',
  'Fotograf je cekao pravu svjetlost da uslika zalazak sunca.',
  'Majstor je popravio krov prije nego sto su pocele jesenje kise.',
  'Skola je organizovala izlet u obliznji nacionalni park.',
  'Prodavac novina je poznavao svakog stanovnika ulice po imenu.',
  'Meteorolog je najavio pogorsanje vremena za vikend.',
  'Fabrika tekstila zaposljava vecinu radnika u malom gradu.',
  'Djeca su naucila da plivaju u rijeci iza kuce.',
  'Stari most je zatvoren za saobracaj zbog ostecenja.',
  'Vozac taksija je poznavao svaku precicu u gradu.',
  'Basta iza kuce puna je paradajza i paprike svakog ljeta.',
  'Novinska agencija je prenijela vijest u roku od nekoliko minuta.',
  'Planinarski dom nudi prenociste i toplu hranu umornim putnicima.',
  'Trener je zadovoljan napretkom mladih igraca tokom sezone.',
  'Pilot je sletio bez problema uprkos jakom bocnom vjetru.',
  'Susjedi su zajedno ocistili park pored zgrade.',
  'Doktorka je otvorila ordinaciju u centru grada prije pet godina.',
  'Radnici na pruzi su radili cijele noci da zavrse popravku.',
  'Djevojcica je naucila da svira gitaru posmatrajuci starijeg brata.',
  'Prodavnica knjiga organizuje veceri citanja svakog petka.',
  'Vlasnik kafica je zamijenio stolove i stolice proslog mjeseca.',
  'Grupa naucnika je otkrila novu vrstu biljke u dolini.',
  'Vozovi na ovoj liniji voze rjedje vikendom.',
  'Bastovan je posadio ruze duz cijele staze.',
  'Mladi programer je razvio aplikaciju za pracenje vremena.',
  'Seljani su se okupili na trgu povodom praznika.',
  'Knjizara je proslavila dvadeset godina rada malom svecanoscu.',
  'Radio stanica emituje vijesti svakog sata na pola sata.',
  'Djeca su sadila drvece u skolskom dvoristu u proljece.',
  'Stolar je izradio sto od starog hrastovog drveta.',
  'Vatra u kaminu grijala je cijelu kucu do jutra.',
  'Novi zakon o saobracaju stupa na snagu sljedeceg mjeseca.',
  'Planinarska staza vodi kroz gustu sumu do vidikovca.',
  'Prodavac voca dolazi na pijacu svakog utorka i petka.',
  'Fudbaleri su trenirali dva puta dnevno pred veliku utakmicu.',
  'Selo je poznato po starim kucama od kamena.',
  'Mehanicar je zamijenio kocnice na automobilu za manje od sat vremena.',
  'Nastavnik matematike je smislio novu igru za vjezbanje racunanja.',
  'Rijetka ptica vidjena je pored jezera prosle sedmice.',
  'Radnici u fabrici dobili su nove uniforme ove godine.',
  'Djed i baka su svaki dan setali istom stazom pored rijeke.',
  'Autor je predstavio svoju novu knjigu na sajmu.',
  'Grad je uveo nove biciklisticke staze duz glavne ulice.',
];

function shuffleArray(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a;
}

function generateText() {
  var targetInput = document.getElementById('genWords').value;
  var target = parseInt(targetInput, 10);
  if (isNaN(target) || target <= 0) {
    target = 600;
  }

  var pool = shuffleArray(SENTENCE_BANK);
  var result = [];
  var wordTotal = 0;
  var idx = 0;

  while (wordTotal < target) {
    if (idx >= pool.length) {
      pool = shuffleArray(SENTENCE_BANK);
      idx = 0;
    }
    var sentence = pool[idx];
    idx = idx + 1;
    result.push(sentence);
    wordTotal = wordTotal + countWords(sentence);
  }

  // Grupisi u pasuse od po 4 recenice
  var paragraphs = [];
  var i2;
  for (i2 = 0; i2 < result.length; i2 = i2 + 4) {
    paragraphs.push(result.slice(i2, i2 + 4).join(' '));
  }
  var finalText = paragraphs.join('\n\n');

  document.getElementById('textArea').value = finalText;
  updateCount();
}

// --- Tajmer (countdown) ---
var timerRemaining = 60;
var timerRunning = false;
var timerIntervalId = null;

function timerFormat(sec) {
  var m = Math.floor(sec / 60);
  var s = sec % 60;
  var mStr = m < 10 ? '0' + m : '' + m;
  var sStr = s < 10 ? '0' + s : '' + s;
  return mStr + ':' + sStr;
}

function timerUpdateDisplay() {
  document.getElementById('timerDisplay').innerHTML =
    timerFormat(timerRemaining);
}

function timerReadInputs() {
  var m = parseInt(document.getElementById('timerMin').value, 10);
  var s = parseInt(document.getElementById('timerSec').value, 10);
  if (isNaN(m) || m < 0) m = 1;
  if (isNaN(s) || s < 0) s = 0;
  if (s > 59) s = 59;
  return m * 60 + s;
}

function timerStart() {
  if (timerRunning) return;
  if (timerRemaining <= 0) {
    timerRemaining = timerReadInputs();
  }
  timerRunning = true;
  timerIntervalId = setInterval(function () {
    timerUpdateDisplay();
    if (timerRemaining <= 0) {
      timerRunning = false;
      clearInterval(timerIntervalId);
      alert('Vrijeme je isteklo!');
      return;
    }
    timerRemaining = timerRemaining - 1;
  }, 1000);
}

function timerPause() {
  timerRunning = false;
  if (timerIntervalId !== null) {
    clearInterval(timerIntervalId);
    timerIntervalId = null;
  }
}

function timerReset() {
  timerPause();
  timerRemaining = timerReadInputs();
  timerUpdateDisplay();
}

// --- Stoperica (count up) ---
var stopwatchElapsed = 0;
var stopwatchRunning = false;
var stopwatchIntervalId = null;

function stopwatchUpdateDisplay() {
  document.getElementById('stopwatchDisplay').innerHTML =
    timerFormat(stopwatchElapsed);
}

function stopwatchStart() {
  if (stopwatchRunning) return;
  stopwatchRunning = true;
  stopwatchIntervalId = setInterval(function () {
    stopwatchUpdateDisplay();
    stopwatchElapsed = stopwatchElapsed + 1;
  }, 1000);
}

function stopwatchPause() {
  stopwatchRunning = false;
  if (stopwatchIntervalId !== null) {
    clearInterval(stopwatchIntervalId);
    stopwatchIntervalId = null;
  }
}

function stopwatchReset() {
  stopwatchPause();
  stopwatchElapsed = 0;
  stopwatchUpdateDisplay();
}

// --- Sakrivanje kontrola radi vise prostora za tekst na malom ekranu ---
var controlsHidden = false;

function toggleControls() {
  controlsHidden = !controlsHidden;
  var displayValue = controlsHidden ? 'none' : 'block';

  document.getElementById('controlsTop').style.display = displayValue;
  document.getElementById('controlsBottom').style.display = displayValue;
  document.getElementById('controlsTimers').style.display = controlsHidden
    ? 'none'
    : '';

  document.getElementById('toggleBtn').innerHTML = controlsHidden
    ? 'Prikazi kontrole'
    : 'Sakrij kontrole';

  var ta = document.getElementById('textArea');
  if (controlsHidden) {
    var targetHeight = Math.round(window.innerHeight * 0.7);
    if (targetHeight < 200) targetHeight = 200;
    ta.style.height = targetHeight + 'px';
  } else {
    ta.style.height = '260px';
  }
}

// Inicijalno stanje
timerUpdateDisplay();
stopwatchUpdateDisplay();
