import Icons from "./components/Icons.tsx";

// ── Keywords for chip row ─────────────────────────────────────────────────────
const KEYWORDS = [
  { label: "NAMA", type: "normal" },
  { label: "F_NAMA", type: "normal" },
  { label: "PHONE", type: "normal" },
  { label: "DATA_1", type: "data" },
  { label: "DATA_2", type: "data" },
  { label: "DATA_3", type: "data" },
];

// ════════════════════════════════════════════════════════════════════════════
export default function WayFuUI({ style }) {
  const { useState, useRef, useEffect } = React;
  const [theme, setTheme] = useState(style ?? "light");
  const [open, setOpen] = useState(true);
  const [tab, setTab] = useState("msg");
  const [hasFile, setHasFile] = useState(true);
  const [hasImg, setHasImg] = useState(false);
  const [imgEnabled, setImgEnabled] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [msgText, setMsgText] = useState(
    "Halo *NAMA*, selamat menggunakan fitur premium *WayFu*. 🎉\n\nAnda bisa menggunakan pemformatan WhatsApp seperti *tebal*, _miring_, dan ~coret~.\n\nSalam hangat,",
  );

  const rootRef = useRef(null);
  useEffect(() => {
    if (rootRef.current) rootRef.current.setAttribute("data-theme", theme);
  }, [theme]);

  const tabs = [
    {
      id: "msg",
      icon: <Icons.Msg />,
      label: "Pesan",
    },
    {
      id: "attach",
      icon: <Icons.Image />,
      label: "Lampiran",
    },
    {
      id: "settings",
      icon: <Icons.Settings />,
      label: "Opsi",
    },
  ];

  return (
    <div ref={rootRef} data-theme={theme}>
      {/* <style>{CSS}</style> */}
      {/* Main chat area */}
      <div className="wf-main" style={{ position: "static" }}>
        {/* ── WayFu FAB ── */}
        <button
          className={`wf-fab${open ? " open" : ""}`}
          onClick={() => setOpen((v) => !v)}
          title="WayFu - Easy Follow Up"
        >
          {open ? (
            <Icons.Close stroke="#fff" strokeWidth="2.5" size={20} />
          ) : (
            <Icons.Logo theme="dark" />
          )}
        </button>

        {/* ── WayFu Panel ── */}
        <div className={`wf-panel${open ? " visible" : " hidden"}`}>
          {/* Header */}
          <div className="wf-panel-header">
            <div className="wf-panel-brand">
              <div className="wf-panel-logo-wrap">
                <Icons.Logo theme={theme} />
              </div>
              <div>
                <div className="wf-panel-title">WayFu</div>
                <div className="wf-panel-version">v5.0.0 · Easy Follow Up</div>
              </div>
            </div>
            <div className="wf-panel-actions">
              <button
                className={`wf-panel-action-btn${theme === "dark" ? " active" : ""}`}
                onClick={() =>
                  setTheme((t) => (t === "dark" ? "light" : "dark"))
                }
                title="Toggle theme"
              >
                {theme === "dark" ? <Icons.Sun /> : <Icons.Moon />}
              </button>
              <button
                className="wf-panel-action-btn"
                onClick={() => setOpen(false)}
                title="Close"
              >
                <Icons.Close />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="wf-tab-nav">
            {tabs.map((t) => (
              <button
                key={t.id}
                className={`wf-tab-btn${tab === t.id ? " active" : ""}`}
                onClick={() => setTab(t.id)}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
          <div className="wf-tab-divider" />

          {/* Content */}
          <div className="wf-tab-content">
            {/* ── Message Tab ── */}
            <div className={`wf-tab-pane${tab === "msg" ? " active" : ""}`}>
              <textarea
                className="wf-msg-area"
                value={msgText}
                onChange={(e) => setMsgText(e.target.value)}
                placeholder="Tulis pesan di sini…"
              />

              {/* Keyword chips */}
              <div>
                <div className="wf-label">Kata Kunci</div>
                <div className="wf-keyword-row">
                  {KEYWORDS.map((k) => (
                    <button
                      key={k.label}
                      className={`wf-chip${k.type === "data" ? " data" : ""}`}
                      onClick={() => setMsgText((t) => t + k.label)}
                      title={`Sisipkan ${k.label}`}
                    >
                      {k.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode toggle */}
              <div className="wf-mode-row">
                <span className="wf-mode-label">
                  <Icons.WaIcon /> Mode Preview
                </span>
                <label className="wf-toggle-switch">
                  <input
                    type="checkbox"
                    checked={previewMode}
                    onChange={(e) => setPreviewMode(e.target.checked)}
                  />
                  <div className="wf-toggle-track" />
                  <div
                    className="wf-toggle-thumb"
                    style={{
                      transform: previewMode
                        ? "translateX(16px)"
                        : "translateX(0)",
                    }}
                  />
                </label>
              </div>

              {/* File row */}
              <div className="wf-file-row">
                <button className="wf-file-btn">
                  <Icons.File />
                  {hasFile
                    ? "Test_file.csv"
                    : "Pilih file penerima (.csv / .xlsx)"}
                </button>
                {hasFile && <span className="wf-file-badge">6</span>}
              </div>

              {/* Blast */}
              <button className="wf-blast-btn">
                <Icons.Send />
                BLAST!
              </button>
            </div>

            {/* ── Attachment Tab ── */}
            <div className={`wf-tab-pane${tab === "attach" ? " active" : ""}`}>
              <div className="wf-attach-toggle-row">
                <span className="wf-attach-toggle-label">
                  Aktifkan Lampiran Gambar
                </span>
                <label className="wf-toggle-switch">
                  <input
                    type="checkbox"
                    checked={imgEnabled}
                    onChange={(e) => {
                      setImgEnabled(e.target.checked);
                      if (!e.target.checked) setHasImg(false);
                    }}
                  />
                  <div className="wf-toggle-track" />
                  <div
                    className="wf-toggle-thumb"
                    style={{
                      transform: imgEnabled
                        ? "translateX(16px)"
                        : "translateX(0)",
                    }}
                  />
                </label>
              </div>

              {imgEnabled && (
                <>
                  {hasImg ? (
                    <div className="wf-attach-preview">
                      <img
                        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='120'%3E%3Crect width='300' height='120' fill='%23009A4B' opacity='.15'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='sans-serif' font-size='14' fill='%23009A4B'%3Ewayfu-logo.png%3C/text%3E%3C/svg%3E"
                        alt="preview"
                      />
                      <button
                        className="wf-attach-preview-del"
                        onClick={() => setHasImg(false)}
                      >
                        <Icons.Close size={12} />
                      </button>
                    </div>
                  ) : (
                    <div
                      className="wf-attach-upload"
                      onClick={() => setHasImg(true)}
                    >
                      <Icons.Upload />
                      <p>
                        <strong>Klik untuk memilih</strong>
                        <br />
                        gambar / PDF (maks. 4MB)
                      </p>
                    </div>
                  )}
                  <div>
                    <div className="wf-label">Caption</div>
                    <input
                      className="wf-caption-input"
                      placeholder="Tulis caption di sini (opsional)…"
                    />
                  </div>
                </>
              )}

              {!imgEnabled && (
                <div className="px-24 text-center text-[12px] text-(--wf-text-muted)">
                  Aktifkan toggle di atas untuk menambahkan lampiran gambar.
                </div>
              )}

              {/* Blast */}
              <button className="wf-blast-btn">
                <Icons.Send />
                BLAST!
              </button>
            </div>

            {/* ── Settings Tab ── */}
            <div
              className={`wf-tab-pane${tab === "settings" ? " active" : ""}`}
            >
              <div className="wf-setting-group">
                <div className="wf-settings-section-label">Tampilan</div>
                <div className="wf-setting-row">
                  <span className="wf-setting-label">
                    <Icons.Palette />
                    Warna Panel
                  </span>
                  <select className="wf-setting-select">
                    <option>Bawaan</option>
                    <option>Hijau</option>
                    <option>Biru</option>
                    <option>Oranye</option>
                  </select>
                </div>
              </div>

              <div className="wf-setting-group">
                <div className="wf-settings-section-label">Pesan</div>
                <div className="wf-setting-row">
                  <span className="wf-setting-label">
                    <Icons.Msg />
                    Caption <span className="wf-beta-badge">Beta</span>
                  </span>
                  <select className="wf-setting-select">
                    <option>Caption</option>
                    <option>Pesan</option>
                  </select>
                </div>
                <div className="wf-setting-row">
                  <span className="wf-setting-label">
                    <Icons.Zap />
                    Jumlah Penerima
                  </span>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <input
                      type="range"
                      className="wf-setting-slider"
                      min={100}
                      max={1000}
                      step={10}
                      defaultValue={500}
                    />
                    <span className="wf-setting-output">500</span>
                  </div>
                </div>
              </div>

              <div className="wf-setting-group">
                <div className="wf-settings-section-label">Oriflame</div>
                <div className="wf-setting-row">
                  <span className="wf-setting-label">
                    <Icons.Zap />
                    Target BP
                  </span>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <input
                      type="range"
                      className="wf-setting-slider"
                      min={100}
                      max={300}
                      step={5}
                      defaultValue={100}
                    />
                    <span className="wf-setting-output">100</span>
                  </div>
                </div>
                <div className="wf-setting-row">
                  <span className="wf-setting-label">
                    <Icons.Calendar />
                    Format Tanggal
                  </span>
                  <select className="wf-setting-select">
                    <option>Deteksi Otomatis</option>
                    <option>MM/DD/YYYY</option>
                    <option>DD/MM/YYYY</option>
                    <option>YYYY/MM/DD</option>
                  </select>
                </div>
              </div>

              <div className="wf-setting-group">
                <div className="wf-settings-section-label">Output</div>
                <div className="wf-setting-row">
                  <span className="wf-setting-label">
                    <Icons.Download />
                    Format File <span className="wf-beta-badge">Beta</span>
                  </span>
                  <select className="wf-setting-select">
                    <option>Always Ask</option>
                    <option>CSV (.csv)</option>
                    <option>Excel (.xlsx)</option>
                  </select>
                </div>
                <div className="wf-setting-row">
                  <span className="wf-setting-label">
                    <Icons.User />
                    Tipe Pengguna
                  </span>
                  <span className="wf-setting-output">Oriflame</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="wf-panel-footer">
            <div className="wf-footer-info">
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div className="wf-status-dot" />
                <span
                  style={{
                    color: "var(--green)",
                    fontWeight: 600,
                    fontSize: "10px",
                  }}
                >
                  6 penerima dimuat
                </span>
              </div>
              © Rizal Nurhidayat · Panel v1.7 · App v5.0
            </div>
            <div className="wf-footer-socials">
              {["facebook", "ig", "wa"].map((n) => (
                <button key={n} className="wf-social-btn" title={n}>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
