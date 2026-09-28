/**
 * Registro dei post del diario.
 * Quando scriverai un nuovo post, basterà aggiungere il percorso del file qui sotto.
 * Esempio: 'post/roma.json'
 */
const registroPost = [
  // 'post/primo-viaggio.json'
];

const container = document.getElementById('posts-container');
const modal = document.getElementById('post-modal');

// Carica tutti i post elencati nel registro
async function caricaPost() {
  container.innerHTML = '';

  // Se non ci sono post nel registro, mostra un messaggio di cortesia
  if (registroPost.length === 0) {
    container.innerHTML = `<div class="empty-state">Il diario è pronto. Presto arriveranno i primi ricordi di viaggio!</div>`;
    return;
  }

  for (const percorsoFile of registroPost) {
    try {
      const risposta = await fetch(percorsoFile);
      if (!risposta.ok) throw new Error('File non trovato');
      const datiPost = await risposta.json();

      creaBoxPost(datiPost);
    } catch (errore) {
      console.warn(`Impossibile caricare il post (${percorsoFile}):`, errore);
    }
  }
}

// Genera l'HTML per ogni singola box post
function creaBoxPost(post) {
  const card = document.createElement('article');
  card.className = 'post-card';
  card.onclick = () => apriPost(post);

  card.innerHTML = `
    <h3 class="post-card-title">${post.titolo}</h3>
    <div class="post-card-meta">
      <span>${post.luogo || ''}</span>
      <span>${post.data || ''}</span>
    </div>
  `;

  container.appendChild(card);
}

// Apri la finestra di lettura
function apriPost(post) {
  document.getElementById('modal-title').innerText = post.titolo;
  document.getElementById('modal-meta').innerText = `${post.luogo ? post.luogo + ' • ' : ''}${post.data || ''}`;
  document.getElementById('modal-body').innerHTML = post.testo;
  
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
}

// Chiudi la finestra di lettura
function chiudiPost() {
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
}

// Chiudi cliccando sullo sfondo fuori dalla finestra
window.onclick = function(event) {
  if (event.target === modal) {
    chiudiPost();
  }
};

// Avvia il caricamento all'apertura della pagina
caricaPost();
