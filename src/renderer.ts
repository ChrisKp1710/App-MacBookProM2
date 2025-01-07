import { EditorView, basicSetup } from "@codemirror/basic-setup";
import { EditorState } from "@codemirror/state";
import { json } from "@codemirror/lang-json";
import { html } from "@codemirror/lang-html";
import { markdown } from "@codemirror/lang-markdown";

// Test rapido per verificare window.electronAPI
if (window.electronAPI) {
  console.log("window.electronAPI è disponibile!");
} else {
  console.error("window.electronAPI non è disponibile.");
}

// Elementi UI
const preview = document.getElementById("preview") as HTMLDivElement;
const formatSelector = document.getElementById(
  "format-selector"
) as HTMLSelectElement;
const themeToggle = document.getElementById(
  "theme-toggle"
) as HTMLButtonElement;
const saveButton = document.getElementById("save-button") as HTMLButtonElement;
const titleInput = document.getElementById("title-input") as HTMLInputElement;

// Crea l'editor con CodeMirror
const editorContainer = document.getElementById("editor") as HTMLDivElement;
const editor = new EditorView({
  state: EditorState.create({
    doc: "", // Testo iniziale vuoto
    extensions: [basicSetup, json()], // Default: JSON
  }),
  parent: editorContainer,
});

// Funzione per aggiornare l'anteprima in base al formato
function updatePreview(content: string, format: string) {
  switch (format) {
    case "json":
      try {
        const jsonContent = JSON.parse(content);
        preview.textContent = JSON.stringify(jsonContent, null, 2);
        preview.style.color = "#3c763d"; // Verde per JSON valido
      } catch {
        preview.textContent = "JSON non valido!";
        preview.style.color = "red";
      }
      break;

    case "html":
      preview.innerHTML = content; // Interpreta HTML
      break;

    case "md":
      preview.innerHTML = markdownToHTML(content); // Markdown a HTML
      break;

    default:
      preview.textContent = content; // Testo normale
      preview.style.color = ""; // Reset stile
      break;
  }
}

// Gestore di eventi per cambiare il tema
themeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
});

// Aggiorna l'editor in base al formato selezionato
formatSelector?.addEventListener("change", () => {
  const format = formatSelector.value;

  let languageExtension;
  switch (format) {
    case "json":
      languageExtension = json();
      break;
    case "html":
      languageExtension = html();
      break;
    case "md":
      languageExtension = markdown();
      break;
    default:
      languageExtension = [];
      break;
  }

  // Aggiorna lo stato dell'editor con la nuova sintassi
  editor.setState(
    EditorState.create({
      doc: editor.state.doc.toString(),
      extensions: [basicSetup, languageExtension],
    })
  );

  // Aggiorna l'anteprima
  updatePreview(editor.state.doc.toString(), format);
});

// Funzione di conversione Markdown → HTML
function markdownToHTML(md: string): string {
  const bold = md.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  const italic = bold.replace(/\*(.*?)\*/g, "<em>$1</em>");
  const headers = italic.replace(/^(#{1,6})\s(.+)$/gm, (_, hashes, text) => {
    const level = hashes.length;
    return `<h${level}>${text}</h${level}>`;
  });
  const lists = headers.replace(/^- (.+)$/gm, "<li>$1</li>");
  const wrappedLists = lists.replace(/(<li>.*<\/li>)/g, "<ul>$1</ul>");
  const links = wrappedLists.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank">$1</a>'
  );
  return links.replace(/\n/g, "<br />");
}

// Gestione del clic sul pulsante "Salva"
saveButton?.addEventListener("click", async () => {
  const titolo = titleInput.value.trim(); // Prendi il titolo
  const contenuto = editor.state.doc.toString().trim(); // Prendi il contenuto dall'editor

  if (!titolo || !contenuto) {
    alert("Titolo e contenuto non possono essere vuoti!");
    return;
  }

  // Invio al processo principale per salvare
  const response = await window.electronAPI.salvaAppunto({ titolo, contenuto });

  if (response.success) {
    console.log("Appunto salvato con successo:", response.id);
    alert("Appunto salvato!");
  } else {
    console.error("Errore durante il salvataggio dell'appunto");
    alert("Errore durante il salvataggio.");
  }
});
