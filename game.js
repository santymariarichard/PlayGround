(() => {
  const firstNames = ['Mara','Elliot','Nina','Jonah','Ruth','Caleb','Sloane','Isaac','Dahlia','Felix','June','Rafael','Tessa','Malcolm','Iris','Theo','Anika','Silas','Celia','Owen','Maeve','Adrian','Lena','Gideon','Willa','Micah','Estelle','Hugo','Noor','Vincent','Clara','Bennett','Zora','Miles','Simone','Alden','Freya','Dorian','Mina','Jasper'];
  const lastNames = ['Vale','Mercer','Holloway','Cross','Bennett','Sato','Wren','Doyle','Voss','Ellery','Kane','Marsh','Quinn','Rook','Frost','Pike','Bishop','Lowe','Hale','Morrow','Nash','Rowe','Kerr','Whitaker','Shaw','Bell','Caldwell','Price','Reed','Sterling','Mills','Kessler','North','Baxter','Finch','Solomon','Greer','Wolfe','Hunt','Arden'];
  const caseTitles = ['The Last Call','A Quiet Departure','Ashes at Dawn','The Glass House','The Night Ledger','A Borrowed Hour','The Third Key','Dead Air','The Blue Room','A Narrow Escape','The Long Weekend','No Fixed Address','The Final Draft','A Perfect Alibi','The Empty Platform','A Familiar Face','The Winter Garden','The Open Window','After the Bell','The Missing Hour','A Silent Witness','The Paper Trail','One Last Dance','The Wrong Number','Beneath the Floorboards','The Unlit Room','A Matter of Time','The Red Envelope','The Other Side','A Sudden Silence'];
  const locations = ['the Bellweather Hotel','Pier 19 warehouse','the Marlowe Gallery','Northpoint Station','the Orpheum Theatre','Calder House','the Meridian rooftop','Juniper Street clinic','the old observatory','the Ashford newsroom','Linden Row apartments','the Glassworks factory','Westlake Marina','the Halcyon Club','Room 8 at the Rookery','the Briarwood estate','Civic Hall','the Silverline diner','the city archives','the Vale Street studio'];
  const causes = ['a single blow to the head','a dose of a rare sedative','a fatal wound from a letter opener','smoke inhalation in a locked room','a fall from the mezzanine','poison concealed in a nightcap','a gunshot wound at close range','a strangulation using a silk cord','a staged electrical accident','a deep cut from broken glass'];
  const objects = ['a brass room key','a cracked pocket watch','a rain-soaked matchbook','a silver cufflink','a torn concert ticket','a green glass button','a fountain pen with a split nib','a scorched receipt','a missing photograph','a red wool thread','a broken compass','a hotel service token','a smudged calling card','a brass lighter','a chipped porcelain shard'];
  const motives = ['a concealed inheritance','a blackmail scheme that was about to unravel','a disputed property deed','a career-making story the victim planned to expose','a quietly altered will','a debt that had become impossible to hide','the theft of a valuable collection','a betrayal hidden behind a business partnership','an old secret resurfacing','the victim’s plan to leave town with the truth'];
  const occupations = ['the victim’s business partner','a former colleague','the building’s night manager','the victim’s estranged sibling','a rival journalist','the family solicitor','a longtime housekeeper','the victim’s personal driver','a gallery curator','a neighbor with a key'];
  const traceItems = ['silver nitrate','blue tailor’s chalk','cedar oil','printer’s ink','copper dust','violet perfume','lampblack','green sealing wax','cinnamon tobacco','camera fixative','red clay','machine grease','piano varnish','turpentine','saltwater'];
  const alibiPlaces = ['the all-night diner','the southbound tram','a payphone on Mercer Street','the hotel lobby','the 24-hour pharmacy','a late rehearsal at the Orpheum','the river ferry','the newsroom basement','a card game at the Halcyon','a taxi outside City Hall'];
  const witnesses = ['Inez Bell','Arthur Pike','Mina Cho','Deputy Ellis','Samir Patel','Rosa Venn','Nell Harper','Tomás Reed','June Park','Officer Kline','Evelyn Moss','Peter Lau'];
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const pick = (arr, n) => arr[((n % arr.length) + arr.length) % arr.length];
  const hash = n => { let x = Math.imul(n ^ 0x45d9f3b, 0x45d9f3b); x = Math.imul(x ^ (x >>> 16), 0x45d9f3b); return (x ^ (x >>> 16)) >>> 0; };
  const pad = n => String(n).padStart(3, '0');
  const makeCase = n => {
    const seed = hash(n * 7919 + 104729);
    const victim = `${pick(firstNames, seed)} ${pick(lastNames, seed >>> 4)}`;
    const culpritIndex = hash(n * 1777 + 301) % 4;
    const suspects = Array.from({length:4}, (_, i) => {
      const k = hash(n * 131 + i * 997 + 17);
      return { name:`${pick(firstNames, k)} ${pick(lastNames, k >>> 5)}`, role:pick(occupations, k >>> 9), alibi:pick(alibiPlaces, k >>> 13), trace:pick(traceItems, hash(k + 44)), index:i };
    });
    // Ensure suspects and victim have distinct names, even in the rare event of a collision.
    const used = new Set([victim]);
    suspects.forEach((s,i) => { while (used.has(s.name)) s.name = `${pick(firstNames, hash(n*88+i*313+1))} ${pick(lastNames, hash(n*19+i*127+3))}${i ? '' : ' Jr.'}`; used.add(s.name); });
    const culprit = suspects[culpritIndex];
    // Make the forensic trace a fair, deducible clue: exactly one suspect is tied to it.
    suspects.forEach((suspect, i) => {
      if (i === culpritIndex) return;
      let alternate = pick(traceItems, hash(n * 431 + i * 73));
      while (alternate === culprit.trace) alternate = pick(traceItems, traceItems.indexOf(alternate) + 1);
      suspect.trace = alternate;
    });
    const title = pick(caseTitles, n * 7 + Math.floor(n / 3)) + (n > caseTitles.length ? ` — File ${pad(n)}` : '');
    const place = pick(locations, seed >>> 8);
    const cause = pick(causes, seed >>> 14);
    const object = pick(objects, seed >>> 19);
    const motive = pick(motives, seed >>> 22);
    const witness = pick(witnesses, n * 5 + (seed % 7));
    const month = pick(months, n * 3);
    const day = (n * 7 % 27) + 1;
    const hour = 8 + (seed % 12);
    const time = `${String(hour % 12 || 12).padStart(2,'0')}:${seed % 2 ? '40' : '15'} ${hour >= 12 ? 'PM' : 'AM'}`;
    const evidence = [
      {icon:'⌕', type:'TRACE ANALYSIS', title:'Residue on the scene', body:`A trace of ${culprit.trace} was found on the inside edge of the service door. The lab matched the sample to material routinely used by ${culprit.name}. No other person of interest is known to handle it.`},
      {icon:'⌑', type:'SCENE PHOTOGRAPH', title:'The room was not locked', body:`The latch shows no sign of forced entry. A single set of fresh prints leads from the service entrance to the desk, then back out. The victim’s ${object} was found beside the desk, wiped clean.`},
      {icon:'◷', type:'TIMELINE', title:'The window of opportunity', body:`The coroner places the death between ${time} and ${pick(['10:10 PM','11:25 PM','12:40 AM','9:55 PM'], seed >>> 3)}. The nearest street clock stopped at ${time}. The access log records an unassigned entry during that same interval.`},
      {icon:'▤', type:'PROPERTY LOG', title:'Item recovered', body:`${object} was catalogued at the scene. The object itself is ordinary; the detail that matters is the ${culprit.trace} caught in its hinge. It links the person who handled it to the service entrance.`}
    ];
    const reports = [
      {icon:'✚', type:'MEDICAL EXAMINER', title:'Coroner’s report', body:`Cause of death: ${cause}. Estimated time of death: ${time}, plus or minus twenty minutes. No defensive wounds were found, suggesting the victim knew the visitor or was taken by surprise. The victim’s final meal was untouched.`},
      {icon:'▧', type:'WITNESS STATEMENT', title:`Interview: ${witness}`, body:`“I heard the service door close just after ${time}. I caught a glimpse of someone leaving, but the rain had blurred the street. There was a sharp smell of ${culprit.trace} in the corridor. I thought it was coming from the workroom.”`},
      {icon:'≋', type:'INTERVIEW TRANSCRIPTS', title:'Four stories, one timeline', body:`${suspects.map((s,i)=>`${s.name} (${s.role}) says they were at ${s.alibi}${i===culpritIndex?' — but the trace evidence places them at the service door.':'.'}`).join('\n')}`}
    ];
    return {id:n,title,victim,place,cause,object,motive,culpritIndex,suspects,evidence,reports,witness,month,day,time,seed};
  };
  const cases = Array.from({length:100},(_,i)=>makeCase(i+1));
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem('casefile-save-v1') || '{}') || {}; } catch (_) { saved = {}; }
  if (!saved.solved || typeof saved.solved !== 'object') saved.solved = {};
  saved.solved = Object.fromEntries(Object.entries(saved.solved).filter(([id, value]) => Number(id) >= 1 && Number(id) <= cases.length && value));
  saved.attempts = Math.max(0, Number(saved.attempts) || 0);
  saved.correct = Math.max(0, Number(saved.correct) || 0);
  let current = null, activeFilter = 'all', activeTab = 'overview', hintLevel = {};
  const $ = id => document.getElementById(id);
  const escapeHtml = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const persist = () => { try { localStorage.setItem('casefile-save-v1', JSON.stringify(saved)); } catch (_) {} updateStats(); };
  const updateStats = () => {
    const count = Object.keys(saved.solved).length;
    const total = cases.length;
    $('solved-stat').textContent = count;
    $('solved-note').textContent = count ? `${count} file${count===1?'':'s'} resolved` : 'Your record starts here';
    $('accuracy-stat').textContent = saved.attempts ? `${Math.round(saved.correct / saved.attempts * 100)}%` : '—';
    $('nav-count').textContent = total;
    $('unsolved-count').textContent = total-count;
    $('record-mini').textContent = `${count} / ${total}`;
    $('mini-progress').style.width = `${count / total * 100}%`;
    document.querySelector('.stat-card small').textContent = 'ACTIVE FILES';
    document.querySelector('.stat-card strong').textContent = total;
  };
  const cardMarkup = c => {
    const closed = !!saved.solved[c.id];
    return `<article class="case-card" data-id="${c.id}" tabindex="0" role="button" aria-label="Open case ${pad(c.id)}: ${escapeHtml(c.title)}"><div class="card-top"><span class="case-number">FILE NO. ${pad(c.id)}</span><span class="status-pill ${closed?'closed':''}">${closed?'CLOSED':'UNSOLVED'}</span></div><h3>${escapeHtml(c.title)}</h3><div class="card-victim">Victim: ${escapeHtml(c.victim)}</div><div class="card-bottom"><span>${escapeHtml(c.place.replace(/^the /,'' ).toUpperCase())}</span><span>${c.month} ${String(c.day).padStart(2,'0')}</span></div></article>`;
  };
  const renderArchive = () => {
    const query = $('search-input').value.trim().toLowerCase();
    let list = cases.filter(c => activeFilter==='all' || (activeFilter==='unsolved' ? !saved.solved[c.id] : !!saved.solved[c.id]));
    if (query) list = list.filter(c => `${c.title} ${c.victim} ${c.place} ${pad(c.id)}`.toLowerCase().includes(query));
    const sort = $('sort-select').value;
    if (sort==='title') list.sort((a,b)=>a.title.localeCompare(b.title));
    if (sort==='victim') list.sort((a,b)=>a.victim.localeCompare(b.victim));
    if (sort==='unsolved') list.sort((a,b)=>(!!saved.solved[a.id])-(!!saved.solved[b.id]) || a.id-b.id);
    $('showing-count').textContent = `${list.length} FILE${list.length===1?'':'S'}`;
    $('case-grid').innerHTML = list.length ? list.map(cardMarkup).join('') : '<div class="empty-state">No files match that search. Try another name or case number.</div>';
    document.querySelectorAll('.case-card').forEach(card=>{card.addEventListener('click',()=>openCase(Number(card.dataset.id)));card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openCase(Number(card.dataset.id));}});});
    updateStats();
  };
  const documentMarkup = (doc,index) => `<article class="document"><div class="document-header"><span class="document-type"><span class="doc-icon">${doc.icon}</span>${escapeHtml(doc.type)}</span><span class="document-date">${current.month} ${String(current.day).padStart(2,'0')} · MCB</span></div><h3>${escapeHtml(doc.title)}</h3>${doc.body.split('\n').map(line=>`<p>${escapeHtml(line)}</p>`).join('')}<span class="evidence-tag">FILED · ${pad(current.id)}-${String((activeTab==='overview'?0:activeTab==='evidence'?20:40)+index+1).padStart(2,'0')}</span></article>`;
  const overviewDocs = c => [
    {icon:'▤',type:'CASE SUMMARY',title:'Incident overview',body:`${c.victim} was found dead at ${c.place} on ${c.month} ${String(c.day).padStart(2,'0')}. The cause was ${c.cause}. There were no signs of forced entry, and the scene suggests the victim knew their visitor. New forensic results connect an item from the scene to one of four people close to the victim.`},
    {icon:'⌖',type:'INVESTIGATOR’S BRIEF',title:'People of interest',body:`${c.suspects.map(s=>`${s.name} — ${s.role}. Claims to have been at ${s.alibi}.`).join('\n')}\n\nPossible motive under review: ${c.motive}. The motive is not proof. Compare each account with the lab findings and the witness timeline.`}
  ];
  const renderDocs = () => {
    const docs = activeTab==='overview' ? overviewDocs(current) : activeTab==='evidence' ? current.evidence : current.reports;
    $('document-content').innerHTML = `<div class="document-stack">${docs.map(documentMarkup).join('')}</div>`;
    document.querySelectorAll('.tab').forEach(tab=>tab.classList.toggle('active',tab.dataset.tab===activeTab));
  };
  const openCase = id => {
    current = cases[id-1]; if(!current)return;
    activeTab='overview'; $('archive-view').classList.add('hidden'); $('case-view').classList.remove('hidden'); $('crumb-current').textContent=`FILE ${pad(id)}`;
    $('detail-kicker').textContent=`CASE ${pad(id)} · ${saved.solved[id]?'CLOSED INVESTIGATION':'OPEN INVESTIGATION'}`;
    $('detail-title').innerHTML=`${escapeHtml(current.title)}<span class="title-period">.</span>`;
    $('detail-deck').textContent=`A night in ${current.month.toLowerCase()}. Four stories. One truth.`;
    $('detail-number').textContent=pad(id);
    $('case-meta').innerHTML=[['VICTIM',current.victim],['LOCATION',current.place],['DATE',`${current.month} ${String(current.day).padStart(2,'0')}`],['CAUSE OF DEATH',current.cause]].map(([a,b])=>`<div class="meta-item"><small>${a}</small><strong>${escapeHtml(b)}</strong></div>`).join('');
    const options=current.suspects.map((s,i)=>`<option value="${i}">${escapeHtml(s.name)} — ${escapeHtml(s.role)}</option>`).join('');
    $('suspect-select').innerHTML=`<option value="">Choose suspect...</option>${options}`;
    $('suspect-select').value=''; $('suspect-clues').textContent=''; $('submit-guess').disabled=true;
    $('feedback').textContent=saved.solved[id]?`Case closed. You correctly identified ${current.suspects[current.culpritIndex].name}.`:'';
    $('feedback').className='feedback'+(saved.solved[id]?' correct':'');
    $('submit-guess').textContent=saved.solved[id]?'Case solved':'Submit accusation';
    $('submit-guess').disabled=!!saved.solved[id];
    const solvedCount = Object.keys(saved.solved).length;
    $('case-progress-label').textContent=`${solvedCount} OF ${cases.length}`;
    $('case-progress-bar').style.width=`${solvedCount / cases.length * 100}%`;
    $('prev-case').disabled=id===1; $('next-case').innerHTML=id===cases.length?'Archive <span>→</span>':'Next case <span>→</span>';
    $('hint-text').textContent=hintLevel[id] ? hintText(current,hintLevel[id]) : 'The evidence is all here. Look for what doesn’t add up.';
    $('hint-button').innerHTML=hintLevel[id]>=3?'Hint revealed':'Reveal a hint <span>→</span>';
    $('hint-button').disabled=hintLevel[id]>=3;
    renderDocs(); window.scrollTo(0,0);
  };
  const hintText = (c,level) => level===1 ? 'One of the people of interest claims they were far from the scene. Check the trace analysis.' : level===2 ? `The trace material is ${c.suspects[c.culpritIndex].trace}. Which suspect has a connection to it?` : `The trace evidence links the crime to ${c.suspects[c.culpritIndex].name}.`;
  $('suspect-select').addEventListener('change',()=>{
    const i=Number($('suspect-select').value); const valid=$('suspect-select').value!=='';
    $('suspect-clues').textContent=valid?`Alibi: ${current.suspects[i].alibi}. Their account is included in the interview transcripts.`:'';
    $('submit-guess').disabled=!valid || !!saved.solved[current.id]; $('feedback').textContent=''; $('feedback').className='feedback';
  });
  $('submit-guess').addEventListener('click',()=>{
    if(!current||$('suspect-select').value===''||saved.solved[current.id])return;
    const guess=Number($('suspect-select').value); saved.attempts++; const feedback=$('feedback');
    if(guess===current.culpritIndex){saved.correct++;saved.solved[current.id]=true;feedback.textContent=`Correct. ${current.suspects[guess].name} killed ${current.victim}. The evidence holds up.`;feedback.className='feedback correct';$('detail-kicker').textContent=`CASE ${pad(current.id)} · CLOSED INVESTIGATION`;$('submit-guess').disabled=true;$('submit-guess').textContent='Case solved';const solvedCount=Object.keys(saved.solved).length;$('case-progress-label').textContent=`${solvedCount} OF ${cases.length}`;$('case-progress-bar').style.width=`${solvedCount / cases.length * 100}%`;persist();}
    else{feedback.textContent='That accusation doesn’t fit the evidence. Revisit the reports and try again.';feedback.className='feedback incorrect';persist();}
  });
  $('hint-button').addEventListener('click',()=>{if(!current)return;hintLevel[current.id]=Math.min(3,(hintLevel[current.id]||0)+1);$('hint-text').textContent=hintText(current,hintLevel[current.id]);if(hintLevel[current.id]>=3){$('hint-button').textContent='Hint revealed';$('hint-button').disabled=true;}});
  document.querySelectorAll('.tab').forEach(tab=>tab.addEventListener('click',()=>{activeTab=tab.dataset.tab;renderDocs();}));
  $('back-button').addEventListener('click',()=>{ $('case-view').classList.add('hidden');$('archive-view').classList.remove('hidden');$('crumb-current').textContent='CASE ARCHIVE';renderArchive();window.scrollTo(0,0); });
  $('prev-case').addEventListener('click',()=>{if(current?.id>1)openCase(current.id-1);});
  $('next-case').addEventListener('click',()=>{if(current?.id<100)openCase(current.id+1);else $('back-button').click();});
  $('search-input').addEventListener('input',renderArchive);$('sort-select').addEventListener('change',renderArchive);
  const setFilter = filter=>{activeFilter=filter;$('nav-cases').classList.toggle('active',filter==='all');$('nav-unsolved').classList.toggle('active',filter==='unsolved');$('nav-solved').classList.toggle('active',filter==='solved');$('archive-view').classList.remove('hidden');$('case-view').classList.add('hidden');$('crumb-current').textContent=filter==='all'?'CASE ARCHIVE':filter==='unsolved'?'UNSOLVED FILES':'CLOSED CASES';renderArchive();};
  $('nav-cases').addEventListener('click',()=>setFilter('all'));$('nav-unsolved').addEventListener('click',()=>setFilter('unsolved'));$('nav-solved').addEventListener('click',()=>setFilter('solved'));
  $('help-button').addEventListener('click',()=>$('help-modal').classList.remove('hidden'));$('close-help').addEventListener('click',()=>$('help-modal').classList.add('hidden'));$('got-it').addEventListener('click',()=>$('help-modal').classList.add('hidden'));$('help-modal').addEventListener('click',e=>{if(e.target===$('help-modal'))$('help-modal').classList.add('hidden');});
  document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();$('search-input').focus();}if(e.key==='Escape')$('help-modal').classList.add('hidden');});
  renderArchive(); updateStats();
})();
