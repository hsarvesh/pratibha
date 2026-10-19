import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Server,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Save,
  Zap,
  Code,
  Sliders,
  ExternalLink,
  Cpu
} from 'lucide-react';

export default function LLMConfigModal({ onClose, onConfigSaved }) {
  const [provider, setProvider] = useState('llama.cpp');
  const [endpointUrl, setEndpointUrl] = useState('http://127.0.0.1:8080');
  const [modelName, setModelName] = useState('Qwen3-0.6B-Q4_K_M-Instruct.gguf');
  const [enabled, setEnabled] = useState(true);
  const [parametersText, setParametersText] = useState('');
  const [detectedModels, setDetectedModels] = useState([]);

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [jsonError, setJsonError] = useState(null);

  // Load existing config from backend
  useEffect(() => {
    fetch('/api/ai/config')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.config) {
          setProvider(data.config.provider || 'llama.cpp');
          setEndpointUrl(data.config.endpointUrl || 'http://127.0.0.1:8080');
          setModelName(data.config.modelName || 'Qwen3-0.6B-Q4_K_M-Instruct.gguf');
          setEnabled(data.config.enabled !== false);
          setParametersText(
            typeof data.config.parameters === 'string'
              ? data.config.parameters
              : JSON.stringify(data.config.parameters, null, 2)
          );
        }
        if (data.detectedModels) {
          setDetectedModels(data.detectedModels);
        }
      })
      .catch(console.error);
  }, []);

  // Validate JSON parameters on change
  useEffect(() => {
    if (!parametersText.trim()) {
      setJsonError(null);
      return;
    }
    try {
      JSON.parse(parametersText);
      setJsonError(null);
    } catch (err) {
      setJsonError(err.message);
    }
  }, [parametersText]);

  // Presets
  const applyPreset = (presetKey) => {
    if (presetKey === 'llama-local') {
      setProvider('llama.cpp');
      setEndpointUrl('http://127.0.0.1:8080');
      setModelName('Qwen3-0.6B-Q4_K_M-Instruct.gguf');
      setParametersText(
        JSON.stringify(
          {
            temperature: 0.2,
            max_tokens: 250,
            top_p: 0.95,
            timeout_ms: 12000,
            system_prompt: 'You are Pratibha AI career intelligence engine. Provide direct, concise and actionable guidance.',
            custom_headers: {
              'Content-Type': 'application/json'
            }
          },
          null,
          2
        )
      );
    } else if (presetKey === 'ollama') {
      setProvider('Ollama');
      setEndpointUrl('http://127.0.0.1:11434');
      setModelName('llama3:latest');
      setParametersText(
        JSON.stringify(
          {
            temperature: 0.3,
            max_tokens: 300,
            top_p: 0.9,
            timeout_ms: 20000,
            system_prompt: 'You are Pratibha AI career intelligence assistant.',
            custom_headers: {
              'Content-Type': 'application/json'
            }
          },
          null,
          2
        )
      );
    } else if (presetKey === 'lmstudio') {
      setProvider('LM Studio / vLLM');
      setEndpointUrl('http://127.0.0.1:1234');
      setModelName('local-model');
      setParametersText(
        JSON.stringify(
          {
            temperature: 0.2,
            max_tokens: 250,
            timeout_ms: 15000,
            system_prompt: 'You are Pratibha AI career assistant.'
          },
          null,
          2
        )
      );
    } else if (presetKey === 'openai-custom') {
      setProvider('OpenAI / Remote Compatible');
      setEndpointUrl('https://api.openai.com');
      setModelName('gpt-4o-mini');
      setParametersText(
        JSON.stringify(
          {
            temperature: 0.2,
            max_tokens: 300,
            timeout_ms: 15000,
            custom_headers: {
              Authorization: 'Bearer YOUR_API_KEY_HERE'
            }
          },
          null,
          2
        )
      );
    }
  };

  const handleFormatJSON = () => {
    try {
      const parsed = JSON.parse(parametersText);
      setParametersText(JSON.stringify(parsed, null, 2));
      setJsonError(null);
    } catch (err) {
      alert('Unable to format invalid JSON: ' + err.message);
    }
  };

  // Live Test Connection
  const handleTestConnection = async () => {
    if (jsonError) {
      alert('Please fix JSON syntax errors in parameters text box first.');
      return;
    }
    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/ai/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          endpointUrl,
          modelName,
          parameters: parametersText
        })
      });
      const data = await res.json();
      setTestResult(data);
    } catch (err) {
      setTestResult({
        success: false,
        error: 'Network error connecting to backend: ' + err.message
      });
    } finally {
      setTesting(false);
    }
  };

  // Save Configuration
  const handleSave = async (e) => {
    e.preventDefault();
    if (jsonError) {
      alert('Cannot save invalid JSON in parameters text box. Please fix syntax errors.');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/ai/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          endpointUrl,
          modelName,
          enabled,
          parameters: parametersText
        })
      });
      const data = await res.json();
      if (data.success) {
        if (onConfigSaved) onConfigSaved(data.config);
        alert('LLM configuration saved and applied across Pratibha platform!');
        onClose();
      }
    } catch (err) {
      alert('Error saving configuration: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Reset LLM configuration to default local 0.6B llama.cpp?')) {
      try {
        const res = await fetch('/api/ai/reset-config', { method: 'POST' });
        const data = await res.json();
        if (data.success) {
          setProvider(data.config.provider);
          setEndpointUrl(data.config.endpointUrl);
          setModelName(data.config.modelName);
          setParametersText(data.config.parameters);
          setEnabled(true);
          setTestResult(null);
          if (onConfigSaved) onConfigSaved(data.config);
          alert('Configuration reset to local 0.6B default!');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 760, width: '100%' }}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 'var(--radius-md)',
                background: 'var(--primary-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}
            >
              <Cpu size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>LLM Engine Modular Configuration</h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Configure local or remote LLM endpoints, model tags, and custom inference parameters.
              </p>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close Dialog">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ gap: '1.25rem' }}>
          {/* Quick Presets */}
          <div>
            <label className="form-label" style={{ marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Sliders size={14} /> Quick Architecture Presets:
            </label>
            <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className={`btn btn-sm ${endpointUrl.includes('8080') ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => applyPreset('llama-local')}
                style={{ fontSize: '0.78rem' }}
              >
                <Zap size={13} /> Local llama.cpp (0.6B Default)
              </button>
              <button
                type="button"
                className={`btn btn-sm ${endpointUrl.includes('11434') ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => applyPreset('ollama')}
                style={{ fontSize: '0.78rem' }}
              >
                Ollama (Port 11434)
              </button>
              <button
                type="button"
                className={`btn btn-sm ${endpointUrl.includes('1234') ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => applyPreset('lmstudio')}
                style={{ fontSize: '0.78rem' }}
              >
                LM Studio / vLLM
              </button>
              <button
                type="button"
                className={`btn btn-sm ${endpointUrl.includes('openai') ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => applyPreset('openai-custom')}
                style={{ fontSize: '0.78rem' }}
              >
                OpenAI / Remote
              </button>
            </div>
          </div>

          {/* Primary Coordinates: Endpoint & Model */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Server size={14} /> Endpoint URL (Default: http://127.0.0.1:8080)
              </label>
              <input
                type="text"
                className="form-input"
                value={endpointUrl}
                onChange={(e) => setEndpointUrl(e.target.value)}
                placeholder="http://127.0.0.1:8080"
                required
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Model Identifier</label>
              <input
                type="text"
                className="form-input"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                placeholder="Qwen3-0.6B-Q4_K_M-Instruct.gguf"
                required
              />
            </div>
          </div>

          {/* Detected Models chips */}
          {detectedModels.length > 0 && (
            <div style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
              <span style={{ color: 'var(--text-muted)' }}>Detected from endpoint:</span>
              {detectedModels.map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setModelName(m)}
                  style={{
                    background: modelName === m ? 'var(--primary)' : 'var(--bg-tertiary)',
                    color: modelName === m ? 'white' : 'var(--text-secondary)',
                    border: '1px solid var(--border-color)',
                    padding: '0.15rem 0.55rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.72rem',
                    cursor: 'pointer'
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          )}

          {/* Enable Toggle Switch */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-card)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div>
              <strong style={{ fontSize: '0.88rem' }}>Enable LLM Processing for Pratibha</strong>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                When enabled, Resume Studio and Interview Coach query this local/configured LLM.
              </p>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: 'var(--primary)' }}
              />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{enabled ? 'Active' : 'Disabled'}</span>
            </label>
          </div>

          {/* THE LONG TEXT BOX FOR ALL PARAMETERS (USER REQUIREMENT) */}
          <div className="form-group" style={{ margin: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', margin: 0 }}>
                <Code size={14} /> Custom Parameters Configuration (JSON):
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {jsonError ? (
                  <span style={{ fontSize: '0.72rem', color: 'var(--rose)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <AlertCircle size={12} /> Syntax Error
                  </span>
                ) : (
                  <span style={{ fontSize: '0.72rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <CheckCircle2 size={12} /> Valid JSON
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleFormatJSON}
                  style={{ fontSize: '0.75rem', color: 'var(--primary)', textDecoration: 'underline' }}
                >
                  Format JSON
                </button>
              </div>
            </div>

            <textarea
              className="form-textarea"
              style={{
                fontFamily: 'monospace',
                fontSize: '0.82rem',
                lineHeight: 1.45,
                background: '#0d1117',
                color: '#e6edf3',
                border: jsonError ? '1px solid var(--rose)' : '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem'
              }}
              rows={9}
              value={parametersText}
              onChange={(e) => setParametersText(e.target.value)}
              placeholder="Enter JSON parameters (temperature, max_tokens, system_prompt, custom_headers, etc.)..."
            />
            {jsonError && (
              <span style={{ fontSize: '0.74rem', color: 'var(--rose)', marginTop: '0.25rem' }}>
                {jsonError}
              </span>
            )}
          </div>

          {/* Live Test Connection Result */}
          {testResult && (
            <div
              style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: testResult.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                border: `1px solid ${testResult.success ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
                fontSize: '0.82rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <strong style={{ color: testResult.success ? '#34d399' : '#fb7185', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  {testResult.success ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                  {testResult.success ? 'Connection Successful!' : 'Connection Failed'}
                </strong>
                {testResult.latencyMs && (
                  <span className="badge badge-emerald">⚡ {testResult.latencyMs}ms Latency</span>
                )}
              </div>

              {testResult.success ? (
                <div style={{ color: 'var(--text-secondary)' }}>
                  Model <strong>{testResult.model}</strong> responded: <em>"{testResult.reply}"</em>
                </div>
              ) : (
                <div style={{ color: '#fb7185' }}>{testResult.error}</div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleReset}
            title="Reset to local 0.6B default"
          >
            <RotateCcw size={14} /> Reset to Default (0.6B)
          </button>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleTestConnection}
              disabled={testing || Boolean(jsonError)}
            >
              <Zap size={14} color="var(--primary)" /> {testing ? 'Testing Endpoint...' : 'Test Connection'}
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleSave}
              disabled={saving || Boolean(jsonError)}
            >
              <Save size={14} /> {saving ? 'Saving...' : 'Save & Apply Config'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
