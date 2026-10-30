// Early-access form for product and guide pages. Posts to the same Google Apps Script web app
// as index.html (apps-script/Code.gs); data-source on the form tells the sheet which page it came from.
const FORM_ENDPOINT = "https://script.google.com/macros/s/AKfycbxBll4z7N6UnZTaHdrv1axAH2No23ykzTjvPmWX57CXaaP3m_xE3NWouUgUg0dIaM3nPg/exec";
const CONTACT_EMAIL = "tim.kim@k-nex.com";

document.querySelectorAll("form[data-kind=early-access]").forEach((form) => {
  const status = form.querySelector(".knex-status");
  const button = form.querySelector("button[type=submit]");
  const label = button.textContent;
  const say = (text, kind) => { status.textContent = text; status.className = "knex-status" + (kind ? " " + kind : ""); };

  form.addEventListener("input", (e) => e.target.removeAttribute("aria-invalid"));
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = form.elements.email;
    if (!email.checkValidity()) {
      email.setAttribute("aria-invalid", "true");
      say("Please enter a valid email address.", "err");
      email.focus();
      return;
    }
    if (form.elements._gotcha.value) return;

    button.disabled = true;
    button.textContent = "Sending…";
    say("");
    try {
      const payload = { form: "early-access", email: email.value, source: form.dataset.source };
      // A plain-text body keeps this a simple CORS request, which Apps Script accepts.
      const res = await fetch(FORM_ENDPOINT, { method: "POST", body: JSON.stringify(payload) });
      const result = await res.json();
      if (!result.ok) throw new Error(result.error);
      form.reset();
      say("You’re on the list. We’ll email you when NexMove launches.", "ok");
    } catch {
      say(`Something went wrong. Please email ${CONTACT_EMAIL} instead.`, "err");
    } finally {
      button.disabled = false;
      button.textContent = label;
    }
  });
});
